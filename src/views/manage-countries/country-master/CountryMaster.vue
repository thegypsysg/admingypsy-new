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
              label="Enter Country Code"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="3">
            <v-combobox
              v-model="input.national"
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
              <tr class="country-table-body" v-for="item in filteredItems" :key="item.id">
                <td>
                  <div class="image-upload-cont">
                    <v-img
                      class="image-upload-item"
                      height="40"
                      @click="openImage(item)"
                      style="cursor: pointer"
                      :src="
                        item.image != null
                          ? $fileURL + item.image
                          : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                      "
                      ><template #placeholder> <div class="skeleton" /> </template
                    ></v-img>
                  </div>
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
                    :disabled="isSending2"
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
                    :disabled="isSending2"
                    rounded="5"
                    @click="favoriteCountry(item.id)"
                  >
                    <v-btn size="27" :value="true"> Yes </v-btn>

                    <v-btn size="27" :value="false"> No </v-btn>
                  </v-btn-toggle>
                </td>
                <td>
                  <div class="d-flex">
                    <v-btn color="green" variant="text" @click="editCountry(item)" icon>
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
          <skeleton-table v-if="isLoading" :rows="5" :columns="7" />
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
      @confirm="deleteCountry"
    />
    <v-dialog persistent width="auto" v-model="isOpenImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4"> Upload Image - Flag</v-card-title>
        <v-card-text>
          <image-upload
            :image-file="imageFile"
            @update-image-file="updateImageFile"
            @delete-image-file="deleteImageFile"
          />
        </v-card-text>
        <v-card-actions class="mt-16">
          <v-spacer></v-spacer>
          <v-btn style="text-transform: none" color="error" text @click="closeImage">Cancel</v-btn>
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
import SkeletonTable from '@/components/SkeletonTable.vue';
import EmptyState from '@/components/EmptyState.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import { useNotificationStore } from '@/stores/notification';
import ImageUpload from '@/components/ImageUpload.vue';
import axios from '@/util/axios';
import { setAuthHeader } from '@/util/axios';
// import app from '@/util/eventBus';

export default {
  name: 'CountryMaster',
  components: {
    ConfirmDialog,
    EmptyState,
    SkeletonTable,
    ImageUpload,
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
    isSending2: false,
    isEdit: false,
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
      return this.items.filter(
        (item) =>
          item.country.toLowerCase().includes(searchTextLower) ||
          item.code.toLowerCase().includes(searchTextLower) ||
          item.national.toLowerCase().includes(searchTextLower)
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
          this.notification.success(data.message);
          this.getCountryData();
          // app.config.globalProperties.$eventBus.$emit('update-image');
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === '' ? 'Something Wrong!!!' : error.response.data.message;
          this.notification.error(message);
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
        this.notification.error('Please input the country code!');
      } else if (payload.nationality == '') {
        this.notification.error('Please input the nationality!');
      }

      if (this.isError == false) {
        this.isSending = true;
        axios
          .post(`/countries/update`, payload, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((response) => {
            const data = response.data;
            this.notification.success(data.message);
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
            this.notification.success(data.message);
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
            this.notification.success(data.message);
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
            this.notification.error(message);
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
          this.notification.success(data.message);
          this.getCountryData();
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
              isActive: item.active == 'N' ? false : item.active == 'Y' ? true : null,
              isFav: item.favorite == 'N' ? false : item.favorite == 'Y' ? true : null,
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
      this.isSending2 = true;
      axios
        .get(`/countries/toggle-active/${id}`)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getCountryData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === '' ? 'Something Wrong!!!' : error.response.data.message;
          this.notification.error(message);
        })
        .finally(() => {
          this.isSending2 = false;
        });
    },
    favoriteCountry(id) {
      this.isSending2 = true;
      axios
        .get(`/countries/toggle-favorite/${id}`)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getCountryData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === '' ? 'Something Wrong!!!' : error.response.data.message;
          this.notification.error(message);
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
