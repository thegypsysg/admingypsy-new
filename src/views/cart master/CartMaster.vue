td
<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <h1>Cart Master</h1>

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
        <v-col cols="12" md="2">
          <v-btn
            prepend-icon="mdi-magnify"
            color="indigo-accent-2"
            style="text-transform: none"
            variant="flat"
            class="w-100"
            @click="getProductData()"
            :disabled="isLoading"
            :loading="isLoading"
          >
            <template v-slot:prepend>
              <v-icon color="white"></v-icon>
            </template>

            Search
          </v-btn>
        </v-col>
      </v-row>
      <!-- <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            density="compact"
            v-model="search"
            label="Search"
            variant="outlined"
            hide-details
          ></v-text-field>
        </v-col>
      </v-row> -->
      <v-row align="center" justify="space-between">
        <v-col cols="8">
          <span>
            Showing {{ startItem }} - {{ endItem }} from {{ totalItems }} item
          </span>
        </v-col>
        <v-col cols="4" class="text-right">
          <v-select
            v-model="perPage"
            :items="[5, 10, 15, 20]"
            label="Items per page"
            density="compact"
            variant="outlined"
            hide-details
            @update:modelValue="getItemsData"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-table class="country-table">
            <thead>
              <tr>
                <th class="text-left text-no-wrap">Cart Id</th>
                <th class="text-left text-no-wrap">Customer Name</th>
                <th class="text-left text-no-wrap">Order Date</th>
                <th class="text-left text-no-wrap">Order Status</th>
                <th class="text-left text-no-wrap">Total Items</th>
                <th class="text-left text-no-wrap">Sub-total</th>
                <th class="text-left text-no-wrap">Delivery Charges</th>
                <th class="text-left text-no-wrap">Platform Fee</th>
                <th class="text-left text-no-wrap">G.S.T</th>
                <th class="text-left text-no-wrap">Total</th>
                <th class="text-left text-no-wrap">Payment By</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in items.slice(0, 5)" :key="item.id">
                <tr class="country-table-body text-no-wrap">
                  <td>{{ item.id }}</td>
                  <td>
                    {{ item.user }}
                  </td>
                  <td>
                    {{ item.dated }}
                  </td>
                  <td>
                    <!-- {{ item.dated }} -->
                    Confirmed
                  </td>
                  <td class="d-flex align-center">
                    <span>2</span
                    ><span class="text-blue-lighten-1 font-weight-bold ml-3"
                      >View</span
                    >
                  </td>
                  <td>
                    <!-- {{ item.dated }} -->
                    S$ 100.00
                  </td>
                  <td>
                    <!-- {{ item.dated }} -->
                    S$ 12.00
                  </td>
                  <td>
                    <!-- {{ item.dated }} -->
                    S$ 0.50
                  </td>
                  <td>
                    <!-- {{ item.dated }} -->
                    S$ 0.00
                  </td>
                  <td>
                    <!-- {{ item.dated }} -->
                    S$ 112.50
                  </td>
                  <td>
                    <!-- {{ item.dated }} -->
                    Cash
                  </td>
                </tr>

                <tr v-if="item.quantity.length > 0" class="mt-n4">
                  <td style="border: none !important"></td>
                  <td
                    :class="{
                      'has-border': item.quantity.length > 0,
                      'not-border': item.quantity.length == 0,
                    }"
                    style="border-bottom: none !important"
                    colspan="6"
                  >
                    <v-table class="">
                      <tr>
                        <td class="pr-6 pt-4">1</td>
                        <td class="pr-6 pt-4">
                          Monkey Shoulders Original Scotch Whisky - 700 ml
                        </td>
                        <td class="pr-6 pt-4">S$ 62.00</td>
                        <td class="pr-6 pt-4">1</td>
                        <td class="pr-6 pt-4">S$ 62.00</td>
                      </tr>
                      <tr>
                        <td class="pr-6 pt-4">1</td>
                        <td class="pr-6 pt-4">Roku Gin - 700 ml</td>
                        <td class="pr-6 pt-4">S$ 62.00</td>
                        <td class="pr-6 pt-4">1</td>
                        <td class="pr-6 pt-4">S$ 62.00</td>
                      </tr>
                    </v-table>
                  </td>
                  <td style="border: none !important"></td>
                  <td style="border: none !important"></td>
                  <td style="border: none !important"></td>
                  <td style="border: none !important"></td>
                </tr>

                <tr v-if="item.quantity.length > 0">
                  <td></td>
                  <td colspan="6">
                    <v-table class="mt-6">
                      <thead>
                        <tr class="py-0">
                          <th class="text-left py-0">Delivery Full Address</th>
                          <th class="text-left py-0">Town</th>
                          <th class="text-left py-0">Order Instructions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr class="font-weight-bold">
                          <td class="pr-6 py-2">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Sed ratione esse quae.
                          </td>
                          <td class="pr-6 py-2">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit.
                          </td>
                          <td class="pr-6 py-2">
                            Lorem ipsum dolor sit amet consectetur adipisicing.
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </template>
              <tr v-if="isLoading">
                <td :colspan="11" class="text-center">
                  <v-progress-circular
                    indeterminate
                    color="indigo-accent-2"
                  ></v-progress-circular>
                </td>
              </tr>
            </tbody>
          </v-table>
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            @update:modelValue="getItemsData"
          ></v-pagination>
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
    isSending2: false,
    isEdit: false,
    isSuccess: false,
    isError: false,
    isDelete: false,
    isDeleteLoading: false,
    productIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    currentPage: 1,
    perPage: 5,
    totalPages: 1,
    totalItems: 0,
    imageFile: [],
    logoFile: [],
    productDataToImage: {
      id: 0,
      product: null,
      brand: null,
      desc: null,
      percentage: null,
    },
    isOpenImage: false,
    isOpenLogo: false,
    successMessage: '',
    errorMessage: '',
    input: {
      id: 0,
      product: null,
      brand: null,
      desc: null,
      percentage: null,
    },
    resource: {
      brand: [],
    },
    search: '',
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
    this.getBrands();
  },
  computed: {
    startItem() {
      return (this.currentPage - 1) * this.perPage + 1;
    },
    endItem() {
      return Math.min(this.currentPage * this.perPage, this.totalItems);
    },
  },
  watch: {
    perPage() {
      this.currentPage = 1; // Reset ke halaman pertama saat `perPage` berubah
      this.getItemsData();
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
        desc: item.desc,
        percentage: item.percentage,
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
        desc: null,
        percentage: null,
      };
    },
    saveImage() {
      this.isSending = true;
      const payload = {
        product_id: this.productDataToImage.id,
        product_name: this.productDataToImage.product,
        brand_id: this.productDataToImage.brand,
        additional_description: this.productDataToImage.desc,
        percentage: this.productDataToImage.percentage,
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
            desc: null,
            percentage: null,
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
        desc: product.desc,
        percentage: product.percentage,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        id: 0,
        product: null,
        brand: null,
        desc: null,
        percentage: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          product_id: this.input.id,
          product_name: this.input.product,
          brand_id: this.input.brand,
          additional_description: this.input.desc,
          percentage: this.input.percentage,
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
              desc: null,
              percentage: null,
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
              desc: null,
              percentage: null,
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
          additional_description: this.input.desc,
          percentage: this.input.percentage,
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
              desc: null,
              percentage: null,
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
      this.isLoading = true;
      axios
        .get(`/products`)
        .then((response) => {
          const data = response.data.data;
          this.items = data.map((item) => {
            return {
              id: item.product_id || 1,
              image: item.image || null,
              product: item.product_name || '',
              isActive:
                item.active == 'N' ? false : item.active == 'Y' ? true : null,
              isFavorite:
                item.favorite == 'N'
                  ? false
                  : item.favorite == 'Y'
                  ? true
                  : null,
              user: item.user.name || '',
              dated: item.dated || '',
              app: item.brand.category.app.app_name || '',
              brand: item.brand.brand_name || '',
              brand_id: item.brand_id || null,
              category: item.brand.category.category_name || '',
              desc: item.additional_description || '',
              percentage: item.percentage || '',
              madeIn: item.brand.country?.country_name || '',
              quantity: item.quantity.map((i) => i.quantity_name),
            };
          });
          this.resource.name = data.map((item) => item.partner_name || '');
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
    getBrands() {
      this.isLoading = true;
      axios
        .get(`/brands`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.resource.brand = data
            .sort((a, b) => a.brand_id > b.brand_id)
            .map((item) => {
              return {
                id: item.brand_id || 1,
                name: item.brand_name || '',
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
      this.isSending2 = true;
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
          this.isSending2 = false;
        });
    },
    favoriteProduct(id) {
      this.isSending2 = true;
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

.has-border {
  border-top: 1px solid rgb(188, 188, 188) !important;
}

.not-border {
  border-top: none !important;
}
</style>
