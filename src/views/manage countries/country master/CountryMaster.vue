<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <div class="d-flex ml-4 mb-4" style="gap: 40px">
      <router-link
        active-class="text-black"
        style="color: #3e4aaf"
        class="text-decoration-none"
        to="/country-master"
      >
        <h1>Country Master</h1>
      </router-link>
      <router-link
        active-class="text-black"
        style="color: #3e4aaf"
        class="text-decoration-none"
        to="/city-master"
      >
        <h1>City Master</h1>
      </router-link>
      <router-link
        active-class="text-black"
        style="color: #3e4aaf"
        class="text-decoration-none"
        to="/town-master"
      >
        <h1>Town Master</h1>
      </router-link>
      <router-link
        active-class="text-black"
        style="color: #3e4aaf"
        class="text-decoration-none"
        to="/zone-master"
      >
        <h1>Zone Master</h1>
      </router-link>
    </div>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="3">
            <v-combobox
              clearable
              density="compact"
              :rules="rules.countryRules"
              label="Select Country"
              placeholder="Type a Country"
              :items="resource.country"
              v-model="input.country"
              variant="outlined"
              required
            ></v-combobox>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="input.code"
              :rules="rules.codeRules"
              label="Enter Country Code"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="3">
            <v-combobox
              v-model="input.national"
              :rules="rules.nationalRules"
              label="Enter Nationality"
              variant="outlined"
              density="compact"
              required
              clearable
              placeholder="Type a Nationality"
              :items="resource.nationality"
              item-title="name"
              item-value="name"
            ></v-combobox>
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
                <th class="text-left">Image</th>
                <th class="text-left">Country Name</th>
                <th class="text-left">Code</th>
                <th class="text-left">Nationality</th>
                <th class="text-left">Active</th>
                <th class="text-left">Favorite</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="country-table-body"
                v-for="item in filteredItems"
                :key="item.id"
              >
                <td>
                  <v-img
                    height="40"
                    width="65"
                    @click="openImage(item)"
                    style="cursor: pointer"
                    :src="
                      item.image != null
                        ? $fileURL + item.image
                        : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                    "
                  ></v-img>
                </td>
                <td style="font-weight: 500 !important">
                  {{ item.country }}
                </td>
                <td style="font-weight: 500 !important">
                  {{ item.code }}
                </td>
                <td style="font-weight: 500 !important">{{ item.national }}</td>
                <td>
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
                    @click="activeCountry(item.id)"
                  >
                    <v-btn size="27" :value="true"> Yes </v-btn>

                    <v-btn size="27" :value="false"> No </v-btn>
                  </v-btn-toggle>
                </td>
                <td>
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
                    @click="favoriteCountry(item.id)"
                  >
                    <v-btn size="27" :value="true"> Yes </v-btn>

                    <v-btn size="27" :value="false"> No </v-btn>
                  </v-btn-toggle>
                </td>
                <td>
                  <div class="d-flex">
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          color="green"
                          variant="text"
                          v-bind="props"
                          @click="editCountry(item)"
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
    <v-dialog persistent width="auto" v-model="isOpenImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4">
          Upload Image - Flag</v-card-title
        >
        <v-card-text>
          <image-upload
            :image-file="imageFile"
            @update-image-file="updateImageFile"
            @delete-image-file="deleteImageFile"
          />
        </v-card-text>
        <v-card-actions class="mt-16">
          <v-spacer></v-spacer>
          <v-btn
            style="text-transform: none"
            color="error"
            text
            @click="closeImage"
            >Cancel</v-btn
          >
          <v-btn
            style="background-color: #9ddcff; text-transform: none"
            color="black"
            @click="saveImage()"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import ImageUpload from '@/components/ImageUpload.vue';
import axios from '@/util/axios';
import http from 'axios';
import { setAuthHeader } from '@/util/axios';
// import app from '@/util/eventBus';

