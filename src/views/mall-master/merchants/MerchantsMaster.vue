<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <div class="d-flex ml-4 mb-4" style="gap: 30px">
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/mall_master"
        >
          <h4>On-Board Mall</h4>
        </router-link>
        <router-link
          active-class="text-purple-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/mall-country"
        >
          <h4 class="mt-4">Country / City</h4>
        </router-link>
        <router-link
          active-class="text-purple-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/manage_parking_info"
        >
          <h4 class="mt-4">Manage Parking Info</h4>
        </router-link>
      </div>
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/merchants_master"
        >
          <h4>On-Board Merchants</h4>
        </router-link>

        <router-link
          active-class="text-purple-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/manage_events"
        >
          <h4 class="mt-4">Manage Events</h4>
        </router-link>
        <router-link
          active-class="text-purple-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/manage_mall_promos"
        >
          <h4 class="mt-4">Manage Mall Promos</h4>
        </router-link>
      </div>

      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/outlets_master"
        >
          <h4>On-Board Outlets</h4>
        </router-link>

        <router-link
          active-class="text-red-darken-4"
          style="color: black"
          class="text-decoration-none"
          to="/manage_levels"
        >
          <h4 class="mt-4">Manage Levels</h4>
        </router-link>
        <router-link
          active-class="text-red-darken-4"
          style="color: black"
          class="text-decoration-none"
          to="/manage_jobs"
        >
          <h4 class="mt-4">Manage Jobs</h4>
        </router-link>
      </div>
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/promotions_master"
        >
          <h4>On-Board Promotions</h4>
        </router-link>

        <router-link
          active-class="text-blue-darken-4"
          style="color: black"
          class="text-decoration-none"
          to="/manage_services"
        >
          <h4 class="mt-4">Manage Services</h4>
        </router-link>
      </div>

      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/tag-header"
        >
          <h4>Tag Header</h4>
        </router-link>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/displayed-banners"
        >
          <h4 class="mt-4">Displayed Banners</h4>
        </router-link>
      </div>
      <router-link
        active-class="text-blue-accent-4"
        style="color: black"
        class="text-decoration-none"
        to="/tag-master"
      >
        <h4>Tag Master</h4>
      </router-link>
    </div>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-autocomplete
              class="mt-8"
              density="compact"
              label="Type Merchants Name"
              placeholder="Type Merchant / Brand Name"
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
              label="Select Country"
              placeholder="Select Country"
              :items="resource.country"
              item-title="name"
              item-value="id"
              v-model="input.country"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <label>Merchant Type</label>
            <v-autocomplete
              class="mt-2"
              density="compact"
              label="Select - Merchant - Type"
              placeholder="Select - Merchant - Type"
              :items="resource.subIndustry"
              item-title="name"
              item-value="id"
              v-model="input.type"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="2">
            <div>
              <v-btn
                :prepend-icon="isEdit ? 'mdi-account-multiple-check' : 'mdi-account-multiple-plus'"
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
            </div>
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
                <th class="text-left font-weight-bold text-black">Merchant id</th>
                <th class="text-left font-weight-bold text-black">Name</th>
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
                      :disabled="isSending2"
                      rounded="5"
                      @click="activeMerchants(item.id)"
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
                      :disabled="isSending2"
                      rounded="5"
                      @click="featuredMerchants(item.id)"
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
                      <v-btn color="green" variant="text" @click="editLocation(item)" icon>
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

                <tr>
                  <td colspan="8">
                    <div class="d-flex flex-column justify-start">
                      <v-table class="text-left pl-16">
                        <tr>
                          <td class="pt-2 pr-1"></td>
                          <td class="pt-2 pr-10">
                            (<span class="text-red">{{ item.type }}</span
                            >)
                          </td>
                          <td class="pt-2 pr-8">
                            <div class="d-flex" style="gap: 50px">
                              <div class="">
                                <p class="font-weight-bold mb-2">Privileged</p>
                                <v-btn-toggle
                                  style="
                                    font-size: 10px !important;
                                    font-weight: 200 !important;
                                    height: 22px !important;
                                    width: 54px !important;
                                  "
                                  class="d-flex align-center"
                                  v-model="item.isPrivileged"
                                  rounded="5"
                                  :disabled="isSending2"
                                  @click="privilegedMerchants(item.id)"
                                >
                                  <v-btn size="27" :value="true"> Yes </v-btn>

                                  <v-btn size="27" :value="false"> No </v-btn>
                                </v-btn-toggle>
                              </div>
                              <div class="">
                                <p class="font-weight-bold mb-2">Platinum</p>
                                <v-btn-toggle
                                  style="
                                    font-size: 10px !important;
                                    font-weight: 200 !important;
                                    height: 22px !important;
                                    width: 54px !important;
                                  "
                                  class="d-flex align-center"
                                  v-model="item.isPlatinum"
                                  :disabled="isSending2"
                                  rounded="5"
                                  @click="platinumMerchants(item.id)"
                                >
                                  <v-btn size="27" :value="true"> Yes </v-btn>

                                  <v-btn size="27" :value="false"> No </v-btn>
                                </v-btn-toggle>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </v-table>
                      <v-table class="text-left pt-8 px-16 w-50">
                        <tr>
                          <td class="pt-2 pr-1 d-flex">
                            <v-autocomplete
                              v-model="item.selectedTag"
                              class="form-control search-input"
                              item-title="name"
                              item-value="id"
                              :items="resource.tags"
                              placeholder="Enter Tag Name"
                              density="compact"
                              variant="outlined"
                              color="blue-grey-lighten-2"
                            >
                              <template #item="{ props, item }">
                                <div class="mb-2" v-bind="props">
                                  <div class="d-flex align-center w-100">
                                    <div class="w-25 py-1">
                                      <div>
                                        <v-img height="40" :src="item?.raw?.image">
                                          <template #placeholder>
                                            <div class="skeleton" />
                                          </template>
                                        </v-img>
                                      </div>
                                    </div>
                                    <div class="w-75" style="font-size: 12px">
                                      <p class="mb-1">
                                        {{ `${item?.raw?.name}` }}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </template>
                            </v-autocomplete>

                            <v-btn
                              class="ml-4"
                              color="indigo-accent-2"
                              style="text-transform: none"
                              type="submit"
                              variant="flat"
                              @click="addTagById(item)"
                              :disabled="item.loadingTag"
                              :loading="item.loadingTag"
                            >
                              Add Tag
                            </v-btn>
                          </td>
                        </tr>
                      </v-table>
                      <v-table class="text-left pl-16 pt-4 pb-2">
                        <tr>
                          <td>
                            <v-row>
                              <v-col class="d-flex flex-wrap" cols="7">
                                <v-chip
                                  v-for="tagItem in item.tagHeaderItems"
                                  :key="tagItem.mmt_id"
                                  color="primary"
                                  dark
                                  small
                                  class="mr-1 mb-1"
                                >
                                  {{ tagItem.tag_name }}
                                  <v-icon color="red" small @click="deleteTagById(tagItem.mmt_id)">
                                    mdi-close
                                  </v-icon>
                                </v-chip>
                              </v-col>
                            </v-row>
                          </td>
                        </tr>
                      </v-table>
                      <v-table class="text-left pl-10 mt-2">
                        <tr>
                          <td class="pt-2 pr-3"></td>
                          <td class="pr-6 pt-2 pb-4 d-flex">
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
                                :to="`partner_master/locations/${item.id}`"
                              >
                                <span
                                  >Outlets (<span class="text-red">{{ item.outlets }}</span
                                  >)</span
                                >
                              </router-link>
                              <router-link
                                class="text-decoration-none"
                                :to="`partner_master/locations/${item.id}`"
                              >
                                <span
                                  >Malls (<span class="text-red">{{ item.malls }}</span
                                  >)</span
                                >
                              </router-link>
                            </div>
                          </td>
                        </tr>
                      </v-table>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </v-table>
          <skeleton-table v-if="isLoading" :rows="5" :columns="8" />
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
      @confirm="deleteLocation"
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
    partnerName: null,
    valid: false,
    requestCount: 0,
    isLoading: false,
    isSending: false,
    isSending2: false,
    isEdit: false,
    isDelete: false,
    isDeleteLoading: false,
    locationIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    isOpenImage: false,
    imageFile: [],

    tagId: null,
    input: {
      id: 0,
      mall: null,
      country: null,
      type: null,
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
    filteredMerchants: [],
    resource: {
      mall: [],
      country: [],
      city: [],
      town: [],
      subIndustry: [],
      tags: [],
    },
    // itemsTry: [
    //   {
    //     id: 1,
    //     name: 'Pappa Rich',
    //     country: 'Singapore',
    //     isActive: false,
    //     isFeatured: false,
    //     user: 'Charlton',
    //     dated: '15/08/2023',
    //     type: 'Restaurant',
    //     outlets: 5,
    //     malls: 2,
    //   },
    // ],
  }),
  watch: {
    'input.mall'() {
      this.input.country = this.mallCountry?.country?.country_id;
      this.input.type = this.mallCountry?.sub_industry?.sub_industry_id;
    },
    requestCount() {
      if (this.requestCount === 0) {
        this.isLoading = false;
      }
    },
  },
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.getItemsData();
    this.getPartnerData();
    this.getCountry();
    this.getSubIndustryData();
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.items.slice(0, 10);
      }
      const searchTextLower = this.search.toLowerCase();
      return this.items
        .filter((item) => item.name.toLowerCase().includes(searchTextLower))
        .slice(0, 10);
    },
    // filteredMerchants() {
    //   console.log(this.searchMall);
    //   let filtered = [];
    //   if (this.searchMall) {
    //     filtered = this.resource.mall.filter((item) =>
    //       item.name.toLowerCase().includes(this.searchMall.toLowerCase())
    //     );
    //     return filtered.slice(0, 10);
    //   } else {
    //     return this.resource.mall.slice(0, 10);
    //   }
    // },
    mallCountry() {
      return this.resource?.mall.find((item) => item.id === this.input.mall);
    },
  },
  methods: {
    editLocation(item) {
      this.isEdit = true;
      this.input = {
        id: item.id,
        mall: item.partner_id,
        country: item.country_id,
        type: item.sub_industry_id,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        id: 0,
        mall: null,
        country: null,
        type: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          mm_id: this.input.id,
          partner_id: this.input.mall,
          country_id: this.input.country,
          merchant_type: this.input.type,
        };
        axios
          .post(`/mall-merchants/update`, payload)
          .then((response) => {
            const data = response.data;
            this.notification.success(data.message);
            this.getItemsData();
            this.input = {
              id: 0,
              mall: null,
              country: null,
              type: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.partner_id
              ? error.response.data.partner_id[0]
              : error.response.data.message === ''
              ? 'Something Wrong!!!'
              : error.response.data.message;
            this.notification.error(message);
            this.input = {
              id: 0,
              mall: null,
              country: null,
              type: null,
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
        const payload = {
          partner_id: this.input.mall,
          country_id: this.input.country,
          merchant_type: this.input.type,
        };
        axios
          .post(`/mall-merchants`, payload)
          .then((response) => {
            const data = response.data;
            this.notification.success(data.message);
            this.getItemsData();
            this.input = {
              id: 0,
              mall: null,
              country: null,
              type: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.partner_id
              ? error.response.data.partner_id[0]
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
    deleteLocation() {
      this.isDeleteLoading = true;
      axios
        .delete(`/mall-merchants/${this.locationIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getItemsData();
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
    getPartnerData() {
      axios
        .get(`/partners`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.partnerName = data
            .filter((i) => i.partner_id == this.idPartnerLocations)
            .map((item) => item.partner_name || '')[0];
          this.resource.mall = data.map((item) => {
            return {
              id: item.partner_id || 1,
              name: item.partner_name || '',
              country: item?.country,
              sub_industry: item?.sub_industry,
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
            error.response.data.message === '' ? 'Something Wrong!!!' : error.response.data.message;
          this.notification.error(message);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async getItemsData() {
      this.isLoading = true;
      this.requestCount = 0; // Reset request count
      try {
        let items = await this.getMerchantData();
        this.items = items.sort((a, b) => b.id - a.id);
        this.requestCount++;

        items = await Promise.all(
          items.map(async (item) => {
            const tagHeaderItems = await this.getTagsHeaderDataById(item.partner_id);
            this.requestCount++;
            return {
              ...item,
              loadingTag: false,
              selectedTag: null,
              tagHeaderItems: tagHeaderItems,
            };
          })
        );

        this.items = items.sort((a, b) => b.id - a.id);
        console.log(items);
      } catch (error) {
        console.error('Error fetching items data:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async getMerchantData() {
      this.isLoading = true;
      try {
        const response = await axios.get(`/mall-merchants`);
        const data = response.data.data;

        this.getTagsData();
        return data.map((item) => {
          return {
            id: item.mm_id || 1,
            name: item.partner_name || '',
            partner_id: item.partner_id || null,
            country: item.country_name || '',
            country_id: item.country_id || null,
            isPrivileged: item.privileged == 'N' ? false : item.privileged == 'Y' ? true : null,
            isPlatinum: item.platinum == 'N' ? false : item.platinum == 'Y' ? true : null,
            isActive: item.active == 'N' ? false : item.active == 'Y' ? true : null,
            isFeatured: item.featured == 'N' ? false : item.featured == 'Y' ? true : null,
            user: item.name || '',
            user_id: item.user_id || '',
            dated: item.dated || '',
            type: item.sub_industry_name || '',
            sub_industry_id: item.sub_industry_id || null,
            outlets: 5,
            malls: 2,
          };
        });
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
        const message =
          error.response.data.message === '' ? 'Something Wrong!!!' : error.response.data.message;
        this.notification.error(message);
      } finally {
        this.isLoading = false;
      }
    },
    async getTagsHeaderDataById(id) {
      //this.isLoading = true;
      try {
        const response = await axios.get(`/mall-merchants-tags/${id}/tags`);
        const data = response.data.data;

        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
      //finally {
      //  this.isLoading = false;
      //}
    },
    addTagById(item) {
      item.loading = true;
      const payload = {
        tag_id: item.selectedTag,
        merchant_id: item.partner_id,
      };
      console.log(payload);
      axios
        .post(`/mall-merchants-tags`, payload)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getItemsData();
          item.selectedTag = null;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message = error.response.data.partner_id
            ? error.response.data.partner_id[0]
            : error.response.data.message === ''
            ? 'Something Wrong!!!'
            : error.response.data.message;
          this.notification.error(message);
        })
        .finally(() => {
          item.loading = true;
        });
    },
    deleteTagById(id) {
      this.isDeleteLoading = true;
      axios
        .delete(`/mall-merchants-tags/${id}`)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getItemsData();
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
          this.isDelete = false;
        });
    },
    getTagsData() {
      this.isLoading = true;
      axios
        .get(`/tags`)
        .then((response) => {
          const data = response.data.data;
          this.resource.tags = data
            .sort((a, b) => a.tag_name.localeCompare(b.tag_name))
            .map((item) => {
              return {
                id: item.tag_id || 1,
                name: item.tag_name || '',
                image: item.tag_image ? this.$fileURL + item.tag_image : null,
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
    activeMerchants(id) {
      this.isSending2 = true;
      axios
        .get(`/mall-merchants/toggle-active/${id}`)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          //this.getItemsData();
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
    featuredMerchants(id) {
      this.isSending2 = true;
      axios
        .get(`/mall-merchants/toggle-featured/${id}`)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          //this.getItemsData();
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
    privilegedMerchants(id) {
      this.isSending2 = true;
      axios
        .get(`/mall-merchants/toggle-privileged/${id}`)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          // this.getItemsData();
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
    platinumMerchants(id) {
      this.isSending2 = true;
      axios
        .get(`/mall-merchants/toggle-platinum/${id}`)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          //this.getMerchantData();
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
