<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <div class="d-flex ml-4 mb-4 align-center" style="gap: 30px">
      <router-link class="text-decoration-none text-black" to="/product_master">
        <h1>Product Master</h1>
      </router-link>
      <h1 style="font-size: 35px">|</h1>
      <router-link class="text-decoration-none text-black" to="/quantity_master">
        <h1>Quantity Master</h1>
      </router-link>
    </div>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="3">
            <h3 class="mb-2">Quantity</h3>
            <v-text-field
              v-model="input.quantity"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="mt-n2">
          <v-col cols="12" md="3">
            <v-btn
              :prepend-icon="isEdit ? 'mdi-account-multiple-check' : 'mdi-account-multiple-plus'"
              color="indigo-accent-2"
              style="text-transform: none"
              type="submit"
              variant="flat"
              class="w-100"
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
          <v-col v-if="isEdit" cols="12" md="3">
            <v-btn
              prepend-icon="mdi-account-multiple-remove"
              color="red"
              style="text-transform: none"
              variant="flat"
              class="w-100"
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
        <v-col cols="12">
          <v-table class="country-table">
            <thead>
              <tr>
                <th class="text-left">Id</th>
                <th class="text-left">Quantity Name</th>
                <th class="text-left">User</th>
                <th class="text-left">Dated</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr class="country-table-body" v-for="item in filteredItems" :key="item.id">
                <td style="font-weight: 500 !important">
                  {{ item.id }}
                </td>
                <td style="font-weight: 500 !important">
                  {{ item.quantity }}
                </td>
                <td style="font-weight: 500 !important">
                  {{ item.user }}
                </td>
                <td style="font-weight: 500 !important">
                  {{ item.dated }}
                </td>

                <td>
                  <div class="d-flex">
                    <v-btn color="green" variant="text" @click="editQuantity(item)" icon>
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
          <skeleton-table v-if="isLoading" :rows="5" :columns="5" />
          <empty-state
            v-if="!isLoading && (!filteredItems || filteredItems.length === 0)"
            title="No Data Found"
            subtitle="There are no records to display."
          />
        </v-col>
      </v-row>
    </v-sheet>

    <confirm-dialog
      v-model="isDelete"
      title="Confirmation"
      message="Are you sure you want to delete this item? This action cannot be undone."
      :loading="isDeleteLoading"
      @confirm="deleteQuantity"
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
// import app from '@/util/eventBus';

export default {
  name: 'QuantityMaster',
  components: {
    ConfirmDialog,
    EmptyState,
    SkeletonTable,
  },
  setup() {
    const notification = useNotificationStore();
    return { notification };
  },
  data: () => ({
    // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    valid: false,
    isLoading: false,
    isSending: false,
    isEdit: false,
    isDelete: false,
    isDeleteLoading: false,
    quantityIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    imageFile: [],
    isOpenImage: false,
    input: {
      id: 0,
      quantity: null,
    },
    search: '',
    items: [],
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.getQuantityData();
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.items;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.items.filter(
        (item) =>
          item.quantity.toLowerCase().includes(searchTextLower) ||
          item.user.toLowerCase().includes(searchTextLower) ||
          item.dated.toLowerCase().includes(searchTextLower)
      );
    },
  },
  methods: {
    editQuantity(quantity) {
      this.isEdit = true;
      this.input = {
        id: quantity.id,
        quantity: quantity.quantity,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        id: 0,
        quantity: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          pq_id: this.input.id,
          quantity_name: this.input.quantity,
        };
        axios
          .post(`/product-quantities/update`, payload)
          .then((response) => {
            const data = response.data;
            this.notification.success(data.message);
            this.getQuantityData();
            this.input = {
              id: 0,
              quantity: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.quantity_name
              ? error.response.data.quantity_name[0]
              : error.response.data.message
              ? error.response.data.message
              : 'Something Wrong!!!';
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
          quantity_name: this.input.quantity,
        };
        axios
          .post(`/product-quantities`, payload)
          .then((response) => {
            const data = response.data;
            this.notification.success(data.message);
            this.getQuantityData();
            this.input = {
              id: 0,
              quantity: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.quantity_name
              ? error.response.data.quantity_name[0]
              : error.response.data.message
              ? error.response.data.message
              : 'Something Wrong!!!';
            this.notification.error(message);
          })
          .finally(() => {
            this.isSending = false;
          });
      }
    },
    cancelDelete() {
      this.quantityIdToDelete = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.quantityIdToDelete = itemId;
      this.isDelete = true;
    },
    cancelConfirmation() {
      this.quantityIdToDelete = null;
      this.isDelete = false;
    },
    deleteQuantity() {
      this.isDeleteLoading = true;
      axios
        .delete(`/product-quantities/${this.quantityIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getQuantityData();
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
          this.quantityIdToDelete = null;
          this.isDelete = false;
        });
    },
    getQuantityData() {
      this.isLoading = true;
      axios
        .get(`/product-quantities`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.items = data.map((item) => {
            return {
              id: item.pq_id || 1,
              quantity: item.quantity_name || '',
              user: item.user.name || '',
              user_id: item.user_id || 1,
              dated: item.dated || '',
            };
          });
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
</style>
