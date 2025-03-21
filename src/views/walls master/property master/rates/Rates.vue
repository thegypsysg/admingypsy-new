<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container v-if="isLoading">
    <div class="h-100 d-flex justify-center align-center">
      <p>Loading...</p>
    </div>
  </v-container>
  <v-container v-else>
    <div class="d-flex ml-4 mb-6" style="gap: 50px">
      <router-link
        style="color: #293fb8; font-size: 13px"
        class="text-decoration-none"
        to="/property_master"
      >
        <p>Back</p>
      </router-link>
    </div>

    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="1">
            <h4>ID</h4>
            <h5 class="mt-2">{{ idProperty }}</h5>
          </v-col>
          <v-col cols="11">
            <h4>Tagline</h4>
            <h5 class="text-grey-darken-1 mt-2">{{ tagLine }}</h5>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="input.rate"
              :items="resource.rates"
              item-title="name"
              item-value="id"
              label="---Select Rate Type---"
              variant="outlined"
              density="compact"
              clearable
              required
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="2">
            <div>
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
              <v-btn
                v-if="isEdit"
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

                CANCEL
              </v-btn>
            </div>
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
                <th class="text-left font-weight-bold text-black">Id</th>
                <th class="text-left font-weight-bold text-black">Rate Type</th>
                <th class="text-left font-weight-bold text-black">
                  Rate Description
                </th>
                <th class="text-left font-weight-bold text-black">
                  Rate (SGD)
                </th>
                <th class="text-left font-weight-bold text-black">
                  Rate (IDR)
                </th>
                <th class="text-left font-weight-bold text-black">User</th>
                <th class="text-left font-weight-bold text-black">Dated</th>
                <th class="text-left font-weight-bold text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in items" :key="item.id">
                <tr v-if="!isLoading2" class="country-table-body">
                  <td>{{ item.pr_id }}</td>
                  <td>{{ item.rate_name }}</td>
                  <td>{{ item.description }}</td>
                  <td>
                    <v-text-field
                      density="compact"
                      type="number"
                      variant="outlined"
                      v-model="item.rate_sg"
                      :disabled="isSending"
                      hide-details
                      @focusout="saveRateSG(item.rate_sg, item)"
                    >
                      <!-- @input="(e) => changeSequence(item, e)" -->
                      <template #prepend-inner>
                        <span class="text-blue-darken-4 pr-2">S$ </span> |
                      </template>
                    </v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      density="compact"
                      type="number"
                      variant="outlined"
                      v-model="item.rate_home"
                      hide-details
                      :disabled="isSending"
                      @focusout="saveRateHome(item.rate_home, item)"
                    >
                      <template #prepend-inner>
                        <span class="text-blue-darken-4 pr-2"
                          >{{ item?.currency_symbol }}
                        </span>
                        |
                      </template>
                    </v-text-field>
                  </td>

                  <td>{{ item.name }}</td>
                  <td>
                    {{ item.dated }}
                  </td>
                  <td>
                    <div class="d-flex align-center">
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            color="green"
                            variant="text"
                            v-bind="props"
                            icon="mdi-pencil-outline"
                          ></v-btn>
                          <!-- @click="editPropertyRates(item)" -->
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
                            icon="mdi-trash-can-outline"
                          ></v-btn>
                          <!-- @click="openDeleteConfirm(item.id)" -->
                        </template>
                        <span>Delete</span>
                      </v-tooltip>
                    </div>
                  </td>
                </tr>
              </template>
              <tr v-if="isLoading2">
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
        <v-card-text> Are you sure want to delete this level? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelDelete">No</v-btn>
          <v-btn color="success" text @click="deleteLocation">{{
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
  name: 'ManageLevels',
  data: () => ({
    // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    tagLine: null,
    idProperty: null,
    valid: false,
    isLoading: false,
    isLoading2: false,
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
    resource: {
      rates: [],
    },
    partnerLocationDataToImage: {
      id: 0,
    },

    input: {
      id: 0,
      rate: '',
    },
    rules: {
      nameRules: [
        (value) => {
          if (value) return true;
          return 'Name is required.';
        },
      ],
    },
    search: '',
    items: [],
    // itemsTry: [
    //   {
    //     id: 1,
    //     name: 'Pappa Rich',
    //     country: 'Singapore',
    //     isActive: false,
    //     isFeatured: false,
    //     user: 'Charlton',
    //     dated: '15/08/2023',
    //     type: 'Restaurant',
    //     outlets: 5,
    //   },
    // ],
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.idProperty = parseInt(this.$route.params.id);
    const data = JSON.parse(localStorage.getItem('propertyRates'));
    console.log(data);
    this.tagLine = data?.tag_line;
    this.getPropertyRatesData();
    this.getRatesData();
  },

  methods: {
    saveData() {
      if (this.input.rate) {
        this.isSending = true;
        const payload = {
          property_id: this.idProperty,
          rt_id: this.input.rate,
        };
        axios
          .post(`/4walls-property-rates`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getPropertyRatesData();
            this.input = {
              id: 0,
              rate: '',
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.rt_id
              ? error.response.data.rt_id[0]
              : error.response.data.message === ''
              ? 'Something Wrong!!!'
              : error.response.data.error;
            this.errorMessage = message;
            this.isError = true;
          })
          .finally(() => {
            this.isSending = false;
          });
      }
    },
    saveRateHome(rate, item) {
      if (rate) {
        this.isSending = true;
        const payload = {
          pr_id: item.pr_id,
          rate_home: rate,
          rate_sg: item.rate_sg,
        };
        axios
          .post(`/4walls-property-rates/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            //this.getConstructionCategoryData();
          })
          .catch((error) => {
            console.log(error);
            const message = error.response.data.rate_home
              ? 'Please fill the rate home field'
              : error.response.data.message;
            this.errorMessage = message;
            this.isError = true;
          })
          .finally(() => {
            this.isSending = false;
          });
      }
    },
    saveRateSG(rate, item) {
      if (rate) {
        this.isSending = true;
        const payload = {
          pr_id: item.pr_id,
          rate_sg: rate,
          rate_home: item.rate_home,
        };
        axios
          .post(`/4walls-property-rates/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            //this.getConstructionCategoryData();
          })
          .catch((error) => {
            console.log(error);
            const message = error.response.data.rate_sg
              ? 'Please fill the rate sg field'
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
    deleteLocation() {
      this.isDeleteLoading = true;
      axios
        .delete(`/4walls-property-rates/${this.locationIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPropertyRatesData();
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
    getPropertyRatesData() {
      this.isLoading = true;
      axios
        .get(`/4walls-property-rates`)
        .then((response) => {
          const data = response.data.data;
          this.items = data.map((item) => {
            return {
              ...item,
              rateHome: item?.rate_home
                ? parseInt(item?.rate_home.replace(/,/g, ''), 10)
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

    getRatesData() {
      this.isLoading = true;
      axios
        .get(`/4walls-rates-types`)
        .then((response) => {
          const data = response.data.data;
          this.resource.rates = data.map((item) => {
            return {
              id: item?.rt_id,
              name: item?.rate_name,
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
.app-column {
  display: flex;
  align-items: center;
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
