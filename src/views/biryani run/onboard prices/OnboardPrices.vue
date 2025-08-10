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
                  <td style="border-bottom: none !important">
                    {{ item.brp_id }}
                  </td>
                  <td style="border-bottom: none !important">
                    <div class="image-upload-cont">
                      <v-img
                        class="image-upload-item"
                        height="40"
                        :src="
                          item?.dish?.main_image != null
                            ? $fileURL + item.dish.main_image
                            : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                        "
                      >
                        <template #placeholder>
                          <div class="skeleton" /> </template
                      ></v-img>
                    </div>
                  </td>
                  <td
                    style="
                      font-weight: 500 !important;
                      border-bottom: none !important;
                    "
                  >
                    {{ item?.dish?.dish_name }}
                  </td>
                  <td
                    style="
                      font-weight: 500 !important;
                      border-bottom: none !important;
                      max-width: 300px;
                    "
                  >
                    {{ item?.restaurant?.partner?.partner_name }}
                  </td>
                  <td
                    style="
                      font-weight: 500 !important;
                      border-bottom: none !important;
                      max-width: 300px;
                    "
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
                  </td>
                  <td
                    style="
                      font-weight: 500 !important;
                      border-bottom: none !important;
                    "
                  >
                    {{ item.userName }}
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
                  <td></td>
                  <td colspan="2">
                    <v-text-field
                      density="compact"
                      v-model="item.actual_dish_name"
                      @input="
                        debouncedUpdate(
                          item.brp_id,
                          item.actual_dish_name,
                          'actual'
                        )
                      "
                      placeholder="Actual Dish Name"
                      variant="outlined"
                      hide-details
                    ></v-text-field>
                  </td>
                  <td colspan="5"></td>
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
          Are you sure want to delete this onboard price?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelDelete">No</v-btn>
          <v-btn color="success" text @click="deleteOnboardPrices">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent width="auto" v-model="isOpenMainImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4">
          Upload Main Image - Onboard Prices</v-card-title
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
  </v-container>
</template>

<script>
import ImageUpload from '@/components/ImageUpload.vue';
import axios from '@/util/axios';
import { setAuthHeader } from '@/util/axios';
// import app from '@/util/eventBus';

export default {
  name: 'OnboardPrices',

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
    onboardPricesIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    mainImageFile: [],
    onboardPricesDataToMainImage: {
      brp_id: 0,
      category_name: null,
      description: null,
    },
    isOpenMainImage: false,
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
            .sort((a, b) => a.obd_id < b.obd_id)
            .map((cat) => {
              return {
                id: cat.obd_id || 0,
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
