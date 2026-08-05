<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <div class="d-flex justify-space-between ml-4 mb-6">
      <div class="d-flex">
        <router-link
          style="color: #293fb8; font-size: 13px"
          class="text-decoration-none"
          to="/manage_parking_info"
        >
          <p>Back</p>
        </router-link>
        <h4 class="ml-8 mb-6">Parking Levels</h4>
        <p class="text-blue-darken-1 ml-16">
          {{ parkingName?.name }}
        </p>
      </div>
      <p class="text-blue-darken-1">{{ parkingName?.mall }}</p>
    </div>

    <!-- <div class="d-flex">
      <h4 class="ml-4 mb-6" style="color: #293fb8; font-weight: 400">
        {{ partnerName || '' }}
      </h4>
      <h4 class="ml-8 mb-6" style="color: #991728; font-weight: 400">
        {{ bannerName || '' }}
      </h4>
    </div> -->
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="3">
            <v-autocomplete
              density="compact"
              label="Select Levels"
              placeholder="Type Levels"
              :items="resource.levels"
              item-title="name"
              item-value="id"
              v-model="input.level"
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
        </v-row>
        <!-- <v-row class="mt-n4">
          <v-col cols="12" md="3">
            <v-text-field
              v-model="input.unitNumber"
              label="Unit Number"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
          </v-col>
        </v-row> -->
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
                <th class="text-left font-weight-bold text-black">ID</th>
                <th
                  class="text-left font-weight-bold text-black"
                  style="width: 100px"
                >
                  Levels
                </th>
                <th class="text-left font-weight-bold text-black"></th>
                <th class="text-left font-weight-bold text-black">User</th>
                <th class="text-left font-weight-bold text-black">Dated</th>
                <th class="text-left font-weight-bold text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredItems" :key="item.id">
                <!-- <tr v-for="item in 1" :key="item"> -->
                <td>
                  <div class="app-column">
                    {{ item.id }}
                  </div>
                </td>

                <td>
                  <div class="app-column">
                    <v-img
                      height="40"
                      width="60"
                      class="app-img"
                      :src="
                        item.image != null
                          ? $fileURL + item.image
                          : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                      "
                      ><template #placeholder>
                        <div class="skeleton" /> </template
                    ></v-img>
                  </div>
                </td>
                <td>
                  <div class="app-column">
                    {{ item.name }}
                    <!-- Basement (B1) -->
                  </div>
                </td>
                <td>
                  <div class="app-column">
                    {{ item.user }}
                    <!-- Charlton -->
                  </div>
                </td>
                <td>
                  <div class="app-column">
                    {{ item.dated }}
                    <!-- 17/07/2024 -->
                  </div>
                </td>
                <td>
                  <div class="d-flex">
                    <v-btn
                          color="red" variant="text"
                          :disabled="isDeleteLoading"
                          @click="openDeleteConfirm(item.id)"
                          icon="mdi-trash-can-outline"
                        >  <v-tooltip location="top" activator="parent">Delete</v-tooltip>
