<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <div class="d-flex ml-4 mb-6" style="gap: 50px">
      <router-link
        style="color: #293fb8; font-size: 13px"
        class="text-decoration-none"
        to="/primary-skills"
      >
        <p>Back</p>
      </router-link>
    </div>
    <h4 class="ml-4 mb-6" style="color: #293fb8; font-weight: 400">
      {{ primaryName || '' }}
    </h4>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="3">
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
          <v-col cols="12" md="3">
            <v-autocomplete
              density="compact"
              label="Regulator"
              placeholder="Select Regulator"
              :items="resource.partner"
              item-title="name"
              item-value="id"
              v-model="input.regulator"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              density="compact"
              label="Association"
              placeholder="Select Association"
              :items="resource.partner"
              item-title="name"
              item-value="id"
              v-model="input.association"
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
            <v-btn
              v-if="isEdit"
              prepend-icon="mdi-account-multiple-remove"
              color="red"
              style="text-transform: none"
              variant="flat"
              class="w-100 mt-2"
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
                <th class="text-left">Registrable</th>
                <th class="text-left">Regulator</th>
                <th class="text-left">Associations</th>
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
                    <v-btn-toggle
                      mandatory
                      style="
                        font-size: 10px !important;
                        font-weight: 200 !important;
                        height: 22px !important;
                        width: 54px !important;
                      "
                      class="d-flex align-center"
                      v-model="item.registrable"
                      @click="registrableCountry(item.id)"
                      rounded="5"
                    >
                      <v-btn size="27" :value="true"> Yes </v-btn>

                      <v-btn size="27" :value="false"> No </v-btn>
                    </v-btn-toggle>
                  </td>
                  <td>
                    {{ item.regulator }}
                  </td>
                  <td>
                    {{ item.association }}
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
          Are you sure want to delete this primary skills country?
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
    idPrimaryCountry: null,
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
      regulator: null,
      association: null,
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
    this.idPrimaryCountry = this.$route.params.id;
    this.getPrimarySkillData();
    this.getPrimaryCountryData();
    this.getPartnerData();
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
    getPrimarySkillData() {
      axios
        .get(`/skills`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.primaryName = data
            .filter((i) => i.skills_id == this.idPrimaryCountry)
            .map((item) => item.skills_name || '')[0];
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
        regulator: item.regulator_id,
        association: item.association_id,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        id: 0,
        country: null,
        regulator: null,
        association: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          rc_id: this.input.id,
          skills_id: this.idPrimaryCountry,
          country_id: this.input.country,
          regulator_id: this.input.regulator,
          association_id: this.input.association,
        };
        axios
          .post(`/registrable_countries/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getPrimaryCountryData();
            this.input = {
              id: 0,
              country: null,
              regulator: null,
              association: null,
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
          skills_id: this.idPrimaryCountry,
          country_id: this.input.country,
          regulator_id: this.input.regulator,
          association_id: this.input.association,
        };
        axios
          .post(`/registrable_countries`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getPrimaryCountryData();
            this.input = {
              id: 0,
              country: null,
              regulator: null,
              association: null,
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
        .delete(`/registrable_countries/${this.primaryCountryIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPrimaryCountryData();
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
    getPrimaryCountryData() {
      this.isLoading = true;
      axios
        .get(`/registrable_countries/${this.idPrimaryCountry}/countries`)
        .then((response) => {
          const data = response.data.data;
          console.log(data);
          this.items = data.map((item) => {
            return {
              id: item.rc_id || 0,
              skills_id: item.skills_id || null,
              country: item.country_name || '',
              country_id: item.country_id || null,
              registrable:
                item.registrable == 'N'
                  ? false
                  : item.registrable == 'Y'
                  ? true
                  : null,
              regulator_id: item.regulator_id || null,
              association_id: item.association_id || null,
              user_id: item.user_id || null,
              dated: item.dated || '',
              skills: item.skills_name || '',
              regulator: item.regulator || '',
              association: item.association || '',
              user: item.name || '',
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
    registrableCountry(id) {
      this.isSending = true;
      axios
        .get(`/registrable_countries/toggle-registrable/${id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPrimaryCountryData();
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
