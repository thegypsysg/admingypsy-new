---
name: commit-changes
description: Guide for reading changed files and writing industry-standard git commit messages for AdminGypsy. Use this when the user asks to "commit all changes" or "read all changes and commit".
---

# Skill: Commit Changes in AdminGypsy

Follow this workflow whenever asked to read current changes and create a commit.

---

## Step 1 — Read All Current Changes

```bash
git status
git diff --stat
```

This gives a summary of which files changed and how many lines were added/removed.

For detailed per-file changes:

```bash
git diff
```

---

## Step 2 — Stage All Changes

```bash
git add .
```

> If you only want to stage specific files:
>
> ```bash
> git add src/views/example/Example.vue src/components/Shared.vue
> ```

---

## Step 3 — Write the Commit Message

Follow [Conventional Commits](https://www.conventionalcommits.org/) specification. The format is:

```
<type>(<scope>): <short description in English>

<optional body — more detail, bullet points OK>
```

### Types

| Type       | When to Use                              |
| ---------- | ---------------------------------------- |
| `feat`     | New feature or new page                  |
| `fix`      | Bug fix                                  |
| `refactor` | Code restructure without behavior change |
| `docs`     | Documentation only                       |
| `style`    | Formatting, whitespace (no logic change) |
| `chore`    | Build config, deps, tooling              |
| `perf`     | Performance improvement                  |

### Scopes (common for this project)

| Scope         | Area                                   |
| ------------- | -------------------------------------- |
| `ui`          | General UI/UX change                   |
| `auth`        | Authentication/token                   |
| `api`         | API client, axios                      |
| `table`       | Table patterns (skeleton, empty state) |
| `router`      | Vue Router                             |
| `store`       | Pinia store                            |
| `build`       | Vite/build config                      |
| `deps`        | npm dependencies                       |
| `(view name)` | Specific view, e.g., `(cart-master)`   |

---

## Step 4 — Run the Commit

```bash
git commit -m "type(scope): short description" -m "Body with more detail if needed."
```

> ⚠️ **PowerShell gotcha:** Do NOT put newlines or special shell characters (`&`, `>`, `|`) inside the `-m` strings. Keep the body as a single sentence or use a plain description.

---

## Examples

### Single view change

```bash
git commit -m "refactor(cart-master): replace v-progress-circular with SkeletonTable and EmptyState"
```

### Multiple related views

```bash
git commit -m "refactor(table): standardize loading pattern in 3 remaining views" -m "Replace legacy v-progress-circular spinners with SkeletonTable and EmptyState in CartMaster.vue, Country.vue, and MallMaster.vue."
```

### New feature across multiple views

```bash
git commit -m "feat(ui): add AppBreadcrumb navigation to all main views (Phase 7 UX5)" -m "Create AppBreadcrumb.vue and globally register in main.js. Integrate breadcrumb into 20 main view components."
```

### Documentation update

```bash
git commit -m "docs: update README.md and add AGENTS.md with AI agent guidelines"
```

### Bug fix

```bash
git commit -m "fix(mall-master): remove duplicate components key causing ESLint error"
```

---

## Pre-Commit Hook

This project uses **husky + lint-staged**. On every commit, the hook automatically runs:

- `eslint --fix` on all staged `*.vue` and `*.js` files
- `prettier --write` on all staged files

If the hook fails, the commit is aborted and the files are reverted to pre-lint state. Read the error output, fix the issue, re-stage with `git add .`, and commit again.
