<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <!-- <div class="d-flex align-center ml-4 mb-4" style="gap: 30px">
      <router-link class="text-decoration-none text-black" to="/product_master"> -->
    <h1>Onboard Merchant</h1>
    <!-- </router-link>
      <h1 style="font-size: 35px">|</h1>
      <router-link
        class="text-decoration-none text-black"
        to="/quantity_master"
      >
        <h1>Quantity Master</h1>
      </router-link> 
    </div> -->
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-autocomplete
              density="compact"
              label="Partner Name"
              placeholder="Select Partner Name"
              :items="resource.partners"
              item-title="name"
              item-value="id"
              v-model="input.partner"
              @update:modelValue="getLocationContact"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              density="compact"
              label="---App Id---"
              placeholder="Type App Id"
              :items="resource.app"
              item-title="name"
              item-value="id"
              v-model="input.app"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row class="mt-n4">
          <v-col cols="12" md="4">
            <v-autocomplete
              density="compact"
              label="---Select Location---"
              placeholder="Type Location"
              :items="resource.location"
              item-title="name"
              item-value="id"
              v-model="input.location"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              density="compact"
              label="===Select Contact==="
              placeholder="Type Contact"
              :items="resource.contacts"
              item-title="name"
              item-value="id"
              v-model="input.contact"
              variant="outlined"
            ></v-autocomplete>
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
                <th class="text-left text-no-wrap">OM ID</th>
                <th class="text-left text-no-wrap">Partner Name</th>
                <th class="text-left text-no-wrap">App Id</th>
                <th class="text-left text-no-wrap">City</th>
                <th class="text-left text-no-wrap">Town</th>
                <th class="text-left text-no-wrap">Email Id</th>
                <th class="text-left text-no-wrap">Contact Person</th>
                <th class="text-left text-no-wrap">Contact Number</th>
                <th class="text-left text-no-wrap">User</th>
                <th class="text-left text-no-wrap">Dated</th>
                <th class="text-left text-no-wrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in filteredItems" :key="item.id">
                <tr class="country-table-body">
                  <td>{{ item.id }}</td>
                  <td>
                    <!-- {{ item.user }} -->
                    Value Dollar Shop
                  </td>
                  <td>
                    <!-- {{ item.user }} -->
                    Boozards
                  </td>
                  <td>
                    <!-- {{ item.user }} -->
                    Singapore
                  </td>
                  <td>
                    <!-- {{ item.user }} -->
                    Marine Parade
                  </td>
                  <td>
                    <!-- {{ item.user }} -->
                    charltonmendes@gmail.com
                  </td>
                  <td>
                    <!-- {{ item.user }} -->
                    Charlton
                  </td>
                  <td>
                    <!-- {{ item.user }} -->
                    +69102343434
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
                  <td class="not-border" colspan="8">
                    <div class="d-flex justify-start" style="gap: 20px">
                      <v-table class="text-left font-weight-bold">
                        <tr>
                          <td style="width: 50px"></td>

                          <td class="pr-10 pt-2 pb-4">
                            <span class="text-blue-darken-3">
                              <!-- {{ item.app }} -->
                              # 01 - 554
                            </span>
                          </td>
                          <td class="pr-10 pt-2 pb-4">
                            <a
                              :href="`https://api.whatsapp.com/send?phone=
                        +656547722
                      &text=Hello`"
                              class="text-decoration-none text-blue-darken-3 text-no-wrap"
                            >
                              {{ '+656547722'
                              }}<v-icon
                                color="#4EC053"
                                size="20"
                                class="ml-2 fab fa-whatsapp"
                              ></v-icon>
                            </a>
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
    isSending2: false,
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
      desc: null,
      percentage: null,
    },
    isOpenImage: false,
    isOpenLogo: false,
    successMessage: '',
    errorMessage: '',
    input: {
      id: 0,
      partner: null,
      location: null,
      app: null,
      contact: null,
    },
    resource: {
      partners: [],
      app: [],
      location: [],
      contacts: [],
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
    this.getPartnerData();
    this.getAppActive();
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.items.slice(0, 1);
      }
      const searchTextLower = this.search.toLowerCase();
      return this.items
        .filter(
          (item) =>
            item.product.toLowerCase().includes(searchTextLower) ||
            item.user.toLowerCase().includes(searchTextLower) ||
            item.dated.toLowerCase().includes(searchTextLower) ||
            item.app.toLowerCase().includes(searchTextLower) ||
            item.brand.toLowerCase().includes(searchTextLower) ||
            item.category.toLowerCase().includes(searchTextLower)
        )
        .slice(0, 1);
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
    getPartnerData() {
      this.isLoading = true;
      axios
        .get(`/partners`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.resource.partners = data.map((item) => {
            return {
              id: item.partner_id || 1,
              name: item.partner_name || '',
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
    getLocationContact() {
      this.getLocationData();
      this.getPartnerContactData();
    },
    getLocationData() {
      // this.isLoading = true;
      axios
        .get(`/partner-locations/${this.input.partner}`)
        .then((response) => {
          const data = response.data.data;
          this.resource.location = data
            .sort((a, b) => a.pl_id < b.pl_id)
            .map((item) => {
              return {
                id: item.pl_id || 1,
                name:
                  item.unit_number && item.town.town_name
                    ? `${item.unit_number} - ${item.town.town_name}`
                    : item.town.town_name
                    ? `${item.town.town_name}`
                    : '',
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
      // .finally(() => {
      //   this.isLoading = false;
      // });
    },
    getPartnerContactData() {
      // this.isLoading = true;
      axios
        .get(`/partner-contacts/${this.input.partner}`)
        .then((response) => {
          const data = response.data.data;
          //console.log(data);
          this.resource.contacts = data
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((item) => {
              return {
                id: item.partner_contact_id || 1,
                name: item.name || '',
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
      // .finally(() => {
      //   this.isLoading = false;
      // });
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
  border-bottom: 1px solid rgb(188, 188, 188) !important;
}

.not-border {
  border-bottom: none !important;
}
</style>
