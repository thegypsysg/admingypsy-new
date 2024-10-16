<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <HeaderWallMaster />
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="input.project_name"
              :rules="rules.nameRules"
              label="Project Name"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="d-flex align-baseline mt-n4">
          <v-col cols="12" md="4">
            <v-autocomplete
              class="mt-8"
              density="compact"
              label="Developer Name"
              placeholder="Developer Name"
              :items="resource.developers"
              :rules="rules.developerRules"
              item-title="partner_name"
              item-value="developer_id"
              v-model="input.developer_id"
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
              class="w-100 mb-8"
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
              class="w-100 mb-8"
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
                <th class="text-left">Project Development Name</th>
                <th class="text-left">Developer Name</th>
                <th class="text-left">Country</th>
                <th class="text-left">Dated</th>
                <th class="text-left"></th>
                <th class="text-center" colspan="2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in filteredItems" :key="item.id">
                <tr>
                  <td style="border-bottom: none !important;">{{ item.development_id }}</td>
                  
                  <td style="font-weight: 500 !important;border-bottom: none !important;">
                    {{ item.project_name }}
                  </td>
                  <td style="font-weight: 500 !important;border-bottom: none !important;">
                    {{ item.developer.partner.partner_name }}
                  </td>
                  <td style="font-weight: 500 !important;border-bottom: none !important;">
                    {{ item.country.country_name }}
                  </td>
                  <td style="font-weight: 500 !important;border-bottom: none !important;">
                    {{ item.dated }}
                  </td>
                  <td style="font-weight: 500 !important;border-bottom: none !important;">
                  </td>
                  <td style="font-weight: 500 !important;border-bottom: none !important;">
                  </td>
                  <td style="border-bottom: none !important;">
                    <div class="d-flex">
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            color="green"
                            variant="text"
                            v-bind="props"
                            @click="editPropertyDevelopment(item)"
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
                            @click="openDeleteConfirm(item.development_id)"
                            icon="mdi-trash-can-outline"
                          ></v-btn>
                        </template>
                        <span>Delete</span>
                      </v-tooltip>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="border-bottom: none !important;">
                    <span class="font-weight-bold">Logo</span>
                    <div class="image-upload-cont">
                      <v-img
                        class="image-upload-item"
                        height="40"
                        @click="openLogo(item)"
                        style="cursor: pointer"
                        :src="
                          item.logo != null
                            ? $fileURL + item.logo
                            : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                        "
                      >
                        <template #placeholder>
                          <div class="skeleton" /> </template
                      ></v-img>
                    </div>
                  </td>
                  <td style="border-bottom: none !important;">
                    <span class="font-weight-bold">Main Image</span>
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
                  <td style="border-bottom: none !important;">
                    <v-autocomplete
                      class="mt-8"
                      density="compact"
                      label="City"
                      placeholder="City"
                      :items="resource.cities"
                      item-title="city_name"
                      item-value="city_id"
                      v-model="item.city_id"
                      variant="outlined"
                      @update:modelValue="setCity(item, $event)"
                    ></v-autocomplete>
                  </td>
                  <td style="border-bottom: none !important;">
                    <v-autocomplete
                      class="mt-8"
                      density="compact"
                      label="Town"
                      placeholder="Town"
                      :items="resource.towns"
                      item-title="town_name"
                      item-value="town_id"
                      v-model="item.town_id"
                      variant="outlined"
                      @update:modelValue="setTown(item, $event)"
                    ></v-autocomplete>
                  </td>
                  <td style="border-bottom: none !important;">
                    <span class="font-weight-bold">Active</span>
                    <v-btn-toggle
                      style="
                        font-size: 10px !important;
                        font-weight: 200 !important;
                        height: 22px !important;
                        width: 54px !important;
                      "
                      class="d-flex align-center"
                      v-model="item.isActive"
                      :disabled="isSending2"
                      rounded="5"
                      @click="activePropertyDevelopment(item.development_id)"
                    >
                      <v-btn size="27" :value="true"> Yes </v-btn>

                      <v-btn size="27" :value="false"> No </v-btn>
                    </v-btn-toggle>
                  </td>
                  <td style="border-bottom: none !important;">
                    <span class="font-weight-bold">Featured</span>
                    <v-btn-toggle
                      style="
                        font-size: 10px !important;
                        font-weight: 200 !important;
                        height: 22px !important;
                        width: 54px !important;
                      "
                      class="d-flex align-center"
                      v-model="item.isFeatured"
                      :disabled="isSending2"
                      rounded="5"
                      @click="featuredPropertyDevelopment(item.development_id)"
                    >
                      <v-btn size="27" :value="true"> Yes </v-btn>

                      <v-btn size="27" :value="false"> No </v-btn>
                    </v-btn-toggle>
                  </td>
                  <td style="border-bottom: none !important;">
                    <span class="font-weight-bold">Under Construction</span>
                    <v-btn-toggle
                      style="
                        font-size: 10px !important;
                        font-weight: 200 !important;
                        height: 22px !important;
                        width: 54px !important;
                      "
                      class="d-flex align-center"
                      v-model="item.isUnderConstruction"
                      :disabled="isSending2"
                      rounded="5"
                      @click="underConstructionPropertyDevelopment(item.development_id)"
                    >
                      <v-btn size="27" :value="true"> Yes </v-btn>

                      <v-btn size="27" :value="false"> No </v-btn>
                    </v-btn-toggle>
                  </td>
                  <td style="border-bottom: none !important;"></td>
                </tr>
                <tr>
                  <td style="border-bottom: none !important;" colspan="2">
                    <v-select
                      density="compact"
                      v-model="item.agent_id"
                      label="Agent"
                      variant="outlined"
                      hide-details
                      :items="resource.agents"
                      item-title="agent_name"
                      item-value="pa_id"
                      @update:modelValue="saveAgent(item.agent_id, item)"
                    ></v-select>
                  </td>
                  <td style="border-bottom: none !important;">
                    <v-text-field 
                      density="compact"
                      v-model="item.latitude"
                      label="Latitude"
                      variant="outlined"
                      hide-details
                      @blur="saveLatitude(item.latitude, item)"
                    ></v-text-field>
                  </td>
                  <td style="border-bottom: none !important;">
                    <v-text-field 
                      density="compact"
                      v-model="item.longitude"
                      label="Longitude"
                      variant="outlined"
                      hide-details
                      @blur="saveLongitude(item.longitude, item)"
                    ></v-text-field>
                  </td>
                  <td style="border-bottom: none !important;">
                    <span class="font-weight-bold">Completion :</span>
                  </td>
                  <td style="border-bottom: none !important;">
                    <span class="font-weight-bold">Month :</span>
                    <v-text-field 
                      density="compact"
                      v-model="item.completion_month"
                      variant="outlined"
                      hide-details
                      @blur="saveCompletionMonth(item.completion_month, item)"
                    ></v-text-field>
                  </td>
                  <td style="border-bottom: none !important;">
                    <span class="font-weight-bold">Year :</span>
                    <v-text-field 
                      density="compact"
                      v-model="item.completion_year"
                      variant="outlined"
                      hide-details
                      @blur="saveCompletionYear(item.completion_year, item)"
                    ></v-text-field>
                  </td>
                  <td style="border-bottom: none !important;"></td>
                </tr>
                <tr>
                  <td>
                    <router-link
                      active-class="text-blue-accent-4"
                      style="color: blue"
                      font-weight="bold"
                      class="text-decoration-none"
                      :to="`/property_developments/main-info/${item.development_id}`"
                    >
                      <h4>Main Info</h4>
                    </router-link>
                  </td>
                  <td>More Image</td>
                  <td>Videos</td>
                  <td>
                    <router-link
                      active-class="text-blue-accent-4"
                      style="color: blue"
                      font-weight="bold"
                      class="text-decoration-none"
                      :to="`/property_developments/development_construction/${item.development_id}`"
                    >
                      <h4>Construction</h4>
                    </router-link>
                  </td>
                  <td colspan="5"></td>
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
        <v-card-text>
          Are you sure want to delete this property type?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelDelete">No</v-btn>
          <v-btn color="success" text @click="deletePropertyDevelopment">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent width="auto" v-model="isOpenMainImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4">
          Upload Image - Property Developments</v-card-title
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
          <v-btn
            style="text-transform: none"
            color="error"
            text
            @click="closeMainImage"
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
    <v-dialog persistent width="auto" v-model="isOpenLogo">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4">
          Upload Image - Property Developments</v-card-title
        >
        <v-card-text>
          <image-upload
            :image-file="logoFile"
            @update-image-file="updateLogoFile"
            @delete-image-file="deleteLogoFile"
          />
        </v-card-text>
        <v-card-actions class="mt-16">
          <v-spacer></v-spacer>
          <v-btn
            style="text-transform: none"
            color="error"
            text
            @click="closeLogo"
            >Cancel</v-btn
          >
          <v-btn
            style="background-color: #9ddcff; text-transform: none"
            color="black"
            @click="saveLogo"
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
import HeaderWallMaster from '@/components/HeaderWallMaster.vue';
// import app from '@/util/eventBus';

