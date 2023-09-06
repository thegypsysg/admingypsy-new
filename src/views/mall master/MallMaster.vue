<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <div class="d-flex ml-4 mb-4" style="gap: 40px">
      <router-link
        active-class="text-blue-accent-4"
        style="color: black"
        class="text-decoration-none"
        to="/mall_master"
      >
        <h3>On-Board Mall</h3>
      </router-link>
      <router-link
        active-class="text-blue-accent-4"
        style="color: black"
        class="text-decoration-none"
        to="/merchants_master"
      >
        <h3>On-Board Merchants</h3>
      </router-link>
      <router-link
        active-class="text-blue-accent-4"
        style="color: black"
        class="text-decoration-none"
        to="/"
      >
        <h3>On-Board Outlets</h3>
      </router-link>
      <router-link
        active-class="text-blue-accent-4"
        style="color: black"
        class="text-decoration-none"
        to="/"
      >
        <h3>On-Board Promotions</h3>
      </router-link>
    </div>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-autocomplete
              class="mt-8"
              density="compact"
              label="Type Mall Name"
              placeholder="Type Mall Name"
              :items="resource.mall"
              item-title="name"
              item-value="id"
              v-model="input.mall"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="2">
            <label>Country</label>
            <v-autocomplete
              class="mt-2"
              density="compact"
              label="Type Country"
              placeholder="Type Country"
              :items="resource.country"
              item-title="name"
              item-value="id"
              v-model="input.country"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="2">
            <label>City</label>
            <v-combobox
              v-if="!isEdit"
              class="mt-2"
              density="compact"
              label="Type City"
              placeholder="Type City"
              :items="resource.city"
              item-title="name"
              item-value="id"
              v-model="input.city"
              variant="outlined"
            ></v-combobox>
            <v-autocomplete
              v-if="isEdit"
              class="mt-2"
              density="compact"
              label="Type City"
              placeholder="Type City"
              :items="resource.city"
              item-title="name"
              item-value="id"
              v-model="input.city"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="2">
            <label>Town</label>
            <v-combobox
              v-if="!isEdit"
              class="mt-2"
              density="compact"
              label="Type Town"
              placeholder="Type Town"
              :items="resource.town"
              item-title="name"
              item-value="id"
              v-model="input.town"
              variant="outlined"
            ></v-combobox>
            <v-autocomplete
              v-if="isEdit"
              class="mt-2"
              density="compact"
              label="Type Town"
              placeholder="Type Town"
              :items="resource.town"
              item-title="name"
              item-value="id"
              v-model="input.town"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row class="mt-n4">
          <v-col cols="12" md="4">
            <label>Mall Type</label>
            <v-autocomplete
              class="mt-2"
              density="compact"
              label="Type Mall Type"
              placeholder="Type Mall Type"
              :items="resource.subIndustry"
              item-title="name"
              item-value="id"
              v-model="input.type"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field
              class="mt-8"
              v-model="input.latitude"
              label="Latitude"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field
              class="mt-8"
              v-model="input.longitude"
              label="Longitude"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
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
              class="w-100 mt-8"
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
          <v-col cols="12" md="2">
            <v-btn
              v-if="isEdit"
              prepend-icon="mdi-account-multiple-remove"
              color="red"
              style="text-transform: none"
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
                <th class="text-left font-weight-bold text-black">Mall id</th>
                <th class="text-left font-weight-bold text-black">Name</th>
                <th class="text-left font-weight-bold text-black">Town</th>
                <th class="text-left font-weight-bold text-black">City</th>
                <th class="text-left font-weight-bold text-black">Country</th>
                <th class="text-left font-weight-bold text-black">Active</th>
                <th class="text-left font-weight-bold text-black">Featured</th>
                <th class="text-left font-weight-bold text-black">User</th>
                <th class="text-left font-weight-bold text-black">Dated</th>
                <th class="text-left font-weight-bold text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in filteredItems" :key="item.id">
                <tr class="country-table-body">
                  <td>{{ item.id }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.town }}</td>
                  <td>{{ item.city }}</td>
                  <td>{{ item.country }}</td>
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
                      @click="activeMall(item.id)"
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
                      v-model="item.isFeatured"
                      rounded="5"
                      @click="featuredMall(item.id)"
                    >
                      <v-btn size="27" :value="true"> Yes </v-btn>

                      <v-btn size="27" :value="false"> No </v-btn>
                    </v-btn-toggle>
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
                            @click="editLocation(item)"
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

                <tr>
                  <td colspan="10">
                    <div class="d-flex flex-column justify-start">
                      <v-table class="text-left pl-16">
                        <tr>
                          <td class="pt-2 pr-8">
                            (<span class="text-red">{{ item.type }}</span
                            >)
                          </td>
                          <td class="pt-2">
                            Latitude :
                            <span class="text-red">{{ item.latitude }}</span>
                          </td>
                          <td class="pt-2">
                            Longitude :
                            <span class="text-red">{{ item.longitude }}</span>
                          </td>
                          <td class="pt-2">
                            Managed By :
                            <span class="text-red">{{ item.managed }}</span>
                          </td>
                        </tr>
                      </v-table>
                      <v-table class="text-left pl-16 mt-2">
                        <tr>
                          <td class="pr-6 pt-2 pb-4">
                            <div class="d-flex justify-start" style="gap: 20px">
                              <router-link
                                class="text-decoration-none"
                                :to="`partner_master/main-info/${item.id}`"
                              >
                                <span>Main Info</span>
                              </router-link>
                              <router-link
                                class="text-decoration-none"
                                :to="`partner_master/contacts/${item.id}`"
                              >
                                <span>Images</span>
                              </router-link>
                              <router-link
                                class="text-decoration-none"
                                :to="`partner_master/socials/${item.id}`"
                              >
                                <span>Levels</span>
                              </router-link>
                              <router-link
                                class="text-decoration-none"
                                :to="`partner_master/locations/${item.id}`"
                              >
                                <span>Events ({{ item.events }})</span>
                              </router-link>
                              <router-link
                                class="text-decoration-none"
                                :to="`partner_master/socials/${item.id}`"
                              >
                                <span>Parking Info</span>
                              </router-link>
                              <router-link
                                class="text-decoration-none"
                                :to="`partner_master/locations/${item.id}`"
                              >
                                <span>Mall Offers ({{ item.events }})</span>
                              </router-link>
                              <router-link
                                class="text-decoration-none"
                                :to="`partner_master/locations/${item.id}`"
                              >
                                <span>Merchants ({{ item.events }})</span>
                              </router-link>
                            </div>
                          </td>
                        </tr>
                      </v-table>
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
        <v-card-text> Are you sure want to delete this mall? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelDelete">No</v-btn>
          <v-btn color="success" text @click="deleteLocation">{{
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
import { setAuthHeader } from '@/util/axios';
// import app from '@/util/eventBus';

export default {
  name: 'LocationsVue',
  data: () => ({
    // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    idPartnerLocations: null,
    partnerName: null,
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
    isOpenImage: false,
    successMessage: '',
    errorMessage: '',
    imageFile: [],

    input: {
      id: 0,
      mall: null,
      country: null,
      town: null,
      city: null,
      type: null,
      latitude: null,
      longitude: null,
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
      mall: [],
      country: [],
      city: [],
      town: [],
      subIndustry: [],
    },
    // itemsTry: [
    //   {
    //     id: 1,
    //     name: 'Parkway Parade',
    //     town: 'Marine Parade',
    //     city: 'Singapore',
    //     country: 'Singapore',
    //     isActive: false,
    //     isFeatured: false,
    //     user: 'Charlton',
    //     dated: '15/08/2023',
    //     type: 'Mall',
    //     latitude: 1.3019,
    //     longitude: 103.9028,
    //     managed: 'Lendlease Pte Ltd',
    //     events: 4,
    //     offers: 2,
    //     merchants: 14,
    //   },
    // ],
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.idPartnerLocations = this.$route.params.id;
    this.getMallData();
    this.getPartnerData();
    this.getCountry();
    this.getCityData();
    this.getTownData();
    this.getSubIndustryData();
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.items;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTextLower) ||
          item.country.toLowerCase().includes(searchTextLower) ||
          item.city.toLowerCase().includes(searchTextLower) ||
          item.town.toLowerCase().includes(searchTextLower)
      );
    },
  },
  methods: {
    editLocation(item) {
      this.isEdit = true;
      this.input = {
        id: item.id,
        mall: item.partner_id,
        country: item.country_id,
        town: item.town_id,
        city: item.city_id,
        type: null,
        latitude: item.latitude,
        longitude: item.longitude,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        id: 0,
        mall: null,
        country: null,
        town: null,
        city: null,
        type: null,
        latitude: null,
        longitude: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        console.log(this.input.city);
        console.log(this.input.town);
        const payload = {
          mall_id: this.input.id,
          partner_id: this.input.mall,
          country_id: this.input.country,
          city_id: this.input.city,
          town_id: this.input.town,
          new_city: '',
          new_town: '',
          latitude: this.input.latitude,
          longitude: this.input.longitude,
        };
        axios
          .post(`/mall/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getMallData();
            this.input = {
              id: 0,
              mall: null,
              country: null,
              town: null,
              city: null,
              type: null,
              latitude: null,
              longitude: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.partner_id
              ? error.response.data.partner_id[0]
              : error.response.data.new_city
              ? error.response.data.new_city[0]
              : error.response.data.new_town
              ? error.response.data.new_town[0]
              : error.response.data.message
              ? error.response.data.message
              : 'Something Wrong!!!';
            this.errorMessage = message;
            this.isError = true;
            this.input = {
              id: 0,
              mall: null,
              country: null,
              town: null,
              city: null,
              type: null,
              latitude: null,
              longitude: null,
            };
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
        console.log(this.input.city);
        console.log(this.input.town);
        const payload = {
          partner_id: this.input.mall,
          country_id: this.input.country,
          city_id: this.input.city.id ? this.input.city.id : null,
          town_id: this.input.town.id ? this.input.town.id : null,
          new_city: !this.input.city.id ? this.input.city : '',
          new_town: !this.input.town.id ? this.input.town : '',
          latitude: this.input.latitude,
          longitude: this.input.longitude,
        };
        axios
          .post(`/mall`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getMallData();
            this.input = {
              id: 0,
              mall: null,
              country: null,
              town: null,
              city: null,
              type: null,
              latitude: null,
              longitude: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.partner_id
              ? error.response.data.partner_id[0]
              : error.response.data.new_city
              ? error.response.data.new_city[0]
              : error.response.data.new_town
              ? error.response.data.new_town[0]
              : error.response.data.message
              ? error.response.data.message
              : 'Something Wrong!!!';
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
    deleteLocation() {
      this.isDeleteLoading = true;
      axios
        .delete(`/mall/${this.locationIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getMallData();
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

    getMallData() {
      this.isLoading = true;
      axios
        .get(`/mall`)
        .then((response) => {
          const data = response.data.data;
          console.log(data);
          this.items = data.map((item) => {
            return {
              // type: 'Mall',

              id: item.mall_id || 1,
              name: item.partner_name || '',
              partner_id: item.partner_id || null,
              town: item.town_name || '',
              city: item.city_name || '',
              country: item.country_name || '',
              isActive:
                item.active == 'N' ? false : item.active == 'Y' ? true : null,
              isFeatured:
                item.featured == 'N'
                  ? false
                  : item.featured == 'Y'
                  ? true
                  : null,
              user: item.name || '',
              dated: item.dated || '',
              latitude: item.latitude || '',
              longitude: item.longitude || '',
              managed: item.managed_by || '',
              country_id: item.country_id || null,
              city_id: item.city_id || null,
              town_id: item?.town_id || null,

              type: 'Mall',
              events: 4,
              offers: 2,
              merchants: 14,
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
    getPartnerData() {
      axios
        .get(`/partners`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.resource.mall = data.map((item) => {
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
    getCityData() {
      this.isLoading = true;
      axios
        .get(`/cities`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.resource.city = data
            .sort((a, b) => a.city_name.localeCompare(b.city_name))
            .map((item) => {
              return {
                id: item.city_id || 1,
                name: item.city_name || '',
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
    getTownData() {
      this.isLoading = true;
      axios
        .get(`/towns`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.resource.town = data
            .sort((a, b) => a.town_name.localeCompare(b.town_name))
            .map((item) => {
              return {
                id: item.town_id || 1,
                name: item.town_name || '',
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
    getSubIndustryData() {
      this.isLoading = true;
      axios
        .get(`/sub-industries`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.resource.subIndustry = data.map((item) => {
            return {
              id: item.sub_industry_id || 1,
              name: item.sub_industry_name || '',
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
    featuredMall(id) {
      this.isSending = true;
      axios
        .get(`/mall/toggle-featured/${id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getMallData();
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
    activeMall(id) {
      this.isSending = true;
      axios
        .get(`/mall/toggle-active/${id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getMallData();
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
  components: { ImageUpload },
};
</script>

<style lang="scss" scoped>
.country-table {
  font-size: 12px;
  color: rgb(100, 100, 100) !important;
}

.country-table-body {
  margin-top: 50px !important;
  margin-bottom: 50px !important;
}

.country-table-body td {
  border-bottom: none !important;
}
.app-column {
  display: flex;
  align-items: center;
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
