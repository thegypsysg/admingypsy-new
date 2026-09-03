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
            <v-text-field
              v-model="input.dish_name"
              :rules="rules.nameRules"
              label="Dish Name"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="d-flex align-baseline mt-n4">
          <v-col cols="12" md="4">
            <v-select
              density="compact"
              v-model="input.origin_country"
              label="Country"
              variant="outlined"
              required
              :items="resource.country"
              item-title="name"
              item-value="id"
            ></v-select>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn
              :prepend-icon="isEdit ? 'mdi-account-multiple-check' : 'mdi-account-multiple-plus'"
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
          <v-col cols="12" md="1">
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
                <th class="text-left">Country Of Origin</th>
                <th class="text-left">User</th>
                <th class="text-left">Dated</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in filteredItems" :key="item.id">
                <tr>
                  <td style="border-bottom: none !important">{{ item.dish_id }}</td>

                  <td style="border-bottom: none !important">
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
                        loading="lazy"
                        lazy-src="data:image/svg+xml,%3Csvg xmlns%3D%22http%3A//www.w3.org/2000/svg%22 width%3D%221%22 height%3D%221%22%3E%3C/svg%3E"
                      >
                        <template #placeholder> <div class="skeleton" /> </template
                      ></v-img>
                    </div>
                  </td>
                  <td style="font-weight: 500 !important; border-bottom: none !important">
                    {{ item.dish_name }}
                  </td>
                  <td
                    style="
                      font-weight: 500 !important;
                      border-bottom: none !important;
                      max-width: 300px;
                    "
                  >
                    {{ item.country.country_name }}
                  </td>
                  <td style="font-weight: 500 !important; border-bottom: none !important">
                    {{ item.user.name }}
                  </td>
                  <td style="font-weight: 500 !important; border-bottom: none !important">
                    {{ item.dated }}
                  </td>
                  <td style="border-bottom: none !important">
                    <div class="d-flex">
                      <v-btn color="green" variant="text" @click="editDishMaster(item)" icon>
                        <v-icon>mdi-pencil-outline</v-icon>
                        <v-tooltip location="top" activator="parent">Edit</v-tooltip>
                      </v-btn>
                      <v-btn
                        color="red"
                        variant="text"
                        :disabled="isDeleteLoading"
                        @click="openDeleteConfirm(item.dish_id)"
                        icon
                      >
                        <v-icon>mdi-trash-can-outline</v-icon>
                        <v-tooltip location="top" activator="parent">Delete</v-tooltip>
                      </v-btn>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td colspan="2">
                    <v-textarea
                      class="mt-4"
                      v-model="item.dish_description"
                      label="Dish Description"
                      variant="outlined"
                      density="compact"
                      required
                      style="max-width: 500px"
                      rows="3"
                      @change="saveDescription(item.dish_description, item)"
                    ></v-textarea>
                  </td>
                  <td>
                    <v-select
                      v-model="item.origin_city"
                      label="City"
                      variant="outlined"
                      density="compact"
                      required
                      :items="filterCity(item.origin_country)"
                      item-title="city_name"
                      item-value="city_id"
                      @update:modelValue="saveCity(item.origin_city, item)"
                    ></v-select>
                  </td>
                  <td></td>
                  <td></td>
                </tr>
              </template>
            </tbody>
          </v-table>
          <skeleton-table v-if="isLoading" :rows="5" :columns="7" />
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
      @confirm="deleteDishMaster"
    />
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
          <v-btn style="text-transform: none" color="error" text @click="closeMainImage"
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
          <v-btn style="text-transform: none" color="error" text @click="closeLogo">Cancel</v-btn>
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
          <v-btn style="text-transform: none" color="error" text @click="closeIconImage"
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
import SkeletonTable from '@/components/SkeletonTable.vue';
import EmptyState from '@/components/EmptyState.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import { useNotificationStore } from '@/stores/notification';
import ImageUpload from '@/components/ImageUpload.vue';
import axios from '@/util/axios';
import { setAuthHeader } from '@/util/axios';
// import app from '@/util/eventBus';

