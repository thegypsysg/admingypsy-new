<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container v-if="isLoading">
    <div class="h-100 d-flex justify-center align-center">
      <p>Loading...</p>
    </div>
  </v-container>
  <v-container v-else>
    <div class="d-flex ml-4 mb-6 justify-space-between pr-16">
      <div class="d-flex" style="gap: 50px">
        <router-link
          style="color: #293fb8; font-size: 13px"
          class="text-decoration-none"
          to="/construction_master"
        >
          <p>Back</p>
        </router-link>
        <h3 class="ml-4 mr-10 mb-6">Main Info</h3>
      </div>
    </div>
    <div class="d-flex align-center justify-space-between pr-16 pl-4">
      <div class="d-flex" style="gap: 10px">
        <div style="min-width: 100px">
          <h3 style="color: blue">{{ this.constructionData?.construction_name }}</h3>
        </div>
        <div style="min-width: 100px">
          <h3 style="color: blue">
            {{ this.constructionData?.construction_category?.category_name }}
          </h3>
        </div>
      </div>
    </div>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-autocomplete
              class="mt-8"
              v-model="input.atm_id"
              :rules="rules.atm_idRules"
              item-title="apartment_type_name"
              item-value="atm_id"
              label="Apartment Type Name"
              variant="outlined"
              density="compact"
              required
              :items="apartmentTypeMasterData"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              class="mt-8"
              v-model="input.property_type_id"
              :rules="rules.property_type_idRules"
              item-title="property_name"
              item-value="property_type_id"
              label="Property Type Name"
              variant="outlined"
              density="compact"
              required
              :items="propertyTypeMasterData"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn
              :prepend-icon="isEdit ? 'mdi-account-multiple-check' : 'mdi-account-multiple-plus'"
              color="indigo-accent-2"
              style="text-transform: none"
              type="submit"
              variant="flat"
              class="w-100 mt-8"
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
              style="text-transform: none"
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
                <th class="text-left font-weight-bold text-black">id</th>
                <th class="text-left font-weight-bold text-black">Main Image</th>
                <th class="text-left font-weight-bold text-black">Apartment Type Name</th>
                <th class="text-left font-weight-bold text-black">Property Type Name</th>
                <th class="text-left font-weight-bold text-black">Bedroom</th>
                <th class="text-left font-weight-bold text-black">Bathroom</th>
                <th class="text-left font-weight-bold text-black">Area</th>
                <th class="text-left font-weight-bold text-black">Price Range</th>
                <th class="text-left font-weight-bold text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in filteredItems" :key="item.ca_id">
                <tr class="country-table-body">
                  <td>{{ item.ca_id }}</td>
                  <td>
                    <div class="image-upload-cont">
                      <v-img
                        class="image-upload-item"
                        height="40"
                        @click="openMainImage(item)"
                        style="cursor: pointer"
                        :src="
                          item.main_image != null && item.main_image != ''
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
                  <td>{{ item?.apartment_type_master?.apartment_type_name }}</td>
                  <td>
                    {{ item?.property_type_master?.property_name }}
                  </td>
                  <td>
                    <v-text-field
                      v-model="item.bedrooms"
                      variant="outlined"
                      density="compact"
                      hide-details
                      @blur="saveBedrooms(item, item.bedrooms)"
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      v-model="item.bathrooms"
                      variant="outlined"
                      density="compact"
                      hide-details
                      @blur="saveBathrooms(item, item.bathrooms)"
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      v-model="item.area"
                      variant="outlined"
                      density="compact"
                      hide-details
                      @blur="saveArea(item, item.area)"
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      v-model="item.price_range"
                      variant="outlined"
                      density="compact"
                      hide-details
                      @blur="savePriceRange(item, item.price_range)"
                    ></v-text-field>
                  </td>
                  <td>
                    <div class="d-flex">
                      <v-btn
                        color="red"
                        variant="text"
                        :disabled="isDeleteLoading"
                        @click="openDeleteConfirm(item.ca_id)"
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
                  <td colspan="4">
                    <br />
                    <label class="font-weight-bold text-black">Video Link</label>
                    <br />
                    <v-text-field
                      v-model="item.video_link"
                      variant="outlined"
                      density="compact"
                      hide-details
                      @blur="saveVideoLink(item, item.video_link)"
                      class="mb-5"
                    ></v-text-field>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </template>
            </tbody>
          </v-table>
          <skeleton-table v-if="isLoading" :rows="5" :columns="9" />
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
      @confirm="deleteDevelopmentConstruction"
    />
    <v-dialog persistent width="auto" v-model="isOpenMainImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4">
          Upload Image - Construction Apartment
        </v-card-title>
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
  </v-container>
</template>

<script>
import SkeletonTable from '@/components/SkeletonTable.vue';
import EmptyState from '@/components/EmptyState.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import { useNotificationStore } from '@/stores/notification';
import ImageUpload from '@/components/ImageUpload.vue';
import axios from '@/util/axios';
// import moment from 'moment';
import { setAuthHeader } from '@/util/axios';
// import app from '@/util/eventBus';

