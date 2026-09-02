<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <div class="d-flex ml-4 mb-4" style="gap: 40px">
      <h4>Position Master</h4>
    </div>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="3">
            <h4>Position</h4>
            <v-text-field
              v-model="input.position"
              label="Type Position"
              variant="outlined"
              density="compact"
              required
              class="mt-2"
            ></v-text-field>
          </v-col>
          <v-col class="mt-8" cols="12" md="2">
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
          <v-col class="mt-8" v-if="isEdit" cols="12" md="2">
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
      <v-row>
        <v-col cols="12">
          <v-table class="country-table">
            <thead>
              <tr>
                <th class="text-left">Id</th>
                <th class="text-left">Position Name</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr class="country-table-body" v-for="item in filteredItems" :key="item.id">
                <td style="font-weight: 500 !important">
                  {{ item.id }}
                </td>
                <td style="font-weight: 500 !important">
                  {{ item.position }}
                </td>

                <td>
                  <div class="d-flex">
                    <v-btn color="green" variant="text" @click="editPosition(item)" icon>
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
          <skeleton-table v-if="isLoading" :rows="5" :columns="3" />
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
      @confirm="deletePosition"
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
  name: 'PositionMaster',
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
    positionIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    imageFile: [],
    isOpenImage: false,
    input: {
      id: 0,
      position: null,
    },
    rules: {
      positionRules: [
        (value) => {
          if (value) return true;
          return 'Position is requred.';
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
    this.getPositionData();
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.items;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.items.filter((item) => item.position.toLowerCase().includes(searchTextLower));
    },
  },
  methods: {
    editPosition(position) {
      this.isEdit = true;
      this.input = {
        id: position.id,
        position: position.position,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        id: 0,
        position: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          position_id: this.input.id,
          position_name: this.input.position,
        };
        axios
          .post(`/positions/update`, payload)
          .then((response) => {
            const data = response.data;
            this.notification.success(data.message);
            this.getPositionData();
            this.input = {
              id: 0,
              position: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.position_name
              ? error.response.data.position_name[0]
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
          position_name: this.input.position,
        };
        axios
          .post(`/positions`, payload)
          .then((response) => {
            const data = response.data;
            this.notification.success(data.message);
            this.getPositionData();
            this.input = {
              id: 0,
              position: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.position_name
              ? error.response.data.position_name[0]
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
      this.positionIdToDelete = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.positionIdToDelete = itemId;
      this.isDelete = true;
    },
    cancelConfirmation() {
      this.positionIdToDelete = null;
      this.isDelete = false;
    },
    deletePosition() {
      this.isDeleteLoading = true;
      axios
        .delete(`/positions/${this.positionIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getPositionData();
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
          this.positionIdToDelete = null;
          this.isDelete = false;
        });
    },
    getPositionData() {
      this.isLoading = true;
      axios
        .get(`/positions`)
        .then((response) => {
          const data = response.data.data;
          this.items = data.map((item) => {
            return {
              id: item.position_id || 1,
              position: item.position_name || '',
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
