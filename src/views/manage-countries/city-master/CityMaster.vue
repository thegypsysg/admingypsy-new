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
              label="Select City"
              placeholder="Type a City"
              :items="resource.city"
              v-model="input.city"
              variant="outlined"
            ></v-combobox>
          </v-col>
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
            label="Search a City"
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
                <th class="text-left">Long Image</th>
                <th class="text-left">City Name</th>
                <th class="text-left">Country</th>
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
                      loading="lazy"
                      lazy-src="data:image/svg+xml,%3Csvg xmlns%3D%22http%3A//www.w3.org/2000/svg%22 width%3D%221%22 height%3D%221%22%3E%3C/svg%3E"
                      ><template #placeholder> <div class="skeleton" /> </template
                    ></v-img>
                  </div>
                </td>
                <td>
                  <div class="image-upload-cont">
                    <v-img
                      class="image-upload-item"
                      height="40"
                      @click="openWebLongImage(item)"
                      style="cursor: pointer"
                      :src="
                        item.web_long_image != null
                          ? $fileURL + item.web_long_image
                          : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                      "
                      loading="lazy"
                      lazy-src="data:image/svg+xml,%3Csvg xmlns%3D%22http%3A//www.w3.org/2000/svg%22 width%3D%221%22 height%3D%221%22%3E%3C/svg%3E"
                      ><template #placeholder> <div class="skeleton" /> </template
                    ></v-img>
                  </div>
                </td>
                <td style="font-weight: 500 !important">
                  {{ item.city }}
                </td>
                <td style="font-weight: 500 !important">
                  {{ item.country }}
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
                    v-model="item.isActive"
                    :disabled="isSending2"
                    rounded="5"
                    @click="activeCity(item.id)"
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
                    @click="favoriteCity(item.id)"
                  >
                    <v-btn size="27" :value="true"> Yes </v-btn>

                    <v-btn size="27" :value="false"> No </v-btn>
                  </v-btn-toggle>
                </td>
                <td>
                  <div class="d-flex">
                    <v-btn color="green" variant="text" @click="editCity(item)" icon>
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
      @confirm="deleteCity"
    />
    <v-dialog persistent width="auto" v-model="isOpenImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4"> Upload Image - City</v-card-title>
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
    <v-dialog persistent width="auto" v-model="isOpenWebLongImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4"> Upload Long Image - City</v-card-title>
        <v-card-text>
          <image-upload
            :image-file="webLongImageFile"
            @update-image-file="updateWebLongImageFile"
            @delete-image-file="deleteWebLongImageFile"
          />
        </v-card-text>
        <v-card-actions class="mt-16">
          <v-spacer></v-spacer>
          <v-btn style="text-transform: none" color="error" text @click="closeWebLongImage"
            >Cancel</v-btn
          >
          <v-btn
            style="background-color: #9ddcff; text-transform: none"
            color="black"
            @click="saveWebLongImage()"
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
  name: 'CityMaster',
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
    cityIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    imageFile: [],
    webLongImageFile: [],
    cityDataToImage: {
      id: 0,
      city: null,
      country: null,
    },
    cityDataToWebLongImage: {
      id: 0,
      city: null,
      country: null,
    },
    isOpenImage: false,
    isOpenWebLongImage: false,
    input: {
      id: 0,
      city: null,
      country: null,
    },
    resource: {
      country: [],
      city: [],
    },
    rules: {
      countryRules: [
        (value) => {
          if (value) return true;
          return 'Country is requred.';
        },
      ],
      cityRules: [
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
    //     city: 'Jakarta',
    //     country: 'Indonesia',
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
    this.getCityData();
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
          item.city.toLowerCase().includes(searchTextLower) ||
          item.country.toLowerCase().includes(searchTextLower)
      );
    },
  },
  methods: {
    updateImageFile(newImageFile) {
      this.imageFile.push(newImageFile);
    },
    updateWebLongImageFile(newWebLongImageFile) {
      this.webLongImageFile.push(newWebLongImageFile);
    },
    deleteImageFile() {
      this.isSending = true;
      axios
        .delete(`/cities/${this.cityDataToImage.id}/image`)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getCityData();
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
          this.isSending = false;
          this.imageFile = [];
        });
    },
    deleteWebLongImageFile() {
      this.isSending = true;
      axios
        .delete(`/cities/${this.cityDataToWebLongImage.id}/web_long_image`)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getCityData();
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
          this.webLongImageFile = [];
        });
    },
    openWebLongImage(item) {
      this.isOpenWebLongImage = true;
      this.cityDataToWebLongImage = {
        id: item.id,
      };
      this.webLongImageFile =
        item.web_long_image != null
          ? [
              {
                file: {
                  name: item.web_long_image,
                  size: '',
                  base64: '',
                  format: '',
                },
              },
            ]
          : [];
    },
    closeWebLongImage() {
      this.isOpenWebLongImage = false;
      this.webLongImageFile = [];
      this.cityDataToWebLongImage = {
        id: 0,
        city: null,
        country: null,
      };
    },
    openImage(item) {
      this.isOpenImage = true;
      this.cityDataToImage = {
        id: item.id,
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
      this.cityDataToImage = {
        id: 0,
        city: null,
        country: null,
      };
    },
    saveImage() {
      const payload = {
        city_id: this.cityDataToImage.id,
        city_image: this.imageFile[0],
      };

      if (this.isError == false) {
        this.isSending = true;
        axios
          .post(`/cities/update`, payload, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((response) => {
            const data = response.data;
            this.notification.success(data.message);
            this.getCityData();
            // app.config.globalProperties.$eventBus.$emit('update-image');
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
          })
          .finally(() => {
            this.isEdit = false;
            this.isSending = false;
            this.cityDataToImage = {
              id: 0,
              city: null,
              country: null,
            };
            this.isOpenImage = false;
            this.imageFile = [];
          });
      }
    },
    saveWebLongImage() {
      const payload = {
        city_id: this.cityDataToWebLongImage.id,
        web_long_image: this.webLongImageFile[0],
      };

      if (this.isError == false) {
        this.isSending = true;
        axios
          .post(`/cities/update`, payload, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((response) => {
            const data = response.data;
            this.notification.success(data.message);
            this.getCityData();
            // app.config.globalProperties.$eventBus.$emit('update-image');
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
          })
          .finally(() => {
            this.isEdit = false;
            this.isSending = false;
            this.cityDataToWebLongImage = {
              id: 0,
              city: null,
              country: null,
            };
            this.isOpenWebLongImage = false;
            this.webLongImageFile = [];
          });
      }
    },
    editCity(city) {
      this.isEdit = true;
      this.input = {
        id: city.id,
        city: city.city,
        country: city.country_id,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        id: 0,
        city: null,
        country: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          city_id: this.input.id,
          city_name: this.input.city,
          country_id: this.input.country,
        };
        axios
          .post(`/cities/update`, payload)
          .then((response) => {
            const data = response.data;
            this.notification.success(data.message);
            this.getCityData();
            this.input = {
              id: 0,
              city: null,
              country: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.city_name
              ? error.response.data.city_name[0]
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
          city_name: this.input.city,
          country_id: this.input.country,
        };
        axios
          .post(`/cities`, payload)
          .then((response) => {
            const data = response.data;
            this.notification.success(data.message);
            this.getCityData();
            this.input = {
              id: 0,
              city: null,
              country: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.city_name
              ? error.response.data.city_name[0]
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
      this.cityIdToDelete = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.cityIdToDelete = itemId;
      this.isDelete = true;
    },
    cancelConfirmation() {
      this.cityIdToDelete = null;
      this.isDelete = false;
    },
    deleteCity() {
      this.isDeleteLoading = true;
      axios
        .delete(`/cities/${this.cityIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getCityData();
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
          this.cityIdToDelete = null;
          this.isDelete = false;
        });
    },
    getCityData() {
      this.isLoading = true;
      axios
        .get(`/cities`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.items = data.map((item) => {
            return {
              id: item.city_id || 1,
              city: item.city_name || '',
              country: item.country.country_name || '',
              image: item.city_image || null,
              web_long_image: item.web_long_image || null,
              country_id: item.country_id || 1,
              isActive: item.active == 'N' ? false : item.active == 'Y' ? true : null,
              isFav: item.favorite == 'N' ? false : item.favorite == 'Y' ? true : null,
            };
          });
          this.resource.city = data
            .filter((d) => d.city_name !== '')
            .sort((a, b) => a.city_name.localeCompare(b.city_name))

            .map((item) => item.city_name);
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
    getCountry() {
      axios
        .get(`/country`)
        .then((response) => {
          const data = response.data.data;
          this.resource.country = data
            .sort((a, b) => a.country_name.localeCompare(b.country_name))
            .map((country) => {
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
            error.response.data.message === '' ? 'Something Wrong!!!' : error.response.data.message;
          this.notification.error(message);
        });
    },
    activeCity(id) {
      this.isSending2 = true;
      axios
        .get(`/cities/toggle-active/${id}`)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getCityData();
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
    favoriteCity(id) {
      this.isSending2 = true;
      axios
        .get(`/cities/toggle-favorite/${id}`)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getCityData();
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
</style>
