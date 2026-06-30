---
layout: post
title: "Inspector component registry with pre-warm"
date: 2026-06-25 00:00:00 -0400
tags: [pattern]
description: "makeGetInspectorComponent — type/class → component resolver with a byHint() pre-warm path that avoids import cycles."
---

A resolver factory that maps entity type tags to detail-panel components. Two call signatures: one for post-fetch resolution (full entity), one for pre-fetch resolution (type hint from the list row). The hint path lets the panel warm its data before the entity fetch resolves, so the drawer opens immediately.

Tag metadata lives in a separate module from the component map to avoid the import cycle that always appears in this shape.

## The factory

```ts
type InspectorEntry = {
  component:  React.ComponentType<{ entity: Entity }>;
  dataView?:  React.ComponentType<{ hint: EntityHint }>;  // pre-warm shell
  pageLink?:  (entity: Entity) => AppRoutePath;
};

type EntityHint = { _type: string; _class: string[] };

function makeGetInspectorComponent(
  byType:        Record<string, InspectorEntry>,
  byClass:       Record<string, InspectorEntry>,
  classPriority: string[],
  defaultEntry:  InspectorEntry,
) {
  function resolve(entity: Entity): InspectorEntry {
    if (byType[entity._type]) return byType[entity._type];
    for (const cls of classPriority) {
      if (entity._class.includes(cls) && byClass[cls]) return byClass[cls];
    }
    return defaultEntry;
  }

  function byHint(hint: EntityHint): InspectorEntry {
    if (byType[hint._type]) return byType[hint._type];
    for (const cls of classPriority) {
      if (hint._class.includes(cls) && byClass[cls]) return byClass[cls];
    }
    return defaultEntry;
  }

  resolve.byHint = byHint;
  return resolve;
}
```

## Splitting metadata from components

The import cycle: `ResultRow` → `getInspectorComponent` → `RuleOverview` → `RuleResultTable` → `ResultRow`.

Break it by putting the priority array and type/class sets in a metadata module (`overviewRegistry.ts`) that has no component imports. The component map (`getInspectorComponent.ts`) imports both the metadata and the components. `ResultRow` imports only the metadata to check if an entity has a custom inspector — it never touches the component map.

```
overviewRegistry.ts       ← type sets, class priority, InspectorEntry type
getInspectorComponent.ts  ← imports registry + components, exports the resolver
ResultRow.tsx             ← imports overviewRegistry only (no cycle)
```

## Usage

```tsx
// List row — pre-warm path
function EntityRow({ entity }: { entity: ListEntity }) {
  const entry = getInspectorComponent.byHint({
    _type:  entity._type,
    _class: entity._class,
  });

  const openInspector = () => inspector.open(entity._id, { hint: entity._type });

  return (
    <tr onClick={openInspector}>
      {entry.dataView && <entry.dataView hint={entity} />}  {/* warms data */}
      <td>{entity.displayName}</td>
    </tr>
  );
}

// Inspector shell — post-fetch path
function InspectorOverview({ entity }: { entity: Entity }) {
  const entry = getInspectorComponent(entity);
  return <entry.component entity={entity} />;
}
```

## Pre-warm mechanics

`dataView` is a component that mounts when the row is visible (e.g. inside the viewport in a virtualized list) and fires its own `useSuspenseQuery`. When the user clicks the row and the inspector opens, the query is already warm — the drawer renders the full detail immediately rather than showing a skeleton.

```tsx
// RuleDataView — mounts in the list, fires before the drawer opens
function RuleDataView({ hint }: { hint: EntityHint }) {
  // Invisible — renders nothing, just pre-fetches
  useSuspenseQuery(ruleDetailQueryOptions(hint._type));
  return null;
}
```

## Page link factory

The optional `pageLink` field lets the inspector render a "View full page" deep link without knowing the entity's destination:

```ts
const ruleEntry: InspectorEntry = {
  component: RuleOverview,
  pageLink:  (entity) => `/rules/${entity.id}`,
};

// Inspector shell
const entry = getInspectorComponent(entity);
{entry.pageLink && (
  <Link to={entry.pageLink(entity)}>View full page</Link>
)}
```

When a new entity type gets a dedicated page, add `pageLink` to its registry entry. No change to the inspector shell.
