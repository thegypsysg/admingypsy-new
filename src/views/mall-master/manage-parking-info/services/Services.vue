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
        <h4 class="ml-8 mb-6 text-red-accent-4">Parking Services</h4>
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
              label="Select Services"
              placeholder="Type Services"
              :items="resource.services"
              item-title="name"
              item-value="id"
              v-model="input.service"
              variant="outlined"
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" md="2">
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
                <th class="text-left font-weight-bold text-black">Services Name</th>
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
                    {{ item.name }}
                  </div>
                </td>
                <td>
                  <div class="app-column">
                    {{ item.user }}
                  </div>
                </td>
                <td>
                  <div class="app-column">
                    {{ item.dated }}
                  </div>
                </td>
                <td>
                  <div class="d-flex">
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
          <skeleton-table v-if="isLoading" :rows="5" :columns="5" />
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
      @confirm="deleteService"
    />
    <v-dialog persistent width="auto" v-model="isOpenImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4"> Upload Image - Partner Location</v-card-title>
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
  name: 'LocationsVue',
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
    idBanner: null,
    idParking: null,
    partnerName: null,
    bannerName: null,
    valid: false,
    isLoading: false,
    isSending: false,
    isEdit: false,
    isDelete: false,
    isDeleteLoading: false,
    locationIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    parkingName: null,
    isOpenImage: false,
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
      service: null,
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
      services: [],
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
    this.getServicesData();
    this.getServicesItems();
    this.getParkingData();
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.items;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.items.filter((item) => item.name.toLowerCase().includes(searchTextLower));
    },
  },

  methods: {
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
            error.response.data.message === '' ? 'Something Wrong!!!' : error.response.data.message;
          this.notification.error(message);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    saveData() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          parking_id: this.idParking,
          service_id: this.input.service,
        };
        axios
          .post(`/mall-parking-services`, payload)
          .then((response) => {
            const data = response.data;
            this.notification.success(data.message);
            this.getServicesData();
            this.input = {
              id: 0,
              service: null,
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
            this.notification.error(message);
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
    deleteService() {
      this.isDeleteLoading = true;
      axios
        .delete(`/mall-parking-services/${this.locationIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getServicesData();
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
          this.locationIdToDelete = null;
          this.isDelete = false;
        });
    },
    getServicesData() {
      this.isLoading = true;
      axios
        .get(`/mall-parking-services/${this.idParking}/services`)
        .then((response) => {
          const data = response.data.data;
          console.log(data);
          this.items = data.map((item) => {
            return {
              ...item,
              id: item.mps_id || 1,
              name: item.service_name || '',
              user: item?.user?.name || '',
              user_id: item?.user_id || '',
              dated: item?.dated || '',
            };
          });
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
    getServicesItems() {
      axios
        .get(`/services`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.resource.services = data.map((item) => {
            return {
              id: item.service_id || 1,
              name: item.service_name || '',
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