export default {
  name: 'DevelopmentConstruction',
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
    // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    constructionId: null,
    caId: null,
    constructionData: null,
    apartmentTypeMasterData: [],
    propertyTypeMasterData: [],
    constructionApartmentData: [],
    valid: false,
    isLoading: false,
    isSending: false,
    isEdit: false,
    isDelete: false,
    isDeleteLoading: false,
    isOpenMainImage: false,
    mainImageFile: [],
    propertyDataToMainImage: {
      ca_id: null,
      construction_id: null,
      atm_id: null,
      property_type_id: null,
    },
    input: {
      cf_id: 0,
      construction_id: 0,
      atm_id: null,
      property_type_id: null,
    },
    rules: {
      atm_idRules: [
        (value) => {
          if (value) return true;
          return 'Apartment Type Name is required.';
        },
      ],
      property_type_idRules: [
        (value) => {
          if (value) return true;
          return 'Property Type Name is required.';
        },
      ],
    },
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.constructionApartmentData;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.constructionFacilityData.filter((item) =>
        item.construction.construction_name.toLowerCase().includes(searchTextLower)
      );
    },
  },
  mounted() {
    this.isLoading = true;
    this.constructionId = parseInt(this.$route.params.id);
    this.getConstructionData();
    this.getConstructionApartmentData();
    this.getApartmentTypeMasterData();
    this.getPropertyTypeMasterData();
  },
  methods: {
    getConstructionData() {
      this.isLoading = true;
      axios
        .get(`/4walls-construction-masters/${this.constructionId}`)
        .then((response) => {
          this.constructionData = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    getConstructionApartmentData() {
      axios
        .get(`/4walls-construction-apartment/${this.constructionId}`)
        .then((response) => {
          this.constructionApartmentData = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    getApartmentTypeMasterData() {
      axios
        .get(`/4walls-apartment-type-masters`)
        .then((response) => {
          this.apartmentTypeMasterData = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    getPropertyTypeMasterData() {
      axios
        .get(`/four-walls-property-types`)
        .then((response) => {
          this.propertyTypeMasterData = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    saveData() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          construction_id: this.constructionId,
          atm_id: this.input.atm_id,
          property_type_id: this.input.property_type_id,
        };
        axios
          .post(`/4walls-construction-apartment`, payload)
          .then((response) => {
            const data = response.data;
            this.notification.success(data.message);
            this.getConstructionApartmentData();
            this.input.atm_id = null;
            this.input.property_type_id = null;
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.project_header
              ? 'Please fill the header field'
              : error.response.data.project_description
              ? 'Please fill the description field'
              : error.response.data.message;
            this.notification.error(message);
          })
          .finally(() => {
            this.isSending = false;
          });
      }
    },

    cancelDelete() {
      this.caId = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.caId = itemId;
      this.isDelete = true;
    },
    cancelConfirmation() {
      this.caId = null;
      this.isDelete = false;
    },
    deleteDevelopmentConstruction() {
      this.isDeleteLoading = true;
      axios
        .delete(`/4walls-construction-apartment/${this.caId}`)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getConstructionApartmentData();
          this.cancelDelete();
        })
        .catch((error) => {
          console.log(error);
          this.notification.error(error.response.data.message);
        })
        .finally(() => {
          this.isDeleteLoading = false;
        });
    },
    openMainImage(prop) {
      this.isOpenMainImage = true;
      this.propertyDataToMainImage = {
        ca_id: prop.ca_id,
        construction_id: prop.construction_id,
        atm_id: prop.atm_id,
        property_type_id: prop.property_type_id,
      };
      this.mainImageFile =
        prop.main_image != null && prop.main_image != ''
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
        ca_id: null,
        construction_id: null,
        atm_id: null,
        property_type_id: null,
      };
    },
    saveMainImage() {
      this.isSending = true;
      const payload = {
        ca_id: this.propertyDataToMainImage.ca_id,
        construction_id: this.propertyDataToMainImage.construction_id,
        atm_id: this.propertyDataToMainImage.atm_id,
        property_type_id: this.propertyDataToMainImage.property_type_id,
        main_image: this.mainImageFile[0],
      };

      axios
        .post(`/4walls-construction-apartment/update`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getConstructionApartmentData();
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
            cf_id: 1,
            construction_id: null,
            image: null,
          };
          this.isOpenMainImage = false;
          this.mainImageFile = [];
        });
    },
    updateMainImageFile(newImageFile) {
      this.mainImageFile.push(newImageFile);
    },
    deleteMainImageFile() {
      this.isSending = true;
      axios
        .delete(`/4walls-construction-apartment/${this.propertyDataToMainImage.ca_id}/main_image`)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getConstructionApartmentData();
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
          this.mainImageFile = [];
        });
    },
    saveBedrooms(item, bedrooms) {
      const payload = {
        ca_id: item.ca_id,
        construction_id: item.construction_id,
        atm_id: item.atm_id,
        property_type_id: item.property_type_id,
        bedrooms: bedrooms,
      };
      axios
        .post(`/4walls-construction-apartment/update`, payload)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getConstructionApartmentData();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    saveBathrooms(item, bathrooms) {
      const payload = {
        ca_id: item.ca_id,
        construction_id: item.construction_id,
        atm_id: item.atm_id,
        property_type_id: item.property_type_id,
        bathrooms: bathrooms,
      };
      axios
        .post(`/4walls-construction-apartment/update`, payload)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getConstructionApartmentData();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    saveArea(item, area) {
      const payload = {
        ca_id: item.ca_id,
        construction_id: item.construction_id,
        atm_id: item.atm_id,
        property_type_id: item.property_type_id,
        area: area,
      };
      axios
        .post(`/4walls-construction-apartment/update`, payload)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getConstructionApartmentData();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    savePriceRange(item, priceRange) {
      const payload = {
        ca_id: item.ca_id,
        construction_id: item.construction_id,
        atm_id: item.atm_id,
        property_type_id: item.property_type_id,
        price_range: priceRange,
      };
      axios
        .post(`/4walls-construction-apartment/update`, payload)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getConstructionApartmentData();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    saveVideoLink(item, videoLink) {
      const payload = {
        ca_id: item.ca_id,
        construction_id: item.construction_id,
        atm_id: item.atm_id,
        property_type_id: item.property_type_id,
        video_link: videoLink,
      };
      axios
        .post(`/4walls-construction-apartment/update`, payload)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getConstructionApartmentData();
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
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
</style>
