<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <div class="d-flex ml-4 mb-6" style="gap: 50px">
      <router-link
        style="color: #293fb8; font-size: 13px"
        class="text-decoration-none"
        to="/promotions_master"
      >
        <p>Back</p>
      </router-link>
    </div>
    <h3 class="ml-4 mb-6">Outlets</h3>
    <div class="d-flex">
      <h4 class="ml-4 mb-6" style="color: #293fb8; font-weight: 400">
        {{ partnerName || '' }}
      </h4>
      <h4 class="ml-8 mb-6" style="color: #991728; font-weight: 400">
        {{ promoName || '' }}
      </h4>
    </div>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="3">
            <v-autocomplete
              density="compact"
              label="Search Mall Name"
              placeholder="Type Mall Name"
              :items="resource.malls"
              item-title="name"
              item-value="id"
              v-model="input.mall"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              density="compact"
              label="Select Mall Location"
              placeholder="Type Mall Location"
              :items="resource.locations"
              item-title="name"
              item-value="id"
              v-model="input.location"
              variant="outlined"
            ></v-autocomplete>
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
        </v-row>
        <!-- <v-row class="mt-n4">
          <v-col cols="12" md="3">
            <v-text-field
              v-model="input.unitNumber"
              label="Unit Number"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
          </v-col>
        </v-row> -->
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
                <th class="text-left font-weight-bold text-black">ID</th>
                <th class="text-left font-weight-bold text-black">Mall Name</th>
                <th class="text-left font-weight-bold text-black">
                  Location / Unit Number
                </th>
                <th class="text-left font-weight-bold text-black">User</th>
                <th class="text-left font-weight-bold text-black">Dated</th>
                <th class="text-left font-weight-bold text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredItems" :key="item.id">
                <td>
                  <div class="app-column">
                    {{ item.id }}
                  </div>
                </td>
                <td>
                  <div class="app-column">
                    {{ item.mall }}
                  </div>
                </td>
                <td>
                  <div class="app-column">
                    {{ item.unit_number }}
                  </div>
                </td>
                <td>
                  <div class="app-column">
                    {{ item.user }}
                  </div>
                </td>
                <td>
                  <div class="app-column">
                    {{ item.dated }}
                  </div>
                </td>
                <td>
                  <div class="d-flex">
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
          Are you sure want to delete this promotion outlet?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelDelete">No</v-btn>
          <v-btn color="success" text @click="deleteOutlet">{{
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
import { setAuthHeader } from '@/util/axios';
// import app from '@/util/eventBus';

export default {
  name: 'LocationsVue',
  data: () => ({
    // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    idPromo: null,
    idMerchant: null,
    partnerName: null,
    promoName: null,
    valid: false,
    isLoading: false,
    isSending: false,
    isError: false,
    isEdit: false,
    isSuccess: false,
    isDelete: false,
    isDeleteLoading: false,
    locationIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    isOpenImage: false,
    successMessage: '',
    errorMessage: '',
    imageFile: [],
    partnerLocationDataToImage: {
      id: 0,
      country: null,
      town: null,
      city: null,
      zone: null,
      location: null,
      latitude: null,
      longitude: null,
      address: null,
    },
    input: {
      id: 0,
      mall: null,
      location: null,
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
      mall: [],
      locations: [],
    },
    itemsTry: [
      {
        //  id: 1,
        //  image: null,
        //  location: 'Headquarters',
        //  latitude: 0.927336,
        //  longitude: 0.53383,
        //  address:
        //    '320 North Bridge Road # 09-17 Peninsular Plaza Singapore - 760887',
        //  country: 'Singapore',
        //  city: 'Singapore',
        //  town: 'Woodlands',
        //  zone: 'North',
        //  isPrimary: false,
        //  isFavorite: false,
      },
    ],
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.idPromo = this.$route.params.id_promo;
    this.idMerchant = this.$route.params.id_merchant;
    this.getOutletsData();
    this.getPromotionData();
    this.getPartnerData();
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.items;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.items.filter(
        (item) =>
          item.mall.toLowerCase().includes(searchTextLower) ||
          item.unit_number.toLowerCase().includes(searchTextLower)
      );
    },
  },
  watch: {
    'input.mall'() {
      const filteredLocation = this.resource.malls
        .filter((i) => i.id == this.input.mall)
        .map((item) => {
          return {
            id: item.pl_id,
            name: item.unit_number,
          };
        });
      this.resource.locations = filteredLocation;
    },
  },
  methods: {
    saveData() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          merchant_id: this.idMerchant,
          promo_id: this.idPromo,
          mmo_id: this.input.mall,
        };
        axios
          .post(`/mall-promotions-outlets`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getOutletsData();
            this.input = {
              id: 0,
              mall: null,
              location: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.mmo_id
              ? error.response.data.mmo_id[0]
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
      this.locationIdToDelete = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.locationIdToDelete = itemId;
      this.isDelete = true;
    },
    cancelConfirmation() {
      this.locationIdToDelete = null;
      this.isDelete = false;
    },
    deleteOutlet() {
      this.isDeleteLoading = true;
      axios
        .delete(`/mall-promotions-outlets/${this.locationIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getOutletsData();
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
          this.locationIdToDelete = null;
          this.isDelete = false;
        });
    },
    getOutletsData() {
      this.isLoading = true;
      axios
        .get(`/mall-promotions-outlets`)
        .then((response) => {
          const data = response.data.data;
          console.log(data);
          this.items = data.map((item) => {
            return {
              id: item.mpo_id || 1,
              promo_id: item.promo_id || 1,
              merchant_id: item.merchant_id || 1,
              mall_id: item.mall_id || 1,
              pl_id: item.pl_id || 1,
              mall: item.mall || '',
              unit_number: item.unit_number || '',
              user: item.name || '',
              dated: item.dated || '',
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
    getPromotionData() {
      this.isLoading = true;
      axios
        .get(`/mall-promotions`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          const dataItem = data.filter((i) => i.promo_id == this.idPromo);
          this.partnerName = dataItem.map((item) => {
            return {
              id: item.promo_id,
              name: item.partner_name,
            };
          })[0].name;
          this.promoName = dataItem.map((item) => {
            return {
              id: item.promo_id,
              name: item.promo_name,
            };
          })[0].name;
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
      axios
        .get(`/mall-merchant-outlets/${this.idMerchant}/list`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.resource.malls = data.map((item) => {
            return {
              id: item.mmo_id || 1,
              name: item.mall || '',
              pl_id: item.pl_id || 1,
              unit_number: item.unit_number || '',
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
  font-weight: 500;
}

.app-column {
  display: flex;
  align-items: center;
  min-height: 70px;
  margin-bottom: 10px;
}
.app-column-2 {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-direction: column;
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
