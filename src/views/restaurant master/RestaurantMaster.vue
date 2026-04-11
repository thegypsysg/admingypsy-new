<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row class="d-flex align-baseline mt-n4">
          <v-col cols="12" md="4">
            <v-autocomplete
              density="compact"
              v-model="input.partner_id"
              label="Restaurant Name"
              variant="outlined"
              required
              :items="resource.partner"
              item-title="partner_name"
              item-value="partner_id"
              :rules="rules.partnerRules"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              density="compact"
              v-model="input.location_id"
              label="---Location---"
              variant="outlined"
              required
              :items="resource.location"
              item-title="name"
              item-value="id"
              :rules="rules.locationRules"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="2" class="align-center">
            <v-btn
              :prepend-icon="'mdi-account-multiple-plus'"
              color="indigo-accent-2"
              style="text-transform: none; margin-top: -30px !important"
              type="submit"
              variant="flat"
              class="w-100"
              @click="saveData()"
              :disabled="isSending"
              :loading="isSending"
            >
              <template v-slot:prepend>
                <v-icon color="white"></v-icon>
              </template>

              {{ 'Add' }}
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
                <th class="text-left">Id</th>
                <th class="text-left">Restaurant Name</th>
                <th class="text-left">Location</th>
                <th class="text-left">Halal</th>
                <th class="text-left">Veg</th>
                <th class="text-left">Non-veg</th>
                <th class="text-left">Active</th>
                <th class="text-left">Featured</th>
                <th class="text-left">User</th>
                <th class="text-left">Dated</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in filteredItems" :key="item.id">
                <tr>
                  <td style="border-bottom: none !important">
                    {{ item.restaurant_id }}
                  </td>
                  <td
                    style="
                      font-weight: 500 !important;
                      border-bottom: none !important;
                    "
                  >
                    {{ item.restaurantName }}
                  </td>
                  <td
                    style="
                      font-weight: 500 !important;
                      border-bottom: none !important;
                    "
                  >
                    {{ item.locationName }}
                  </td>
                  <td
                    style="
                      font-weight: 500 !important;
                      border-bottom: none !important;
                    "
                  >
                    <v-btn-toggle
                      mandatory
                      style="
                        font-size: 10px !important;
                        font-weight: 200 !important;
                        height: 22px !important;
                        width: 54px !important;
                      "
                      v-model="item.isActive"
                      class="d-flex align-center"
                      :disabled="isSending2"
                      rounded="5"
                    >
                      <!-- @click="activeRestaurant(item.restaurant_id)" -->
                      <v-btn size="27" :value="true"> Yes </v-btn>

                      <v-btn size="27" :value="false"> No </v-btn>
                    </v-btn-toggle>
                  </td>
                  <td
                    style="
                      font-weight: 500 !important;
                      border-bottom: none !important;
                    "
                  >
                    <v-btn-toggle
                      mandatory
                      style="
                        font-size: 10px !important;
                        font-weight: 200 !important;
                        height: 22px !important;
                        width: 54px !important;
                      "
                      v-model="item.isActive"
                      class="d-flex align-center"
                      :disabled="isSending2"
                      rounded="5"
                    >
                      <!-- @click="activeRestaurant(item.restaurant_id)" -->
                      <v-btn size="27" :value="true"> Yes </v-btn>

                      <v-btn size="27" :value="false"> No </v-btn>
                    </v-btn-toggle>
                  </td>
                  <td
                    style="
                      font-weight: 500 !important;
                      border-bottom: none !important;
                    "
                  >
                    <v-btn-toggle
                      mandatory
                      style="
                        font-size: 10px !important;
                        font-weight: 200 !important;
                        height: 22px !important;
                        width: 54px !important;
                      "
                      v-model="item.isActive"
                      class="d-flex align-center"
                      :disabled="isSending2"
                      rounded="5"
                    >
                      <!-- @click="activeRestaurant(item.restaurant_id)" -->
                      <v-btn size="27" :value="true"> Yes </v-btn>

                      <v-btn size="27" :value="false"> No </v-btn>
                    </v-btn-toggle>
                  </td>
                  <td
                    style="
                      font-weight: 500 !important;
                      border-bottom: none !important;
                    "
                  >
                    <v-btn-toggle
                      mandatory
                      style="
                        font-size: 10px !important;
                        font-weight: 200 !important;
                        height: 22px !important;
                        width: 54px !important;
                      "
                      v-model="item.isActive"
                      @click="activeRestaurant(item.restaurant_id)"
                      class="d-flex align-center"
                      :disabled="isSending2"
                      rounded="5"
                    >
                      <v-btn size="27" :value="true"> Yes </v-btn>

                      <v-btn size="27" :value="false"> No </v-btn>
                    </v-btn-toggle>
                  </td>
                  <td
                    style="
                      font-weight: 500 !important;
                      border-bottom: none !important;
                    "
                  >
                    <v-btn-toggle
                      mandatory
                      style="
                        font-size: 10px !important;
                        font-weight: 200 !important;
                        height: 22px !important;
                        width: 54px !important;
                      "
                      v-model="item.isActive"
                      class="d-flex align-center"
                      :disabled="isSending2"
                      rounded="5"
                    >
                      <!-- @click="activeRestaurant(item.restaurant_id)" -->
                      <v-btn size="27" :value="true"> Yes </v-btn>

                      <v-btn size="27" :value="false"> No </v-btn>
                    </v-btn-toggle>
                  </td>
                  <td
                    style="
                      font-weight: 500 !important;
                      border-bottom: none !important;
                    "
                  >
                    {{ item.user.name }}
                  </td>
                  <td
                    style="
                      font-weight: 500 !important;
                      border-bottom: none !important;
                    "
                  >
                    {{ item.dated }}
                  </td>
                  <td style="border-bottom: none !important">
                    <div class="d-flex">
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            color="red"
                            v-bind="props"
                            variant="text"
                            :disabled="isDeleteLoading"
                            @click="openDeleteConfirm(item.restaurant_id)"
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
          Are you sure want to delete this restaurant?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelDelete">No</v-btn>
          <v-btn color="success" text @click="deleteRestaurant">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent width="auto" v-model="isOpenMainImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4">
          Upload Main Image - Main Categories</v-card-title
        >
        <v-card-text>
          <image-upload
            :image-file="mainImageFile"
            @update-image-file="updateMainImageFile"
            @delete-image-file="deleteMainImageFile"
          />
        </v-card-text>
        <v-card-actions class="mt-16">
          <v-spacer></v-spacer>
          <v-btn
            style="text-transform: none"
            color="error"
            text
            @click="closeMainImage"
            >Cancel</v-btn
          >
          <v-btn
            style="background-color: #9ddcff; text-transform: none"
            color="black"
            @click="saveMainImage()"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent width="auto" v-model="isOpenLongImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4">
          Upload Long Image - Main Categories</v-card-title
        >
        <v-card-text>
          <image-upload
            :image-file="longImageFile"
            @update-image-file="updateLongImageFile"
            @delete-image-file="deleteLongImageFile"
          />
        </v-card-text>
        <v-card-actions class="mt-16">
          <v-spacer></v-spacer>
          <v-btn
            style="text-transform: none"
            color="error"
            text
            @click="closeLogo"
            >Cancel</v-btn
          >
          <v-btn
            style="background-color: #9ddcff; text-transform: none"
            color="black"
            @click="saveLongImage"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent width="auto" v-model="isOpenIconImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4">
          Upload Icon Image - Main Categories</v-card-title
        >
        <v-card-text>
          <image-upload
            :image-file="iconImageFile"
            @update-image-file="updateIconImageFile"
            @delete-image-file="deleteIconImageFile"
          />
        </v-card-text>
        <v-card-actions class="mt-16">
          <v-spacer></v-spacer>
          <v-btn
            style="text-transform: none"
            color="error"
            text
            @click="closeIconImage"
            >Cancel</v-btn
          >
          <v-btn
            style="background-color: #9ddcff; text-transform: none"
            color="black"
            @click="saveIconImage"
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
import { setAuthHeader } from '@/util/axios';
// import app from '@/util/eventBus';

