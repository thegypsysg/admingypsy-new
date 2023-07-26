<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-autocomplete
              density="compact"
              label="Select Position"
              placeholder="Type Position"
              :items="resource.position"
              item-title="name"
              item-value="id"
              v-model="input.position"
              variant="outlined"
              required
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              density="compact"
              label="Select Skills Page"
              placeholder="Type Skills Page"
              :items="resource.skills"
              item-title="name"
              item-value="id"
              v-model="input.skills"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              density="compact"
              label="---Select Partner---"
              placeholder="Type Partner"
              :items="resource.partner"
              item-title="name"
              item-value="id"
              v-model="input.partner"
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
                  <td
                    class="text-bold"
                    :class="{
                      'text-green': item.status == 'Completed',
                      'text-red': item.status == 'Pending',
                    }"
                  >
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
                            @click="openDeleteConfirm(item.job_id)"
                            icon="mdi-trash-can-outline"
                          ></v-btn>
                        </template>
                        <span>Delete</span>
                      </v-tooltip>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td colspan="7">
                    <div>
                      <v-table class="text-left">
                        <tr>
                          <th class="pt-2">Job Posted on</th>
                          <th class="pt-2">Active</th>
                          <th class="pt-2">Live</th>
                          <th class="pt-2">Favorite</th>
                          <th class="pt-2 text-blue-darken-4">App Name</th>
                          <th class="pt-2 text-blue-darken-4">Skills Group</th>
                          <th class="pt-2 text-blue-darken-4">Skills Page</th>
                          <th class="pt-2"></th>
                        </tr>
                        <tr>
                          <td class="pt-2 pb-4 text-bold">
                            {{ item.postedOn }}
                          </td>
                          <td class="pt-2 pb-4">
                            <v-btn-toggle
                              style="
                                font-size: 10px !important;
                                font-weight: 200 !important;
                                height: 22px !important;
                                width: 54px !important;
                              "
                              class="d-flex align-center"
                              v-model="item.isActive"
                              @click="activeJob(item.job_id)"
                              rounded="5"
                            >
                              <v-btn size="27" :value="true"> Yes </v-btn>

                              <v-btn size="27" :value="false"> No </v-btn>
                            </v-btn-toggle>
                          </td>
                          <td class="pt-2 pb-4">
                            <v-btn-toggle
                              style="
                                font-size: 10px !important;
                                font-weight: 200 !important;
                                height: 22px !important;
                                width: 54px !important;
                              "
                              class="d-flex align-center"
                              v-model="item.isLive"
                              @click="liveJob(item.job_id)"
                              rounded="5"
                            >
                              <v-btn size="27" :value="true"> Yes </v-btn>

                              <v-btn size="27" :value="false"> No </v-btn>
                            </v-btn-toggle>
                          </td>
                          <td class="pt-2 pb-4">
                            <v-btn-toggle
                              style="
                                font-size: 10px !important;
                                font-weight: 200 !important;
                                height: 22px !important;
                                width: 54px !important;
                              "
                              class="d-flex align-center"
                              v-model="item.isFav"
                              @click="favoriteJob(item.job_id)"
                              rounded="5"
                            >
                              <v-btn size="27" :value="true"> Yes </v-btn>

                              <v-btn size="27" :value="false"> No </v-btn>
                            </v-btn-toggle>
                          </td>
                          <td class="pt-2 pb-4 text-purple text-bold">
                            {{ item.app }}
                          </td>
                          <td class="pt-2 pb-4 text-purple text-bold">
                            {{ item.skillsGroup }}
                          </td>
                          <td class="pt-2 pb-4 text-purple text-bold">
                            {{ item.skills }}
                          </td>
                          <td class="pb-4 d-flex justify-end">
                            <v-btn
                              :to="`/jobs-master/${item.job_id}`"
                              color="indigo-accent-2"
                              style="text-transform: none"
                              variant="flat"
                              class="mt-n3 px-2 py-1"
                            >
                              View Details
                            </v-btn>
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
      id: null,
      position: null,
      skills: null,
      partner: null,
    },
    resource: {
      position: [],
      skills: [],
      partner: [],
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
    //   itemsTry: [
    //     {
    //       id: '05-SG-2023-07-1',
    //       position: 'Senior Physioterapist',
    //       client: 'BMJ Therapy Pte Ltd',
    //       subIndustry: 'Private Clinic',
    //       sub_industry_id: 1,
    //       country: 'Singapore',
    //       status: 'Completed',
    //       postedOn: '16/07/2023',
    //       app: 'The Syringe',
    //       skillsGroup: 'Nusrsing',
    //       skills: 'Physioterapist',
    //       isActive: true,
    //       isFav: true,
    //       isLive: true,
    //     },
    //   ],
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.getJobData();
    this.getPositionData();
    this.getPrimarySkillData();
    this.getPartnerData();
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.items;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.items.filter(
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
        id: job.job_id,
        position: job.position_id,
        skills: job.skills_id,
        partner: job.partner_id,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        id: null,
        position: null,
        skills: null,
        partner: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          job_id: this.input.id,
          position_id: this.input.position,
          skills_id: this.input.skills,
          partner_id: this.input.partner,
        };
        axios
          .post(`/jobs/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getJobData();
            this.input = {
              id: null,
              position: null,
              skills: null,
              partner: null,
            };
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
            this.input = {
              id: null,
              position: null,
              skills: null,
              partner: null,
            };
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
          position_id: this.input.position,
          skills_id: this.input.skills,
          partner_id: this.input.partner,
        };
        axios
          .post(`/jobs`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getJobData();
            this.input = {
              id: null,
              position: null,
              skills: null,
              partner: null,
            };
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
            this.isSending = false;
          });
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
      axios
        .delete(`/jobs/${this.jobIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getJobData();
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
          this.jobIdToDelete = null;
          this.isDelete = false;
        });
    },
    getJobData() {
      this.isLoading = true;
      axios
        .get(`/jobs`)
        .then((response) => {
          const data = response.data.data;
          this.items = data.map((item) => {
            return {
              //       app: 'The Syringe',
              //       skillsGroup: 'Nusrsing',
              //       skills: 'Physioterapist',
              id: item.job_reference_no || '',
              job_id: item.job_id || 1,
              position: item.position.position_name || '',
              position_id: item.position_id || 1,
              client: item.partner.partner_name || '',
              partner_id: item.partner_id || 1,
              subIndustry: item.partner.sub_industry.sub_industry_name || '',
              skills_id: item.skills_id || 1,
              country: item.partner.country.country_name || '',
              status:
                item.status == 'P'
                  ? 'Pending'
                  : item.status == 'C'
                  ? 'Completed'
                  : '',
              postedOn: item.job_dated || '',
              isActive:
                item.active == 'N' ? false : item.active == 'Y' ? true : null,
              isFav:
                item.favorite == 'N'
                  ? false
                  : item.favorite == 'Y'
                  ? true
                  : null,
              isLive: item.live == 'N' ? false : item.live == 'Y' ? true : null,
              app: item.skill.skill_group.app.app_name || '',
              skillsGroup: item.skill.skill_group.group_name || '',
              skills: item.skill.skills_name || '',
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
    getPositionData() {
      this.isLoading = true;
      axios
        .get(`/positions`)
        .then((response) => {
          const data = response.data.data;
          this.resource.position = data.map((item) => {
            return {
              id: item.position_id || 1,
              name: item.position_name || '',
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
    getPrimarySkillData() {
      this.isLoading = true;
      axios
        .get(`/skills`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);

          this.resource.skills = data
            .sort((a, b) => a.skills_id > b.skills_id)
            .map((item) => {
              return {
                id: item.skills_id || 1,
                name: item.skills_name || '',
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
    getPartnerData() {
      this.isLoading = true;
      axios
        .get(`/partners`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.resource.partner = data.map((item) => {
            return {
              id: item.partner_id || 1,
              name: item.partner_name || '',
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
    activeJob(id) {
      this.isSending = true;
      axios
        .get(`/jobs/toggle-active/${id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getJobData();
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
          this.isSending = false;
        });
    },
    favoriteJob(id) {
      this.isSending = true;
      axios
        .get(`/jobs/toggle-favorite/${id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getJobData();
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
          this.isSending = false;
        });
    },
    liveJob(id) {
      this.isSending = true;
      axios
        .get(`/jobs/toggle-live/${id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getJobData();
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
          this.isSending = false;
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
