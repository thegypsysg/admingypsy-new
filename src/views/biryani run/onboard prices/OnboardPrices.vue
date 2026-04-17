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
          to="/biryani-home/onboard-dishes"
        >
          <h4>On-Board Dishes</h4>
        </router-link>
      </div>
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/biryani-home/onboard-tags"
        >
          <h4>On-Board Tags</h4>
        </router-link>
      </div>
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/biryani-home/onboard-prices"
        >
          <h4>On-Board Biryani Prices</h4>
        </router-link>
      </div>
    </div>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-autocomplete
              density="compact"
              label="Restaurant Name"
              variant="outlined"
              required
              v-model="input.restaurant_id"
              :items="resource.restaurantName"
              item-title="name"
              item-value="id"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              density="compact"
              label="Dish Name"
              variant="outlined"
              required
              v-model="input.dish_id"
              :items="resource.dishName"
              item-title="name"
              item-value="id"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row class="d-flex align-baseline">
          <v-col cols="12" md="2">
            <v-btn
              :prepend-icon="
                isEdit
                  ? 'mdi-account-multiple-check'
                  : 'mdi-account-multiple-plus'
              "
              color="indigo-accent-2"
              style="text-transform: none; margin-top: -30px !important"
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
          <v-col cols="12" md="2">
            <v-btn
              v-if="isEdit"
              prepend-icon="mdi-account-multiple-remove"
              color="red"
              style="text-transform: none; margin-top: -30px !important"
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
                <th class="text-left">Main Image</th>
                <th class="text-left">Dish Name</th>
                <th class="text-left">Restaurant Name</th>
                <th class="text-left">Rate</th>
                <th class="text-left">User</th>
                <th class="text-left">Dated</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in filteredItems" :key="item.brp_id">
                <tr>
                  <td class="border-b-0 pt-3">
                    {{ item.brp_id }}
                  </td>
                  <td class="border-b-0 pt-3">
                    <div class="image-upload-cont">
                      <v-img
                        class="image-upload-item"
                        height="40"
                        @click="openImage(item)"
                        style="cursor: pointer"
                        :src="
                          item?.dish_image != null
                            ? $fileURL + item.dish_image
                            : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                        "
                      >
                        <template #placeholder>
                          <div class="skeleton" /> </template
                      ></v-img>
                    </div>
                  </td>
                  <td class="border-b-0 font-weight-bold pt-3">
                    {{ item?.dish?.dish_name }}
                  </td>
                  <td
                    style="max-width: 300px"
                    class="border-b-0 font-weight-bold pt-3"
                  >
                    {{ item?.restaurant?.partner?.partner_name }}
                  </td>
                  <td
                    style="max-width: 300px"
                    class="border-b-0 font-weight-bold pt-3"
                  >
                    <div
                      class="d-flex align-content-center p-0 w-66"
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
                        <h4 style="color: #077cff">S$</h4>
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
                        @input="debouncedUpdate(item.brp_id, item.rate, 'rate')"
                      ></v-text-field>
                    </div>
                    <div class="w-33"></div>
                  </td>
                  <td class="border-b-0 font-weight-bold pt-3">
                    {{ item.userName }}
                  </td>
                  <td class="border-b-0 font-weight-bold pt-3">
                    {{ item.dated }}
                  </td>
                  <td class="border-b-0 pt-3">
                    <div class="d-flex">
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            color="green"
                            variant="text"
                            v-bind="props"
                            @click="editOnboardPrices(item)"
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
                            @click="openDeleteConfirm(item.brp_id)"
                            icon="mdi-trash-can-outline"
                          ></v-btn>
                        </template>
                        <span>Delete</span>
                      </v-tooltip>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="border-b-0"></td>
                  <td colspan="2" class="border-b-0">
                    <v-text-field
                      density="compact"
                      v-model="item.actual_dish_name"
                      @input="
                        debouncedUpdate(
                          item.brp_id,
                          item.actual_dish_name,
                          'actual',
                        )
                      "
                      placeholder="Actual Dish Name"
                      variant="outlined"
                      hide-details
                    ></v-text-field>
                  </td>
                  <td class="border-b-0" colspan="2">
                    <div class="pt-2 pb-4 d-flex ga-4">
                      <div
                        style="font-size: 12px; font-weight: 600"
                        class="ml-8"
                      >
                        <p>Active</p>

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
                          @click="togglePrice(item.brp_id, 'active')"
                          rounded="5"
                        >
                          <v-btn size="27" :value="true"> Yes </v-btn>

                          <v-btn size="27" :value="false"> No </v-btn>
                        </v-btn-toggle>
                      </div>

                      <div
                        style="font-size: 12px; font-weight: 600"
                        class="ml-8"
                      >
                        <p>Live</p>
                        <v-btn-toggle
                          style="
                            font-size: 10px !important;
                            font-weight: 200 !important;
                            height: 22px !important;
                            width: 54px !important;
                          "
                          class="d-flex align-center"
                          v-model="item.isLive"
                          :disabled="isSending2"
                          @click="togglePrice(item.brp_id, 'live')"
                          rounded="5"
                        >
                          <v-btn size="27" :value="true"> Yes </v-btn>

                          <v-btn size="27" :value="false"> No </v-btn>
                        </v-btn-toggle>
                      </div>

                      <div
                        style="font-size: 12px; font-weight: 600"
                        class="ml-8"
                      >
                        <p>Featured</p>
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
                          @click="togglePrice(item.brp_id, 'featured')"
                          rounded="5"
                        >
                          <v-btn size="27" :value="true"> Yes </v-btn>

                          <v-btn size="27" :value="false"> No </v-btn>
                        </v-btn-toggle>
                      </div>

                      <div
                        style="font-size: 12px; font-weight: 600"
                        class="ml-8"
                      >
                        <p>Platinum</p>
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
                          @click="togglePrice(item.brp_id, 'platinum')"
                          rounded="5"
                        >
                          <v-btn size="27" :value="true"> Yes </v-btn>

                          <v-btn size="27" :value="false"> No </v-btn>
                        </v-btn-toggle>
                      </div>

                      <div
                        style="font-size: 12px; font-weight: 600"
                        class="ml-8"
                      >
                        <p>Privileged</p>
                        <v-btn-toggle
                          style="
                            font-size: 10px !important;
                            font-weight: 200 !important;
                            height: 22px !important;
                            width: 54px !important;
                          "
                          class="d-flex align-center"
                          v-model="item.isPrivileged"
                          :disabled="isSending2"
                          @click="togglePrice(item.brp_id, 'privileged')"
                          rounded="5"
                        >
                          <v-btn size="27" :value="true"> Yes </v-btn>

                          <v-btn size="27" :value="false"> No </v-btn>
                        </v-btn-toggle>
                      </div>
                    </div>
                  </td>
                  <td class="border-b-0" colspan="1"></td>
                </tr>
                <tr>
                  <td
                    class="pb-3"
                    :class="
                      item.biryani_run_price2.length > 0
                        ? 'border-b-0'
                        : 'border-b-sm'
                    "
                  ></td>
                  <td
                    class="pb-3"
                    :class="
                      item.biryani_run_price2.length > 0
                        ? 'border-b-0'
                        : 'border-b-sm'
                    "
                    colspan="2"
                  >
                    <v-textarea
                      density="compact"
                      v-model="item.dish_description"
                      @input="
                        debouncedUpdate(
                          item.brp_id,
                          item.dish_description,
                          'dish_description',
                        )
                      "
                      placeholder="Dish Description details"
                      variant="outlined"
                      hide-details
                      rows="4"
                    ></v-textarea>
                  </td>
                  <td
                    class="pb-3"
                    :class="
                      item.biryani_run_price2.length > 0
                        ? 'border-b-0'
                        : 'border-b-sm'
                    "
                    colspan="2"
                  >
                    <div class="d-flex">
                      <div class="w-66 pr-4">
                        <v-autocomplete
                          density="compact"
                          label="Quantity"
                          variant="outlined"
                          required
                          v-model="item.pq_id"
                          :items="resource.quantity"
                          item-title="name"
                          item-value="id"
                          @update:modelValue="updateQuantity(item)"
                        ></v-autocomplete>
                        <v-textarea
                          density="compact"
                          v-model="item.pq_description"
                          placeholder="Item Description"
                          variant="outlined"
                          hide-details
                          rows="2"
                          @input="
                            debouncedUpdate(
                              item.brp_id,
                              item.pq_description,
                              'pq_description',
                            )
                          "
                        ></v-textarea>
                      </div>
                      <div class="w-33 d-flex justify-space-between">
                        <div
                          style="font-size: 12px; font-weight: 600"
                          class="ml-1"
                        >
                          <p>Veg</p>
                          <v-btn-toggle
                            style="
                              font-size: 10px !important;
                              font-weight: 200 !important;
                              height: 22px !important;
                              width: 54px !important;
                            "
                            class="d-flex align-center"
                            v-model="item.isVeg"
                            :disabled="isSending3"
                            @click="toggleField(item.brp_id, 'veg')"
                            rounded="5"
                          >
                            <v-btn size="27" :value="true"> Yes </v-btn>

                            <v-btn size="27" :value="false"> No </v-btn>
                          </v-btn-toggle>
                          <router-link
                            :to="`/biryani-home/onboard-prices/pax-kgs/${item.brp_id}`"
                            class="text-decoration-none"
                          >
                            <p
                              class="font-weight-black text-blue-accent-4 mt-16"
                            >
                              Add Pax / Kgs
                            </p>
                          </router-link>
                        </div>
                        <div
                          style="font-size: 12px; font-weight: 600"
                          class="ml-1"
                        >
                          <p>Non Veg</p>
                          <v-btn-toggle
                            style="
                              font-size: 10px !important;
                              font-weight: 200 !important;
                              height: 22px !important;
                              width: 54px !important;
                            "
                            class="d-flex align-center"
                            v-model="item.isNonVeg"
                            :disabled="isSending3"
                            @click="toggleField(item.brp_id, 'non-veg')"
                            rounded="5"
                          >
                            <v-btn size="27" :value="true"> Yes </v-btn>

                            <v-btn size="27" :value="false"> No </v-btn>
                          </v-btn-toggle>
                          <p class="font-weight-black text-red-accent-4 mt-16">
                            Tags
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="d-flex flex-row justify-start pb-3 border-b-0">
                    <div style="font-size: 12px; font-weight: 600" class="ml-2">
                      <p>Halal</p>
                      <v-btn-toggle
                        style="
                          font-size: 10px !important;
                          font-weight: 200 !important;
                          height: 22px !important;
                          width: 54px !important;
                        "
                        class="d-flex align-center"
                        v-model="item.isHalal"
                        :disabled="isSending3"
                        @click="toggleField(item.brp_id, 'halal')"
                        rounded="5"
                      >
                        <v-btn size="27" :value="true"> Yes </v-btn>

                        <v-btn size="27" :value="false"> No </v-btn>
                      </v-btn-toggle>
                    </div>
                  </td>
                </tr>
                <template
                  v-for="(data, index) in item.biryani_run_price2"
                  :key="data.brp_id_2"
                >
                  <tr>
                    <td
                      class="pb-3"
                      :class="
                        index == item.biryani_run_price2.length - 1
                          ? 'border-b-sm'
                          : 'border-b-0'
                      "
                    ></td>
                    <td
                      class="pb-3"
                      :class="
                        index == item.biryani_run_price2.length - 1
                          ? 'border-b-sm'
                          : 'border-b-0'
                      "
                    >
                      <div class="image-upload-cont mt-2 mb-2">
                        <v-img
                          class="image-upload-item"
                          height="40"
                          :src="
                            data?.dish_image != null
                              ? $fileURL + data.dish_image
                              : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                          "
                        >
                          <template #placeholder>
                            <div class="skeleton" />
                          </template>
                        </v-img>
                      </div>
                    </td>
                    <td
                      class="font-weight-bold pb-3"
                      :class="
                        index == item.biryani_run_price2.length - 1
                          ? 'border-b-sm'
                          : 'border-b-0'
                      "
                    >
                      {{ data?.product_quantity?.quantity_name || '-' }}
                    </td>
                    <td
                      class="font-weight-bold pb-3"
                      :class="
                        index == item.biryani_run_price2.length - 1
                          ? 'border-b-sm'
                          : 'border-b-0'
                      "
                    >
                      S$ {{ data?.rate || '-' }}
                    </td>
                    <td
                      class="pb-3"
                      :class="
                        index == item.biryani_run_price2.length - 1
                          ? 'border-b-sm'
                          : 'border-b-0'
                      "
                      colspan="4"
                    ></td>
                  </tr>
                </template>
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
          Are you sure want to delete this onboard price?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelDelete">No</v-btn>
          <v-btn color="success" text @click="deleteOnboardPrices">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent width="auto" v-model="isOpenImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4">
          Upload Image - Onboard Prices</v-card-title
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
  name: 'OnboardPrices',

  data: () => ({
    //fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    valid: false,
    isLoading: false,
    isSending: false,
    isSending2: false,
    isSending3: false,
    isEdit: false,
    isSuccess: false,
    isError: false,
    isDelete: false,
    isDeleteLoading: false,
    isOpenImage: false,
    onboardPricesIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    imageFile: [],
    onboardPricesDataToImage: {
      brp_id: 0,
    },
    successMessage: '',
    errorMessage: '',
    input: {
      brp_id: 0,
      dish_id: null,
      restaurant_id: null,
    },
    resource: {
      restaurantName: [],
      dishName: [],
      quantity: [],
    },
    search: '',
    items: [],
    debounceTimer: null,
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.getOnboardPricesData();
    this.getRestaurants();
    this.getDishMasters();
    this.getQuantityData();
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.items;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.items.filter((item) => {
        const dishName = item.dishName?.toLowerCase() || '';
        const restaurantName = item.restaurantName?.toLowerCase() || '';
        const actualDishName = item.actual_dish_name?.toLowerCase() || '';
        const userName = item.userName?.toLowerCase() || '';
        return (
          dishName.includes(searchTextLower) ||
          restaurantName.includes(searchTextLower) ||
          actualDishName.includes(searchTextLower) ||
          userName.includes(searchTextLower)
        );
      });
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
          `/biryani-run-prices/${this.onboardPricesDataToImage.brp_id}/image`,
        )
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getOnboardPricesData();
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
      console.log(item);
      this.isOpenImage = true;
      this.onboardPricesDataToImage = {
        brp_id: item.brp_id,
      };
      this.imageFile =
        item?.dish_image != null
          ? [
              {
                file: {
                  name: item.dish_image,
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
      this.onboardPricesDataToImage = {
        brp_id: 0,
      };
    },
    saveImage() {
      this.isSending = true;
      const payload = {
        brp_id: this.onboardPricesDataToImage.brp_id,
        dish_image: this.imageFile[0],
      };
      http
        .post(`/biryani-run-prices/update`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getOnboardPricesData();
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
          this.onboardPricesDataToImage = {
            brp_id: 0,
          };
          this.isOpenImage = false;
          this.imageFile = [];
        });
    },
    editOnboardPrices(prop) {
      this.isEdit = true;

      this.input = {
        brp_id: prop.brp_id,
        dish_id: prop.dish_id,
        restaurant_id: prop.restaurant_id,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        brp_id: 0,
        dish_id: null,
        restaurant_id: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          brp_id: this.input.brp_id,
          restaurant_id: this.input.restaurant_id,
          dish_id: this.input.dish_id,
        };
        axios
          .post(`/biryani-run-prices/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getOnboardPricesData();
            this.input = {
              brp_id: 0,
              dish_id: null,
              restaurant_id: null,
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
    debouncedUpdate(id, value, type) {
      // Hapus timer sebelumnya jika ada
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }

      // Set debounce baru
      this.debounceTimer = setTimeout(() => {
        this.updateData(id, value, type);
      }, 800);
    },
    updateData(id, val, type) {
      let payload = {};
      let url = '';
      if (type == 'rate') {
        url = 'biryani-run-prices/update-rate';
        payload = {
          brp_id: id,
          rate: val,
        };
      } else if (type == 'dish_description') {
        url = 'biryani-run-prices/update-dish-description';
        payload = {
          brp_id: id,
          dish_description: val,
        };
      } else if (type == 'pq_description') {
        url = 'biryani-run-prices/update-pq-description';
        payload = {
          brp_id: id,
          pq_description: val,
        };
      } else if (type == 'pax_kgs') {
        url = 'biryani-run-prices/update-pax-kgs';
        payload = {
          brp_id: id,
          pax_kgs: val,
        };
      } else {
        url = 'biryani-run-prices/update-actual-dish-name';
        payload = {
          brp_id: id,
          actual_dish_name: val,
        };
      }

      axios
        .post(url, payload)
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
          dish_id: this.input.dish_id,
          restaurant_id: this.input.restaurant_id,
        };
        axios
          .post(`/biryani-run-prices`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getOnboardPricesData();
            this.input = {
              brp_id: 0,
              dish_id: null,
              restaurant_id: null,
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
      this.onboardPricesIdToDelete = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.onboardPricesIdToDelete = itemId;
      this.isDelete = true;
    },
    deleteOnboardPrices() {
      this.isDeleteLoading = true;
      axios
        .delete(`/biryani-run-prices/${this.onboardPricesIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getOnboardPricesData();
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
          this.onboardPricesIdToDelete = null;
          this.isDelete = false;
        });
    },
    getOnboardPricesData() {
      this.isLoading = true;
      axios
        .get(`/biryani-run-prices`)
        .then((response) => {
          const data = response.data.data;
          this.items = data
            .sort((a, b) => b.brp_id - a.brp_id)
            .map((item) => {
              console.log(item);
              return {
                ...item,
                dishName: item?.dish?.dish_name || '',
                restaurantName: item?.restaurant?.partner?.partner_name || '',
                userName: item?.user?.name || '',
                isActive:
                  item.active == 'N' ? false : item.active == 'Y' ? true : null,
                isFeatured:
                  item.featured == 'N'
                    ? false
                    : item.featured == 'Y'
                    ? true
                    : null,
                isPlatinum:
                  item.platinum == 'N'
                    ? false
                    : item.platinum == 'Y'
                    ? true
                    : null,
                isPrivileged:
                  item.privileged == 'N'
                    ? false
                    : item.privileged == 'Y'
                    ? true
                    : null,
                isLive:
                  item.live == 'N' ? false : item.live == 'Y' ? true : null,
                isVeg: item.veg == 'N' ? false : item.veg == 'Y' ? true : null,
                isNonVeg:
                  item['non-veg'] == 'N'
                    ? false
                    : item['non-veg'] == 'Y'
                    ? true
                    : null,
                isHalal:
                  item.halal == 'N' ? false : item.halal == 'Y' ? true : null,
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
    getRestaurants() {
      axios
        .get(`/biryani-restaurant-masters`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.resource.restaurantName = data
            .sort((a, b) => a.restaurant_id < b.restaurant_id)
            .map((cat) => {
              return {
                id: cat.restaurant_id || 0,
                name: cat.partner?.partner_name || '',
              };
            });
          // console.log(this.items);
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
    getDishMasters() {
      axios
        .get(`/onboard-dishes`)
        .then((response) => {
          const data = response.data.data;
          //console.log(data);
          this.resource.dishName = data
            .sort((a, b) => a.dish_id < b.dish_id)
            .map((cat) => {
              return {
                id: cat.dish_id || 0,
                name: cat?.dish?.dish_name || '',
              };
            });
          // console.log(this.items);
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
    getQuantityData() {
      this.isLoading = true;
      axios
        .get(`/product-quantities`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.resource.quantity = data.map((item) => {
            return {
              id: item.pq_id || 1,
              name: item.quantity_name || '',
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
    updateQuantity(item) {
      const payload = {
        brp_id: item.brp_id,
        pq_id: item.pq_id,
      };
      axios
        .post(`/biryani-run-prices/update-product-quantity`, payload)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
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
    togglePrice(id, type) {
      this.isSending2 = true;
      axios
        .get(`/biryani-run-prices/toggle-field/${type}/${id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getOnboardPricesData();
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
    toggleField(id, type) {
      this.isSending3 = true;
      axios
        .get(`/biryani-run-prices/toggle-field/${type}/${id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getOnboardPricesData();
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
          this.isSending3 = false;
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
