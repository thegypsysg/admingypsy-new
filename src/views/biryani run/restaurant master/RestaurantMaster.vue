<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    
    <div class="d-flex ml-4 mb-4" style="gap: 30px">
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/biryani-home/main-categories"
        >
          <h4>Main Category</h4>
        </router-link>
      </div>
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/biryani-home/restaurant-master"
        >
          <h4>Restaurant Master</h4>
        </router-link>
      </div>
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/biryani-home/dish-master"
        >
          <h4>Dish Master</h4>
        </router-link>
      </div>
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/biryani-home/restaurant-dish"
        >
          <h4>Biryani Promotion</h4>
        </router-link>
      </div>
    </div>
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
              v-model="input.country_id"
              label="Country"
              variant="outlined"
              required
              :items="resource.country"
              item-title="name"
              item-value="id"
              :rules="rules.countryRules"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="2" class="align-center">
            <v-btn
              :prepend-icon="
                isEdit
                  ? 'mdi-account-multiple-check'
                  : 'mdi-account-multiple-plus'
              "
              color="indigo-accent-2"
              style="text-transform: none;margin-top: -30px !important;"
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
          <v-col cols="12" md="1">
            <v-btn
              v-if="isEdit"
              prepend-icon="mdi-account-multiple-remove"
              color="red"
              style="text-transform: none;margin-top: -30px !important;"
              variant="flat"
              class="w-100 mt-8"
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
                <th class="text-left">Country</th>
                <th class="text-left">Active</th>
                <th class="text-left">Featured</th>
                <th class="text-left">User</th>
                <th class="text-left">Dated</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(item, index) in filteredItems" :key="item.id">
                <tr>
                  <td style="border-bottom: none !important;">{{ item.restaurant_id }}</td>
                  <td style="font-weight: 500 !important;border-bottom: none !important;">
                    {{ item.partner?.partner_name }}
                  </td>
                  <td style="font-weight: 500 !important;border-bottom: none !important;">
                    {{ item.country?.country_name }}
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
                      @click="activeRestaurant(item.restaurant_id)"
                      v-model="item.isActive"
                      :disabled="isSending2"
                      rounded="5"
                    >
                      <v-btn size="27" :value="true"> Yes </v-btn>

                      <v-btn size="27" :value="false"> No </v-btn>
                    </v-btn-toggle>
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
                      @click="featuredRestaurant(item.restaurant_id)"
                      v-model="item.isFeatured"
                      :disabled="isSending2"
                      rounded="5"
                    >
                      <v-btn size="27" :value="true"> Yes </v-btn>

                      <v-btn size="27" :value="false"> No </v-btn>
                    </v-btn-toggle>
                  </td>
                  <td style="font-weight: 500 !important;border-bottom: none !important;">
                    {{ item.user.name }}
                  </td>
                  <td style="font-weight: 500 !important;border-bottom: none !important;">
                    {{ item.dated }}
                  </td>
                  <td style="border-bottom: none !important;">
                    <div class="d-flex">
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            color="green"
                            variant="text"
                            v-bind="props"
                            @click="editRestaurant(item)"
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
                            @click="openDeleteConfirm(item.restaurant_id)"
                            icon="mdi-trash-can-outline"
                          ></v-btn>
                        </template>
                        <span>Delete</span>
                      </v-tooltip>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    <v-select
                      density="compact"
                      v-model="item.city_id"
                      label="City"
                      variant="outlined"
                      :items="filterCity(item.country_id)"
                      item-title="city_name"
                      item-value="city_id"
                      @update:modelValue="saveCity(item.city_id, index)"
                    ></v-select>
                  </td>
                  <td colspan="2">
                    <v-select
                      density="compact"
                      v-model="item.town_id"
                      label="Town"
                      variant="outlined"
                      :items="filterTown(item.city_id)"
                      item-title="town_name"
                      item-value="town_id"
                      @update:modelValue="saveTown(item.town_id, index)"
                    ></v-select>
                  </td>
                  <td colspan="2">
                    <v-text-field
                      density="compact"
                      v-model="item.latitude"
                      label="Latitude"
                      variant="outlined"
                      @change="saveLatitude(item.latitude, index)"
                    ></v-text-field>
                  </td>
                  <td colspan="2">
                    <v-text-field
                      density="compact"
                      v-model="item.longitude"
                      label="Longitude"
                      variant="outlined"
                      @change="saveLongitude(item.longitude, index)"
                    ></v-text-field>
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
          Are you sure want to delete this property type?
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
  name: 'PropertyTypes',
  data: () => ({
    //fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    valid: false,
    isLoading: false,
    isSending: false,
    isEdit: false,
    isSuccess: false,
    isError: false,
    isDelete: false,
    isDeleteLoading: false,
    propertyIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    successMessage: '',
    errorMessage: '',
    input: {
      restaurant_id: 0,
      partner_id: null,
      country_id: null,
    },
    resource: {
      app: [],
      partner: [],
      country: [],
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
    this.getRestaurantData();
    this.getPartnerData();
    this.getCountry();
    this.getCity();
    this.getTown();
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.items;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.items.filter(
        (item) =>
          item.category_name.toLowerCase().includes(searchTextLower) ||
          item.description.toLowerCase().includes(searchTextLower)
      );
    },
  },
  methods: {
    saveErrorResponse(response) {
      let errorMessage = '';

      for (const key in response.data) {
        errorMessage += `${key}: ${response.data[key][0]}\n`;
      }

      return errorMessage;
    },
    editRestaurant(prop) {
      this.isEdit = true;
      this.input = {
        restaurant_id: prop.restaurant_id,
        partner_id: prop.partner_id,
        country_id: prop.country_id,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        restaurant_id: 0,
        partner_id: null,
        country_id: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          restaurant_id: this.input.restaurant_id,
          partner_id: this.input.partner_id,
          country_id: this.input.country_id,
        };
        axios
          .post(`/biryani-restaurant-masters/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getRestaurantData();
            this.input = {
              restaurant_id: 0,
              partner_id: null,
              country_id: null,
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
          partner_id: this.input.partner_id,
          country_id: this.input.country_id,
        };
        axios
          .post(`/biryani-restaurant-masters`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getRestaurantData();
            this.input = {
              restaurant_id: 0,
              partner_id: null,
              country_id: null,
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
      this.propertyIdToDelete = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.propertyIdToDelete = itemId;
      this.isDelete = true;
    },
    cancelConfirmation() {
      this.propertyIdToDelete = null;
      this.isDelete = false;
    },
    deleteRestaurant() {
      this.isDeleteLoading = true;
      axios
        .delete(`/biryani-restaurant-masters/${this.propertyIdToDelete}`)
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
          this.propertyIdToDelete = null;
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
    getRestaurantData() {
      this.isLoading = true;
      axios
        .get(`/biryani-restaurant-masters`)
        .then((response) => {
          this.items = response.data.data.map(item => ({
            ...item,
            isActive: item.active !== 'Y' ? false : true,
            isFeatured: item.featured !== 'Y' ? false : true,
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
            error.response.data.message === ''
              ? 'Something Wrong!!!'
              : error.response.data.message;
          this.errorMessage = message;
          this.isError = true;
        });
    },
    getCity() {
      axios
        .get(`/cities`)
        .then((response) => {
          const data = response.data.data;
          this.resource.city = data;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        });
    },
    getTown() {
      axios
        .get(`/towns`)
        .then((response) => {
          const data = response.data.data;
          this.resource.town = data;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        });
    },
    filterCity(country_id) {
      return this.resource.city.filter(
        (item) => item.country_id === country_id
      );
    },
    filterTown(city_id) {
      return this.resource.town.filter(
        (item) => item.city_id === city_id
      );
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
    featuredRestaurant(restaurant_id) {
      this.isSending2 = true;
      axios
        .get(`/biryani-restaurant-masters/toggle-featured/${restaurant_id}`)
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
    saveCity(city_id, index) {
      this.items[index].town_id = null;
      let payload = {
        restaurant_id: this.items[index].restaurant_id,
        city_id: city_id,
        town_id: null,
      };
      axios
        .post(`/biryani-restaurant-masters/update`, payload)
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
        });
    },
    saveTown(town_id, index) {
      let payload = {
        restaurant_id: this.items[index].restaurant_id,
        town_id: town_id,
      };
      axios
        .post(`/biryani-restaurant-masters/update`, payload)
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
        });
    },
    saveLatitude(latitude, index) {
      let payload = {
        restaurant_id: this.items[index].restaurant_id,
        latitude: latitude,
      };
      axios
        .post(`/biryani-restaurant-masters/update`, payload)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getRestaurantData();
        })
    },
    saveLongitude(longitude, index) {
      let payload = {
        restaurant_id: this.items[index].restaurant_id,
        longitude: longitude,
      };
      axios
        .post(`/biryani-restaurant-masters/update`, payload)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getRestaurantData();
        })
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