export default {
  name: 'RestaurantMaster2',
  data: () => ({
    //fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    valid: false,
    isLoading: false,
    isSending: false,
    isSuccess: false,
    isError: false,
    isDelete: false,
    isDeleteLoading: false,
    restaurantIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    successMessage: '',
    errorMessage: '',
    input: {
      partner_id: null,
      location_id: null,
    },
    resource: {
      app: [],
      partner: [],
      location: [],
      city: [],
      town: [],
    },
    rules: {
      partnerRules: [
        (value) => {
          if (value) return true;
          return 'Restaurant name is required.';
        },
      ],
      locationRules: [
        (value) => {
          if (value) return true;
          return 'Location is required.';
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
    this.getRestaurantData();
    this.getPartnerData();
  },
  watch: {
    'input.partner_id': function () {
      this.input.location_id = null;
      this.getLocationData();
    },
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.items;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.items.filter(
        (item) =>
          item.restaurantName.toLowerCase().includes(searchTextLower) ||
          item.locationName.toLowerCase().includes(searchTextLower),
      );
    },
  },
  methods: {
    saveData() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          partner_id: this.input.partner_id,
          pl_id: this.input.location_id,
        };
        axios
          .post(`/biryani-restaurant-masters`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getRestaurantData();
            this.input = {
              partner_id: null,
              location_id: null,
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
      this.restaurantIdToDelete = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.restaurantIdToDelete = itemId;
      this.isDelete = true;
    },
    deleteRestaurant() {
      this.isDeleteLoading = true;
      axios
        .delete(`/biryani-restaurant-masters/${this.restaurantIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getRestaurantData();
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
          this.restaurantIdToDelete = null;
          this.isDelete = false;
        });
    },
    getPartnerData() {
      axios
        .get(`/partners`)
        .then((response) => {
          const data = response.data.data;
          this.resource.partner = data;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        });
    },
    getLocationData() {
      this.isLoading = true;
      axios
        .get(`/partner-locations/${this.input.partner_id}`)
        .then((response) => {
          const data = response.data.data;
          this.resource.location = data
            .sort((a, b) => a.city.city_name.localeCompare(b.city.city_name))
            .map((item) => {
              return {
                id: item.pl_id || 1,
                name:
                  item?.town?.town_name && item?.city?.city_name
                    ? `${item?.town?.town_name} (${item?.city?.city_name})`
                    : !item?.town?.town_name && item?.city?.city_name
                    ? item?.city?.city_name
                    : item?.town?.town_name && !item?.city?.city_name
                    ? item?.town?.town_name
                    : '-',
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
    getRestaurantData() {
      this.isLoading = true;
      axios
        .get(`/biryani-restaurant-masters`)
        .then((response) => {
          this.items = response.data.data.map((item) => ({
            ...item,
            isActive: item.active !== 'Y' ? false : true,
            restaurantName: item.partner?.partner_name || '-',
            locationName:
              item?.town?.town_name && item?.city?.city_name
                ? `${item?.town?.town_name} (${item?.city?.city_name})`
                : !item?.town?.town_name && item?.city?.city_name
                ? item?.city?.city_name
                : item?.town?.town_name && !item?.city?.city_name
                ? item?.town?.town_name
                : '-',
          }));
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
    activeRestaurant(restaurant_id) {
      this.isSending2 = true;
      axios
        .get(`/biryani-restaurant-masters/toggle-active/${restaurant_id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getRestaurantData();
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
          this.isSending2 = false;
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

.skeleton {
  width: 100%;
  height: 100%;
  border-radius: 0;

  background: linear-gradient(-90deg, #f2f2f2 0%, #e1e1e1 50%, #f2f2f2 100%);
  background-size: 400% 400%;
  animation: skeleton 1.6s ease infinite;
  margin: 0 auto;
}

@keyframes skeleton {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}
</style>
