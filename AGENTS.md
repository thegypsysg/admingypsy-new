# AGENTS.md — AI Coding Agent Guide for AdminGypsy

> **Read this first** before making any changes to this codebase.
> This file provides essential context for AI agents (Gemini, Claude, etc.) working on this project.

---

## 📌 Project Overview

AdminGypsy is a **Vue 3 admin dashboard** for The Gypsy SG platform, hosted on cPanel shared hosting. It manages a multi-tenant marketplace covering food delivery, job listings, mall management, real estate, and more.

- **~90 views** across 36 feature modules
- **Options API** is the primary style (most views); **Composition API / `<script setup>`** is used in shared components and new composables
- **No test suite** — verify all changes with `npm run type-check` and `npm run build`
- **Active branch:** `refactor`
- **Deployment:** `npm run build` → upload `dist/` to cPanel

---

## ⛔ ABSOLUTE RULES — NEVER VIOLATE

1. **DO NOT modify business logic** in `src/views/` — only UI layout, imports, or explicitly instructed changes
2. **DO NOT use raw `axios`** — always import from `@/util/axios` (wrapper to `apiClient`)
3. **DO NOT use `localStorage`** for auth — always use `tokenStorage` from `@/util/tokenStorage`
4. **DO NOT add `lang="ts"`** to existing `*.vue` files — TypeScript migration is gradual
5. **DO NOT rename existing `*.js` files** to `*.ts` without explicit instruction
6. **DO NOT create view directories with spaces** — all must be kebab-case
7. **DO NOT add `<router-link>` inside `v-slot:title`** of `v-breadcrumbs-item` — causes nested `<a>` tags (invalid HTML)
8. **ALWAYS run `npm run type-check` and `npm run build`** after making changes to verify zero errors

---

## 🛠️ Standard Patterns

### HTTP Requests

```javascript
// ✅ CORRECT — always
import axios from '@/util/axios';
import { setAuthHeader } from '@/util/axios';

// In created():
const token = JSON.parse(localStorage.getItem('token')); // legacy pattern in old views
setAuthHeader(token);

// In API calls:
axios.get('/endpoint').then(response => { ... });
```

> **Note:** Some older views still use the `setAuthHeader(token)` pattern in `created()` for backward compatibility. Do not change this unless explicitly asked.

---

### Auth Token (new code / shared components)

```javascript
import { tokenStorage } from '@/util/tokenStorage';
tokenStorage.getToken();
tokenStorage.isAuthenticated();
tokenStorage.clearAll(); // on logout
```

---

### Toast Notifications

```javascript
// In Options API view — use this pattern:
import { useNotificationStore } from '@/stores/notification';

export default {
  setup() {
    return { notification: useNotificationStore() };
  },
  methods: {
    onSuccess() {
      this.notification.success('Data saved!');
    },
    onError(err) {
      const msg = err?.response?.data?.message || 'Something went wrong.';
      this.notification.error(msg);
    },
  },
};
```

> ⚠️ The `GlobalNotification.vue` component is already mounted in `App.vue`. **Do NOT add it to individual views.**

---

### Table Loading Pattern (STANDARD for ALL views)

Every view with a `<v-table>` must follow this pattern — **no exceptions**:

```html
<!-- 1. Main data table (v-show keeps column widths stable) -->
<v-table class="country-table">
  <thead>
    ...
  </thead>
  <tbody>
    <template v-for="item in items" :key="item.id">
      <tr class="country-table-body">
        <!-- ... row cells ... -->
      </tr>
    </template>
  </tbody>
</v-table>

<!-- 2. Skeleton (OUTSIDE v-table, right after </v-table>) -->
<skeleton-table v-if="isLoading" :rows="5" :columns="6" />

<!-- 3. Empty state (OUTSIDE v-table, right after skeleton-table) -->
<empty-state
  v-if="!isLoading && (!items || items.length === 0)"
  title="No Data Found"
  subtitle="There are no records to display."
/>
```

```javascript
// Script imports:
import SkeletonTable from '@/components/SkeletonTable.vue';
import EmptyState from '@/components/EmptyState.vue';

export default {
  components: { SkeletonTable, EmptyState },
  // ...
};
```

