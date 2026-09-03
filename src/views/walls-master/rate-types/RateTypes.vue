<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <app-breadcrumb
      :items="[
        { title: 'Dashboard', to: '/' },
        { title: 'Rate Types', to: null },
      ]"
    />
    <HeaderWallMaster />
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="input.name"
              :rules="rules.nameRules"
              label="Rate Name"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-textarea
              density="compact"
              v-model="input.desc"
              label="Rate Description"
              rows="1"
              variant="outlined"
              required
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row class="d-flex align-baseline mt-n4">
          <v-col cols="12" md="2">
            <v-btn
              :prepend-icon="isEdit ? 'mdi-account-multiple-check' : 'mdi-account-multiple-plus'"
              color="indigo-accent-2"
              style="text-transform: none"
              type="submit"
              variant="flat"
              class="w-100 mb-8"
              @click="isEdit ? saveEdit() : saveData()"
              :disabled="isSending"
              :loading="isSending"
            >
              <template v-slot:prepend>
                <v-icon color="white"></v-icon>
              </template>

              {{ isEdit ? 'Save' : 'Add' }}
            </v-btn>
          </v-col>
          <v-col v-if="isEdit" cols="12" md="2">
            <v-btn
              prepend-icon="mdi-account-multiple-remove"
              color="red"
              style="text-transform: none"
              variant="flat"
              class="w-100 mb-8"
              @click="cancelEdit"
              :disabled="isSending"
            >
              <template v-slot:prepend>
                <v-icon color="white"></v-icon>
              </template>

              Cancel
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <v-sheet class="py-6 px-4 mt-6" border rounded width="100%">
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            density="compact"
            v-model="search"
            label="Search"
            variant="outlined"
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row align="center" justify="space-between">
        <v-col cols="8">
          <span> Showing {{ startItem }} - {{ endItem }} from {{ totalItems }} item </span>
        </v-col>
        <v-col cols="4" class="text-right">
          <v-select
            v-model="perPage"
            :items="[5, 10, 15, 20]"
            label="Items per page"
            density="compact"
            variant="outlined"
            hide-details
            @update:modelValue="getRateMasterData"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-table class="country-table">
            <thead>
              <tr>
                <th class="text-left">ID</th>
                <th class="text-left">Rate Name</th>
                <th class="text-left">RateDescription</th>
                <th class="text-left">User</th>
                <th class="text-left">Dated</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr class="country-table-body" v-for="item in filteredItems" :key="item.id">
                <td>{{ item.id }}</td>

                <td style="font-weight: 500 !important">
                  {{ item.name }}
                </td>
                <td style="font-weight: 500 !important">
                  {{ item.desc }}
                </td>
                <td style="font-weight: 500 !important">
                  {{ item?.user?.name }}
                </td>
                <td style="font-weight: 500 !important">
                  {{ item.dated }}
                </td>

                <td>
                  <div class="d-flex">
                    <v-btn color="green" variant="text" @click="editRateType(item)" icon>
                      <v-icon>mdi-pencil-outline</v-icon>
                      <v-tooltip location="top" activator="parent">Edit</v-tooltip>
                    </v-btn>
                    <v-btn
                      color="red"
                      variant="text"
                      :disabled="isDeleteLoading"
                      @click="openDeleteConfirm(item.id)"
                      icon
                    >
                      <v-icon>mdi-trash-can-outline</v-icon>
                      <v-tooltip location="top" activator="parent">Delete</v-tooltip>
                    </v-btn>
                  </div>
                </td>
              </tr>
            </tbody>
          </v-table>
          <skeleton-table v-if="isLoading" :rows="5" :columns="6" />
          <empty-state
            v-if="!isLoading && (!filteredItems || filteredItems.length === 0)"
            title="No Data Found"
            subtitle="There are no records to display."
          />
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            @update:modelValue="getRateMasterData"
          ></v-pagination>
        </v-col>
      </v-row>
    </v-sheet>

    <confirm-dialog
      v-model="isDelete"
      title="Confirmation"
      message="Are you sure you want to delete this item? This action cannot be undone."
      :loading="isDeleteLoading"
      @confirm="deleteRateType"
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
import HeaderWallMaster from '@/components/HeaderWallMaster.vue';
// import app from '@/util/eventBus';

