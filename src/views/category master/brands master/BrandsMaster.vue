<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container
    ><div class="d-flex ml-4 mb-4" style="gap: 40px">
      <router-link
        style="color: #a370c8; font-weight: 500"
        class="text-decoration-none"
        to="/category_master"
      >
        <p>Category Master</p>
      </router-link>
      <router-link
        style="color: #ff7f27; font-weight: 500"
        class="text-decoration-none"
        to="/brands_master"
      >
        <p>Brands Master</p>
      </router-link>
    </div>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <!-- <v-row>
          <v-col cols="12" md="3">
            <p style="color: #8f8f8b; font-weight: 500">Category Name</p>
          </v-col>
          <v-col cols="12" md="4">
            <p style="color: #8f8f8b; font-weight: 500">Description</p>
          </v-col>
        </v-row> -->
        <v-row>
          <v-col cols="12" md="3">
            <p style="color: #000; font-weight: 500">Brand Name</p>
            <v-text-field
              v-model="input.brand"
              label="Type Brand Name"
              variant="outlined"
              density="compact"
              class="mt-4"
              required
            ></v-text-field>
            <v-autocomplete
              clearable
              density="compact"
              label="Category"
              placeholder="Type category"
              :items="resource.category"
              item-title="name"
              item-value="value"
              class="mt-1"
              v-model="input.category"
              variant="outlined"
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" md="4">
            <p style="color: #000; font-weight: 500">Brand Description</p>
            <v-textarea
              v-model="input.desc"
              label="Type Description"
              rows="3"
              variant="outlined"
              class="mt-4"
              required
            ></v-textarea>
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
              class="w-100 mt-10"
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
          <v-col v-if="isEdit" cols="12" md="2">
            <v-btn
              prepend-icon="mdi-account-multiple-remove"
              color="red"
              style="text-transform: none"
              variant="flat"
              class="w-100 mt-10"
              @click="cancelEdit"
              :disabled="isSending"
            >
              <template v-slot:prepend>
                <v-icon color="white"></v-icon>
              </template>

              Cancel
            </v-btn>
          </v-col>
        </v-row>
        <v-row class="my-n4">
          <v-col cols="12" md="3">
            <v-autocomplete
              clearable
              density="compact"
              label="Select Country"
              placeholder="Type country"
              :items="resource.country"
              item-title="name"
              item-value="id"
              v-model="input.country"
              variant="outlined"
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" md="3">
            <v-autocomplete
              density="compact"
              label="---Select App---"
              placeholder="Type App"
              :items="resource.app"
              class="mt-1"
              item-title="name"
              item-value="id"
              v-model="input.app"
              variant="outlined"
            ></v-autocomplete>
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
          <v-table style="font-size: 12px !important">
            <thead>
              <tr>
                <th class="text-left">Id</th>
                <th class="text-left">Image</th>
                <th class="text-left">Brand</th>
                <th class="text-left">Country of Brand</th>
                <th class="text-left">Category</th>
                <th class="text-left">Description</th>
                <th class="text-left">Active</th>
                <th class="text-left">Website</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredItems" :key="item.id">
                <td style="font-weight: 500 !important">
                  <div class="app-column">
                    {{ item.id }}
                  </div>
                  <v-table class="app-column-table"></v-table>
                </td>
                <td>
                  <div class="app-column">
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
                    >
                      <template #placeholder>
                        <div class="skeleton" /> </template
                    ></v-img>
                  </div>
                  <v-table class="app-column-table"></v-table>
                </td>
                <td style="font-weight: 500 !important">
                  <div class="app-column">
                    {{ item.brand_name }}
                  </div>
                  <v-table class="app-column-table">
                    <tr>
                      <td>
                        <span class="text-black font-weight-black">App: </span
                        ><span class="text-red font-weight-bold">{{
                          item.app
                        }}</span>
                      </td>
                    </tr>
                  </v-table>
                </td>
                <td style="font-weight: 500 !important">
                  <div class="app-column">
                    {{ item.country_name }}
                  </div>
                  <v-table class="app-column-table"></v-table>
                </td>
                <td style="font-weight: 500 !important">
                  <div class="app-column">
                    {{ item.category_name }}
                  </div>
                  <v-table class="app-column-table"></v-table>
                </td>
                <td style="color: #7f7f80; font-weight: 500 !important">
                  <div class="app-column">
                    {{ item.description }}
                  </div>
                  <v-table class="app-column-table"></v-table>
                </td>
                <td>
                  <div class="app-column">
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
                      @click="activeBrand(item.id)"
                    >
                      <v-btn size="27" :value="true"> Yes </v-btn>

                      <v-btn size="27" :value="false"> No </v-btn>
                    </v-btn-toggle>
                  </div>
                  <v-table class="app-column-table"></v-table>
                </td>
                <td>
                  <div class="app-column">
                    <v-btn-toggle
                      style="
                        font-size: 10px !important;
                        font-weight: 200 !important;
                        height: 22px !important;
                        width: 54px !important;
                      "
                      class="d-flex align-center"
                      v-model="item.isWebsite"
                      rounded="5"
                      @click="websiteBrand(item.id)"
                    >
                      <v-btn size="27" :value="true"> Yes </v-btn>

                      <v-btn size="27" :value="false"> No </v-btn>
                    </v-btn-toggle>
                  </div>
                  <v-table class="app-column-table"></v-table>
                </td>
                <td>
                  <div class="d-flex app-column">
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          color="green"
                          variant="text"
                          v-bind="props"
                          @click="editBrands(item)"
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
                  <v-table class="app-column-table"></v-table>
                </td>
              </tr>
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
        <v-card-text> Are you sure want to delete this brand? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelDelete">No</v-btn>
          <v-btn color="success" text @click="deleteBrands">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent width="auto" v-model="isOpenImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4">
          Upload Image - Brands</v-card-title
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
  name: 'BoozardsBrands',
  data: () => ({
    // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    valid: false,
    isLoading: false,
    isSending: false,
    isEdit: false,
    isSuccess: false,
    isError: false,
    isDelete: false,
    isDeleteLoading: false,
    brandsIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    imageFile: [],
    brandDataToImage: {
      id: 0,
      brand: null,
      desc: null,
      country: null,
      category: null,
      app: null,
    },
    isOpenImage: false,
    successMessage: '',
    errorMessage: '',
    input: {
      id: 0,
      image: null,
      brand: null,
      desc: null,
      country: null,
      category: null,
      app: null,
    },
    resource: {
      country: [],
      category: [],
      app: [],
    },
    rules: {
      brandRules: [
        (value) => {
          if (value) return true;
          return 'Brand Name is requred.';
        },
      ],
      descRules: [
        (value) => {
          if (value) return true;
          return 'Description is requred.';
        },
      ],
      countryRules: [
        (value) => {
          if (value) return true;
          return 'Country is requred.';
        },
      ],
      categoryRules: [
        (value) => {
          if (value) return true;
          return 'Category is requred.';
        },
      ],
      appRules: [
        (value) => {
          if (value) return true;
          return 'App is required.';
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
    this.getBrands();
    this.getCategory();
    this.getCountry();
    this.getAppActive();
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.items;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.items.filter(
        (item) =>
          item.brand_name.toLowerCase().includes(searchTextLower) ||
          item.country.toLowerCase().includes(searchTextLower) ||
          item.category_name.toLowerCase().includes(searchTextLower) ||
          item.description.toLowerCase().includes(searchTextLower)
      );
    },
  },
  methods: {
    updateImageFile(newImageFile) {
      this.imageFile.push(newImageFile);
    },
    deleteImageFile() {
      this.isSending = true;
      axios
        .delete(`/brands/${this.brandDataToImage.id}/image`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getBrands();
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
          this.imageFile = [];
        });
    },
    openImage(item) {
      this.isOpenImage = true;
      this.brandDataToImage = {
        id: item.id,
        brand: item.brand_name,
        country: item.country_id,
        category: item.category_id,
        desc: item.description,
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
      this.brandDataToImage = {
        id: 0,
        brand: null,
        desc: null,
        country: null,
        category: null,
        app: null,
      };
    },
    saveImage() {
      this.isSending = true;
      const payload = {
        brand_id: this.brandDataToImage.id,
        brand_name: this.brandDataToImage.brand,
        country_id: this.brandDataToImage.country,
        category_id: this.brandDataToImage.category,
        description: this.brandDataToImage.desc,
        image: this.imageFile[0],
      };
      http
        .post(`/brands/update`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getBrands();
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
          this.brandDataToImage = {
            id: 0,
            brand: null,
            desc: null,
            country: null,
            category: null,
            app: null,
          };
          this.isOpenImage = false;
          this.imageFile = [];
        });
    },
    editBrands(brand) {
      this.isEdit = true;
      this.input = {
        id: brand.id,
        brand: brand.brand_name,
        country: brand.country_id,
        category: brand.category_id,
        desc: brand.description,
        app: brand.app,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        id: 0,
        image: null,
        brand: null,
        desc: null,
        country: null,
        category: null,
        app: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          brand_id: this.input.id,
          brand_name: this.input.brand,
          country_id: this.input.country,
          category_id: this.input.category,
          description: this.input.desc,
        };
        if (this.input.image !== null) {
          payload['image'] = this.input.image;
        }
        axios
          .post(`/brands/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getBrands();
            this.input = {
              id: 0,
              image: null,
              brand: null,
              desc: null,
              country: null,
              category: null,
              app: null,
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
          brand_name: this.input.brand,
          country_id: this.input.country,
          category_id: this.input.category,
          description: this.input.desc,
        };
        if (this.input.image !== null) {
          payload['image'] = this.input.image;
        }
        axios
          .post(`/brands`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getBrands();
            this.input = {
              id: 0,
              image: null,
              brand: null,
              desc: null,
              country: null,
              category: null,
              app: null,
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
      this.brandsIdToDelete = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.brandsIdToDelete = itemId;
      this.isDelete = true;
    },
    cancelConfirmation() {
      this.brandsIdToDelete = null;
      this.isDelete = false;
    },
    deleteBrands() {
      this.isDeleteLoading = true;
      axios
        .delete(`/brands/${this.brandsIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getBrands();
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
          this.brandsIdToDelete = null;
          this.isDelete = false;
        });
    },
    getBrands() {
      this.isLoading = true;
      axios
        .get(`/brands`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.items = data
            .sort((a, b) => a.brand_id > b.brand_id)
            .map((item) => {
              return {
                id: item.brand_id || 1,
                image: item.image || null,
                brand_name: item.brand_name || '',
                country_id: item.country_id || 1,
                country_name:
                  item.country != null ? item.country.country_name : '',
                category_id: item.category_id || 1,
                category_name: item.category.category_name || '',
                description: item.description || '',
                app: item.category.app.app_name || '',
                app_id: item.category.app_id || 0,
                isActive:
                  item.active == 'N' ? false : item.active == 'Y' ? true : null,
                isWebsite:
                  item.website == 'N'
                    ? false
                    : item.website == 'Y'
                    ? true
                    : null,
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
    getCategory() {
      this.isLoading = true;
      axios
        .get(`/categories`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.resource.category = data
            .sort((a, b) => a.category_name.localeCompare(b.category_name))
            .map((item) => {
              return {
                name: item.category_name || '',
                value: item.category_id || 1,
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
    getCountry() {
      axios
        .get(`/countries`)
        .then((response) => {
          const data = response.data.data;
          this.resource.country = data.map((country) => {
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
    getAppActive() {
      axios
        .get(`/app/active`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.resource.app = data
            .sort((a, b) => a.app_id < b.app_id)
            .map((app) => {
              return {
                id: app.app_id || 0,
                name: app.app_name || '',
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

    activeBrand(id) {
      this.isSending = true;
      axios
        .get(`/brands/toggle-active/${id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getBrands();
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
    websiteBrand(id) {
      this.isSending = true;
      axios
        .get(`/brands/toggle-show-in-website/${id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getBrands();
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

.app-column {
  font-size: 12px;
  display: flex;
  align-items: center;
  min-height: 70px;
}

.app-column-table {
  font-size: 12px;
  min-height: 50px;
}

.app-column-table th {
  color: grey;
  text-align: left;
  font-weight: 400;
}
</style>
