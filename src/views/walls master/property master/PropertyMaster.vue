<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <div class="d-flex ml-4 mb-4" style="gap: 30px">
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/property_developers"
        >
          <h4>On Board Property Developers</h4>
        </router-link>
        <!-- <router-link
          active-class="text-purple-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/mall-country"
        >
          <h4 class="mt-4">Country / City</h4>
        </router-link> -->
      </div>
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/property_developments"
        >
          <h4>New Projects</h4>
        </router-link>
      </div>
      <div>
        <router-link
          active-class="text-blue-accent-4"
          class="text-decoration-none"
          to=""
        >
          <h4>On-Board Agents</h4>
        </router-link>

        <!-- <router-link
          active-class="text-purple-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/manage_events"
        >
          <h4 class="mt-4">Manage Events</h4>
        </router-link> -->
      </div>

      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to=""
        >
          <h4>Manage Tenants</h4>
        </router-link>

        <!-- <router-link
          active-class="text-red-darken-4"
          style="color: black"
          class="text-decoration-none"
          to="/manage_levels"
        >
          <h4 class="mt-4">Manage Levels</h4>
        </router-link> -->
      </div>
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to=""
        >
          <h4>Country/City</h4>
        </router-link>

        <!-- <router-link
          active-class="text-blue-darken-4"
          style="color: black"
          class="text-decoration-none"
          to="/manage_services"
        >
          <h4 class="mt-4">Manage Services</h4>
        </router-link> -->
      </div>
    </div>
    <div class="d-flex ml-4 mb-4" style="gap: 30px">
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/property_types"
        >
          <h4>Property Types</h4>
        </router-link>
        
      </div>
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/main_categories"
        >
          <h4>Main Categories</h4>
        </router-link>
      </div>
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/construction_category"
        >
          <h4>Construction Category</h4>
        </router-link>
      </div>
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/construction_master"
        >
          <h4>Construction Master</h4>
        </router-link>
      </div>
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/building_type"
        >
          <h4>Building Type</h4>
        </router-link>
      </div>
    </div>
    <div class="d-flex ml-4 mb-4" style="gap: 30px">
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/facilities"
        >
          <h4>Facilities</h4>
        </router-link>
        
      </div>
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/property_master"
        >
          <h4>On-Board Property</h4>
        </router-link>
      </div>
    </div>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="3">
            <v-select
              class="mt-8"
              v-model="input.category_id"
              :rules="rules.mainCategoryRules"
              item-title="category_name"
              item-value="category_id"
              label="Main Category"
              variant="outlined"
              density="compact"
              required
              :items="mainCategory"
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              class="mt-8"
              v-model="input.property_type_id"
              :rules="rules.propertyTypeRules"
              item-title="property_name"
              item-value="property_type_id"
              label="Property Type"
              variant="outlined"
              density="compact"
              required
              :items="propertyType"
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              class="mt-8"
              v-model="input.cc_id"
              :rules="rules.constructionCategoryRules"
              item-title="category_name"
              item-value="cc_id"
              label="Construction Category"
              variant="outlined"
              density="compact"
              required
              :items="constructionCategory"
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              class="mt-8"
              v-model="input.bt_id"
              :rules="rules.buildingTypeRules"
              item-title="building_type"
              item-value="bt_id"
              label="Building Type"
              variant="outlined"
              density="compact"
              required
              :items="buildingType"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="2">
            <v-select
              v-model="input.country_id"
              :rules="rules.countryRules"
              item-title="country_name"
              item-value="country_id"
              label="Country"
              variant="outlined"
              density="compact"
              required
              :items="country"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
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
          <v-col cols="12" md="2">
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
                <th class="text-left font-weight-bold text-black">Reference ID</th>
                <th class="text-left font-weight-bold text-black">Image</th>
                <th class="text-left font-weight-bold text-black">Main Category</th>
                <th class="text-left font-weight-bold text-black">Property Type</th>
                <th class="text-left font-weight-bold text-black">Construction Category</th>
                <th class="text-left font-weight-bold text-black">Building Type</th>
                <th class="text-left font-weight-bold text-black">User</th>
                <th class="text-left font-weight-bold text-black">Dated</th>
                <th class="text-left font-weight-bold text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in filteredItems" :key="item.id">
                <tr class="country-table-body">
                  <td>{{ item.cc_id }}</td>
                  <td>{{ item.property_ref_no }}</td>
                  <td>
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
                  <td>{{ item.main_category.category_name }}</td>
                  <td>{{ item.property_type.property_name }}</td>
                  <td>{{ item.construction_category.category_name }}</td>
                  <td>{{ item.building_type.building_type }}</td>
                  <td>
                    {{ item.user.name }}
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
                            @click="editPropertyMaster(item)"
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
                            @click="openDeleteConfirm(item.property_id)"
                            icon="mdi-trash-can-outline"
                          ></v-btn>
                        </template>
                        <span>Delete</span>
                      </v-tooltip>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="6">
                    <v-row class="mt-4">
                      <v-col cols="12" md="1" class="font-weight-bold align-center ">
                        Tagline
                      </v-col>
                      <v-col cols="12" md="3">
                        <div class="d-flex align-center">
                          Active 
                          <v-btn-toggle
                            style="
                              font-size: 10px !important;
                              font-weight: 200 !important;
                              height: 22px !important;
                              width: 54px !important;
                              margin-left: 10px;
                            "
                            class="d-flex align-center"
                            v-model="item.isActive"
                            rounded="5"
                            @click="activePropertyMaster(item.property_id)"
                          >
                            <v-btn size="27" :value="true"> Yes </v-btn>

                            <v-btn size="27" :value="false"> No </v-btn>
                          </v-btn-toggle>
                        </div>
                      </v-col>
                      <v-col cols="12" md="3">
                        <div class="d-flex align-center">
                          Featured 
                          <v-btn-toggle
                            style="
                              font-size: 10px !important;
                              font-weight: 200 !important;
                              height: 22px !important;
                              width: 54px !important;
                              margin-left: 10px;
                            "
                            class="d-flex align-center"
                            v-model="item.isFeatured"
                            rounded="5"
                            @click="featuredPropertyMaster(item.property_id)"
                          >
                            <v-btn size="27" :value="true"> Yes </v-btn>

                            <v-btn size="27" :value="false"> No </v-btn>
                          </v-btn-toggle>
                        </div>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="3">
                        <v-text-field
                          v-model="item.tag_line"
                          label="Tagline"
                          variant="outlined"
                          density="compact"
                          hide-details
                          @focusout="updateTagline(item.property_id, item.tag_line)"
                        ></v-text-field>
                      </v-col>
                      
                      <v-col cols="12" md="3">
                        <v-select
                          v-model="item.country_id"
                          item-title="country_name"
                          item-value="country_id"
                          label="Country"
                          variant="outlined"
                          density="compact"
                          required
                          :items="country"
                          @update:modelValue="updateCountry(item.property_id, item.country_id)"
                        ></v-select>
                      </v-col>
                      
                      <v-col cols="12" md="3">
                        <v-select
                          v-model="item.town_id"
                          item-title="town_name"
                          item-value="town_id"
                          label="Town"
                          variant="outlined"
                          density="compact"
                          required
                          :items="town"
                          @update:modelValue="updateTown(item.property_id, item.town_id)"
                        ></v-select>
                      </v-col>
                      
                      <v-col cols="12" md="3">
                        <v-select
                          v-model="item.city_id"
                          item-title="city_name"
                          item-value="city_id"
                          label="City"
                          variant="outlined"
                          density="compact"
                          required
                          :items="city"
                          @update:modelValue="updateCity(item.property_id, item.city_id)"
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="2">
                        Main Info
                      </v-col>
                      <v-col cols="12" md="2">
                        Images
                      </v-col>
                      <v-col cols="12" md="2">
                        Video
                      </v-col>
                    </v-row>
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
        <v-card-text> Are you sure want to delete this construction category? </v-card-text>
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
          Upload Image - Construction Category</v-card-title
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
  name: 'PropertyMaster',
  data: () => ({
    // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    idPropertyMaster: null,
    valid: false,
    isLoading: false,
    isSending: false,
    isSending2: false,
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
    mainCategory: [],
    propertyType: [],
    buildingType: [],
    constructionCategory: [],
    propertyMaster: [],
    country: [],
    town: [],
    city: [],
    propertyDataToMainImage: {
      property_id: null,
      category_id: null,
      cc_id: null,
      bt_id: null,
      country_id: null,
      property_type_id: null,
      main_image: null,
      tag_line: null,
    },
    input: {
      property_id: null,
      category_id: null,
      cc_id: null,
      bt_id: null,
      country_id: null,
      property_type_id: null,
    },
    rules: {
      mainCategoryRules: [
        (value) => {
          if (value) return true;
          return 'Main Category is required.';
        },
      ],
      propertyTypeRules: [
        (value) => {
          if (value) return true;
          return 'Property Type is required.';
        },
      ],
      constructionCategoryRules: [
        (value) => {
          if (value) return true;
          return 'Construction Category is required.';
        },
      ],
      buildingTypeRules: [
        (value) => {
          if (value) return true;
          return 'Building Type is required.';
        },
      ],
      countryRules: [
        (value) => {
          if (value) return true;
          return 'Country is required.';
        },
      ],
    },
    search: '',
    items: [],
    resource: {
      construction_category: [],
    },
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.idConstructionCategory = this.$route.params.id;
    this.getConstructionCategoryData();
    this.getMainCategoryData();
    this.getPropertyTypeData();
    this.getBuildingTypeData();
    this.getPropertyMasterData();
    this.getCountryData();
    this.getTownData();
    this.getCityData();
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.propertyMaster;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.propertyMaster.filter(
        (item) =>
          item.property_name.toLowerCase().includes(searchTextLower) 
      );
    },
  },
  methods: {
    editPropertyMaster(item) {
      this.isEdit = true;
      this.input = {
        property_id: item.property_id,
        category_id: item.main_category.category_id,
        cc_id: item.cc_id,
        bt_id: item.building_type.bt_id,
        country_id: item.country.country_id,
        property_type_id: item.property_type.property_type_id,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        property_id: 0,
        category_id: null,
        cc_id: null,
        building_type_id: null,
        country_id: null,
        property_type_id: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          property_id: this.input.property_id,
          category_id: this.input.category_id,
          cc_id: this.input.cc_id,
          bt_id: this.input.bt_id,
          country_id: this.input.country_id,
          property_type_id: this.input.property_type_id,
        };
        axios
          .post(`/4walls-property-master/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getConstructionCategoryData();
            this.input = {
              property_id: null,
              category_id: null,
              cc_id: null,
              building_type_id: null,
              country_id: null,
              property_type_id: null,
            };
          })
          .catch((error) => {
            console.log(error);
            const message = error.response.data.category_name
              ? 'Please fill the category name field'
              : error.response.data.message;
            this.errorMessage = message;
            this.isError = true;
          })
          .finally(() => {
            this.isSending = false;
          });
      } 

    },
    saveData() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          category_id: this.input.category_id,
          property_type_id: this.input.property_type_id,
          cc_id: this.input.cc_id,
          bt_id: this.input.bt_id,
          country_id: this.input.country_id,
        };
        axios
          .post(`/4walls-property-master`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getPropertyMasterData();
            this.input = {
              property_id: null,
              main_category_id: null,
              construction_category_id: null,
              building_type_id: null,
              country_id: null,
              property_type_id: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.category_name
              ? error.response.data.category_name[0]
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
      this.idConstructionCategory = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.idConstructionCategory = itemId;
      this.isDelete = true;
    },
    cancelConfirmation() {
      this.idConstructionCategory = null;
      this.isDelete = false;
    },
    deleteLocation() {
      this.isDeleteLoading = true;
      axios
        .delete(`/4walls-property-master/${this.idConstructionCategory}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPropertyMasterData();
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
          this.idConstructionCategory = null;
          this.isDelete = false;
        });
    },
    getMainCategoryData() {
      this.isLoading = true;
      axios
        .get(`/4walls-main-categories`)
        .then((response) => {
          const data = response.data.data;
          console.log(data);
          this.mainCategory = data.map((item) => {
            return {
              category_id: item.category_id || 1,
              category_name: item.category_name || '',
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
    getPropertyTypeData() {
      this.isLoading = true;
      axios
        .get(`/four-walls-property-types`)
        .then((response) => {
          const data = response.data.data;
          console.log(data);
          this.propertyType = data.map((item) => {
            return {
              property_type_id: item.property_type_id || 1,
              property_name: item.property_name || '',
            };
          });
        }).catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === ''
              ? 'Something Wrong!!!'
              : error.response.data.message;
          this.errorMessage = message;
          this.isError = true;
        }).finally(() => {
          this.isLoading = false;
        });
    },
    getConstructionCategoryData() {
      this.isLoading = true;
      axios
        .get(`/4walls-construction-categories`)
        .then((response) => {
          const data = response.data.data;
          console.log(data);
          this.constructionCategory = data.map((item) => {
            return {
              cc_id: item.cc_id || 1,
              category_name: item.category_name || '',
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
    getBuildingTypeData() {
      this.isLoading = true;
      axios
        .get(`/4walls-building-types`)
        .then((response) => {
          const data = response.data.data;
          console.log(data);
          this.buildingType = data.map((item) => {
            return {
              bt_id: item.bt_id || 1,
              building_type: item.building_type || '',
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
    getPropertyMasterData() {
      this.isLoading = true;
      axios
        .get(`/4walls-property-master`)
        .then((response) => {
          this.propertyMaster = response.data.data.map((item) => {
            return {
              ...item,
              isActive:
                item.active == 'N' ? false : item.active == 'Y' ? true : null,
              isFeatured:
                item.featured == 'N' ? false : item.featured == 'Y' ? true : null,

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
    getCountryData() {
      this.isLoading = true;
      axios
        .get(`/countries`)
        .then((response) => {
          const data = response.data.data;
          console.log(data);
          this.country = data.map((item) => {
            return {
              country_id: item.country_id || 1,
              country_name: item.country_name || '',
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
    getTownData() {
      this.isLoading = true;
      axios
        .get(`/towns`)
        .then((response) => {
          const data = response.data.data;
          this.town = data.map((item) => {
            return {
              town_id: item.town_id || 1,
              town_name: item.town_name || '',
            };
          });
          console.log(data);
        }).catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === ''
              ? 'Something Wrong!!!'
              : error.response.data.message;
          this.errorMessage = message;
          this.isError = true;
        }).finally(() => {
          this.isLoading = false;
        });
    },
    getCityData() {
      this.isLoading = true;
      axios
        .get(`/cities`)
        .then((response) => {
          const data = response.data.data;
          console.log(data);
          this.city = data.map((item) => {
            return {
              city_id: item.city_id || 1,
              city_name: item.city_name || '',
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
        }).finally(() => {
          this.isLoading = false;
        });
    },
    activePropertyMaster(id) {
      this.isSending2 = true;
      axios
        .get(`/4walls-property-master/toggle-active/${id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPropertyMasterData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        .finally(() => {
          this.isSending2 = false;
        });
    },  
    featuredPropertyMaster(id) {
      this.isSending2 = true;
      axios
        .get(`/4walls-property-master/toggle-featured/${id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPropertyMasterData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        .finally(() => {
          this.isSending2 = false;
        });
    },

    updateTagline(id, tagline) {
      this.isSending2 = true;
      const payload = {
        tag_line: tagline,
      };
      axios
        .post(`/4walls-property-master/update-tagline/${id}`, payload)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPropertyMasterData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        .finally(() => {
          this.isSending2 = false;
        });
    },
    updateCountry(id, country_id) {
      this.isSending2 = true;
      const payload = {
        country_id: country_id,
      };
      axios
        .post(`/4walls-property-master/update-country/${id}`, payload)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPropertyMasterData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        .finally(() => {
          this.isSending2 = false;
        });
    },
    updateCity(id, city_id) {
      this.isSending2 = true;
      const payload = {
        city_id: city_id,
      };
      axios
        .post(`/4walls-property-master/update-city/${id}`, payload)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPropertyMasterData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        .finally(() => {
          this.isSending2 = false;
        });
    },
    updateTown(id, town_id) {
      this.isSending2 = true;
      const payload = {
        town_id: town_id,
      };
      axios
        .post(`/4walls-property-master/update-town/${id}`, payload)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPropertyMasterData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        .finally(() => {
          this.isSending2 = false;
        });
    },
    openMainImage(prop) {
      this.isOpenImage = true;
      this.propertyDataToMainImage = {
        property_id: prop.property_id,
        main_image: prop.main_image,
        category_id: prop.category_id,
        cc_id: prop.cc_id,
        bt_id: prop.bt_id,
        country_id: prop.country_id,
        property_type_id: prop.property_type_id,
      };
      this.imageFile =
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
    closeImage() {
      this.isOpenImage = false;
      this.imageFile = [];
      this.propertyDataToMainImage = {
        property_id: null,
        category_id: null,
        cc_id: null,
        building_type_id: null,
        country_id: null,
        property_type_id: null,
        main_image: null,
      };
    },
    saveImage() {
      this.isSending = true;
      const payload = {
        property_id: this.propertyDataToMainImage.property_id,
        category_id: this.propertyDataToMainImage.category_id,
        cc_id: this.propertyDataToMainImage.cc_id,
        bt_id: this.propertyDataToMainImage.bt_id,
        country_id: this.propertyDataToMainImage.country_id,
        property_type_id: this.propertyDataToMainImage.property_type_id,
        main_image: this.imageFile[0],
      };

      axios
        .post(`/4walls-property-master/update`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPropertyMasterData();
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
            property_id: null,
            category_id: null,
            cc_id: null,
            bt_id: null,
            country_id: null,
            property_type_id: null,
            main_image: null,
          };
          this.isOpenImage = false;
          this.imageFile = [];
        });
    },
    updateImageFile(newImageFile) {
      this.imageFile.push(newImageFile);
    },
    deleteImageFile() {
      this.isSending = true;
      axios
        .delete(
          `/4walls-property-master/${this.propertyDataToMainImage.property_id}/main_image`
        )
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPropertyMasterData();
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
          // this.propertyDataToImage = {
          //   app_id: 1,
          //   app_group_id: 1,
          //   app_name: '',
          //   app_description: '',
          //   app_detail: '',
          // };
          this.imageFile = [];
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