export default {
  name: 'RateTypes',
  components: {
    ConfirmDialog,
    EmptyState,
    SkeletonTable,
    HeaderWallMaster,
  },
  setup() {
    const notification = useNotificationStore();
    return { notification };
  },
  data: () => ({
    //fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    valid: false,
    isLoading: false,
    isSending: false,
    isEdit: false,
    isDelete: false,
    isDeleteLoading: false,
    rateIdToDelete: null,

    input: {
      id: 0,
      name: null,
      desc: null,
      app: null,
    },
    resource: {
      app: [],
    },
    rules: {
      nameRules: [
        (value) => {
          if (value) return true;
          return 'Rate name is required.';
        },
      ],
      descriptionRules: [
        (value) => {
          if (value) return true;
          return 'Description is required.';
        },
      ],
      appRules: [
        (value) => {
          if (value) return true;
          return 'App is required.';
        },
      ],
    },
    search: '',
    items: [],
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.getRateTypeData();
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.items;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTextLower) ||
          item.desc.toLowerCase().includes(searchTextLower)
      );
    },
    startItem() {
      return (this.currentPage - 1) * this.perPage + 1;
    },
    endItem() {
      return Math.min(this.currentPage * this.perPage, this.totalItems);
    },
  },
  watch: {
    perPage() {
      this.currentPage = 1; // Reset ke halaman pertama saat `perPage` berubah
      this.getRateTypeData();
    },
  },
  methods: {
    saveErrorResponse(response) {
      let errorMessage = '';

      for (const key in response.data) {
        errorMessage += `${key}: ${response.data[key][0]}\n`;
      }

      return errorMessage;
    },
    editRateType(prop) {
      this.isEdit = true;
      this.input = {
        id: prop.id,
        name: prop.name,
        desc: prop.desc,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        id: 0,
        name: null,
        desc: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          rt_id: this.input.id,
          rate_name: this.input.name,
          description: this.input.desc,
        };
        axios
          .post(`/4walls-rates-types/update`, payload)
          .then((response) => {
            const data = response.data;
            this.notification.success(data.message);
            this.getRateTypeData();
            this.input = {
              id: 0,
              name: null,
              desc: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message =
              error.response.data.message === ''
                ? 'Something Wrong!!!'
                : error.response.data.message;
            this.notification.error(message);
          })
          .finally(() => {
            this.isEdit = false;
            this.isSending = false;
          });
      }
    },
    saveData() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          rate_name: this.input.name,
          description: this.input.desc,
        };
        axios
          .post(`/4walls-rates-types`, payload)
          .then((response) => {
            const data = response.data;
            this.notification.success(data.message);
            this.getRateTypeData();
            this.input = {
              id: 0,
              name: null,
              desc: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message =
              error.response.data.message === ''
                ? 'Something Wrong!!!'
                : error.response.data.message;
            this.notification.error(message);
          })
          .finally(() => {
            this.isSending = false;
          });
      }
    },
    cancelDelete() {
      this.rateIdToDelete = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.rateIdToDelete = itemId;
      this.isDelete = true;
    },
    cancelConfirmation() {
      this.rateIdToDelete = null;
      this.isDelete = false;
    },
    deleteRateType() {
      this.isDeleteLoading = true;
      axios
        .delete(`/4walls-rates-types/${this.rateIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getRateTypeData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === '' ? 'Something Wrong!!!' : error.response.data.message;
          this.notification.error(message);
        })
        .finally(() => {
          this.isDeleteLoading = false;
          this.rateIdToDelete = null;
          this.isDelete = false;
        });
    },
    getRateTypeData() {
      this.isLoading = true;
      axios
        .get(
          `/4walls-rates-types`
          // {
          //   params: {
          //     query: this.search,
          //     page: this.currentPage,
          //     perPage: this.perPage,
          //   },
          // }
        )
        .then((response) => {
          const data = response.data.data;
          //console.log(data);
          this.items = data.map((item) => {
            return {
              ...item,
              id: item.rt_id || 1,
              name: item.rate_name || '',
              desc: item.description || '',
            };
          });

          // // Perbarui pagination
          // this.currentPage = data?.current_page;
          // this.perPage = data?.per_page;
          // this.totalItems = data?.total;
          // this.totalPages = data?.last_page;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === '' ? 'Something Wrong!!!' : error.response.data.message;
          this.notification.error(message);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.country-table {
  font-size: 12px;
  color: black !important;
}

.country-table-body {
  margin-top: 50px !important;
  margin-bottom: 50px !important;
}

.upload-title {
  background-color: #9ddcff;
  color: white;
}

.v-simple-table {
  background: red !important;
}

.v-btn-toggle .v-btn:not(.v-btn--active) {
  background-color: #e0e0e0 !important;
}

/* Latar belakang aktif */
.v-btn-toggle .v-btn--active {
  background-color: #2196f3 !important;
  color: #fff !important;
}

.skeleton {
  width: 100%;
  height: 100%;
  border-radius: 0;

  background: linear-gradient(-90deg, #f2f2f2 0%, #e1e1e1 50%, #f2f2f2 100%);
  background-size: 400% 400%;
  animation: skeleton 1.6s ease infinite;
  margin: 0 auto;
}

@keyframes skeleton {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}
</style>
