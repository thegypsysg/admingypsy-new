<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <div class="d-flex ml-4 mb-6" style="gap: 50px">
      <router-link
        style="color: #293fb8; font-size: 13px"
        class="text-decoration-none"
        to="/jobs-master"
      >
        <p>Back</p>
      </router-link>
    </div>
    <template v-if="itemData != null">
      <h3>
        <span class="mx-4 mb-6" style="color: #293fb8; font-weight: 600">{{
          itemData?.client || ''
        }}</span
        ><span>{{ itemData?.id || '' }}</span
        ><span>{{ itemData?.id || '' }}</span> -
        <span>{{ itemData?.position || '' }}</span> -
        <span>{{ itemData?.country || '' }}</span>
      </h3>
      <h4 class="ml-4 mt-4">
        Skills Page:
        <span class="mx-4 mb-6" style="color: #293fb8; font-weight: 600">{{
          itemData?.skills || ''
        }}</span>
      </h4>
    </template>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="3">
            <h4 class="mb-2">Show in</h4>
            <v-autocomplete
              density="compact"
              label="Select Country"
              placeholder="Select Country"
              :items="resource.country"
              :rules="rules.countryRules"
              item-title="name"
              item-value="id"
              v-model="input.country"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
          <v-col class="mt-8" cols="12" md="2">
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
          <v-col class="mt-8" cols="12" md="2">
            <v-btn
              v-if="isEdit"
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

              CANCEL
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <v-sheet class="py-6 px-4 mt-10" border rounded width="100%">
      <v-row>
        <v-col cols="12">
          <v-table class="country-table">
            <thead>
              <tr>
                <th class="text-left">Id</th>
                <th class="text-left">Country</th>
                <th class="text-left">User</th>
                <th class="text-left">Dated</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in filteredItems" :key="item.id">
                <tr class="country-table-body">
                  <td>{{ item.id }}</td>
                  <td>
                    {{ item.country }}
                  </td>

                  <td>
                    {{ item.user }}
                  </td>
                  <td>
                    {{ item.dated }}
                  </td>
                  <td>
                    <div class="d-flex">
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            color="green"
                            variant="text"
                            v-bind="props"
                            @click="editPrimaryCountry(item)"
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
        <v-card-text>
          Are you sure want to delete this job master country?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelDelete">No</v-btn>
          <v-btn color="success" text @click="deletePrimaryCountry">Yes</v-btn>
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
  name: 'CountryVue',
  data: () => ({
    // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    idJobCountry: null,
    itemData: null,
    primaryName: null,
    valid: false,
    isLoading: false,
    isSending: false,
    isEdit: false,
    isSuccess: false,
    isError: false,
    isDelete: false,
    isDeleteLoading: false,
    primaryCountryIdToDelete: null,
    successMessage: '',
    errorMessage: '',
    input: {
      id: 0,
      country: null,
    },

    resource: {
      country: [],
      partner: [],
    },
    formattedDate: null,
    rules: {
      countryRules: [
        (value) => {
          if (value) return true;
          return 'Country is required.';
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
    this.idJobCountry = this.$route.params.id;
    this.getJobData();
    this.getJobCountryData();
    this.getCountry();
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.items;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.items.filter(
        (item) =>
          item.contact.toLowerCase().includes(searchTextLower) ||
          item.position.toLowerCase().includes(searchTextLower) ||
          item.telephone.toLowerCase().includes(searchTextLower) ||
          item.mobile.toLowerCase().includes(searchTextLower) ||
          item.whatsapp.toLowerCase().includes(searchTextLower) ||
          item.email.toLowerCase().includes(searchTextLower)
      );
    },
  },
  methods: {
    getJobData() {
      this.isLoading = true;
      axios
        .get(`/jobs`)
        .then((response) => {
          const data = response.data.data;
          this.itemData = data
            .filter((i) => i.job_id == this.idJobCountry)
            .map((item) => {
              return {
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
                isFeatured:
                  item.favorite == 'N'
                    ? false
                    : item.favorite == 'Y'
                    ? true
                    : null,
                isPlatinum:
                  item.favorite == 'N'
                    ? false
                    : item.favorite == 'Y'
                    ? true
                    : null,
                isLive:
                  item.live == 'N' ? false : item.live == 'Y' ? true : null,
                app: item.skill.skill_group.app.app_name || '',
                skillsGroup: item.skill.skill_group.group_name || '',
                skills: item.skill.skills_name || '',
              };
            })[0];
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
    reverseFormatDate(date) {
      const arrayDate = date.split('/');
      const formattedDate = `${arrayDate[2]}-${arrayDate[1]}-${arrayDate[0]}`;
      return formattedDate;
    },
    changeFormatDate() {
      if (this.input.contactedOn) {
        const arrayDate = this.input.contactedOn.split('-');
        const formattedDate = `${arrayDate[2]}/${arrayDate[1]}/${arrayDate[0]}`;
        this.formattedDate = formattedDate;
      }
    },
    editPrimaryCountry(item) {
      this.isEdit = true;
      this.input = {
        id: item.id,
        country: item.country_id,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        id: 0,
        country: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          jmi_id: this.input.id,
          job_id: this.idJobCountry,
          country_id: this.input.country,
        };
        axios
          .post(`/job-international/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getJobCountryData();
            this.input = {
              id: 0,
              country: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message =
              error.response.data.error === ''
                ? 'Something Wrong!!!'
                : error.response.data.error;
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
          job_id: this.idJobCountry,
          country_id: this.input.country,
        };
        axios
          .post(`/job-international`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getJobCountryData();
            this.input = {
              id: 0,
              country: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message =
              error.response.data.error === ''
                ? 'Something Wrong!!!'
                : error.response.data.error;
            this.errorMessage = message;
            this.isError = true;
          })
          .finally(() => {
            this.isSending = false;
          });
      }
    },
    cancelDelete() {
      this.primaryCountryIdToDelete = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.primaryCountryIdToDelete = itemId;
      this.isDelete = true;
    },
    cancelConfirmation() {
      this.primaryCountryIdToDelete = null;
      this.isDelete = false;
    },
    deletePrimaryCountry() {
      this.isDeleteLoading = true;
      axios
        .delete(`/job-international/${this.primaryCountryIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getJobCountryData();
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
          this.primaryCountryIdToDelete = null;
          this.isDelete = false;
        });
    },
    getJobCountryData() {
      this.isLoading = true;
      axios
        .get(`/job-international/${this.idJobCountry}/countries`)
        .then((response) => {
          const data = response.data.data;
          console.log(data);
          // this.items = [
          //   {
          //     user: 'Aji Prasetyo',
          //     dated: '12/08/2023',
          //   },
          // ];
          this.items = data.map((item) => {
            return {
              id: item.jmi_id || 0,
              country: item.country_name || '',
              country_id: item.country_id || null,
              user: item.name || '',
              dated: item.dated || '',
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
    getCountry() {
      axios
        .get(`/countries`)
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
          const message =
            error.response.data.message === ''
              ? 'Something Wrong!!!'
              : error.response.data.message;
          this.errorMessage = message;
          this.isError = true;
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
  font-weight: 500;
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
