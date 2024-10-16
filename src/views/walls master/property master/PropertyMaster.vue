<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <HeaderWallMaster />
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
          <v-col cols="12" md="3">
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
              <template v-for="(item, index) in filteredItems" :key="index">
                <tr class="country-table-body">
                  <td>{{ item.property_id }}</td>
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
                  <td  style="border-bottom: none !important;">
                    <label class="font-weight-bold">Tagline</label>
                  </td>
                  <td style="border-bottom: none !important;">
                    <div class="d-flex align-center">
                      <h3>Active</h3> 
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
                    
                  </td>
                  <td colspan="8"  style="border-bottom: none !important;">
                    <div class="d-flex align-center">
                      <h3>Featured</h3> 
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
                  </td>
                </tr>
                <tr>
                  <td colspan="4" style="border-bottom: none !important;">
                    <v-text-field
                          v-model="item.tag_line"
                          label="Tagline"
                          variant="outlined"
                          density="compact"
                          hide-details
                          clearable
                          @focusout="updateTagline(item.property_id, item.tag_line)"
                        ></v-text-field>
                  </td>
                  <td colspan="6" style="border-bottom: none !important;">
                    <v-row>
                      <v-col cols="12" md="4">
                        <v-autocomplete
                          density="compact"
                          label="Country"
                          placeholder="Country"
                          :items="country"
                          item-title="country_name"
                          item-value="country_id"
                          v-model="item.country_id"
                          variant="outlined"
                          clearable
                          class="mt-5"
                          @update:modelValue="updateCountry(item)"
                        ></v-autocomplete>
                      </v-col>
                      
                      <v-col cols="12" md="4">
                        <v-select
                          v-model="item.city_id"
                          item-title="city_name"
                          item-value="city_id"
                          label="City"
                          variant="outlined"
                          density="compact"
                          required
                          :items="filterCity(item.country_id)"
                          clearable
                          class="mt-5"
                          @update:modelValue="updateCity(item)"
                        ></v-select>
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-select
                          v-model="item.town_id"
                          item-title="town_name"
                          item-value="town_id"
                          label="Town"
                          variant="outlined"
                          density="compact"
                          required
                          :items="filterTown(item.city_id)"
                          clearable
                          class="mt-5"
                          @update:modelValue="updateTown(item)"
                        ></v-select>
                      </v-col>
                    </v-row>
                  </td>
                  <!-- <td colspan="10">
                    <v-row class="mt-4">
                      <v-col cols="12" md="1" class="font-weight-bold align-center ">
                        <h3>Tagline</h3>
                      </v-col>
                      <v-col cols="12" md="3">
                        <div class="d-flex align-center">
                          <h3>Active</h3> 
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
                          <h3>Featured</h3> 
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
                          clearable
                          @focusout="updateTagline(item.property_id, item.tag_line)"
                        ></v-text-field>
                      </v-col>
                      
                      <v-col cols="12" md="1">
                        <v-autocomplete
                          density="compact"
                          label="Country"
                          placeholder="Country"
                          :items="country"
                          item-title="country_name"
                          item-value="country_id"
                          v-model="item.country_id"
                          variant="outlined"
                          clearable
                          @update:modelValue="updateCountry(item)"
                        ></v-autocomplete>
                      </v-col>
                      
                      <v-col cols="12" md="2">
                        <v-select
                          v-model="item.city_id"
                          item-title="city_name"
                          item-value="city_id"
                          label="City"
                          variant="outlined"
                          density="compact"
                          required
                          :items="filterCity(item.country_id)"
                          clearable
                          @update:modelValue="updateCity(item)"
                        ></v-select>
                      </v-col>

                      <v-col cols="12" md="2">
                        <v-select
                          v-model="item.town_id"
                          item-title="town_name"
                          item-value="town_id"
                          label="Town"
                          variant="outlined"
                          density="compact"
                          required
                          :items="filterTown(item.city_id)"
                          clearable
                          @update:modelValue="updateTown(item)"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-text-field
                          v-model="item.latitude"
                          label="Latitude"
                          variant="outlined"
                          density="compact"
                          hide-details
                          clearable
                          @focusout="saveLatitude(item.latitude, item)"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-text-field
                          v-model="item.longitude"
                          label="Longitude"
                          variant="outlined"
                          density="compact"
                          hide-details
                          clearable
                          @focusout="saveLongitude(item.longitude, item)"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="2">
                        <router-link :to="`/property_master/main-info/${item.property_id}`" class="align-center" style="text-decoration: none; color: blue;">
                          <h3>Main Info</h3>
                        </router-link>
                      </v-col>
                      <v-col cols="12" md="2">
                        <h3 class="align-center">Images</h3>
                      </v-col>
                      <v-col cols="12" md="2">
                        <h3 class="align-center">Video</h3>
                        
                      </v-col>
                    </v-row>
                  </td> -->
                </tr>
                <tr>
                  <td colspan="4">
                    <v-text-field
                      v-model="item.video_link"
                      label="Video Link"
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                      @focusout="saveVideoLink(item.video_link, item)"
                    ></v-text-field>
                  </td>
                  <td colspan="6">
                    <v-row>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="item.latitude"
                          label="Latitude"
                          variant="outlined"
                          density="compact"
                          hide-details
                          clearable
                          class="mt-5"
                          @focusout="saveLatitude(item.latitude, item)"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="item.longitude"
                          label="Longitude"
                          variant="outlined"
                          density="compact"
                          hide-details
                          clearable
                          @focusout="saveLongitude(item.longitude, item)"
                          class="mt-5"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-select
                          v-model="item.agent_id"
                          label="Agent"
                          variant="outlined"
                          density="compact"
                          item-title="agent_name"
                          item-value="pa_id"
                          :items="agent"
                          class="mt-5"
                          @update:modelValue="saveAgent(item.agent_id, item)"
                        ></v-select>
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
          <v-btn color="success" text @click="deletePropertyMaster">{{
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
import HeaderWallMaster from '@/components/HeaderWallMaster.vue';
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
    agent: [],
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
  async mounted() {
    this.idConstructionCategory = this.$route.params.id;
    this.getConstructionCategoryData();
    this.getMainCategoryData();
    this.getPropertyTypeData();
    this.getBuildingTypeData();
    await this.getCountryData();
    await this.getCityData();
    await this.getTownData();
    await this.getPropertyMasterData();
    await this.getAgentData();

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
    saveLatitude(latitude, item){
      const payload = {
          property_id: item.property_id,
          category_id: item.category_id,
          cc_id: item.cc_id,
          bt_id: item.bt_id,
          country_id: item.country_id,
          property_type_id: item.property_type_id,
          latitude: latitude,
        };
      axios
        .post(`/4walls-property-master/update`, payload)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getConstructionCategoryData();
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
    },
    saveLongitude(longitude, item){
      const payload = {
          property_id: item.property_id,
          category_id: item.category_id,
          cc_id: item.cc_id,
          bt_id: item.bt_id,
          country_id: item.country_id,
          property_type_id: item.property_type_id,
          longitude: longitude,
        };
        axios
          .post(`/4walls-property-master/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getConstructionCategoryData();
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
    },
    
    saveAgent(agent, item){
      const payload = {
          property_id: item.property_id,
          category_id: item.category_id,
          cc_id: item.cc_id,
          bt_id: item.bt_id,
          country_id: item.country_id,
          property_type_id: item.property_type_id,
          agent_id: agent,
        };
        axios
          .post(`/4walls-property-master/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getConstructionCategoryData();
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
    },
    saveVideoLink(videoLink, item){
      const payload = {
          property_id: item.property_id,
          category_id: item.category_id,
          cc_id: item.cc_id,
          bt_id: item.bt_id,
          country_id: item.country_id,
          property_type_id: item.property_type_id,
          video_link: videoLink,
        };
        axios
          .post(`/4walls-property-master/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getConstructionCategoryData();
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
      this.idPropertyMaster = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.idPropertyMaster = itemId;
      this.isDelete = true;
    },
    cancelConfirmation() {
      this.idPropertyMaster = null;
      this.isDelete = false;
    },
    deletePropertyMaster() {
      this.isDeleteLoading = true;
      axios
        .delete(`/4walls-property-master/${this.idPropertyMaster}`)
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
          this.idPropertyMaster = null;
          this.isDelete = false;
        });
    },
    getMainCategoryData() {
      this.isLoading = true;
      axios
        .get(`/4walls-main-categories`)
        .then((response) => {
          const data = response.data.data;
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
            console.log({
              ...item,
              isActive:
                item.active == 'N' ? false : item.active == 'Y' ? true : null,
              isFeatured:
                item.featured == 'N' ? false : item.featured == 'Y' ? true : null,
              city_id: item.city_id || null,
              town_id: item.town_id || null,
            })
            return {
              ...item,
              isActive:
                item.active == 'N' ? false : item.active == 'Y' ? true : null,
              isFeatured:
                item.featured == 'N' ? false : item.featured == 'Y' ? true : null,
              city_id: item.city_id || null,
              town_id: item.town_id || null,
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
    async getAgentData(){
      this.isLoading = true;
      await axios
        .get(`/4walls-agent-masters/list`)
        .then((response) => {
          const data = response.data.data;
          this.agent = data.map((item) => {
            return {
              pa_id: item.pa_id || 1,
              agent_name: item.agent_name || '',
            };
          });
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
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
              city_id: item.city_id || 1,
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
    getCityData() {
      this.isLoading = true;
      axios
        .get(`/cities`)
        .then((response) => {
          const data = response.data.data;
          this.city = data.map((item) => {
            return {
              city_id: item.city_id || 1,
              city_name: item.city_name || '',
              country_id: item.country_id || 1,
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
    updateCountry(item) {
      this.isSending2 = true;
      const payload = {
        property_id: item.property_id,
        category_id: item.category_id,
        cc_id: item.cc_id,
        bt_id: item.bt_id,
        country_id: item.country_id,
        property_type_id: item.property_type_id,
        city_id: null,
        town_id: null,
      };
      axios
        .post(`/4walls-property-master/update`, payload)
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
    updateCity(item) {
      this.isSending2 = true;
      const payload = {
        property_id: item.property_id,
        category_id: item.category_id,
        cc_id: item.cc_id,
        bt_id: item.bt_id,
        country_id: item.country_id,
        property_type_id: item.property_type_id,
        city_id: item.city_id,
        town_id: null,
      };
      axios
        .post(`/4walls-property-master/update`, payload)
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
    updateTown(item) {
      this.isSending2 = true;
      const payload = {
        property_id: item.property_id,
        category_id: item.category_id,
        cc_id: item.cc_id,
        bt_id: item.bt_id,
        country_id: item.country_id,
        property_type_id: item.property_type_id,
        city_id: item.city_id,
        town_id: item.town_id,
      };
      axios
        .post(`/4walls-property-master/update`, payload)
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
    filterCity(country_id) {
      return this.city.filter((item) => item.country_id === country_id);
    },
    filterTown(city_id) {
      return this.town.filter((item) => item.city_id === city_id);
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
  components: { ImageUpload, HeaderWallMaster },
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
