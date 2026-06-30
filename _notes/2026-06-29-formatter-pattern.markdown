---
layout: post
title: "Formatter pattern"
date: 2026-03-18 00:00:00 -0400
tags: [pattern]
description: "Pure format functions, locale-aware, Intl-cached, em-dash fallback."
---

A single `format` namespace of pure functions. Each takes an unknown value and returns a display string. Locale and timezone are read at call-time — never baked in. `Intl.*` instances are cached by key and cleared when preferences change.

## Shape

```
format/
  index.ts      ← assembles the namespace
  constants.ts  ← EMPTY sentinel ("—"), FormatOptions type
  locale.ts     ← getLocale(), getTimezone(), formatterCache, cache invalidation
  date.ts
  number.ts
  misc.ts
```

## Namespace

```ts
export const format = {
  date, shortDate, dateTime, time, relativeTime,
  number, compactNumber, currency, decimal, percent, fraction, duration,
  boolean, empty,
} as const;
```

## Signature

Every formatter follows the same shape:

```ts
function formatFoo(value: unknown, opts?: { fallback?: string }): string
```

Returns `opts.fallback ?? EMPTY` (`"—"`) for null, undefined, or unparseable input.

## Cache

Expensive `Intl.*` constructors are created once and reused:

```ts
const cache = new Map<string, Intl.DateTimeFormat | Intl.NumberFormat>();

function getDateFormat(): Intl.DateTimeFormat {
  const key = "date";
  if (!cache.has(key)) {
    cache.set(key, new Intl.DateTimeFormat(getLocale(), {
      month: "short", day: "numeric", year: "numeric",
      timeZone: getTimezone(),
    }));
  }
  return cache.get(key) as Intl.DateTimeFormat;
}
```

Cache key encodes any options that affect output (e.g. `"percent:2"` for 2 decimal places). Clear the whole cache when locale or timezone changes — all instances must be rebuilt.

## Input coercion

Backend date fields arrive as epoch-ms numbers, numeric strings, or ISO strings depending on how the record was written. Normalize before formatting:

```ts
function parseDate(value: unknown): Date | null {
  if (value == null) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  if (typeof value === "number") return isFinite(value) ? new Date(value) : null;
  if (typeof value === "string") {
    if (!value) return null;
    if (/^-?\d+(\.\d+)?$/.test(value)) return new Date(Number(value));
    const d = Date.parse(value);
    return isNaN(d) ? null : new Date(d);
  }
  return null;
}
```

Return `null`, never `Invalid Date`, so every formatter's fallback path is a simple null check.

## Usage

Format at render time, not in hooks or data layers:

```tsx
<p>{format.date(item.createdAt)}</p>
<p>{format.number(item.count)}</p>
<p>{format.duration(item.elapsedMs)}</p>
<p>{format.percent(item.passing, item.total)}</p>
<p>{format.date(item.updatedAt, { fallback: "Never" })}</p>
```

Never `.toFixed()`, `.toLocaleString()`, or bare `String(someNumber)` in a view.