export default {
  name: 'PropertyTypes',
  data: () => ({
    //fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    valid: false,
    isLoading: false,
    isSending: false,
    isEdit: false,
    isSuccess: false,
    isError: false,
    isDelete: false,
    isDeleteLoading: false,
    propertyIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    mainImageFile: [],
    logoFile: [],
    propertyDataToMainImage: {
      development_id: 0,
      project_name: null,
      developer_id: null,
      country_id: null,
      city_id: null,
      town_id: null,
    },
    propertyDataToLogo: {
      development_id: 0,
      project_name: null,
      developer_id: null,
      country_id: null,
      city_id: null,
      town_id: null,
    },
    isOpenMainImage: false,
    isOpenLogo: false,
    successMessage: '',
    errorMessage: '',
    input: {
      development_id: 0,
      project_name: null,
      developer_id: null,
      country_id: null,
      city_id: null,
      town_id: null,
      logo: null,
      main_image: null,
    },
    resource: {
      app: [],
      agents: [],
    },
    rules: {
      nameRules: [
        (value) => {
          if (value) return true;
          return 'Project name is required.';
        },
      ],
      developerRules: [
        (value) => {
          if (value) return true;
          return 'Developer is required.';
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
    this.getPropertyDevelopersData();
    this.getPropertyDevelopmentsData();
    this.getCityData();
    this.getTownData();
    this.getAgentsData();
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.items;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTextLower) ||
          item.desc.toLowerCase().includes(searchTextLower)
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
    setCity(prop, value) {
      this.input.city_id = value;
      this.isSending = true;
      const payload = {
        development_id: prop.development_id,
        project_name: prop.project_name,
        developer_id: prop.developer_id,
        country_id: prop.country_id,
        city_id: this.input.city_id,
      };
      http
        .post(`/4walls-property-developments/update`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPropertyDevelopmentsData();
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
            development_id: 0,
            project_name: null,
            developer_id: null,
            country_id: null,
            city_id: null,
            town_id: null,
          };
          this.isOpenMainImage = false;
          this.mainImageFile = [];
        });
    },
    setTown(prop, value) {
      this.input.town_id = value;
      this.isSending = true;
      const payload = {
        development_id: prop.development_id,
        project_name: prop.project_name,
        developer_id: prop.developer_id,
        country_id: prop.country_id,
        town_id: this.input.town_id,
      };
      http
        .post(`/4walls-property-developments/update`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPropertyDevelopmentsData();
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
            development_id: 0,
            project_name: null,
            developer_id: null,
            country_id: null,
            city_id: null,
            town_id: null,
          };
          this.isOpenMainImage = false;
          this.mainImageFile = [];
        });
    },
    updateLogoFile(newImageFile) {
      this.logoFile.push(newImageFile);
    },
    updateMainImageFile(newImageFile) {
      this.mainImageFile.push(newImageFile);
    },
    deleteMainImageFile() {
      this.isSending = true;
      axios
        .delete(
          `/4walls-property-developments/${this.propertyDataToMainImage.development_id}/main-image`
        )
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPropertyDevelopmentsData();
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
    deleteLogoFile() {
      this.isSending = true;
      axios
        .delete(
          `/4walls-property-developments/${this.propertyDataToLogo.development_id}/logo`
        )
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPropertyDevelopmentsData();
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
          // this.propertyDataToLogo = {
          //   development_id: 0,
          //   project_name: null,
          //   developer_id: null,
          //   country_id: null,
          //   city_id: null,
          //   town_id: null,
          // };
          this.logoFile = [];
        });
    },
    openLogo(prop) {
      this.isOpenLogo = true;
      this.propertyDataToLogo = {
        development_id: prop.development_id,
        project_name: prop.project_name,
        developer_id: prop.developer_id,
        country_id: prop.country_id,
        city_id: prop.city_id,
        town_id: prop.town_id,
      };
      this.logoFile =
        prop.logo != null
          ? [
              {
                file: {
                  name: prop.logo,
                  size: '',
                  base64: '',
                  format: '',
                },
              },
            ]
          : [];
    },
    closeLogo() {
      this.isOpenLogo = false;
      this.logoFile = [];
      this.propertyDataToLogo = {
        development_id: 0,
        project_name: null,
        developer_id: null,
        country_id: null,
        city_id: null,
        town_id: null,
      };
    },
    saveLogo() {
      this.isSending = true;
      const payload = {
        development_id: this.propertyDataToLogo.development_id,
        project_name: this.propertyDataToLogo.project_name,
        developer_id: this.propertyDataToLogo.developer_id,
        country_id: this.propertyDataToLogo.country_id,
        city_id: this.propertyDataToLogo.city_id,
        town_id: this.propertyDataToLogo.town_id,
        logo: this.logoFile[0],
      };
      http
        .post(`/4walls-property-developments/update`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPropertyDevelopmentsData();
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
          this.propertyDataToLogo = {
            development_id: 0,
            project_name: null,
            developer_id: null,
            country_id: null,
            city_id: null,
            town_id: null,
          };
          this.isOpenLogo = false;
          this.logoFile = [];
        });
    },
    openMainImage(prop) {
      this.isOpenMainImage = true;
      this.propertyDataToMainImage = {
        development_id: prop.development_id,
        project_name: prop.project_name,
        developer_id: prop.developer_id,
        country_id: prop.country_id,
        city_id: prop.city_id,
        town_id: prop.town_id,
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
        development_id: 0,
        project_name: null,
        developer_id: null,
        country_id: null,
        city_id: null,
        town_id: null,
      };
    },
    saveMainImage() {
      this.isSending = true;
      const payload = {
        development_id: this.propertyDataToMainImage.development_id,
        project_name: this.propertyDataToMainImage.project_name,
        developer_id: this.propertyDataToMainImage.developer_id,
        country_id: this.propertyDataToMainImage.country_id,
        city_id: this.propertyDataToMainImage.city_id,
        town_id: this.propertyDataToMainImage.town_id,
        main_image: this.mainImageFile[0],
      };
      console.log(this.mainImageFile);
      http
        .post(`/4walls-property-developments/update`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPropertyDevelopmentsData();
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
            development_id: 0,
            project_name: null,
            developer_id: null,
            country_id: null,
            city_id: null,
            town_id: null,
          };
          this.isOpenMainImage = false;
          this.mainImageFile = [];
        });
    },
    editPropertyDevelopment(prop) {
      this.isEdit = true;
      this.input = {
        development_id: prop.development_id,
        project_name: prop.project_name,
        developer_id: prop.developer_id,
        country_id: prop.country_id,
        city_id: prop.city_id,
        town_id: prop.town_id,
        logo: prop.logo,
        main_image: prop.main_image,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        development_id: 0,
        project_name: null,
        developer_id: null,
        country_id: null,
        city_id: null,
        town_id: null,
        logo: null,
        main_image: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          development_id: this.input.development_id,
          project_name: this.input.project_name,
          developer_id: this.input.developer_id,
          country_id: this.input.country_id,
          city_id: this.input.city_id,
          town_id: this.input.town_id,
          logo: this.input.logo,
          main_image: this.input.main_image,
        };
        axios
          .post(`/4walls-property-developments/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getPropertyDevelopmentsData();
            this.input = {
              development_id: 0,
              project_name: null,
              developer_id: null,
              country_id: null,
              city_id: null,
              town_id: null,
              logo: null,
              main_image: null,
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
          project_name: this.input.project_name,
          developer_id: this.input.developer_id,
        };
        axios
          .post(`/4walls-property-developments`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getPropertyDevelopmentsData();
            this.input = {
              id: 0,
              name: null,
              desc: null,
              image: null,
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
    deletePropertyDevelopment() {
      this.isDeleteLoading = true;
      axios
        .delete(`/4walls-property-developments/${this.propertyIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPropertyDevelopmentsData();
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
          this.propertyIdToDelete = null;
          this.isDelete = false;
        });
    },
    getPropertyDevelopmentsData() {
      this.isLoading = true;
      axios
        .get(`/4walls-property-developments`)
        .then((response) => {
          const data = response.data.data;
          this.items = data.map((item) => {
            console.log(item);
            return {
              development_id: item.development_id || 1,
              project_name: item.project_name || '',
              developer_id: item.developer_id || 1,
              developer: item.developer || null,
              country: item.country || null,
              city: item.city || null,
              town: item.town || null,
              country_id: item.country_id || null,
              city_id: item.city_id || null,
              town_id: item.town_id || null,
              logo: item.logo || null,
              main_image: item.main_image || null,
              isActive:
                item.active == 'N' ? false : item.active == 'Y' ? true : null,
              isFeatured:
                item.featured == 'N'
                  ? false
                  : item.featured == 'Y'
                  ? true
                  : null,
              isUnderConstruction:
                item.under_construction == 'N'
                  ? false
                  : item.under_construction == 'Y'
                  ? true
                  : null,
              dated: item.dated || '',
              latitude: item.latitude || '',
              longitude: item.longitude || '',
              completion_month: item.completion_month || '',
              completion_year: item.completion_year || '',
              pa_id: item.agent_id || null,
              agent_id: item.agent_id || null,
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
    getPropertyDevelopersData() {
      this.isLoading = true;
      axios
        .get(`/4walls-property-developers`)
        .then((response) => {
          this.resource.developers = response.data.data;
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
    getCityData() {
      axios
        .get(`/cities`)
        .then((response) => {
          this.resource.cities = response.data.data;
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
    getTownData() {
      axios.get(`/towns`).then((response) => {
          this.resource.towns = response.data.data;
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
    getAgentsData() {
      axios.get(`/4walls-agent-masters`).then((response) => {
        this.resource.agents = response.data.data;
      });
    },
    saveAgent(agent_id, item) {
      this.isSending2 = true;
      axios.post(`/4walls-property-developments/update`, {
        development_id: item.development_id,
        project_name: item.project_name,
        developer_id: item.developer_id,
        agent_id: agent_id,
      }).then((response) => {
        const data = response.data;
        this.successMessage = data.message;
        this.isSuccess = true;
        this.getPropertyDevelopmentsData();
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
        this.isSending2 = false;
      });
    },
    featuredPropertyDevelopment(id) {
      this.isSending2 = true;
      axios
        .get(`/4walls-property-developments/toggle-featured/${id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPropertyDevelopersData();
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
    underConstructionPropertyDevelopment(id) {
      this.isSending2 = true;
      axios
        .get(`/4walls-property-developments/toggle-under-construction/${id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPropertyDevelopersData();
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
    activePropertyDevelopment(developer_id) {
      this.isSending2 = true;
      axios
        .get(`/4walls-property-developments/toggle-active/${developer_id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPropertyDevelopersData();
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
    saveLatitude(latitude, item) {
      this.isSending2 = true;
      axios
        .post(`/4walls-property-developments/update`, {
          development_id: item.development_id,
          project_name: item.project_name,
          developer_id: item.developer_id,
          latitude: latitude,
        })
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPropertyDevelopmentsData();
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
    saveLongitude(longitude, item) {
      this.isSending2 = true;
      axios
        .post(`/4walls-property-developments/update`, {
          development_id: item.development_id,
          project_name: item.project_name,
          developer_id: item.developer_id,
          longitude: longitude,
        })
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPropertyDevelopmentsData();
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
    saveCompletionMonth(completion_month, item) {
      this.isSending2 = true;
      axios
        .post(`/4walls-property-developments/update`, {
          development_id: item.development_id,
          project_name: item.project_name,
          developer_id: item.developer_id,
          completion_month: completion_month,
        })
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPropertyDevelopmentsData();
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
    saveCompletionYear(completion_year, item) {
      this.isSending2 = true;
      axios
        .post(`/4walls-property-developments/update`, {
          development_id: item.development_id,
          project_name: item.project_name,
          developer_id: item.developer_id,
          completion_year: completion_year,
        })
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPropertyDevelopmentsData();
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
  components: { ImageUpload, HeaderWallMaster },
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
