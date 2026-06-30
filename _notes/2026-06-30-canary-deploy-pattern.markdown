---
layout: post
title: "Canary deploy with sticky PR comment"
date: 2026-06-30 00:00:00 -0400
tags: [pattern]
description: "S3 deploy on every PR push. Smart path from changed files. HTML comment as zero-cost state storage. Lands reviewers inside the feature."
---

Every PR push deploys to S3 and posts a live link in the PR comment. The comment updates in place (never creates a new one). The link lands the reviewer inside the feature being reviewed — not at the app root. State between runs is stored as invisible HTML comments inside the comment body. No database, no cache key, no external storage.

## The flow

1. **Announce** — immediately overwrite the comment with "building…" (keep the previous link visible while the build runs)
2. **Build + upload** to `s3://bucket/pr/<number>/<sha>/`
3. **Notify** — replace the comment with the new live link

If the build fails, the previous link is surfaced so the reviewer still has something to click.

## HTML comment as state

GitHub renders HTML comments as invisible — they don't appear in the UI but are readable via the API as plain text. Use them to store the previous deploy URL across workflow runs:

```js
const MARKER = '<!-- canary-deploy -->';

// Find the comment
const comments = await github.rest.issues.listComments({ owner, repo, issue_number: pr });
const existing = comments.data.find(c => c.body?.includes(MARKER));

// Read previous URL from hidden tag
const prevUrl = existing?.body?.match(/<!-- prev-canary=(.*?) -->/)?.[1] ?? null;

// Write new state
const newBody = `
${MARKER}
<!-- prev-canary=${newDeployUrl} -->

[View canary](${newDeployUrl})
`;

if (existing) {
  await github.rest.issues.updateComment({ owner, repo, comment_id: existing.id, body: newBody });
} else {
  await github.rest.issues.createComment({ owner, repo, issue_number: pr, body: newBody });
}
```

The comment is both the display surface (the link the reviewer sees) and the persistent state store (the hidden tag the next run reads). Zero external infrastructure.

## Announce step — keeps previous link visible during build

```js
const buildingBody = `
${MARKER}
<!-- prev-canary=${prevUrl ?? ''} -->

⏳ **Building canary…**
${prevUrl ? `\nPrevious: [${prevUrl}](${prevUrl})` : ''}
`;
await updateOrCreate(buildingBody);
```

The reviewer sees the "building" message but still has the previous working link. When the build finishes, the notify step replaces it with the new URL.

## Smart path — land inside the feature

After a successful deploy, fetch the PR's changed files and route to the most-changed view area:

```js
const AREA_ROUTES = {
  rules:           '/rules',
  vulnerabilities: '/vulnerabilities',
  insights:        '/insights/dashboards',
  controls:        '/controls/controls',
  assets:          '/assets',
  // ... one entry per view directory
};

async function resolvePath(pr) {
  const files = await github.paginate(github.rest.pulls.listFiles, { owner, repo, pull_number: pr });
  const counts = {};

  for (const { filename } of files) {
    const match = filename.match(/^src\/views\/([^/]+)\//);
    if (match && AREA_ROUTES[match[1]]) {
      counts[match[1]] = (counts[match[1]] ?? 0) + 1;
    }
  }

  const top = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
  return top ? AREA_ROUTES[top] : '/home';
}
```

Append `?magic=<sha>` for dev environment authentication:

```js
const path = await resolvePath(pr);
const deployUrl = `https://dev.myapp.com${path}?magic=${sha}`;
```

### PR description override

Let the author override the heuristic with one line in the PR description:

```js
// Strip HTML comments first so the PR template's example line doesn't match
const prBody = (pr.body ?? '').replace(/<!--[\s\S]*?-->/g, '');
const override = prBody.match(/canary-path:\s*(\/\S*)/i);
const path = override ? override[1] : await resolvePath(pr);
```

Anyone can write `canary-path: /rules/new` in their PR description and control exactly where the reviewer lands.

## Concurrency — cancel stale builds

```yaml
concurrency:
  group: canary-pr-${{ github.event.pull_request.number }}
  cancel-in-progress: true
```

The PR number scopes the group so different PRs never cancel each other. When a new push arrives, the in-progress build for the previous commit is cancelled immediately. The announce step fires before the cancellation can kick in, so the comment always shows the current state.

## Cancelled-run guard on notify

```yaml
notify:
  if: ${{ always() && !cancelled() }}
```

Without `!cancelled()`, a newer push would cancel the in-progress run, and the cancelled notify job would overwrite the live comment with a failure message. The guard prevents that — a cancelled run leaves the comment exactly as the announce step set it.

## Storybook variant — path-scoped + PR-close cleanup

For a component library preview, scope the trigger to only the component files that need Storybook:

```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened, closed]
    paths:
      - 'src/design-system/**'
      - '.storybook/**'
```

Deploy to `s3://bucket/pr/<number>/<sha>/` — per-SHA so each push's build is independently addressable.

Add a cleanup job that fires when the PR closes:

```yaml
cleanup:
  if: github.event.action == 'closed'
  steps:
    - run: aws s3 rm --recursive "s3://bucket/pr/${{ github.event.pull_request.number }}/"
```

All build/deploy/notify jobs guard with `if: github.event.action != 'closed'`. No cron job needed to garbage-collect previews — the PR lifecycle handles it.

## S3 sync

```bash
aws s3 sync dist/ "s3://bucket/pr/${PR}/${SHA}/" \
  --cache-control "public, max-age=31536000, immutable" \
  --delete

# Alias to latest for convenient direct link (optional)
aws s3 sync "s3://bucket/pr/${PR}/${SHA}/" "s3://bucket/pr/${PR}/latest/" --delete
```

Immutable cache headers on the SHA-addressed path — assets never change at that URL. The `latest/` alias can be stale between pushes; the SHA path is always accurate.
