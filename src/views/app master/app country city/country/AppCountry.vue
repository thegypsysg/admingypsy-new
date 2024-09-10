<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <div class="d-flex ml-4 my-4" style="gap: 40px">
      <router-link
        active-class="text-black"
        style="color: #3e4aaf"
        class="text-decoration-none"
        to="/app-country"
      >
        <h3>App Country</h3>
      </router-link>
      <router-link
        active-class="text-black"
        style="color: #3e4aaf"
        class="text-decoration-none"
        to="/app-city"
      >
        <h3>App City</h3>
      </router-link>
    </div>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="3">
            <v-autocomplete
              clearable
              density="compact"
              label="Select Country"
              placeholder="Type a Country"
              :items="resource.country"
              item-title="name"
              item-value="id"
              v-model="input.country"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              density="compact"
              label="---Select App---"
              placeholder="Type App"
              :items="resource.app"
              item-title="name"
              item-value="id"
              v-model="input.app"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row class="mt-n2">
          <v-col cols="12" md="3">
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
        </v-row>
      </v-container>
    </v-form>
    <v-sheet class="py-6 px-4 mt-6" border rounded width="100%">
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            density="compact"
            v-model="search"
            label="Search a Country"
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
                <th class="text-left">Country Name</th>
                <th class="text-left">App Name</th>
                <th class="text-left">Active</th>
                <th class="text-left">User</th>
                <th class="text-left">Dated</th>
                <th class="text-left"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="country-table-body"
                v-for="item in filteredItems"
                :key="item.id"
              >
                <td style="font-weight: 500 !important">
                  {{ item.country }}
                </td>
                <td style="font-weight: 500 !important">
                  {{ item.app }}
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
                    @click="activeCountry(item.id)"
                    v-model="item.isActive"
                    :disabled="isSending2"
                    rounded="5"
                  >
                    <v-btn size="27" :value="true"> Yes </v-btn>

                    <v-btn size="27" :value="false"> No </v-btn>
                  </v-btn-toggle>
                </td>
                <td style="font-weight: 500 !important">
                  {{ item.user }}
                </td>
                <td style="font-weight: 500 !important">
                  {{ item.dated }}
                </td>
                <td>
                  <v-btn
                    color="red"
                    variant="text"
                    :disabled="isDeleteLoading"
                    @click="openDeleteConfirm(item.id)"
                    icon="mdi-trash-can-outline"
                  ></v-btn>
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
        <v-card-text> Are you sure want to delete this country? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelDelete">No</v-btn>
          <v-btn color="success" text @click="deleteCountry">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from '@/util/axios';
import { setAuthHeader } from '@/util/axios';
// import app from '@/util/eventBus';

export default {
  name: 'CountryMaster',
  data: () => ({
    // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    valid: false,
    isLoading: false,
    isSending: false,
    isSending2: false,
    isError: false,
    isEdit: false,
    isSuccess: false,
    isDelete: false,
    isDeleteLoading: false,
    countryIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    imageFile: [],
    countryDataToImage: {
      id: 0,
      country: null,
      code: null,
      national: null,
    },
    isOpenImage: false,
    successMessage: '',
    errorMessage: '',
    input: {
      id: 0,
      country: null,
      app: null,
    },
    resource: {
      country: [],
      app: [],
    },
    rules: {
      codeRules: [
        (value) => {
          if (value) return true;
          return 'Country code is requred.';
        },
        // (value) => {
        //   if (value?.length >= 4) return true;
        //   return 'Username must be more than 4 characters.';
        // },
        // (value) => {
        //   if (value?.length <= 20) return true;
        //   return 'Username must be less than 20 characters.';
        // },
      ],
      nationalRules: [
        (value) => {
          if (value) return true;
          return 'Nationality is requred.';
        },
      ],
      countryRules: [
        (value) => {
          if (value) return true;
          return 'Country is requred.';
        },
      ],
    },
    search: '',
    items: [],
    // itemsTry: [
    //   {
    //     id: 1,
    //     image: '@/assets/indonesia.jpeg',
    //     country: 'Indonesia',
    //     code: '+62',
    //     national: 'Indonesian',
    //     isActive: true,
    //     isFav: true,
    //   },
    // ],
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.getCountryData();
    this.getCountryList();
    this.getAppActive();
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.items;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.items.filter((item) =>
        item.country.toLowerCase().includes(searchTextLower)
      );
    },
  },
  methods: {
    saveData() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          app_id: this.input.app,
          country_id: this.input.country,
        };
        axios
          .post(`/app-countries`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getCountryData();
            this.input = {
              id: 0,
              app: null,
              country: null,
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
      this.countryIdToDelete = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.countryIdToDelete = itemId;
      this.isDelete = true;
    },
    cancelConfirmation() {
      this.countryIdToDelete = null;
      this.isDelete = false;
    },
    deleteCountry() {
      this.isDeleteLoading = true;
      axios
        .delete(`/app-countries/${this.countryIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getCountryData();
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
          this.countryIdToDelete = null;
          this.isDelete = false;
        });
    },
    getCountryData() {
      this.isLoading = true;
      axios
        .get(`/app-countries`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);

          this.items = data.map((item) => {
            return {
              id: item.ac_id || 1,
              country_id: item.country_id || 1,
              country: item.country_name || '',
              app_id: item.app_id || 1,
              app: item.app_name || '',
              isActive:
                item.active == 'N' ? false : item.active == 'Y' ? true : null,
              user: item.name || '',
              dated: item.dated || '',
            };
          });
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    getCountryList() {
      this.isLoading = true;
      axios
        .get(`/countries`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);

          this.resource.country = data
            .sort((a, b) => a.country_name.localeCompare(b.country_name))
            .map((country) => {
              return {
                id: country.country_id || 1,
                name: country.country_name || '',
              };
            });
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    getAppActive() {
      axios
        .get(`/app/active`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.resource.app = data
            .sort((a, b) => a.app_id < b.app_id)
            .map((app) => {
              return {
                id: app.app_id || 0,
                name: app.app_name || '',
              };
            });
          // console.log(this.items);
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
    activeCountry(id) {
      this.isSending2 = true;
      axios
        .get(`/app-countries/toggle-active/${id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getCountryData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        .finally(() => {
          this.isSending2 = false;
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
</style>