> ❌ **NEVER use `<v-progress-circular>` inside `<tbody>`** — this pattern has been fully replaced.

---

### Delete Confirmation

```javascript
import ConfirmDialog from '@/components/ConfirmDialog.vue';

export default {
  components: { ConfirmDialog },
  data: () => ({ isDelete: false, idToDelete: null, isDeleteLoading: false }),
  methods: {
    openDelete(id) {
      this.idToDelete = id;
      this.isDelete = true;
    },
    async handleDelete() {
      this.isDeleteLoading = true;
      try {
        await axios.delete(`/endpoint/${this.idToDelete}`);
        this.notification.success('Deleted!');
        this.fetchData();
      } finally {
        this.isDeleteLoading = false;
        this.idToDelete = null;
        // isDelete resets automatically via v-model in ConfirmDialog
      }
    },
  },
};
```

```html
<confirm-dialog
  v-model="isDelete"
  title="Confirmation"
  message="Are you sure you want to delete this item? This action cannot be undone."
  :loading="isDeleteLoading"
  @confirm="handleDelete"
/>
```

---

### Breadcrumb Navigation

`AppBreadcrumb` is **globally registered** in `main.js` — no import needed in individual views:

```html
<v-container>
  <app-breadcrumb
    :items="[
      { title: 'Dashboard', to: '/' },
      { title: 'Page Name', to: null },
    ]"
  />
  <!-- rest of view -->
</v-container>
```

> Use `to: null` for the last (current) item. The component auto-sets `disabled: true` for the last item.

---

### Image Lazy Loading in Tables

All `<v-img>` inside table rows must use:

```html
<v-img
  height="40"
  loading="lazy"
  lazy-src="data:image/svg+xml,%3Csvg xmlns%3D%22http%3A//www.w3.org/2000/svg%22 width%3D%221%22 height%3D%221%22%3E%3C/svg%3E"
  :src="item.image ? $fileURL + item.image : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'"
>
  <template #placeholder><div class="skeleton" /></template>
</v-img>
```

---

### HTML Sanitization (for `v-html`)

```javascript
import { sanitizeHtml } from '@/util/sanitize';

// In template:
// <div v-html="sanitizeHtml(rawContent)" />

// In a method:
getFormattedText(raw) {
  const processed = raw.replace(/\n/g, '<br>');
  return sanitizeHtml(processed);
}
```

---

### Server-Side Pagination (views with `v-pagination`)

Views with pagination must pass `page` and `perPage` to the API:

```javascript
data: () => ({
  currentPage: 1,
  perPage: 10,
  totalItems: 0,
  totalPages: 0,
  items: [],
}),
methods: {
  fetchData() {
    this.isLoading = true;
    axios.get('/endpoint', {
      params: { page: this.currentPage, per_page: this.perPage }
    }).then(response => {
      this.items = response.data.data;
      this.totalItems = response.data.total;
      this.totalPages = response.data.last_page;
    }).finally(() => { this.isLoading = false; });
  },
},
```

```html
<v-pagination v-model="currentPage" :length="totalPages" @update:modelValue="fetchData" />
```

---

## 🗂️ File & Directory Conventions

| Area                 | Convention                                           |
| -------------------- | ---------------------------------------------------- |
| View directories     | `kebab-case` — no spaces, no PascalCase              |
| Vue components       | `PascalCase.vue`                                     |
| Composables          | `use{Name}.js` or `use{Name}.ts`                     |
| Stores               | `noun.js` (e.g., `navigation.js`, `notification.js`) |
| Utilities            | `camelCase.js`                                       |
| New TypeScript files | `*.ts` in `src/types/` or `src/composables/` only    |

---

## 🧱 Component Inventory

### Globally Registered (no import needed)

| Component           | Tag                 | Purpose                    |
| ------------------- | ------------------- | -------------------------- |
| `AppBreadcrumb.vue` | `<app-breadcrumb>`  | Page breadcrumb navigation |
| `VueDatePicker`     | `<vue-date-picker>` | Date picker                |

### Locally Imported (import per view)