</v-btn>
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
          Are you sure want to delete this banner level?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelDelete">No</v-btn>
          <v-btn color="success" text @click="deleteLevel">{{
            isDeleteLoading ? 'Deleting...' : 'Yes'
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent width="auto" v-model="isOpenImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4">
          Upload Image - Partner Location</v-card-title
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
  name: 'LocationsVue',
  data: () => ({
    // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    idBanner: null,
    idParking: null,
    partnerName: null,
    bannerName: null,
    valid: false,
    isLoading: false,
    isSending: false,
    isError: false,
    isEdit: false,
    isSuccess: false,
    isDelete: false,
    isDeleteLoading: false,
    locationIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    parkingName: null,
    isOpenImage: false,
    successMessage: '',
    errorMessage: '',
    imageFile: [],
    partnerLocationDataToImage: {
      id: 0,
      country: null,
      town: null,
      city: null,
      zone: null,
      location: null,
      latitude: null,
      longitude: null,
      address: null,
    },
    input: {
      id: 0,
      level: null,
    },
    rules: {
      countryRules: [
        (value) => {
          if (value) return true;
          return 'Country is required.';
        },
      ],
      townRules: [
        (value) => {
          if (value) return true;
          return 'Town is required.';
        },
      ],

      cityRules: [
        (value) => {
          if (value) return true;
          return 'City is required.';
        },
      ],
      zoneRules: [
        (value) => {
          if (value) return true;
          return 'Zone is required.';
        },
      ],
      locationRules: [
        (value) => {
          if (value) return true;
          return 'Location is required.';
        },
      ],
      latitudeRules: [
        (value) => {
          if (value) return true;
          return 'Latitude is required.';
        },
      ],
      longitudeRules: [
        (value) => {
          if (value) return true;
          return 'Longitude is required.';
        },
      ],
      addressRules: [
        (value) => {
          if (value) return true;
          return 'Address is required.';
        },
      ],
    },
    search: '',
    items: [],
    resource: {
      levels: [],
    },
    itemsTry: [
      {
        //  id: 1,
        //  image: null,
        //  location: 'Headquarters',
        //  latitude: 0.927336,
        //  longitude: 0.53383,
        //  address:
        //    '320 North Bridge Road # 09-17 Peninsular Plaza Singapore - 760887',
        //  country: 'Singapore',
        //  city: 'Singapore',
        //  town: 'Woodlands',
        //  zone: 'North',
        //  isPrimary: false,
        //  isFavorite: false,
      },
    ],
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.idParking = this.$route.params.id;
    this.getLevelsData();
    this.getLevelsItems();
    this.getParkingData();
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.items;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.items.filter((item) =>
        item.name.toLowerCase().includes(searchTextLower)
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
        .delete(
          `/partner-locations/${this.partnerLocationDataToImage.id}/location-image`
        )
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPartnerLocationsData();
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
      this.partnerLocationDataToImage = {
        id: item.id,
        country: item.country_id,
        town: item.town_id,
        city: item.city_id,
        zone: item.zone_id,
        location: item.location,
        latitude: item.latitude,
        longitude: item.longitude,
        address: item.address,
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
      this.partnerLocationDataToImage = {
        id: 0,
        country: null,
        town: null,
        city: null,
        zone: null,
        location: null,
        latitude: null,
        longitude: null,
        address: null,
      };
    },
    saveImage() {
      this.isSending = true;
      const payload = {
        pl_id: this.partnerLocationDataToImage.id,
        country_id: this.partnerLocationDataToImage.country,
        city_id: this.partnerLocationDataToImage.city,
        town_id: this.partnerLocationDataToImage.town,
        zone_id: this.partnerLocationDataToImage.zone,
        location_name: this.partnerLocationDataToImage.location,
        latitude: this.partnerLocationDataToImage.latitude,
        longitude: this.partnerLocationDataToImage.longitude,
        location_address: this.partnerLocationDataToImage.address,
        location_image: this.imageFile[0],
      };
      http
        .post(`/partner-locations/update`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPartnerLocationsData();
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
          this.partnerLocationDataToImage = {
            id: 0,
            country: null,
            town: null,
            city: null,
            zone: null,
            location: null,
            latitude: null,
            longitude: null,
            address: null,
          };
          this.isOpenImage = false;
          this.imageFile = [];
        });
    },
    saveData() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          parking_id: this.idParking,
          level_id: this.input.level,
        };
        axios
          .post(`/mall-parking-levels`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getLevelsData();
            this.input = {
              id: 0,
              level: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.mmo_id
              ? error.response.data.mmo_id[0]
              : error.response.data.message === ''
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
      this.locationIdToDelete = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.locationIdToDelete = itemId;
      this.isDelete = true;
    },
    cancelConfirmation() {
      this.locationIdToDelete = null;
      this.isDelete = false;
    },
    deleteLevel() {
      this.isDeleteLoading = true;
      axios
        .delete(`/mall-parking-levels/${this.locationIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getLevelsData();
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
          this.locationIdToDelete = null;
          this.isDelete = false;
        });
    },
    getLevelsData() {
      this.isLoading = true;
      axios
        .get(`/mall-parking-levels/${this.idParking}/levels`)
        .then((response) => {
          const data = response.data.data;
          console.log(data);
          this.items = data.map((item) => {
            return {
              ...item,
              id: item.mpl_id || 1,
              name: item.level_name || '',
              image: item.image || '',
              user: item.user.name || '',
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
    getLevelsItems() {
      axios
        .get(`/levels`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.resource.levels = data.map((item) => {
            return {
              id: item.level_id || 1,
              name: item.level_name || '',
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
    getParkingData() {
      this.isLoading = true;
      axios
        .get(`/mall-parking`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          const dataItem = data.filter((i) => i.parking_id == this.idParking);
          this.parkingName = dataItem.map((item) => {
            return {
              id: item.parking_id,
              name: item.parking_header,
              mall: item.mall_name || '',
            };
          })[0];
          console.log(this.parkingName);
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
  font-weight: 500;
}

.app-column {
  display: flex;
  align-items: center;
  min-height: 70px;
  margin-bottom: 10px;
}
.app-column-2 {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-direction: column;
  min-height: 70px;
  margin-bottom: 10px;
}

.app-column-table {
  min-height: 70px;
  margin-bottom: 10px !important;
}
.app-img {
  border: 1px solid grey !important;
  cursor: pointer !important;
}

.app-column-table th {
  text-align: left;
  font-weight: 600;
  padding-bottom: 5px !important;
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
