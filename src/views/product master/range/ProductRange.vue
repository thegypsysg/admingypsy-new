<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <div class="d-flex ml-4 mb-6" style="gap: 50px">
      <router-link
        style="color: #293fb8; font-size: 13px"
        class="text-decoration-none"
        to="/product_master"
      >
        <p>Back</p>
      </router-link>
    </div>
    <div class="d-flex align-start w-100" style="gap: 40px">
      <div class="d-flex" style="width: 45%">
        <h2 class="ml-4 mb-6 text-blue" style="min-width: 45px">
          {{ itemData?.id || '' }} -
        </h2>
        <h2 class="mb-6 text-blue">
          {{ itemData?.product || '' }}
        </h2>
      </div>
      <div
        v-if="itemData"
        class="d-flex font-weight-bold pt-1"
        style="width: 55%"
      >
        App:
        <span class="text-red mr-4 ml-2">{{ itemData?.app || '' }}</span>
        Brand:
        <span class="text-red mr-4 ml-2">{{ itemData?.brand || '' }}</span>
        Category:
        <span class="text-red mr-4 ml-2">{{ itemData?.category || '' }}</span>
      </div>
    </div>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="3">
            <v-autocomplete
              density="compact"
              placeholder="Type Quantity"
              :items="resource.quantity"
              item-title="name"
              item-value="id"
              v-model="input.quantity"
              label="---Quantity---"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="input.desc"
              label="Additional Description"
              placeholder="Type Additional Description"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="mt-n4">
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
          <v-col v-if="isEdit" cols="12" md="2">
            <v-btn
              prepend-icon="mdi-account-multiple-remove"
              color="red"
              style="text-transform: none"
              variant="flat"
              class="w-100"
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
      </v-container>
    </v-form>
    <v-sheet class="py-6 px-4 mt-10" border rounded width="100%">
      <v-row>
        <v-col cols="12">
          <v-table class="country-table">
            <thead>
              <tr>
                <th class="text-left">Id</th>
                <th class="text-left">Image</th>
                <th class="text-left">Product Name</th>
                <th class="text-left">Size</th>
                <th class="text-left">Percentage</th>
                <th class="text-left">User</th>
                <th class="text-left">Dated</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in filteredItems" :key="item.id">
                <tr class="country-table-body">
                  <td>{{ item.id }}</td>
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
                    {{ item.product }}
                  </td>
                  <td>{{ item.size }}</td>
                  <!-- <td class="pt-2">
                    {{ item.percentage }} %
                  </td> -->
                  <td class="pt-2">
                    <v-text-field
                      prepend-inner-icon="mdi-percent-outline"
                      variant="outlined"
                      density="compact"
                      v-model="item.percentage"
                    ></v-text-field>
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
                            @click="editProduct(item)"
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
                  <td
                    style="
                      border-bottom: 1px solid rgb(188, 188, 188) !important;
                    "
                    colspan="8"
                  >
                    <div class="d-flex justify-start" style="gap: 20px">
                      <v-table class="text-left font-weight-bold">
                        <tr>
                          <td style="width: 170px"></td>
                          <td class="pt-2 pb-4 text-grey">
                            {{ item.desc }}
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
        <v-card-text> Are you sure want to delete this product? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelDelete">No</v-btn>
          <v-btn color="success" text @click="deleteProduct">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent width="auto" v-model="isOpenImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4">
          Upload Image - Product</v-card-title
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
  name: 'ProductMaster',
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
    productIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    imageFile: [],
    logoFile: [],
    productDataToImage: {
      id: 0,
      product: null,
      brand: null,
    },
    isOpenImage: false,
    isOpenLogo: false,
    successMessage: '',
    errorMessage: '',
    input: {
      id: 0,
      quantity: null,
      desc: null,
    },
    resource: {
      quantity: [],
    },
    search: '',
    itemData: null,
    items: [],
    //itemsTry: [
    //  {
    //    id: 1,
    //    image: '',
    //    product: 'Monkey Shoulder Blended Malt Scotch Whisky',
    //    isActive: false,
    //    isFavorite: false,
    //    user: 'Charlton',
    //    dated: '27/07/2023',
    //    app: 'Boozards',
    //    brand: 'Chivas Regal',
    //    category: 'Whisky',
    //  },
    //],
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.getProductData();
    this.getProductRange();
    this.getQuantityData();
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.items;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.items.filter(
        (item) =>
          item.product.toLowerCase().includes(searchTextLower) ||
          item.desc.toLowerCase().includes(searchTextLower) ||
          item.size.toLowerCase().includes(searchTextLower) ||
          item.percentage.toLowerCase().includes(searchTextLower) ||
          item.user.toLowerCase().includes(searchTextLower) ||
          item.dated.toLowerCase().includes(searchTextLower)
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
        .delete(`/products/${this.productDataToImage.id}/image`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getProductData();
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
          // this.productDataToImage = {
          //   app_id: 1,
          //   app_group_id: 1,
          //   app_name: '',
          //   app_description: '',
          //   app_detail: '',
          // };
          this.imageFile = [];
        });
    },
    openImage(item) {
      this.isOpenImage = true;
      this.productDataToImage = {
        id: item.id,
        product: item.product,
        brand: item.brand_id,
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
      this.productDataToImage = {
        id: 0,
        product: null,
        brand: null,
      };
    },
    saveImage() {
      this.isSending = true;
      const payload = {
        product_id: this.productDataToImage.id,
        product_name: this.productDataToImage.product,
        brand_id: this.productDataToImage.brand,
        image: this.imageFile[0],
      };

      http
        .post(`/products/update`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getProductData();
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
          this.productDataToImage = {
            id: 0,
            product: null,
            brand: null,
          };
          this.isOpenImage = false;
          this.imageFile = [];
        });
    },
    editProduct(product) {
      this.isEdit = true;
      this.input = {
        id: product.id,
        product: product.product,
        brand: product.brand_id,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        id: 0,
        product: null,
        brand: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          product_id: this.input.id,
          product_name: this.input.product,
          brand_id: this.input.brand,
        };
        axios
          .post(`/products/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getProductData();
            this.input = {
              id: 0,
              product: null,
              brand: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.product_name
              ? error.response.data.product_name[0]
              : error.response.data.message
              ? error.response.data.message
              : 'Something Wrong!!!';
            this.errorMessage = message;
            this.isError = true;
            this.input = {
              id: 0,
              product: null,
              brand: null,
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
          product_name: this.input.product,
          brand_id: this.input.brand,
        };
        axios
          .post(`/products`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getProductData();
            this.input = {
              id: 0,
              product: null,
              brand: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.product_name
              ? error.response.data.product_name[0]
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
      this.productIdToDelete = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.productIdToDelete = itemId;
      this.isDelete = true;
    },
    cancelConfirmation() {
      this.productIdToDelete = null;
      this.isDelete = false;
    },
    deleteProduct() {
      this.isDeleteLoading = true;
      axios
        .delete(`/products/${this.productIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getProductData();
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
          this.productIdToDelete = null;
          this.isDelete = false;
        });
    },
    getProductData() {
      const id = this.$route.params.id;
      this.isLoading = true;
      axios
        .get(`/products`)
        .then((response) => {
          const data = response.data.data;
          this.itemData = data
            .map((item) => {
              return {
                id: item.product_id || 1,
                product: item.product_name || '',
                app: item.brand.category.app.app_name || '',
                brand: item.brand.brand_name || '',
                category: item.brand.category.category_name || '',
              };
            })
            .filter((i) => i.id == id)[0];
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
    getProductRange() {
      this.items = [
        {
          id: 1,
          image: null,
          product: 'Monkey Shoulder Blended Malt Scotch Whisky',
          desc: 'Additional Description',
          size: '700 ML',
          percentage: 40,
          user: 'Charlton',
          dated: '27/8/2023',
        },
      ];
      // const id = this.$route.params.id;
      // this.isLoading = true;
      // axios
      //   .get(`/products`)
      //   .then((response) => {
      //     const data = response.data.data;
      //     this.itemData = data
      //       .map((item) => {
      //         return {
      //           id: item.product_id || 1,
      //           product: item.product_name || '',
      //           app: item.brand.category.app.app_name || '',
      //           brand: item.brand.brand_name || '',
      //           category: item.brand.category.category_name || '',
      //         };
      //       })
      //       .filter((i) => i.id == id)[0];
      //     console.log(this.itemData);
      //   })
      //   .catch((error) => {
      //     // eslint-disable-next-line
      //     console.log(error);
      //     const message =
      //       error.response.data.message === ''
      //         ? 'Something Wrong!!!'
      //         : error.response.data.message;
      //     this.errorMessage = message;
      //     this.isError = true;
      //   })
      //   .finally(() => {
      //     this.isLoading = false;
      //   });
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
    activeProduct(id) {
      this.isSending = true;
      axios
        .get(`/products/toggle-active/${id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getProductData();
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
    favoriteProduct(id) {
      this.isSending = true;
      axios
        .get(`/products/toggle-favorite/${id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getProductData();
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
  color: #000 !important;
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
