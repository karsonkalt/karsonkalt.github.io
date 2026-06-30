---
layout: post
title: "AI agent render structure"
date: 2026-05-04 00:00:00 -0400
tags: [pattern]
description: "Chrome splits into RoutableArea and ObserverArea. AI reads TanStack cache, proposes URL writes."
---

The app shell is two independent overlay scopes side by side. The left scope — the **routable area** — holds the nav, main content, and all overlays (drawers, sheets, palettes) that should cover the page but not the AI. The right scope — the **observer area** — is the AI sidebar. It reads the current page's context and can propose URL-state changes, but owns no route state itself.

## Chrome structure

```
<Chrome>                          providers, NavigationContext, AiAssistantContext
  <RoutableArea>                  ModalBoundary — overlays portal here
    <NavRail />
    <Main>
      <Outlet />                  routed page content
    </Main>
    <Inspector />                 portals into RoutableArea
    <Palette />
  </RoutableArea>
  <ObserverArea>                  separate ModalBoundary, shrink-0
    <AiChat />                    only when open + entitlement
  </ObserverArea>
</Chrome>
```

The sidebar sits **outside** the routable area as a direct sibling. Overlays opened inside the routable area can never bleed into the sidebar — they portal into their own `ModalBoundary`.

## Chrome providers

```tsx
<Chrome
  navigation={{ goBack, backLabel }}     // back-button wiring for deep-linked views
  aiAssistant={{ onAiClick, isChatOpen }} // undefined = no AI trigger on this page
>
  {children}
</Chrome>
```

`Chrome` mounts notify outlets (toast, confirm, interrupt) and `TooltipProvider` — singletons that need the full tree below them.

`AiAssistantContext` is consumed by the nav rail to show/hide the AI trigger button. The sidebar itself is toggled by plain `useState` in the root layout — not a URL param.

## Observer area: reading without owning

The sidebar never receives props from route components. The root layout runs `usePageContext` — which reads the current URL and the TanStack Query cache — and passes the result down as `pageContext`:

```tsx
const pageContext = usePageContext({ registry, dynamicMatchers });
<AiChat pageContext={pageContext} onFilter={onFilter} onNavigate={onNavigate} />
```

Route components don't know the sidebar exists.

## Page context registry

Each route subtree registers a mapping of path → context config:

```ts
const ITEMS_CONTEXT: PageContextRegistry = {
  "/items": {
    flag: "release-ai-context-items",  // feature flag gates the surface
    getConfig: ({ search, queryClient }) => ({
      title:       "Items",
      isQuery:     false,
      queries:     [{ query: buildItemsQuery(search.get("filter")), result: null }],
      meta:        { activeFilter: search.get("filter"), totalCount: readCachedCount(queryClient) },
      suggestions: ["Filter to items created last week", "What needs attention?"],
      tools: {
        filter:   { schema: { type: "object", properties: { filter: { type: "string" } } } },
        navigate: { targets: [{ to: "/items/$id", label: "Item detail" }] },
      },
    }),
  },
};
```

`queries` lists queries the page has already run. Results are read from TanStack cache — no extra fetches.

For routes whose context shape depends on search params, use a `DynamicContextMatcher` instead of a static key.

## Tool calls: observer proposes, routable area executes

The AI agent proposes filter/sort/navigate actions. The root converts them to `router.navigate()` calls — all URL writes, all back-button reversible:

```ts
onFilter={(action) => navigate({
  search: (prev) => action.mode === "replace" ? action.params : { ...prev, ...action.params },
  state: true,
  resetScroll: false,
})}
```

`autoRun` actions apply immediately. `requireUserConfirmation` actions render a button in the chat panel.

## SSE: container + presentational

Every AI-streaming component splits in two:

```
Container — calls the SSE hook, derives state, passes primitives down
Presentational — accepts explicit props (streaming, content, error), renders all states
```

The presentational component has no hooks, so every state is directly testable with explicit props without mocking the hook.

```ts
// Derive display state from the event array
const content          = events.filter(e => e.type === "content").map(e => e.content).join("");
const interruptMessage = events.find(e => e.type === "interrupt")?.content ?? null;
const sseErrorMessage  = events.find(e => e.type === "error")?.content    ?? null;
const thinkingMessage  = events.filter(e => e.type === "thinking").at(-1)?.content ?? null;
```

`streaming` stays `true` for the entire fetch. States branch on event content after `streaming` goes false. Shimmer shows while `!hasContent` — disappears the moment the first content event arrives, not when the stream closes.