| Component              | Import Path                         | Purpose             |
| ---------------------- | ----------------------------------- | ------------------- |
| `SkeletonTable.vue`    | `@/components/SkeletonTable.vue`    | Table loading state |
| `EmptyState.vue`       | `@/components/EmptyState.vue`       | Empty data state    |
| `ConfirmDialog.vue`    | `@/components/ConfirmDialog.vue`    | Delete confirmation |
| `ImageUpload.vue`      | `@/components/ImageUpload.vue`      | Single image upload |
| `ImageMultiUpload.vue` | `@/components/ImageMultiUpload.vue` | Multi-image upload  |
| `VideoUpload.vue`      | `@/components/VideoUpload.vue`      | Video upload        |
| `ImageCropper.vue`     | `@/components/ImageCropper.vue`     | Image crop utility  |

### Auto-mounted in App.vue (never add to views)

| Component                | Notes                                  |
| ------------------------ | -------------------------------------- |
| `GlobalNotification.vue` | Triggered via `useNotificationStore()` |

---

## 📦 Available Composables

| Composable          | Location                             | Use When                                       |
| ------------------- | ------------------------------------ | ---------------------------------------------- |
| `useApi`            | `@/composables/useApi.js`            | Simple reactive API fetch with loading state   |
| `useApiWithCache`   | `@/composables/useApiWithCache.js`   | Cacheable API fetch (⚠️ `<script setup>` only) |
| `useDebounce`       | `@/composables/useDebounce.js`       | Debounce user input (e.g., search)             |
| `usePagination`     | `@/composables/usePagination.js`     | Server-side pagination logic                   |
| `useSkeletonLoader` | `@/composables/useSkeletonLoader.js` | Skeleton loading state helper                  |
| `useImageLazy`      | `@/composables/useImageLazy.js`      | Image lazy-loading intersection observer       |
| `useTypedApi`       | `@/composables/useTypedApi.ts`       | TypeScript-typed API fetch                     |

> ⚠️ **`useApiWithCache` is NOT compatible with Options API** — only use inside `<script setup>`.

---

## 🔍 Useful Search Commands

```bash
# Find all views missing SkeletonTable
grep -rL "skeleton-table" src/views --include="*.vue"

# Find all v-progress-circular (should return 0 results)
grep -r "v-progress-circular" src/views --include="*.vue"

# Find all views missing EmptyState
grep -rL "empty-state" src/views --include="*.vue"

# Find views using localStorage directly (legacy)
grep -r "localStorage" src/views --include="*.vue"

# Find all raw axios imports
grep -r "from 'axios'" src/views --include="*.vue"
```

---

## ✅ Pre-Commit Checklist

Before committing any changes, verify:

- [ ] `npm run type-check` → exits with code 0 (zero TypeScript errors)
- [ ] `npm run build` → exits with code 0 (zero build errors)
- [ ] No `<v-progress-circular>` inside `<tbody>` in views
- [ ] No `import axios from 'axios'` (raw) in views
- [ ] No `localStorage` direct usage for auth in new/modified code
- [ ] All new tables have `SkeletonTable` + `EmptyState`
- [ ] All new images in tables have `loading="lazy"` + `lazy-src`
- [ ] Commit message follows Conventional Commits format

---

## 📝 Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(scope): <short description>

<body — optional>
```

**Types:** `feat`, `fix`, `refactor`, `docs`, `style`, `chore`, `perf`

**Examples:**

```
feat(ui): add breadcrumb navigation to CartMaster view
fix(auth): prevent redirect loop when token expires on login page
refactor(table): replace v-progress-circular with SkeletonTable in MallMaster
docs(readme): update project structure and agent guidelines
```

---

## 📚 Further Reading

| Document                                             | Purpose                                       |
| ---------------------------------------------------- | --------------------------------------------- |
| [`docs/README.md`](./docs/README.md)                 | Full architectural reference for AI agents    |
| [`docs/IMPLEMENTATION.md`](./docs/IMPLEMENTATION.md) | Per-phase implementation log with commit SHAs |
| [`docs/IMPROVEMENT.md`](./docs/IMPROVEMENT.md)       | Improvement backlog & roadmap                 |
| [`.agents/skills/`](./.agents/skills/)               | Task-specific AI skill guides                 |
