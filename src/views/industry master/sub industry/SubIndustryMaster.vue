<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <div class="d-flex ml-4 mb-4" style="gap: 40px">
      <router-link
        class="text-decoration-none text-black"
        to="/industry_master"
      >
        <h4>Industry Master</h4>
      </router-link>
      <router-link
        class="text-decoration-none text-black"
        to="/sub_industry_master"
      >
        <h4>Sub Industry Master</h4>
      </router-link>
    </div>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="3">
            <h4>Sub Industry Name</h4>
            <v-text-field
              v-model="input.subIndustry"
              label="Type Sub Industry Name"
              variant="outlined"
              density="compact"
              required
              class="mt-4"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="mt-n4">
          <v-col cols="12" md="3">
            <v-autocomplete
              clearable
              density="compact"
              label="Select Industry"
              placeholder="Type a Industry"
              :items="resource.industry"
              item-title="name"
              item-value="id"
              v-model="input.industry"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn
              :prepend-icon="
                isEdit
                  ? 'mdi-account-multiple-check'
                  : 'mdi-account-multiple-plus'
              "
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
          <v-col v-if="isEdit" cols="12" md="2">
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
                <th class="text-left">Sub Industry Name</th>
                <th class="text-left">Industry Name</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="country-table-body"
                v-for="item in filteredItems"
                :key="item.id"
              >
                <td style="font-weight: 500 !important">
                  {{ item.id }}
                </td>
                <td style="font-weight: 500 !important">
                  {{ item.subIndustry }}
                </td>
                <td style="font-weight: 500 !important">
                  {{ item.industry }}
                </td>

                <td>
                  <div class="d-flex">
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          color="green"
                          variant="text"
                          v-bind="props"
                          @click="editSubIndustry(item)"
                          icon="mdi-pencil-outline"
                        ></v-btn>
                      </template>
                      <span>Edit</span>
                    </v-tooltip>
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          color="red"
                          variant="text"
                          v-bind="props"
                          :disabled="isDeleteLoading"
                          @click="openDeleteConfirm(item.id)"
                          icon="mdi-trash-can-outline"
                        ></v-btn>
                      </template>
                      <span>Delete</span>
                    </v-tooltip>
                  </div>
                </td>
              </tr>
              <tr v-if="isLoading">
                <td :colspan="6" class="text-center">
                  <v-progress-circular
                    indeterminate
                    color="indigo-accent-2"
                  ></v-progress-circular>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </v-sheet>
    <v-snackbar
      location="top"
      color="green"
      v-model="isSuccess"
      :timeout="3000"
    >
      {{ successMessage }}

      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="isSuccess = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar location="top" color="red" v-model="isError" :timeout="3000">
      {{ errorMessage }}

      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="isError = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <v-dialog persistent width="500" v-model="isDelete">
      <v-card>
        <v-card-title>Confirmation</v-card-title>
        <v-card-text>
          Are you sure want to delete this sub industry?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelDelete">No</v-btn>
          <v-btn color="success" text @click="deleteSubIndustry">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from '@/util/axios';
// import http from 'axios';
import { setAuthHeader } from '@/util/axios';
// import app from '@/util/eventBus';

export default {
  name: 'SubIndustryMaster',
  data: () => ({
    // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    valid: false,
    isLoading: false,
    isSending: false,
    isError: false,
    isEdit: false,
    isSuccess: false,
    isDelete: false,
    isDeleteLoading: false,
    subIndustryIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    imageFile: [],
    isOpenImage: false,
    successMessage: '',
    errorMessage: '',
    input: {
      id: 0,
      subIndustry: null,
      industry: null,
    },
    resource: {
      industry: [],
    },
    rules: {
      industryRules: [
        (value) => {
          if (value) return true;
          return 'Industry is requred.';
        },
      ],
      subIndustryRules: [
        (value) => {
          if (value) return true;
          return 'Sub Industry is requred.';
        },
      ],
    },
    search: '',
    items: [],
    // itemsTry: [
    //   {
    //     id: 8,
    //     subIndustry: 'Private Hospital',
    //     industry: 'Healthcare',
    //   },
    // ],
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.getSubIndustryData();
    this.getIndustryData();
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.items;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.items.filter(
        (item) =>
          item.subIndustry.toLowerCase().includes(searchTextLower) ||
          item.industry.toLowerCase().includes(searchTextLower)
      );
    },
  },
  methods: {
    editSubIndustry(subIndustry) {
      this.isEdit = true;
      this.input = {
        id: subIndustry.id,
        subIndustry: subIndustry.subIndustry,
        industry: subIndustry.industry_id,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        id: 0,
        subIndustry: null,
        industry: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          sub_industry_id: this.input.id,
          sub_industry_name: this.input.subIndustry,
          industry_id: this.input.industry,
        };
        axios
          .post(`/sub-industries/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getSubIndustryData();
            this.input = {
              id: 0,
              subIndustry: null,
              industry: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.sub_industry_name
              ? error.response.data.sub_industry_name[0]
              : error.response.data.message
              ? error.response.data.message
              : 'Something Wrong!!!';
            this.errorMessage = message;
            this.isError = true;
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
          sub_industry_name: this.input.subIndustry,
          industry_id: this.input.industry,
        };
        axios
          .post(`/sub-industries`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getSubIndustryData();
            this.input = {
              id: 0,
              subIndustry: null,
              industry: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.sub_industry_name
              ? error.response.data.sub_industry_name[0]
              : error.response.data.message
              ? error.response.data.message
              : 'Something Wrong!!!';
            this.errorMessage = message;
            this.isError = true;
          })
          .finally(() => {
            this.isSending = false;
          });
      }
    },
    cancelDelete() {
      this.subIndustryIdToDelete = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.subIndustryIdToDelete = itemId;
      this.isDelete = true;
    },
    cancelConfirmation() {
      this.subIndustryIdToDelete = null;
      this.isDelete = false;
    },
    deleteSubIndustry() {
      this.isDeleteLoading = true;
      axios
        .delete(`/sub-industries/${this.subIndustryIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getSubIndustryData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === ''
              ? 'Something Wrong!!!'
              : error.response.data.message;
          this.errorMessage = message;
          this.isError = true;
        })
        .finally(() => {
          this.isDeleteLoading = false;
          this.subIndustryIdToDelete = null;
          this.isDelete = false;
        });
    },
    getSubIndustryData() {
      this.isLoading = true;
      axios
        .get(`/sub-industries`)
        .then((response) => {
          const data = response.data.data;
          this.items = data.map((item) => {
            return {
              id: item.sub_industry_id || 1,
              subIndustry: item.sub_industry_name || '',
              industry: item.industry.industry_name || '',
              industry_id: item.industry_id || '',
            };
          });
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === ''
              ? 'Something Wrong!!!'
              : error.response.data.message;
          this.errorMessage = message;
          this.isError = true;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    getIndustryData() {
      this.isLoading = true;
      axios
        .get(`/industries`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.resource.industry = data.map((item) => {
            return {
              id: item.industry_id || 1,
              name: item.industry_name || '',
            };
          });
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === ''
              ? 'Something Wrong!!!'
              : error.response.data.message;
          this.errorMessage = message;
          this.isError = true;
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
