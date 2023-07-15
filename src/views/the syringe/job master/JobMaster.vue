<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <div class="d-flex ml-4 mb-6" style="gap: 50px">
      <router-link
        style="color: #293fb8; font-weight: 500"
        class="text-decoration-none"
        to="/healthcare-settings"
      >
        <p>Healthcare Settings</p>
      </router-link>
      <router-link
        style="color: #a93f43; font-weight: 500"
        class="text-decoration-none"
        to="/skills-group"
      >
        <p>Skills</p>
      </router-link>
      <router-link
        style="color: #000; font-weight: 500"
        class="text-decoration-none"
        to="/job-master"
      >
        <p>Job Master</p>
      </router-link>
    </div>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="5">
            <v-text-field
              v-model="input.position"
              :rules="rules.positionRules"
              label="Type Position"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              density="compact"
              :rules="rules.skillsRules"
              label="Select Skills Page"
              placeholder="Type Skills Page"
              :items="resource.subIndustry"
              item-title="name"
              item-value="id"
              v-model="input.skills"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row class="mt-n4">
          <v-col cols="12" md="5">
            <v-autocomplete
              density="compact"
              :rules="rules.companyRules"
              label="Selact Company"
              placeholder="Type Company"
              :items="resource.company"
              item-title="name"
              item-value="id"
              v-model="input.company"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              density="compact"
              :rules="rules.countryRules"
              label="Select Country"
              placeholder="Type Country"
              :items="resource.country"
              item-title="name"
              item-value="id"
              v-model="input.country"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row class="mt-n4">
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
    <v-sheet class="py-6 px-4 mt-10" border rounded width="100%">
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
                <th class="text-left">Job Id</th>
                <th class="text-left">Position</th>
                <th class="text-left">Client Name</th>
                <th class="text-left">Sub Industry</th>
                <th class="text-left">Country</th>
                <th class="text-left">Status</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in filteredItems" :key="item.id">
                <tr class="country-table-body">
                  <td class="text-black text-bold">{{ item.id }}</td>
                  <td class="text-black text-bold">{{ item.position }}</td>
                  <td class="text-black text-bold">
                    {{ item.client }}
                  </td>
                  <td class="text-black text-bold">
                    {{ item.subIndustry }}
                  </td>
                  <td class="text-black text-bold">
                    {{ item.country }}
                  </td>
                  <td class="text-green text-bold">
                    {{ item.status }}
                  </td>

                  <td>
                    <div class="d-flex">
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            color="green"
                            variant="text"
                            v-bind="props"
                            @click="editJob(item)"
                            icon="mdi-pencil-outline"
                          ></v-btn>
                        </template>
                        <span>Edit</span>
                      </v-tooltip>
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            color="red"
                            v-bind="props"
                            variant="text"
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

                <tr>
                  <td colspan="5">
                    <div class="d-flex justify-center" style="gap: 20px">
                      <v-table class="text-left">
                        <tr>
                          <th class="pt-2">Active</th>
                          <th class="pt-2">Live</th>
                          <th class="pt-2">Favorite</th>
                          <th class="pt-2"></th>
                          <th class="pt-2"></th>
                        </tr>
                        <tr>
                          <td class="pr-8 pt-2 pb-4">
                            <v-btn-toggle
                              style="
                                font-size: 10px !important;
                                font-weight: 200 !important;
                                height: 22px !important;
                                width: 54px !important;
                              "
                              class="d-flex align-center"
                              v-model="item.isActive"
                              rounded="5"
                            >
                              <v-btn size="27" :value="true"> Yes </v-btn>

                              <v-btn size="27" :value="false"> No </v-btn>
                            </v-btn-toggle>
                          </td>
                          <td class="pr-8 pt-2 pb-4">
                            <v-btn-toggle
                              style="
                                font-size: 10px !important;
                                font-weight: 200 !important;
                                height: 22px !important;
                                width: 54px !important;
                              "
                              class="d-flex align-center"
                              v-model="item.isLive"
                              rounded="5"
                            >
                              <v-btn size="27" :value="true"> Yes </v-btn>

                              <v-btn size="27" :value="false"> No </v-btn>
                            </v-btn-toggle>
                          </td>
                          <td class="pr-8 pt-2 pb-4">
                            <v-btn-toggle
                              style="
                                font-size: 10px !important;
                                font-weight: 200 !important;
                                height: 22px !important;
                                width: 54px !important;
                              "
                              class="d-flex align-center"
                              v-model="item.isFav"
                              rounded="5"
                            >
                              <v-btn size="27" :value="true"> Yes </v-btn>

                              <v-btn size="27" :value="false"> No </v-btn>
                            </v-btn-toggle>
                          </td>
                          <td class="pr-16 pt-2 pb-4"></td>
                          <td class="pr-8 pt-2 pb-4">
                            <div
                              class="d-flex justify-center"
                              style="gap: 20px"
                            >
                              <router-link
                                class="text-decoration-none"
                                :to="`partner_master/locations/${item.id}`"
                              >
                                <span>Job Locations</span>
                              </router-link>
                            </div>
                          </td>
                        </tr>
                      </v-table>
                    </div>
                  </td>
                </tr>
              </template>
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
        <v-card-text> Are you sure want to delete this job? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelDelete">No</v-btn>
          <v-btn color="success" text @click="deleteJob">Yes</v-btn>
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
  name: 'PartnerMaster',
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
    jobIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    imageFile: [],
    isOpenImage: false,
    successMessage: '',
    errorMessage: '',
    input: {
      id: 0,
      position: null,
      company: null,
      skills: null,
      country: null,
    },
    resource: {
      company: [
        {
          id: 1,
          name: 'BMJ Therapy Pte Ltd',
        },
      ],
      subIndustry: [],
      country: [],
    },
    rules: {
      positionRules: [
        (value) => {
          if (value) return true;
          return 'Position is required.';
        },
      ],
      companyRules: [
        (value) => {
          if (value) return true;
          return 'Company is required.';
        },
      ],
      skillsRules: [
        (value) => {
          if (value) return true;
          return 'Skills Page is required.';
        },
      ],
      countryRules: [
        (value) => {
          if (value) return true;
          return 'Country is required.';
        },
      ],
    },
    search: '',
    items: [],
    itemsTry: [
      {
        id: '05-SG-2023-07-1',
        position: 'Senior Physioterapist',
        client: 'BMJ Therapy Pte Ltd',
        subIndustry: 'Private Clinic',
        sub_industry_id: 1,
        country: 'Singapore',
        status: 'Completed',
        isActive: true,
        isFav: true,
        isLive: true,
      },
    ],
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    // this.getJobData();
    this.getCountry();
    this.getSubIndustryData();
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.itemsTry;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.itemsTry.filter(
        (item) =>
          item.position.toLowerCase().includes(searchTextLower) ||
          item.client.toLowerCase().includes(searchTextLower) ||
          item.subIndustry.toLowerCase().includes(searchTextLower) ||
          item.country.toLowerCase().includes(searchTextLower)
      );
    },
  },
  methods: {
    editJob(job) {
      this.isEdit = true;
      this.input = {
        id: job.id,
        position: job.position,
        company: job.client,
        skills: job.subIndustry,
        country: job.country,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        id: 0,
        position: null,
        company: null,
        skills: null,
        country: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          id: this.input.id,
          name: this.input.username,
          email: this.input.email,
          role: this.input.role,
          country_id: this.input.country,
        };
        if (this.input.image !== null) {
          payload['file'] = this.input.image;
        }
        setTimeout(() => {
          console.log(payload);
          this.isSending = false;
          this.isEdit = false;
        }, 2000);
        // axios
        //   .post(`/user/update`, payload)
        //   .then((response) => {
        //     const data = response.data;
        //     this.successMessage = data.message;
        //     this.isSuccess = true;
        //     this.getJobData();
        //     this.input = {
        //     id: 0,
        // position: null,
        // company: null,
        // skills: null,
        // country: null,
        //     };
        //   })
        //   .catch((error) => {
        //     // eslint-disable-next-line
        //     console.log(error);
        //   })
        //   .finally(() => {
        //     this.isEdit = false;
        //     this.isSending = false;
        //   });
      }
    },
    saveData() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          name: this.input.username,
          email: this.input.email,
          role: this.input.role,
          country_id: this.input.country,
        };
        if (this.input.image !== null) {
          payload['file'] = this.input.image;
        }
        setTimeout(() => {
          console.log(payload);
          this.isSending = false;
        }, 2000);
        // axios
        //   .post(`/register`, payload)
        //   .then((response) => {
        //     const data = response.data;
        //     this.successMessage = data.message;
        //     this.isSuccess = true;
        //     this.getJobData();
        //     this.input = {
        //     id: 0,
        // position: null,
        // company: null,
        // skills: null,
        // country: null,
        //     };
        //   })
        //   .catch((error) => {
        //     // eslint-disable-next-line
        //     console.log(error);
        //   })
        //   .finally(() => {
        //     this.isSending = false;
        //   });
      }
    },
    cancelDelete() {
      this.jobIdToDelete = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.jobIdToDelete = itemId;
      this.isDelete = true;
    },
    cancelConfirmation() {
      this.jobIdToDelete = null;
      this.isDelete = false;
    },
    deleteJob() {
      this.isDeleteLoading = true;
      setTimeout(() => {
        console.log(this.jobIdToDelete);
        this.isDeleteLoading = false;
        this.jobIdToDelete = null;
        this.isDelete = false;
      }, 2000);
      // axios
      //   .post(`/user/delete`, {
      //     id: this.jobIdToDelete,
      //   })
      //   .then((response) => {
      //     const data = response.data;
      //     this.successMessage = data.message;
      //     this.isSuccess = true;
      //     this.getJobData();
      //   })
      //   .catch((error) => {
      //     // eslint-disable-next-line
      //     console.log(error);
      //   })
      //   .finally(() => {
      //     this.isDeleteLoading = false;
      //     this.jobIdToDelete = null;
      //     this.isDelete = false;
      //   });
    },
    getJobData() {
      this.isLoading = true;
      setTimeout(() => {
        console.log('OK');
        this.isLoading = false;
      }, 2000);
      // axios
      //   .get(`/user`)
      //   .then((response) => {
      //     const data = response.data.data;
      //     // console.log(data);
      //     this.items = data.map((item) => {
      //       return {
      //         id: item.id || 1,
      //         name: item.name || '',
      //         email: item.email || '',
      //         registered_on: item.registered_on || '',
      //         role: item.role || '',
      //         roleName:
      //           item.role == 'S'
      //             ? 'Superadmin'
      //             : item.role == 'A'
      //             ? 'Admin'
      //             : '',
      //         image: item.image || null,
      //         country_id: item.country_id || 1,
      //         country_name: item.country_name || '',
      //       };
      //     });

      //     app.config.globalProperties.$eventBus.$emit(
      //       'update-image',
      //       this.items
      //     );
      //   })
      //   .catch((error) => {
      //     // eslint-disable-next-line
      //     console.log(error);
      //   })
      //   .finally(() => {
      //     this.isLoading = false;
      //   });
    },
    getCountry() {
      axios
        .get(`/country`)
        .then((response) => {
          const data = response.data.data;
          this.resource.country = data.map((country) => {
            return {
              id: country.country_id,
              name: country.country_name,
            };
          });
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        });
    },
    getIndustryData() {
      this.isLoading = true;
      axios
        .get(`/industries`)
        .then((response) => {
          const data = response.data.data;
          console.log(data);
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
    getSubIndustryData() {
      this.isLoading = true;
      axios
        .get(`/sub-industries`)
        .then((response) => {
          const data = response.data.data;
          console.log(data);
          this.resource.subIndustry = data.map((item) => {
            return {
              id: item.sub_industry_id || 1,
              name: item.sub_industry_name || '',
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
}

.country-table-body {
  margin-top: 50px !important;
  margin-bottom: 50px !important;
}

.country-table-body td {
  border-bottom: none !important;
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
</style>
