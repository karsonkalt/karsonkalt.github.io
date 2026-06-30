---
layout: post
title: "API lib pattern"
date: 2026-03-03 00:00:00 -0400
tags: [pattern]
description: "fetcher → queryOptions factory → QueryClient. Typed errors, smart retry, auto-toast."
---

Three tiers. A low-level fetcher handles auth, error normalization, and Sentry tagging. A query/mutation options factory wraps it for TanStack Query and injects offline mocks. A shared QueryClient configures retry, stale-time, and error reporting once.

Components never call the fetcher directly — they call a hook that calls a factory.

## Error hierarchy

```ts
abstract class ApiError extends Error {
  abstract readonly toast:      string;   // user-facing message
  abstract readonly transient:  boolean;  // worth retrying?
  readonly reportToSentry = true;
}

class NetworkError   extends ApiError { transient = true  }
class TimeoutError   extends ApiError { transient = false; reportToSentry = false }
class ForbiddenError extends ApiError { transient = false }
class NotFoundError  extends ApiError { transient = false; reportToSentry = false }
class HttpError      extends ApiError { transient = status >= 500 || status === 429 }
class GraphQLError   extends ApiError { /* transient from upstream error code */ }
class ParseError     extends ApiError { transient = false }
```

`transient` drives retry. `reportToSentry = false` suppresses noise for expected states.

## Fetcher

```ts
async function apiFetcher<T>(
  url: string,
  body: unknown,
  opts?: { signal?: AbortSignal },
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", "X-Csrf-Token": getCsrfToken() },
      body: JSON.stringify(body),
      signal: opts?.signal,
    });
  } catch (err) {
    if (isTimeout(err)) throw new TimeoutError(...);
    throw new NetworkError(...);
  }

  if (res.status === 401) return interruptAndRedirect();
  if (res.status === 403) throw new ForbiddenError(...);
  if (!res.ok)            throw new HttpError(..., res.status);

  let json: { data?: T; errors?: GqlError[] };
  try { json = await res.json(); } catch { throw new ParseError(...); }

  if (json.errors?.length) {
    if (isNotFound(json.errors[0])) throw new NotFoundError(...);
    throw new GraphQLError(...);
  }
  return json.data!;
}
```

## Query options factory

```ts
function queryOptions<TData, TVars = undefined>(config: {
  queryKey: readonly unknown[];
  query:    string;
  variables?: TVars;
  mock:     TData | ((vars?: TVars) => TData);
}) {
  const queryFn = OFFLINE_MODE
    ? async () => resolveMock(config.mock, config.variables)
    : () => apiFetcher<TData>(API_URL, { query: config.variables });

  return { queryKey: config.queryKey, queryFn };
}

// One file per operation:
export function itemsQueryOptions(filter: string) {
  return queryOptions({
    queryKey: ["items", filter],
    query:    GET_ITEMS,
    variables: { filter },
    mock: { items: [{ id: "item-1", name: "Widget", createdAt: "2026-01-15T12:00:00Z" }] },
  });
}

export function useItems(filter: string) {
  return useSuspenseQuery(itemsQueryOptions(filter));
}
```

## QueryClient

```ts
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:  60_000,
      retry:      (count, err) => count < 3 && err instanceof ApiError && err.transient,
      retryDelay: (count) => Math.min(1_000 * 2 ** count, 30_000),
    },
  },
  queryCache: new QueryCache({
    onError: (err, query) => {
      if (err instanceof NotFoundError) return;   // RouteErrorComponent handles it
      if (query.meta?.suppressToast) return;
      notify.toast.error(err instanceof ApiError ? err.toast : "Something went wrong.");
      if (err instanceof ApiError && err.reportToSentry) captureException(err);
    },
  }),
});
```

| Policy | Value |
|---|---|
| Stale time | 60 s (transient); `Infinity` for session-scoped |
| Max retries | 3, transient errors only |
| Backoff | Exponential, capped at 30 s |
| Auto-toast | Query errors only; mutations use `toast.promise` at the call site |
| `NotFoundError` | Never toasted — rendered as a not-found page |

## Rules

- Hooks call factories. Components call hooks. Nothing calls the fetcher directly.
- Every `queryOptions` factory ships a deterministic mock. No `Date.now()`, no `Math.random()`.
- No `select` in the factory — transforms go in the hook wrapper.
- Session-scoped queries set `staleTime: Infinity`. Don't re-fetch them in child routes.
- For a mutation that read-modify-writes, use `fetchQuery({ staleTime: 0 })` — `ensureQueryData` returns stale cache.