export default {
  name: 'CountryMaster',
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
      image: null,
      country: null,
      code: null,
      national: null,
    },
    resource: {
      country: [],
      nationality: [],
      role: [
        {
          name: 'Super Admin',
          value: 'S',
        },
        {
          name: 'Admin',
          value: 'A',
        },
      ],
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
    this.getCountry();
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
    updateImageFile(newImageFile) {
      this.imageFile.push(newImageFile);
    },
    deleteImageFile() {
      this.isSending = true;
      axios
        .delete(`/countries/${this.countryDataToImage.id}/flag`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getCountryData();
          // app.config.globalProperties.$eventBus.$emit('update-image');
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
          this.isEdit = false;
          this.isSending = false;
          this.imageFile = [];
        });
    },
    openImage(item) {
      this.isOpenImage = true;
      this.countryDataToImage = {
        id: item.id,
        country: item.country,
        code: item.code,
        national: item.national,
      };
      this.imageFile =
        item.image != null
          ? [
              {
                file: {
                  name: item.image,
                  size: '',
                  base64: '',
                  format: '',
                },
              },
            ]
          : [];
    },
    closeImage() {
      this.isOpenImage = false;
      this.imageFile = [];
      this.countryDataToImage = {
        id: 0,
        country: null,
        code: null,
        national: null,
      };
    },
    saveImage() {
      const payload = {
        country_id: this.countryDataToImage.id,
        country_name: this.countryDataToImage.country,
        country_code: this.countryDataToImage.code,
        nationality: this.countryDataToImage.national,
        flag: this.imageFile[0],
      };

      if (payload.country_code == '') {
        this.isError = true;
        this.errorMessage = 'Please input the country code!';
      } else if (payload.nationality == '') {
        this.isError = true;
        this.errorMessage = 'Please input the nationality!';
      } else {
        this.isError = false;
      }

      if (this.isError == false) {
        this.isSending = true;
        http
          .post(`/countries/update`, payload, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getCountryData();
            // app.config.globalProperties.$eventBus.$emit('update-image');
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
          })
          .finally(() => {
            this.isEdit = false;
            this.isSending = false;
            this.countryDataToImage = {
              id: 0,
              country: null,
              code: null,
              national: null,
            };
            this.isOpenImage = false;
            this.imageFile = [];
          });
      }
    },
    editCountry(country) {
      this.isEdit = true;
      this.input = {
        id: country.id,
        country: country.country,
        code: country.code,
        national: country.national,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        id: 1,
        image: null,
        country: null,
        code: null,
        national: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          country_id: this.input.id,
          country_name: this.input.country,
          country_code: this.input.code,
          nationality: this.input.national,
        };
        if (this.input.image !== null) {
          payload['flag'] = this.input.image;
        }
        axios
          .post(`/countries/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getCountryData();
            this.input = {
              id: 0,
              image: null,
              country: null,
              code: null,
              national: null,
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
            this.isEdit = false;
            this.isSending = false;
          });
      }
    },
    saveData() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          country_name: this.input.country,
          country_code: this.input.code,
          nationality: this.input.national,
        };
        if (this.input.image !== null) {
          payload['flag'] = this.input.image;
        }
        axios
          .post(`/countries`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getCountryData();
            this.input = {
              id: 0,
              image: null,
              country: null,
              code: null,
              national: null,
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
        .delete(`/countries/${this.countryIdToDelete}`)
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
        .get(`/countries`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.items = data.map((item) => {
            return {
              id: item.country_id || 1,
              image: item.flag || null,
              country: item.country_name || '',
              code: item.country_code || '',
              national: item.nationality || '',
              isActive:
                item.active == 'N' ? false : item.active == 'Y' ? true : null,
              isFav:
                item.favorite == 'N'
                  ? false
                  : item.favorite == 'Y'
                  ? true
                  : null,
            };
          });
          this.resource.nationality = data
            .filter((d) => d.nationality !== '')
            .map((item) => item.nationality);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    getCountry() {
      axios
        .get(`/country`)
        .then((response) => {
          const data = response.data.data;
          this.resource.country = data.map((country) => country.country_name);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        });
    },

    activeCountry(id) {
      this.isSending = true;
      axios
        .get(`/countries/toggle-active/${id}`)
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
          this.isSending = false;
        });
    },
    favoriteCountry(id) {
      this.isSending = true;
      axios
        .get(`/countries/toggle-favorite/${id}`)
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
          this.isSending = false;
        });
    },
  },
  components: { ImageUpload },
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
