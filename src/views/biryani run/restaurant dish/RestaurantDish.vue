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
        <v-row>
          <v-col cols="12" md="4">
            <v-select
              v-model="input.restaurant_id"
              :rules="rules.restaurantRules"
              label="Restaurant Name"
              variant="outlined"
              density="compact"
              required
              :items="resource.restaurant"
              item-title="restaurant_name"
              item-value="restaurant_id"
            ></v-select>
          </v-col>
        </v-row>
        <v-row class="d-flex align-baseline mt-n4">
          <v-col cols="12" md="4">
            <v-select
              v-model="input.dish_id"
              :rules="rules.dishRules"
              label="Dish Name"
              variant="outlined"
              density="compact"
              :items="resource.dish"
              item-title="dish_name"
              item-value="dish_id"
              required
            ></v-select>
          </v-col>
          
          <v-col cols="12" md="2">
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
                <th class="text-left">Main Image</th>
                <th class="text-left">Restaurant Name</th>
                <th class="text-left">Dish Name</th>
                <th class="text-left">Price</th>
                <th class="text-left">User</th>
                <th class="text-left">Dated</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in filteredItems" :key="item.brd_id">
                <tr>
                  <td style="border-bottom: none !important;">{{ item.brd_id }}</td>
                  
                  <td style="border-bottom: none !important;">
                    <div class="image-upload-cont">
                      <v-img
                        class="image-upload-item"
                        height="40"
                        @click="openMainImage(item)"
                        style="cursor: pointer"
                        :src="
                          item.main_image != null
                            ? $fileURL + item.main_image
                            : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                        "
                      >
                        <template #placeholder>
                          <div class="skeleton" /> </template
                      ></v-img>
                    </div>
                  </td>
                  <td style="font-weight: 500 !important;border-bottom: none !important;">
                    {{ item.restaurant.partner?.partner_name }}
                  </td>
                  
                  <td style="font-weight: 500 !important;border-bottom: none !important;">
                    {{ item.dish?.dish_name }}
                  </td>
                  <td style="font-weight: 500 !important;border-bottom: none !important;">
                    <v-text-field
                      v-model="item.price"
                      placeholder="Price"
                      variant="outlined"
                      density="compact"
                      type="number"
                      class="mt-5"
                      :prefix="item.restaurant?.country?.currency_symbol"
                      @change="savePrice(item.price, item)"
                    >
                    </v-text-field>
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
                            @click="editRestaurantDish(item)"
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
                            @click="openDeleteConfirm(item.brd_id)"
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
          Are you sure want to delete this property type?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelDelete">No</v-btn>
          <v-btn color="success" text @click="deleteRestaurantDish">Yes</v-btn>
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
    mainImageFile: [],
    longImageFile: [],
    iconImageFile: [],
    countries: [],
    propertyDataToMainImage: {
      brd_id: 0,
      restaurant_id: null,
      dish_id: null,
    },
    isOpenMainImage: false,
    isOpenLongImage: false,
    isOpenIconImage: false,
    successMessage: '',
    errorMessage: '',
    input: {
      brd_id: 0,
      restaurant_id: null,
      dish_id: null,
    },
    resource: {
      restaurant: [],
      dish: [],
      country: [],
      city: [],
    },
    rules: {
      restaurantRules : [
        (value) => {
          if (value) return true;
            return 'Restaurant is required.';
        },
      ],
      dishRules: [
        (value) => {
          if (value) return true;
          return 'Dish is required.';
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
    this.getRestaurantMasterData();
    this.getRestaurantDishData();
    this.getDishMasterData();
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
    updateMainImageFile(newImageFile) {
      this.mainImageFile.push(newImageFile);
    },
    deleteMainImageFile() {
      this.isSending = true;
      axios
        .delete(
          `/biryani-restaurant-dishes/${this.propertyDataToMainImage.brd_id}/main-image`
        )
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getRestaurantDishData();
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
    openMainImage(prop) {
      this.isOpenMainImage = true;
      this.propertyDataToMainImage = {
        brd_id: prop.brd_id,
        restaurant_id: prop.restaurant_id,
        dish_id: prop.dish_id,
      };
      this.mainImageFile =
        prop.main_image != null
          ? [
              {
                file: {
                  name: prop.main_image,
                  size: '',
                  base64: '',
                  format: '',
                },
              },
            ]
          : [];
    },
    closeMainImage() {
      this.isOpenMainImage = false;
      this.mainImageFile = [];
      this.propertyDataToMainImage = {
        dish_id: 0,
        dish_name: null,
        origin_country: null,
      };
    },
    saveMainImage() {
      this.isSending = true;
      const payload = {
        brd_id: this.propertyDataToMainImage.brd_id,
        dish_id: this.propertyDataToMainImage.dish_id,
        restaurant_id: this.propertyDataToMainImage.restaurant_id,
        main_image: this.mainImageFile[0],
      };
      axios
        .post(`/biryani-restaurant-dishes/update`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getRestaurantDishData();
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
          this.propertyDataToMainImage = {
            dish_id: 0,
            dish_name: null,
            origin_country: null,
          };
          this.isOpenMainImage = false;
          this.mainImageFile = [];
        });
    },
    editRestaurantDish(prop) {
      this.isEdit = true;
      this.input = {
        brd_id: prop.brd_id,
        restaurant_id: prop.restaurant_id,
        dish_id: prop.dish_id,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        brd_id: 0,
        restaurant_id: null,
        dish_id: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          brd_id: this.input.brd_id,
          restaurant_id: this.input.restaurant_id,
          dish_id: this.input.dish_id,
        };
        axios
          .post(`/biryani-restaurant-dishes/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getRestaurantDishData();
            this.input = {
              brd_id: 0,
              restaurant_id: null,
              dish_id: null,
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
          restaurant_id: this.input.restaurant_id,
          dish_id: this.input.dish_id,
        };
        axios
          .post(`/biryani-restaurant-dishes`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getRestaurantDishData();
            this.input = {
              brd_id: 0,
              restaurant_id: null,
              dish_id: null,
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
    deleteRestaurantDish() {
      this.isDeleteLoading = true;
      axios
        .delete(`/biryani-restaurant-dishes/${this.propertyIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getRestaurantDishData();
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
    getRestaurantMasterData() {
      axios
        .get(`/biryani-restaurant-masters`)
        .then((response) => {
          const data = response.data.data;
          this.resource.restaurant = data.map((item) => {
            console.log(item);
            return {
              restaurant_id: item.restaurant_id || 1,
              restaurant_name: item.partner.partner_name || ''
            };
          });
        });
    },
    getRestaurantDishData() {
      axios
        .get(`/biryani-restaurant-dishes`)
        .then((response) => {
          const data = response.data.data;
          this.items = data;
        });
    },
    getDishMasterData() {
      this.isLoading = true;
      axios
        .get(`/biryani-dish-masters`)
        .then((response) => {
          const data = response.data.data;
          this.resource.dish = data.map((item) => {
            console.log(item);
            return {
              dish_id: item.dish_id || 1,
              dish_name: item.dish_name || ''
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
    savePrice(price, item) {
      this.isSending2 = true;
      const payload = {
        brd_id: item.brd_id,
        restaurant_id: item.restaurant_id,
        dish_id: item.dish_id,
        price: price,
      };
      axios
        .post(`/biryani-restaurant-dishes/update`, payload)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getRestaurantDishData();
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

    activeRestaurantDish(brd_id) {
      this.isSending2 = true;
      axios
        .get(`/biryani-restaurant-dishes/toggle-active/${brd_id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getRestaurantDishData();
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
    featuredRestaurantDish(brd_id) {
      this.isSending2 = true;
      axios
        .get(`/biryani-restaurant-dishes/toggle-featured/${brd_id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getRestaurantDishData();
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
