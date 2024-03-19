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
      </div>
      <router-link
        active-class="text-blue-accent-4"
        style="color: black"
        class="text-decoration-none"
        to="/merchants_master"
      >
        <h4>On-Board Merchants</h4>
      </router-link>
      <router-link
        active-class="text-blue-accent-4"
        style="color: black"
        class="text-decoration-none"
        to="/outlets_master"
      >
        <h4>On-Board Outlets</h4>
      </router-link>
      <router-link
        active-class="text-blue-accent-4"
        style="color: black"
        class="text-decoration-none"
        to="/promotions_master"
      >
        <h4>On-Board Promotions</h4>
      </router-link>

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
              label="Type Merchant Name"
              placeholder="Type Merchant / Brand Name"
              :items="resource.mall"
              item-title="name"
              item-value="id"
              v-model="input.mall"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="9">
            <v-text-field
              v-model="input.name"
              label="Type Merchant Name"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <!-- :prepend-icon="
              isEdit
                ? 'mdi-account-multiple-check'
                : 'mdi-account-multiple-plus'
            " -->
            <div>
              <v-btn
                color="indigo-accent-2"
                style="text-transform: none"
                type="submit"
                variant="flat"
                class="w-100"
                @click="isEdit ? saveEdit() : saveData()"
                :disabled="isSending"
                :loading="isSending"
              >
                <!-- <template v-slot:prepend>
                  <v-icon color="white"></v-icon>
                </template> -->

                {{ isEdit ? 'Save Promotion' : 'Add Promotion' }}
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
                <th class="text-left font-weight-bold text-black">Promo id</th>
                <th class="text-left font-weight-bold text-black">
                  Merchant Name
                </th>
                <th class="text-left font-weight-bold text-black">
                  Promotion Name
                </th>
                <th class="text-left font-weight-bold text-black">Country</th>
                <th class="text-left font-weight-bold text-black">Outlets</th>
                <th class="text-left font-weight-bold text-black">User</th>
                <th class="text-left font-weight-bold text-black">Dated</th>
                <th class="text-left font-weight-bold text-black"></th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in filteredItems" :key="item.id">
                <tr class="country-table-body">
                  <td>{{ item.id }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.promo }}</td>
                  <td>{{ item.country }}</td>

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
                            @click="editPromotion(item)"
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
                  <td colspan="6">
                    <div class="d-flex flex-column justify-start">
                      <v-table class="text-left mt-2 w-66">
                        <tr>
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
                              ><template #placeholder>
                                <div class="skeleton" /> </template
                            ></v-img>
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
                              rounded="5"
                              @click="activePromotions(item.id)"
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
                              @click="featuredPromotions(item.id)"
                            >
                              <v-btn size="27" :value="true"> Yes </v-btn>

                              <v-btn size="27" :value="false"> No </v-btn>
                            </v-btn-toggle>
                          </td>
                          <td class="pl-4">
                            <div class="d-flex justify-start" style="gap: 20px">
                              <router-link
                                class="text-decoration-none"
                                :to="`/promotions_master/main-info/${item.id}`"
                              >
                                <span>Main Info</span>
                              </router-link>
                              <router-link
                                class="text-decoration-none"
                                :to="`/promotions_master/outlets/${item.id}/${item.mall_id}`"
                              >
                                <span
                                  >Outlets (<span class="text-red"> 3 </span
                                  >)</span
                                >
                              </router-link>
                            </div>
                          </td>
                        </tr>
                      </v-table>
                      <v-table class="text-left pt-2 pr-16 w-66">
                        <tr>
                          <td class="pt-2 pr-1 d-flex">
                            <h4 class="mt-2 mr-4">Tags</h4>
                            <v-autocomplete
                              v-model="tagId"
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
                                        <v-img
                                          height="40"
                                          :src="item?.raw?.image"
                                        >
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
                              @click="addTagById(item.id)"
                              :disabled="isSending"
                              :loading="isSending"
                            >
                              Add Tag
                            </v-btn>
                          </td>
                        </tr>
                      </v-table>
                      <table class="text-left pr-16 w-66">
                        <tr>
                          <td>
                            <v-chip
                              v-for="tag in item.tagItems"
                              :key="tag.id"
                              color="primary"
                              dark
                              small
                              class="mr-1 mb-1"
                            >
                              {{ tag.name }}
                              <v-icon
                                color="red"
                                small
                                @click="deleteTagById(tag.id)"
                              >
                                mdi-close
                              </v-icon>
                            </v-chip>
                          </td>
                        </tr>
                      </table>
                      <table class="text-left pt-4 pb-2 pr-16">
                        <tr>
                          <td>
                            <v-row>
                              <v-col cols="6">
                                <!-- <div v-for="tag in item.tagItems" :key="tag.id"> -->
                                <v-row>
                                  <v-col cols="4">
                                    <p>Category Tag</p>
                                  </v-col>
                                  <v-col cols="1">
                                    <span>:</span>
                                  </v-col>
                                  <v-col cols="7">
                                    <v-chip
                                      color="primary"
                                      dark
                                      small
                                      class="mr-1 mb-1"
                                    >
                                      Whole Cake
                                      <v-icon
                                        color="red"
                                        small
                                        @click="deleteTagById(1)"
                                      >
                                        mdi-close
                                      </v-icon>
                                    </v-chip>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="4">
                                    <p>Preference Tag</p>
                                  </v-col>
                                  <v-col cols="1">
                                    <span>:</span>
                                  </v-col>
                                  <v-col cols="7">
                                    <v-chip
                                      color="primary"
                                      dark
                                      small
                                      class="mr-1 mb-1"
                                    >
                                      Dragon Fruit
                                      <v-icon
                                        color="red"
                                        small
                                        @click="deleteTagById(2)"
                                      >
                                        mdi-close
                                      </v-icon>
                                    </v-chip>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="4">
                                    <p>Meals Tag</p>
                                  </v-col>
                                  <v-col cols="1">
                                    <span>:</span>
                                  </v-col>
                                  <v-col cols="7">
                                    <v-chip
                                      color="primary"
                                      dark
                                      small
                                      class="mr-1 mb-1"
                                    >
                                      Dessert
                                      <v-icon
                                        color="red"
                                        small
                                        @click="deleteTagById(3)"
                                      >
                                        mdi-close
                                      </v-icon>
                                    </v-chip>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="4">
                                    <p>Discount Tag</p>
                                  </v-col>
                                  <v-col cols="1">
                                    <span>:</span>
                                  </v-col>
                                  <v-col cols="7">
                                    <v-chip
                                      color="primary"
                                      dark
                                      small
                                      class="mr-1 mb-1"
                                    >
                                      10 % Off
                                      <v-icon
                                        color="red"
                                        small
                                        @click="deleteTagById(4)"
                                      >
                                        mdi-close
                                      </v-icon>
                                    </v-chip>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="4">
                                    <p>Days Tag</p>
                                  </v-col>
                                  <v-col cols="1">
                                    <span>:</span>
                                  </v-col>
                                  <v-col cols="7">
                                    <v-chip
                                      color="primary"
                                      dark
                                      small
                                      class="mr-1 mb-1"
                                    >
                                      Friday
                                      <v-icon
                                        color="red"
                                        small
                                        @click="deleteTagById(5)"
                                      >
                                        mdi-close
                                      </v-icon>
                                    </v-chip>
                                  </v-col>
                                </v-row>
                                <!-- </div> -->
                              </v-col>
                              <v-col cols="6">
                                <!-- <div v-for="tag in item.tagItems" :key="tag.id"> -->
                                <v-row>
                                  <v-col cols="3">
                                    <p>People Tag</p>
                                  </v-col>
                                  <v-col cols="1">
                                    <span>:</span>
                                  </v-col>
                                  <v-col cols="7">
                                    <v-chip
                                      color="primary"
                                      dark
                                      small
                                      class="mr-1 mb-1"
                                    >
                                      Everyone
                                      <v-icon
                                        color="red"
                                        small
                                        @click="deleteTagById(6)"
                                      >
                                        mdi-close
                                      </v-icon>
                                    </v-chip>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="3">
                                    <p>Vouchers Tag</p>
                                  </v-col>
                                  <v-col cols="1">
                                    <span>:</span>
                                  </v-col>
                                  <v-col cols="7">
                                    <v-chip
                                      color="primary"
                                      dark
                                      small
                                      class="mr-1 mb-1"
                                    >
                                      Vouchers for 10$
                                      <v-icon
                                        color="red"
                                        small
                                        @click="deleteTagById(7)"
                                      >
                                        mdi-close
                                      </v-icon>
                                    </v-chip>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="3">
                                    <p>Other Tag</p>
                                  </v-col>
                                  <v-col cols="1">
                                    <span>:</span>
                                  </v-col>
                                  <v-col cols="7">
                                    <v-chip
                                      color="primary"
                                      dark
                                      small
                                      class="mr-1 mb-1"
                                    >
                                      Buy 1 get 1 Free
                                      <v-icon
                                        color="red"
                                        small
                                        @click="deleteTagById(8)"
                                      >
                                        mdi-close
                                      </v-icon>
                                    </v-chip>
                                  </v-col>
                                </v-row>
                                <!-- </div> -->
                              </v-col>
                            </v-row>
                          </td>
                        </tr>
                      </table>
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
        <v-card-text> Are you sure want to delete this promotion? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelDelete">No</v-btn>
          <v-btn color="success" text @click="deletePromo">{{
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
    activeMalls: [],
    partnerName: null,
    valid: false,
    isLoading: false,
    isSending: false,
    isError: false,
    isEdit: false,
    isSuccess: false,
    isDelete: false,
    isDeleteLoading: false,
    promoIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    isOpenImage: false,
    successMessage: '',
    errorMessage: '',
    imageFile: [],

    promotionDataToImage: {
      id: 0,
      name: null,
      industry: null,
      subIndustry: null,
      country: null,
    },
    tagId: null,
    input: {
      id: 0,
      mall: null,
      name: '',
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
      tags: [],
      mall: [],
      country: [],
      city: [],
      town: [],
      subIndustry: [],
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
  //watch: {
  //  'input.mall'() {
  //    this.input.country = this.mallCountry?.country?.country_id;
  //    this.input.type = this.mallCountry?.sub_industry?.sub_industry_id;
  //  },
  //},
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.getItemsData();
    this.getPartnerData();
    this.getTagsData();
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
          item.promo.toLowerCase().includes(searchTextLower)
      );
    },
    mallCountry() {
      return this.resource?.mall.find((item) => item.id === this.input.mall);
    },
  },
  methods: {
    openImage(item) {
      this.isOpenImage = true;
      this.promotionDataToImage = {
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
      this.promotionDataToImage = {
        id: 0,
      };
    },

    updateImageFile(newImageFile) {
      this.imageFile.push(newImageFile);
    },

    deleteImageFile() {
      this.isSending = true;
      axios
        .delete(`/mall-promotions/${this.promotionDataToImage.id}/main-image`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getItemsData();
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
          // this.promotionDataToImage = {
          //   app_id: 1,
          //   app_group_id: 1,
          //   app_name: '',
          //   app_description: '',
          //   app_detail: '',
          // };
          this.imageFile = [];
        });
    },
    saveImage() {
      this.isSending = true;
      const payload = {
        promo_id: this.promotionDataToImage.id,
        main_image: this.imageFile[0],
      };

      http
        .post(`/mall-promotions/update`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getItemsData();
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
          this.promotionDataToImage = {
            id: 0,
          };
          this.isOpenImage = false;
          this.imageFile = [];
        });
    },
    editPromotion(item) {
      this.isEdit = true;
      this.input = {
        id: item.id,
        mall: item.mall_id,
        name: item.promo,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        id: 0,
        mall: null,
        name: '',
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          promo_id: this.input.id,
          merchant_id: this.input.mall,
          promo_name: this.input.name,
        };
        axios
          .post(`/mall-promotions/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getItemsData();
            this.input = {
              id: 0,
              mall: null,
              name: '',
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
            this.errorMessage = message;
            this.isError = true;
            this.input = {
              id: 0,
              mall: null,
              name: '',
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
          merchant_id: this.input.mall,
          promo_name: this.input.name,
        };
        axios
          .post(`/mall-promotions`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getItemsData();
            this.input = {
              id: 0,
              mall: null,
              name: '',
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
            this.errorMessage = message;
            this.isError = true;
          })
          .finally(() => {
            this.isSending = false;
          });
      }
    },
    cancelDelete() {
      this.promoIdToDelete = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.promoIdToDelete = itemId;
      this.isDelete = true;
    },
    cancelConfirmation() {
      this.promoIdToDelete = null;
      this.isDelete = false;
    },
    deletePromo() {
      this.isDeleteLoading = true;
      axios
        .delete(`/mall-promotions/${this.promoIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getItemsData();
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
          this.promoIdToDelete = null;
          this.isDelete = false;
        });
    },
    async getItemsData() {
      this.isLoading = true;
      try {
        let items = await this.getPromotionsData();

        items = await Promise.all(
          items.map(async (item) => {
            const tagItems = await this.getTagsDataById(item.id);
            return { ...item, tagItems };
          })
        );

        this.items = items;
      } catch (error) {
        console.error('Error fetching items data:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async getPromotionsData() {
      this.isLoading = true;
      try {
        const response = await axios.get(`/mall-promotions`);
        const data = response.data.data;
        return data.map((item) => {
          return {
            id: item.promo_id || 1,
            mall_id: item.merchant_id || 1,
            name: item.partner_name || '',
            promo: item.promo_name || '',
            partner_id: item.partner_id || null,
            country: item.country_name || '',
            country_id: item.country_id || null,
            isActive:
              item.promo_active == 'N'
                ? false
                : item.promo_active == 'Y'
                ? true
                : null,
            isFeatured:
              item.promo_featured == 'N'
                ? false
                : item.promo_featured == 'Y'
                ? true
                : null,
            image: item.main_image || null,
            user: item.name || '',
            user_id: item.user_id || '',
            dated: item.promo_dated || '',
            type: item.sub_industry_name || '',
            sub_industry_id: item.sub_industry_id || null,
            outlets: 5,
            malls: 2,
          };
        });
      } catch (error) {
        console.log(error);
        const message =
          error.response.data.message === ''
            ? 'Something Wrong!!!'
            : error.response.data.message;
        this.errorMessage = message;
        this.isError = true;
      } finally {
        this.isLoading = false;
      }
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
            error.response.data.message === ''
              ? 'Something Wrong!!!'
              : error.response.data.message;
          this.errorMessage = message;
          this.isError = true;
        });
    },
    async getTagsDataById(id) {
      this.isLoading = true;
      try {
        const response = await axios.get(`/mall-promotion-tags/${id}/tags`);
        const data = response.data.data;
        return data.map((item) => {
          return {
            id: item.mpt_id || 0,
            title: 'Example Tag',
            name: item.tag_name || '',
          };
        });
      } catch (error) {
        console.log(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    addTagById(id) {
      this.isSending = true;
      const payload = {
        promo_id: id,
        tag_id: this.tagId,
      };
      console.log(payload);
      axios
        .post(`/mall-promotion-tags`, payload)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getItemsData();
          this.tagId = null;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message = error.response.data.partner_id
            ? error.response.data.partner_id[0]
            : error.response.data.message === ''
            ? 'Something Wrong!!!'
            : error.response.data.message;
          this.errorMessage = message;
          this.isError = true;
        })
        .finally(() => {
          this.isSending = false;
        });
    },
    deleteTagById(id) {
      this.isDeleteLoading = true;
      axios
        .delete(`/mall-promotion-tags/${id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getItemsData();
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
    activePromotions(id) {
      this.isSending = true;
      axios
        .get(`/mall-promotions/toggle-active/${id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getItemsData();
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
    featuredPromotions(id) {
      this.isSending = true;
      axios
        .get(`/mall-promotions/toggle-featured/${id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getItemsData();
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
  color: #a12a3d;
  font-weight: 500;
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