export default {
  name: 'PropertyTypes',
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
    //fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    valid: false,
    isLoading: false,
    isSending: false,
    isEdit: false,
    isDelete: false,
    isDeleteLoading: false,
    propertyIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    mainImageFile: [],
    longImageFile: [],
    iconImageFile: [],
    countries: [],
    propertyDataToMainImage: {
      dish_id: 0,
      dish_name: null,
      origin_country: null,
    },
    isOpenMainImage: false,
    isOpenLongImage: false,
    isOpenIconImage: false,
    input: {
      dish_id: 0,
      dish_name: null,
      origin_country: null,
    },
    resource: {
      country: [],
      city: [],
    },
    rules: {
      nameRules: [
        (value) => {
          if (value) return true;
          return 'Dish name is required.';
        },
      ],
      countryRules: [
        (value) => {
          if (value) return true;
          return 'Country of origin is required.';
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
    this.getDishMasterData();
    this.getCountry();
    this.getCity();
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
        .delete(`/biryani-dish-masters/${this.propertyDataToMainImage.dish_id}/main-image`)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getDishMasterData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === '' ? 'Something Wrong!!!' : error.response.data.message;
          this.notification.error(message);
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
        dish_id: prop.dish_id,
        dish_name: prop.dish_name,
        origin_country: prop.origin_country,
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
        dish_id: this.propertyDataToMainImage.dish_id,
        dish_name: this.propertyDataToMainImage.dish_name,
        origin_country: this.propertyDataToMainImage.origin_country,
        main_image: this.mainImageFile[0],
      };
      axios
        .post(`/biryani-dish-masters/update`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getDishMasterData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === '' ? 'Something Wrong!!!' : error.response.data.message;
          this.notification.error(message);
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
    editDishMaster(prop) {
      this.isEdit = true;
      this.input = {
        dish_id: prop.dish_id,
        dish_name: prop.dish_name,
        origin_country: prop.origin_country,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        dish_id: 0,
        dish_name: null,
        origin_country: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          dish_id: this.input.dish_id,
          dish_name: this.input.dish_name,
          origin_country: this.input.origin_country,
        };
        axios
          .post(`/biryani-dish-masters/update`, payload)
          .then((response) => {
            const data = response.data;
            this.notification.success(data.message);
            this.getDishMasterData();
            this.input = {
              dish_id: 0,
              dish_name: null,
              origin_country: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message =
              error.response.data.message === ''
                ? 'Something Wrong!!!'
                : error.response.data.message;
            this.notification.error(message);
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
          dish_name: this.input.dish_name,
          origin_country: this.input.origin_country,
        };
        axios
          .post(`/biryani-dish-masters`, payload)
          .then((response) => {
            const data = response.data;
            this.notification.success(data.message);
            this.getDishMasterData();
            this.input = {
              dish_id: 0,
              dish_name: null,
              origin_country: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message =
              error.response.data.message === ''
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
    deleteDishMaster() {
      this.isDeleteLoading = true;
      axios
        .delete(`/biryani-dish-masters/${this.propertyIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getDishMasterData();
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
          this.propertyIdToDelete = null;
          this.isDelete = false;
        });
    },
    getDishMasterData() {
      this.isLoading = true;
      axios
        .get(`/biryani-dish-masters`)
        .then((response) => {
          const data = response.data.data;
          this.items = data.map((item) => {
            console.log(item);
            return {
              dish_id: item.dish_id || 1,
              dish_name: item.dish_name || '',
              origin_country: item.origin_country || '',
              origin_city: item.origin_city || '',
              dish_description: item.dish_description || '',
              main_image: item.main_image || null,
              isActive: item.active == 'N' ? false : item.active == 'Y' ? true : null,
              isFeatured: item.is_featured == 'N' ? false : item.is_featured == 'Y' ? true : null,
              user: item.user || '',
              dated: item.dated || '',
              country: item.country || '',
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
    getCity() {
      axios.get(`/cities`).then((response) => {
        const data = response.data.data;
        this.resource.city = data;
      });
    },
    filterCity(country_id) {
      return this.resource.city.filter((item) => item.country_id === country_id);
    },
    saveDescription(dish_description, item) {
      this.isSending2 = true;
      const payload = {
        dish_id: item.dish_id,
        dish_name: item.dish_name,
        origin_country: item.origin_country,
        dish_description: dish_description,
      };
      axios
        .post(`/biryani-dish-masters/update`, payload)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getDishMasterData();
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
    saveCity(origin_city, item) {
      this.isSending2 = true;
      const payload = {
        dish_id: item.dish_id,
        dish_name: item.dish_name,
        origin_country: item.origin_country,
        origin_city: origin_city,
      };
      axios
        .post(`/biryani-dish-masters/update`, payload)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getDishMasterData();
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
    activeMainCategory(bmc_id) {
      this.isSending2 = true;
      axios
        .get(`/biryani-main-categories/toggle-active/${bmc_id}`)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getMainCategoriesData();
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
