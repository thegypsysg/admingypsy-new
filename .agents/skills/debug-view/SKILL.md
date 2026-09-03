---
name: debug-view
description: Systematic debugging guide for AdminGypsy views. Use this when a view has errors, blank pages, broken tables, auth issues, or broken API calls. Covers common pitfalls, pattern mismatches, and how to isolate issues step by step.
---

# Skill: Debug a View in AdminGypsy

Use this guide when investigating bugs, blank pages, or broken behavior in any of the 90+ views.

---

## Common Issues & Solutions

### 1. Blank Page / Console Error "getCurrentInstance"

**Cause:** `useApiWithCache` or another Composition API composable called inside Options API `created()` or `mounted()` instead of inside `setup()`.

**Fix:**

```javascript
// ❌ WRONG — causes runtime error
created() {
  const { fetch } = useApiWithCache('/endpoint');
}

// ✅ CORRECT — use setup() or use plain axios
setup() {
  const cache = useApiWithCache('/endpoint');
  return { cache };
},
mounted() {
  this.cache.fetch();
}
```

---

### 2. API Returns 401 (Unauthorized)

**Cause:** Token not attached to request, or token expired.

**Checklist:**

1. Verify `created()` calls `setAuthHeader(token)`:
   ```javascript
   created() {
     const token = JSON.parse(localStorage.getItem('token'));
     setAuthHeader(token);
   }
   ```
2. Check if the user was redirected to login (token expired) — `apiClient.js` auto-redirects on 401.
3. Verify `src/util/axios.js` is imported (not raw `axios`):
   ```javascript
   import axios from '@/util/axios'; // ✅
   // NOT: import axios from 'axios'; // ❌
   ```

---

### 3. Table Shows Data but Loading Never Ends (spinner forever)

**Cause:** `isLoading = false` not called in `.finally()`.

**Fix:** Always use the `.finally()` block:

```javascript
fetchData() {
  this.isLoading = true;
  axios.get('/endpoint')
    .then(response => { this.items = response.data.data; })
    .catch(error => { this.notification.error(error?.response?.data?.message || 'Error'); })
    .finally(() => { this.isLoading = false; }); // ← required
},
```

---

### 4. `<v-progress-circular>` Still Visible After Load

**Cause:** Old loading pattern still in `<tbody>` instead of `<skeleton-table>` outside.

**Fix:**

```html
<!-- ❌ OLD — remove this from inside <tbody> -->
<tr v-if="isLoading">
  <td colspan="6" class="text-center">
    <v-progress-circular indeterminate />
  </td>
</tr>

<!-- ✅ NEW — place OUTSIDE </v-table> -->
<skeleton-table v-if="isLoading" :rows="5" :columns="6" />
```

---

### 5. Breadcrumb Not Rendering

**Cause:** `<app-breadcrumb>` tag not placed directly inside `<v-container>` as the **first child**.

**Fix:**

```html
<template>
  <v-container>
    <app-breadcrumb
      :items="[
        { title: 'Dashboard', to: '/' },
        { title: 'Page Name', to: null },
      ]"
    />
    <!-- rest of content -->
  </v-container>
</template>
```

> `AppBreadcrumb` is globally registered in `main.js` — no local import needed.

---

### 6. Nested `<a>` Tags Warning (Vuetify breadcrumbs)

**Cause:** A `<router-link>` or `<a>` tag placed inside `v-slot:title` of `v-breadcrumbs-item`.

**Fix:** Do NOT put `<router-link>` inside the title slot. Use the `to` prop directly on the item object. The `AppBreadcrumb.vue` component handles navigation via the `formattedItems` computed property.

---

### 7. Build Error: "Duplicate key 'components'"

**Cause:** When adding `components: { SkeletonTable, EmptyState }` to a view that **already has** a trailing `components: { SomeOtherComponent }` at the bottom of the `export default {}` object.

**Fix:** Check the entire `export default {}` for any existing `components` key and merge them:

```javascript
// ❌ Duplicate — will ESLint error
export default {
  name: 'MyView',
  components: { SkeletonTable, EmptyState }, // ← added at top
  // ... lots of code ...
  components: { ImageUpload }, // ← existing at bottom — DUPLICATE!
};

// ✅ Merge into one
export default {
  name: 'MyView',
  components: { SkeletonTable, EmptyState, ImageUpload },
  // ...
};
```

---

### 8. `v-model` on Deprecated Component

**Cause:** Using old Vue 2 `.sync` modifier or old `v-model` API on Vuetify 2 components in Vuetify 3.

**Note:** The file has `<!-- eslint-disable vue/no-deprecated-v-bind-sync -->` at the top — this is a known legacy issue. Do not try to fix these unless explicitly asked.

---

### 9. ESLint Error on Commit (husky pre-commit hook)

The project uses husky + lint-staged. If commit fails:

1. Read the error output carefully — it will tell you the exact file and line
2. Fix the specific ESLint error (most common: `no-dupe-keys`, `no-unused-vars`, `vue/multi-word-component-names`)
3. Re-run `git add .` then `git commit`

Common quick fixes:

```javascript
// no-unused-vars → prefix with _ or remove
// no-dupe-keys → merge duplicate object keys
// vue/multi-word-component-names → add comment at top of file:
// <!-- eslint-disable vue/multi-word-component-names -->
```

---

## Debugging Checklist

When investigating a broken view, work through this list in order:

- [ ] Open browser DevTools → Console: any errors?
- [ ] Open browser DevTools → Network: API calls returning 200? 401? 500?
- [ ] Is `isLoading` being set to `false` in `.finally()`?
- [ ] Is `setAuthHeader(token)` called in `created()`?
- [ ] Is `import axios from '@/util/axios'` (not raw axios)?
- [ ] Run `npm run type-check` — any TypeScript errors?
- [ ] Check `git diff` — what was recently changed?
- [ ] Search for "duplicate key" or "missing import" in the script section
