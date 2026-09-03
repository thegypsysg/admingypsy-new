---
name: add-new-view
description: Step-by-step guide for adding a new view/page to AdminGypsy. Covers template structure, routing, component patterns, API integration, and pre-commit checklist. Use this whenever creating a new admin page from scratch or from a model.
---

# Skill: Add New View to AdminGypsy

Follow these steps **in order** when creating a new admin view.

---

## Step 1 — Create the Directory & File

All view directories must use **kebab-case** (no spaces, no PascalCase folders):

```
src/views/<feature-name>/<ViewName>.vue
```

Example:

```
src/views/product-master/ProductMaster.vue
```

---

## Step 2 — Vue File Boilerplate

Use this exact template. Do **NOT** deviate from the Options API pattern unless instructed:

```vue
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <!-- Breadcrumb navigation — always first inside v-container -->
    <app-breadcrumb
      :items="[
        { title: 'Dashboard', to: '/' },
        { title: 'Feature Name', to: null },
      ]"
    />

    <!-- Form / filter section -->
    <v-sheet class="py-6 px-4 mt-10" border rounded width="100%">
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            density="compact"
            v-model="search"
            label="Search"
            variant="outlined"
            hide-details
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <!-- Data Table -->
          <v-table class="country-table">
            <thead>
              <tr>
                <th class="text-left">ID</th>
                <th class="text-left">Name</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in items" :key="item.id">
                <tr class="country-table-body">
                  <td>{{ item.id }}</td>
                  <td>{{ item.name }}</td>
                  <td>
                    <div class="d-flex">
                      <v-btn color="green" variant="text" @click="editItem(item)" icon>
                        <v-icon>mdi-pencil-outline</v-icon>
                        <v-tooltip location="top" activator="parent">Edit</v-tooltip>
                      </v-btn>
                      <v-btn
                        color="red"
                        variant="text"
                        :disabled="isDeleteLoading"
                        @click="openDelete(item.id)"
                        icon
                      >
                        <v-icon>mdi-trash-can-outline</v-icon>
                        <v-tooltip location="top" activator="parent">Delete</v-tooltip>
                      </v-btn>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </v-table>

          <!-- Loading skeleton — OUTSIDE v-table, right after -->
          <skeleton-table v-if="isLoading" :rows="5" :columns="3" />

          <!-- Empty state — OUTSIDE v-table, right after skeleton -->
          <empty-state
            v-if="!isLoading && (!items || items.length === 0)"
            title="No Data Found"
            subtitle="There are no records to display."
          />
        </v-col>
      </v-row>
    </v-sheet>

    <!-- Delete Confirmation -->
    <confirm-dialog
      v-model="isDelete"
      title="Confirmation"
      message="Are you sure you want to delete this item? This action cannot be undone."
      :loading="isDeleteLoading"
      @confirm="deleteItem"
    />
  </v-container>
</template>

<script>
import SkeletonTable from '@/components/SkeletonTable.vue';
import EmptyState from '@/components/EmptyState.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import { useNotificationStore } from '@/stores/notification';
import axios from '@/util/axios';
import { setAuthHeader } from '@/util/axios';

export default {
  name: 'FeatureName',
  components: {
    SkeletonTable,
    EmptyState,
    ConfirmDialog,
  },
  setup() {
    const notification = useNotificationStore();
    return { notification };
  },
  data: () => ({
    isLoading: false,
    isDelete: false,
    isDeleteLoading: false,
    idToDelete: null,
    search: '',
    items: [],
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.isLoading = true;
      axios
        .get('/endpoint')
        .then((response) => {
          const data = response.data.data;
          this.items = data.map((item) => ({
            id: item.id,
            name: item.name,
          }));
        })
        .catch((error) => {
          const message = error?.response?.data?.message || 'Something went wrong.';
          this.notification.error(message);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    openDelete(id) {
      this.idToDelete = id;
      this.isDelete = true;
    },
    deleteItem() {
      this.isDeleteLoading = true;
      axios
        .delete(`/endpoint/${this.idToDelete}`)
        .then((response) => {
          this.notification.success(response.data.message);
          this.fetchData();
        })
        .catch((error) => {
          const message = error?.response?.data?.message || 'Delete failed.';
          this.notification.error(message);
        })
        .finally(() => {
          this.isDeleteLoading = false;
          this.idToDelete = null;
          this.isDelete = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.country-table {
  font-size: 12px;
  color: rgb(100, 100, 100) !important;
}
.country-table-body td {
  border-bottom: none !important;
}
</style>
```

---

## Step 3 — Add Route to Router

Open `src/router/index.js` and add a lazy-loaded route inside the appropriate parent:

```javascript
{
  path: '/feature-name',
  name: 'feature-name',
  component: () => import('../views/feature-name/FeatureName.vue'),
  meta: { requiresAuth: true },
},
```

> - Route `name` must be **unique** across all 112+ routes — check with `grep_search`
> - Use `meta: { requiresAuth: true }` for protected pages (all admin pages)
> - Always use lazy import `() => import(...)` for code splitting

---

## Step 4 — Add Navigation to Sidebar (if needed)

Open `src/components/SidebarDashboard.vue`. The navigation is driven by the `navigationStore` in `src/stores/navigation.js`. Add your route to the appropriate menu group in `navigation.js`.

---

## Step 5 — Images in Tables

If the view shows images inside table rows, apply lazy loading:

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

## Step 6 — Pagination (only if API supports it)

Only add pagination if the backend API supports `page` and `per_page` query params:

```html
<v-pagination v-model="currentPage" :length="totalPages" @update:modelValue="fetchData" />
```

```javascript
data: () => ({
  currentPage: 1,
  perPage: 10,
  totalItems: 0,
  totalPages: 0,
}),
methods: {
  fetchData() {
    axios.get('/endpoint', {
      params: { page: this.currentPage, per_page: this.perPage }
    }).then(response => {
      this.items = response.data.data;
      this.totalItems = response.data.total;
      this.totalPages = response.data.last_page;
    });
  },
},
```

---

## Step 7 — Verify

```bash
npm run type-check   # must exit 0
npm run build        # must exit 0
```

Navigate to the route in the dev server and confirm:

- Breadcrumb shows correctly
- Table loads data with skeleton during fetch
- Empty state shows when no data
- Delete dialog opens and confirms correctly
- Notifications appear on success/error
