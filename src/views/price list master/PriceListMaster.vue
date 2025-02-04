<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <div class="d-flex align-center">
      <span
        style="cursor: pointer"
        class="font-weight-bold"
        :class="selectedApp == 3 ? 'text-blue-darken-1' : undefined"
        @click="changeSelectedApp(3)"
        >Boozards</span
      >
      <span class="mx-1 font-weight-bold"> | </span>
      <span
        style="cursor: pointer"
        class="font-weight-bold"
        :class="selectedApp == 10 ? 'text-blue-darken-1' : undefined"
        @click="changeSelectedApp(10)"
        >Goan Stuff</span
      >
      <span class="mx-1 font-weight-bold"> | </span>
      <span
        style="cursor: pointer"
        class="font-weight-bold"
        :class="selectedApp == 0 ? 'text-blue-darken-1' : undefined"
        @click="changeSelectedApp(0)"
        >Mart-In</span
      >
      <span class="mx-1 font-weight-bold"> | </span>
      <span
        style="cursor: pointer"
        class="font-weight-bold"
        :class="selectedApp == 8 ? 'text-blue-darken-1' : undefined"
        @click="changeSelectedApp(8)"
        >Pizza Run</span
      >
      <span class="mx-1 font-weight-bold"> | </span>
      <span
        style="cursor: pointer"
        class="font-weight-bold"
        :class="selectedApp == 0 ? 'text-blue-darken-1' : undefined"
        @click="changeSelectedApp(0)"
        >Cake Run</span
      >
    </div>
    <div class="d-flex align-center mt-4">
      <template v-for="(city, index) in cities" :key="city.city_id">
        <span
          style="cursor: pointer"
          class="font-weight-bold"
          :class="
            selectedCity == city.city_id ? 'text-blue-darken-4' : undefined
          "
          @click="changeSelectedCity(city.city_id, city?.currency_symbol)"
          >{{ city.city_name }}</span
        >
        <span v-if="index != cities.length - 1" class="mx-1 font-weight-bold">
          |
        </span>
      </template>
    </div>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row class="mt-2">
          <v-col cols="12" md="7">
            <v-autocomplete
              v-model="input.product"
              class="form-control search-input"
              item-title="name"
              return-object
              :items="products"
              placeholder="Product Name"
              density="compact"
              variant="outlined"
              color="blue-grey-lighten-2"
            >
              <template #selection="{ props, item }">
                <!-- <span v-bind="props">{{ `${item.raw.country_name} ` }}</span>
                <span v-if="item.raw.country_id != 0" class="font-weight-bold">
                  (
                  <span class="text-red">{{ item.raw.brand_count }}</span>
                  Brands )</span
                > -->
                <div
                  v-bind="props"
                  class="d-flex align-center w-100 text-no-wrap"
                >
                  <div style="width: 15%" class="mr-2">
                    <div
                      style="
                        height: 34px;
                        width: 100%;
                        object-fit: cover;
                        object-position: center;
                      "
                    >
                      <v-img
                        height="34"
                        cover
                        :src="$fileURL + item?.raw?.image"
                      >
                        <template #placeholder>
                          <div class="skeleton" />
                        </template>
                      </v-img>
                    </div>
                  </div>
                  <div style="font-size: 12px; width: 85%">
                    <p>
                      {{ `${item?.raw?.name}` }}
                    </p>
                  </div>
                </div>
              </template>
              <template #item="{ props, item }">
                <div class="mb-2" v-bind="props">
                  <div class="d-flex align-center w-100 px-2 py-1">
                    <div style="width: 8%" class="mr-2">
                      <div
                        style="
                          height: 40px;
                          width: 100%;
                          object-fit: cover;
                          object-position: center;
                        "
                      >
                        <v-img
                          height="40"
                          cover
                          :src="$fileURL + item?.raw?.image"
                        >
                          <template #placeholder>
                            <div class="skeleton" />
                          </template>
                        </v-img>
                      </div>
                    </div>
                    <div style="font-size: 12px; width: 92%">
                      <p class="mb-1">
                        {{ `${item?.raw?.name}` }}
                      </p>
                    </div>
                  </div>
                </div>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <div
              class="d-flex align-content-center p-0 w-100"
              style="
                height: 40px;
                overflow-y: hidden;
                border-radius: 5px;
                border: 1px grey solid;
              "
            >
              <div
                class="d-flex justify-center align-center w-33"
                style="background: #e9ecef"
              >
                <h4 style="color: #077cff">{{ selectedCurrency }}</h4>
              </div>
              <v-text-field
                class="w-66"
                style="margin-top: -1px"
                variant="outlined"
                type="number"
                inputmode="numeric"
                density="compact"
                placeholder="0"
                v-model="input.price"
              ></v-text-field>
            </div>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn
              prepend-icon="
                  mdi-account-multiple-plus
              "
              color="indigo-accent-2"
              style="text-transform: none"
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

              Add
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <v-sheet class="py-6 px-4 mt-6" border rounded width="100%">
      <!-- <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            density="compact"
            v-model="search"
            label="Search Contacts"
            variant="outlined"
            hide-details
          ></v-text-field>
        </v-col>
      </v-row> -->
      <v-row>
        <v-col cols="12">
          <v-table class="country-table">
            <thead>
              <tr>
                <th class="text-left">Id</th>
                <th class="text-left">Image</th>
                <th class="text-left">Product Name</th>
                <th class="text-left">Qty</th>
                <th class="text-left">Price</th>
                <th class="text-left">Active</th>
                <th class="text-left">User</th>
                <th class="text-left">Dated</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in items" :key="item.id">
                <tr class="country-table-body">
                  <td>{{ item.id }}</td>

                  <td>
                    <div class="image-upload-cont">
                      <v-img
                        class="image-upload-item"
                        height="40"
                        @click="openImage(item)"
                        style="cursor: pointer"
                        :src="
                          item.image
                            ? $fileURL + item.image
                            : item.image_1
                            ? $fileURL + item.image_1
                            : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                        "
                        ><template #placeholder>
                          <div class="skeleton" /> </template
                      ></v-img>
                    </div>
                  </td>
                  <td>
                    {{ item?.product_name || '-' }}
                  </td>
                  <td>
                    {{ item?.quantity_name || '-' }}
                  </td>
                  <td>
                    <div
                      class="d-flex align-content-center p-0 w-100"
                      style="
                        height: 40px;
                        overflow-y: hidden;
                        border-radius: 5px;
                        border: 1px grey solid;
                      "
                    >
                      <div
                        class="d-flex justify-center align-center w-33"
                        style="background: #e9ecef"
                      >
                        <h4 style="color: #077cff">{{ selectedCurrency }}</h4>
                      </div>
                      <v-text-field
                        class="w-66"
                        style="margin-top: -1px"
                        variant="outlined"
                        type="number"
                        inputmode="numeric"
                        density="compact"
                        placeholder="0"
                        v-model="item.rate"
                        @input="debouncedUpdate(item.id, item.rate)"
                      ></v-text-field>
                    </div>
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
                      @click="activePrice(item.id)"
                    >
                      <v-btn size="27" :value="true"> Yes </v-btn>

                      <v-btn size="27" :value="false"> No </v-btn>
                    </v-btn-toggle>
                  </td>
                  <td>{{ item?.name || '-' }}</td>
                  <td>
                    {{ item?.dated || '-' }}
                  </td>
                  <td>
                    <div class="d-flex">
                      <v-btn
                        color="red"
                        variant="text"
                        :disabled="isDeleteLoading"
                        @click="openDeleteConfirm(item.id)"
                        icon="mdi-trash-can-outline"
                      ></v-btn>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="border-bottom: none !important" colspan="9">
                    <div class="d-flex justify-start" style="gap: 20px">
                      <v-table class="text-left font-weight-bold">
                        <tr>
                          <td style="width: 75px"></td>
                          <td style="width: 75px"></td>
                          <td class="pr-6 pt-2 pb-4">
                            <div class="d-flex align-center">
                              <div class="mr-2 mt-5">
                                <v-label
                                  class="text-blue-lighten-2 text-body-2 mb-2"
                                  >Merchant Prices</v-label
                                >
                                <v-autocomplete
                                  density="compact"
                                  placeholder="Type Template"
                                  :items="products"
                                  :item-title="
                                    (item) => `${item.product_name} | Singapore`
                                  "
                                  item-value="id"
                                  style="min-width: 300px !important"
                                  v-model="item.merchantPrices"
                                  variant="outlined"
                                ></v-autocomplete>
                              </div>
                              <div class="mr-2">
                                <v-label class="text-black text-body-2 mb-2"
                                  >Shop Rate</v-label
                                >
                                <div
                                  class="d-flex align-content-center p-0 w-100"
                                  style="
                                    height: 40px;
                                    overflow-y: hidden;
                                    border-radius: 5px;
                                    border: 1px grey solid;
                                  "
                                >
                                  <div
                                    class="d-flex justify-center align-center w-33"
                                    style="background: #e9ecef"
                                  >
                                    <h4 style="color: #077cff">
                                      {{ selectedCurrency }}
                                    </h4>
                                  </div>
                                  <v-text-field
                                    class="w-66"
                                    style="margin-top: -1px"
                                    variant="outlined"
                                    type="number"
                                    inputmode="numeric"
                                    density="compact"
                                    placeholder="0"
                                    v-model="item.price"
                                  ></v-text-field>
                                </div>
                              </div>
                              <v-btn
                                prepend-icon="mdi-account-multiple-plus"
                                color="indigo-accent-2"
                                style="text-transform: none"
                                type="submit"
                                variant="flat"
                                class="mt-6"
                                @click="saveEdit()"
                                :disabled="isSending"
                                :loading="isSending"
                              >
                                <template v-slot:prepend>
                                  <v-icon color="white"></v-icon>
                                </template>

                                Add
                              </v-btn>
                            </div>
                          </td>
                        </tr>
                      </v-table>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td class="has-border" colspan="9">
                    <div class="d-flex justify-start" style="gap: 20px">
                      <v-table class="text-left font-weight-bold">
                        <tr>
                          <td style="width: 75px"></td>
                          <td style="width: 75px"></td>
                          <td
                            style="width: 600px; overflow: hidden"
                            class="pt-2 pb-4"
                          >
                            <v-row
                              v-for="(
                                data, index
                              ) in item.priceListItems?.slice(0, 2)"
                              :key="index"
                              style="border-top: 1px solid black !important"
                              class="pt-0 pb-2 mt-1"
                            >
                              <v-col cols="12">
                                <v-row class="py-0">
                                  <v-col cols="2">
                                    <p class="text-caption font-weight-bold">
                                      <!-- {{ data?.sent_on || '-' }} -->
                                      Value S Shop
                                    </p>
                                  </v-col>
                                  <v-col cols="2">
                                    <p
                                      class="text-caption font-weight-bold text-no-wrap"
                                    >
                                      <!-- {{ data?.app_name || '-' }} -->
                                      Marine Parade
                                    </p>
                                  </v-col>
                                  <v-col cols="2">
                                    <p class="text-caption font-weight-bold">
                                      <!-- {{ data?.email_subject || '-' }} -->
                                      Mr. Jack
                                    </p>
                                  </v-col>
                                  <v-col cols="2">
                                    <p class="text-caption font-weight-bold">
                                      <a
                                        :href="`https://api.whatsapp.com/send?phone=${
                                          item.code + item.phone
                                        }&text=Hello`"
                                        class="text-decoration-none text-grey-darken-1 text-no-wrap"
                                      >
                                        {{ item.code + item.phone
                                        }}<v-icon
                                          v-if="item.phone"
                                          color="#4EC053"
                                          size="20"
                                          class="ml-2 fab fa-whatsapp"
                                        ></v-icon>
                                      </a>
                                    </p>
                                  </v-col>
                                  <v-col cols="2">
                                    <p class="text-caption font-weight-bold">
                                      <!-- {{ data?.dated || '-' }} -->
                                      Charlton
                                    </p>
                                  </v-col>
                                  <v-col cols="2">
                                    <p class="text-caption font-weight-bold">
                                      <!-- {{ data?.dated || '-' }} -->
                                      28/01/2025
                                    </p>
                                  </v-col>
                                </v-row>
                                <v-row class="py-0">
                                  <v-col cols="2"></v-col>
                                  <v-col cols="3">
                                    <v-label class="text-black text-body-2 mb-2"
                                      >Shop Rate</v-label
                                    >
                                    <div
                                      class="d-flex align-content-center p-0 w-100"
                                      style="
                                        height: 35px;
                                        overflow-y: hidden;
                                        border-radius: 5px;
                                        border: 1px grey solid;
                                      "
                                    >
                                      <div
                                        class="d-flex justify-center align-center w-33"
                                        style="background: #e9ecef"
                                      >
                                        <h4 style="color: #077cff">
                                          {{ selectedCurrency }}
                                        </h4>
                                      </div>
                                      <v-text-field
                                        class="w-66"
                                        style="margin-top: -1px"
                                        variant="outlined"
                                        type="number"
                                        inputmode="numeric"
                                        density="compact"
                                        placeholder="0"
                                        v-model="item.price"
                                      ></v-text-field>
                                    </div>
                                  </v-col>
                                  <v-col cols="3">
                                    <v-label class="text-black text-body-2 mb-2"
                                      >Web Rate</v-label
                                    >
                                    <div
                                      class="d-flex align-content-center p-0 w-100"
                                      style="
                                        height: 35px;
                                        overflow-y: hidden;
                                        border-radius: 5px;
                                        border: 1px grey solid;
                                      "
                                    >
                                      <div
                                        class="d-flex justify-center align-center w-33"
                                        style="background: #e9ecef"
                                      >
                                        <h4 style="color: #077cff">
                                          {{ selectedCurrency }}
                                        </h4>
                                      </div>
                                      <v-text-field
                                        class="w-66"
                                        style="margin-top: -1px"
                                        variant="outlined"
                                        type="number"
                                        inputmode="numeric"
                                        density="compact"
                                        placeholder="0"
                                        v-model="item.price"
                                      ></v-text-field>
                                    </div>
                                  </v-col>
                                  <v-col cols="2">
                                    <v-label class="text-black text-body-2 mb-2"
                                      >Active</v-label
                                    >
                                    <v-btn-toggle
                                      style="
                                        font-size: 10px !important;
                                        font-weight: 200 !important;
                                        height: 35px !important;
                                        width: 54px !important;
                                      "
                                      class="d-flex align-center"
                                      v-model="item.isActive"
                                      :disabled="isSending2"
                                      rounded="5"
                                      @click="activePrice(item.id)"
                                    >
                                      <v-btn size="27" :value="true">
                                        Yes
                                      </v-btn>

                                      <v-btn size="27" :value="false">
                                        No
                                      </v-btn>
                                    </v-btn-toggle>
                                  </v-col>
                                </v-row>
                              </v-col>
                            </v-row>
                          </td>
                        </tr>
                      </v-table>
                    </div>
                  </td>
                </tr>
              </template>
              <tr v-if="isLoading">
                <td :colspan="7" class="text-center">
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
        <v-card-text> Are you sure want to delete this price? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelDelete">No</v-btn>
          <v-btn color="success" text @click="deletePrice">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent width="400" v-model="isSuccessEmail">
      <v-card class="py-8 px-4">
        <v-card-title class="text-center"
          >Email has been successfully sent</v-card-title
        >
        <v-card-actions class="d-flex justify-center mt-8">
          <v-btn class="w-100 bg-primary" text @click="closeSuccessEmail"
            >OK</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent width="auto" v-model="isOpenImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4">
          Upload Image - Price</v-card-title
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

export default {
  name: 'PriceMaster',
  data: () => ({
    // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    selectedApp: 3,
    selectedCity: 1,
    selectedCurrency: 'S$',
    valid: false,
    requestCount: 0,
    isLoading: false,
    isSending: false,
    isSendTemplate: false,
    isSuccess: false,
    isSuccessEmail: false,
    isError: false,
    isDelete: false,
    isDeleteLoading: false,
    priceIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    imageFile: [],
    priceDataToImage: {
      id: 0,
      app: null,
      city: null,
      product: null,
      range: null,
      price: null,
    },
    isOpenImage: false,
    successMessage: '',
    errorMessage: '',
    input: {
      id: 0,
      product: null,
      price: null,
    },
    resource: {
      country: [],
      code: [],
      skills: [],
      app: [],
      emails: [],
      gender: [
        {
          name: 'Male',
          value: 'M',
        },
        {
          name: 'Female',
          value: 'F',
        },
      ],
    },
    rules: {
      nameRules: [
        (value) => {
          if (value) return true;
          return 'Name is requred.';
        },
      ],
      emailRules: [
        (value) => {
          if (/.+@.+\..+/.test(value) || value == null || value == '')
            return true;
          return 'E-mail must be valid.';
        },
      ],
      countryRules: [
        (value) => {
          if (value) return true;
          return 'Country is requred.';
        },
      ],
      roleRules: [
        (value) => {
          if (value) return true;
          return 'Role is requred.';
        },
      ],
    },
    search: '',
    items: [],
    cities: [],
    products: [],
    debounceTimer: null,
  }),
  watch: {
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
    this.getProductRanges();
    this.getCityByApp(this.selectedApp);
    setTimeout(() => {
      this.getItemsData(this.selectedCity);
    }, 500);
  },
  methods: {
    changeSelectedApp(index) {
      this.selectedApp = index;

      this.getCityByApp(index);
    },
    changeSelectedCity(index, currency) {
      this.selectedCity = index;
      this.selectedCurrency = currency;

      this.getItemsData(index);
    },
    updateImageFile(newImageFile) {
      this.imageFile.push(newImageFile);
    },
    deleteImageFile() {
      this.isSending = true;
      axios
        .delete(`/invites/${this.priceDataToImage.id}/image`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getItemsData(this.selectedCity);
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

          this.imageFile = [];
        });
    },
    openImage(item) {
      this.isOpenImage = true;
      this.priceDataToImage = {
        id: item.price_id,
        app: item.app_id,
        city: item.city_id,
        product: item.product_id,
        range: item.range_id,
        price: item.range,
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
      this.priceDataToImage = {
        id: 0,
        app: null,
        city: null,
        product: null,
        range: null,
        price: null,
      };
    },
    saveImage() {
      this.isSending = true;
      const payload = {
        price_id: this.priceDataToImage.id,
        app_id: this.priceDataToImage.app,
        city_id: this.priceDataToImage.city,
        product_id: this.priceDataToImage.product,
        range_id: this.priceDataToImage.range,
        price: this.priceDataToImage.price,
        image: this.imageFile[0],
      };

      http
        .post(`/invites/update`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getItemsData(this.selectedCity);
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
          this.priceDataToImage = {
            id: 0,
            app: null,
            city: null,
            product: null,
            range: null,
            price: null,
          };
          this.isOpenImage = false;
          this.imageFile = [];
        });
    },
    debouncedUpdate(id, value) {
      // Hapus timer sebelumnya jika ada
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }

      // Set debounce baru
      this.debounceTimer = setTimeout(() => {
        this.updateData(id, value);
      }, 800);
    },
    updateData(id, val) {
      const payload = {
        price_id: id,
        rate: val,
      };

      axios
        .post(`/price-list/update`, payload)
        .then((response) => {
          this.successMessage = response.data.message;
          this.isSuccess = true;
        })
        .catch((error) => {
          console.error(error);
          this.errorMessage =
            error.response?.data?.message || 'Something Wrong!!!';
          this.isError = true;
        });
    },
    saveData() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          app_id: this.selectedApp,
          city_id: this.selectedCity,
          product_id: this.input.product.productId,
          range_id: this.input.product.rangeId,
          rate: this.input.price,
        };
        axios
          .post(`/price-list`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getItemsData(this.selectedCity);
            this.input = {
              id: 0,
              product: null,
              price: null,
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
      this.priceIdToDelete = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.priceIdToDelete = itemId;
      this.isDelete = true;
    },
    cancelConfirmation() {
      this.priceIdToDelete = null;
      this.isDelete = false;
    },
    deletePrice() {
      this.isDeleteLoading = true;
      axios
        .delete(`/price-list/${this.priceIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getItemsData(this.selectedCity);
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
          this.priceIdToDelete = null;
          this.isDelete = false;
        });
    },
    sendEmail(item) {
      item.loading = true;
      const payload = {
        invite_id: item.invite_id,
        template_id: item.template,
      };
      console.log(payload);
      axios
        .post(`/invites/send-mail`, payload)
        .then((response) => {
          const data = response.data;
          console.log(data);
          item.template = null;
          this.isSuccessEmail = true;
          this.getItemsData(this.selectedCity);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message = error.response.data.invite_id
            ? error.response.data.invite_id[0]
            : error.response.data.message === ''
            ? 'Something Wrong!!!'
            : error.response.data.message;
          this.errorMessage = message;
          this.isError = true;
        })
        .finally(() => {
          item.loading = false;
        });
    },
    closeSuccessEmail() {
      this.isSuccessEmail = false;
      // this.getItemsData();
    },
    async getItemsData() {
      this.isLoading = true;
      this.requestCount = 0; // Reset request count
      try {
        let items = await this.getPriceData();
        this.items = items.sort((a, b) => b.price_id - a.price_id);
        this.requestCount++;

        items = await Promise.all(
          items.map(async (item) => {
            //const priceListItems = await this.getPriceListById(item.price_id);
            this.requestCount++;
            return {
              ...item,
              //priceListItems: priceListItems,
              priceListItems: [
                {
                  sent_on: '27/01/2025',
                  template_id: 1,
                  email_subject: 'Resume Request - Physiotherapist Jobs',
                  email_id: 'charlton@the-syringe.com',
                  app_id: 5,
                  app_name: 'The Syringe',
                  invite_id: 246,
                  user_id: 1,
                  name: 'Charlton',
                  dated: '27/01/2025',
                },
                {
                  sent_on: '27/01/2025',
                  template_id: 1,
                  email_subject: 'Resume Request - Physiotherapist Jobs',
                  email_id: 'charlton@the-syringe.com',
                  app_id: 5,
                  app_name: 'The Syringe',
                  invite_id: 246,
                  user_id: 1,
                  name: 'Charlton',
                  dated: '27/01/2025',
                },
              ],
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

    async getPriceData() {
      this.isLoading = true;
      try {
        const response = await axios.get(`/price-list`);
        const data = response.data.data;
        return data.map((item) => {
          return {
            ...item,
            id: item.price_id || 0,
            isActive:
              item.active == 'N' ? false : item.active == 'Y' ? true : null,
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
    async getPriceListById(id) {
      //this.isLoading = true;
      try {
        const response = await axios.get(`/price-list/${id}`);
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
    getCityByApp(app) {
      axios
        .get(`/app-cities/get-cities-by-app-id/${app}`)
        .then((response) => {
          const data = response?.data?.data;
          this.cities = data;
          if (data) {
            this.selectedCity = data[0]?.city_id;
            this.selectedCurrency = data[0]?.currency_symbol;
            this.getItemsData(data[0]?.city_id);
          }
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
    //getProductRanges() {
    //  axios
    //    .get(`/products/products-with-ranges`)
    //    .then((response) => {
    //      const data = response.data.data;
    //
    //      this.products = data.map((product) => {
    //        // Ambil semua quantity_name dari ranges
    //        const rangeNames = product.ranges
    //          .map((range) => range.quantity.quantity_name)
    //          .join(' | ');
    //
    //        return {
    //          ...product,
    //          id: product.product_id,
    //          name: rangeNames
    //            ? `${product.product_name} | ${rangeNames}`
    //            : product.product_name,
    //        };
    //      });
    //    })
    //    .catch((error) => {
    //      console.log(error);
    //      const message =
    //        error.response.data.message === ''
    //          ? 'Something Wrong!!!'
    //          : error.response.data.message;
    //      this.errorMessage = message;
    //      this.isError = true;
    //    });
    //},
    getProductRanges() {
      axios
        .get(`/products/products-with-ranges`)
        .then((response) => {
          const data = response.data.data;

          this.products = data.flatMap((product) =>
            product.ranges.map((range) => {
              return {
                ...product,
                id: product.product_id,
                productId: product.product_id,
                rangeId: range.range_id,
                name: `${product.product_name} | ${range.quantity.quantity_name}`,
              };
            })
          );

          console.log(this.products);
        })
        .catch((error) => {
          console.log(error);
          const message = error.response?.data?.message || 'Something Wrong!!!';
          this.errorMessage = message;
          this.isError = true;
        });
    },
    activePrice(id) {
      this.isSending2 = true;
      axios
        .get(`/price-list/toggle-active/${id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getItemsData(this.selectedCity);
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
  color: rgb(100, 100, 100) !important;
}

.country-table-body {
  margin-top: 50px !important;
  margin-bottom: 50px !important;
}

.country-table-body td {
  border-bottom: none !important;
}

.upload-title {
  background-color: #9ddcff;
  color: white;
}

.v-simple-table {
  background: red !important;
}

.has-border {
  border-bottom: 1px solid rgb(188, 188, 188) !important;
}

.not-border {
  border-bottom: none !important;
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
