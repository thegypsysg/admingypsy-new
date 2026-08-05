<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <HeaderWallMaster />  
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="input.category_name"
              :rules="rules.nameRules"
              label="Category Name"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="d-flex align-baseline mt-n4">
          <v-col cols="12" md="4">
            <v-textarea
              density="compact"
              v-model="input.description"
              label="Category Description"
              rows="3"
              variant="outlined"
              required
              style="height: 100px !important;"
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
              style="text-transform: none;margin-top: -30px !important;"
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
          <v-col cols="12" md="1">
            <v-btn
              v-if="isEdit"
              prepend-icon="mdi-account-multiple-remove"
              color="red"
              style="text-transform: none;margin-top: -30px !important;"
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
                <th class="text-left">Main Image</th>
                <th class="text-left">Long Image</th>
                <th class="text-left">Icon</th>
                <th class="text-left">Category Name</th>
                <th class="text-left">Category Description</th>
                <th class="text-left">Active</th>
                <th class="text-left">User</th>
                <th class="text-left">Dated</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in filteredItems" :key="item.id">
                <tr>
                  <td style="border-bottom: none !important;">{{ item.category_id }}</td>
                  
                  <td style="border-bottom: none !important;">
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
                    <div class="image-upload-cont">
                      <v-img
                        class="image-upload-item"
                        height="40"
                        @click="openLongImage(item)"
                        style="cursor: pointer"
                        :src="
                          item.long_image != null
                            ? $fileURL + item.long_image
                            : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                        "
                      >
                        <template #placeholder>
                          <div class="skeleton" /> </template
                      ></v-img>
                    </div>
                  </td>
                  <td style="border-bottom: none !important;">
                    <div class="image-upload-cont">
                      <v-img
                        class="image-upload-item"
                        height="40"
                        @click="openIconImage(item)"
                        style="cursor: pointer"
                        :src="
                          item.icon_image != null
                            ? $fileURL + item.icon_image
                            : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                        "
                      >
                        <template #placeholder>
                          <div class="skeleton" /> </template
                      ></v-img>
                    </div>
                  </td>
                  <td style="font-weight: 500 !important;border-bottom: none !important;">
                    {{ item.category_name }}
                  </td>
                  <td style="font-weight: 500 !important;border-bottom: none !important;">
                    {{ item.description }}
                  </td>
                  <td style="font-weight: 500 !important;border-bottom: none !important;">
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
                      @click="activeMainCategory(item.category_id)"
                    >
                      <v-btn size="27" :value="true"> Yes </v-btn>

                      <v-btn size="27" :value="false"> No </v-btn>
                    </v-btn-toggle>
                  </td>
                  <td style="font-weight: 500 !important;border-bottom: none !important;">
                    {{ item.user.name }}
                  </td>
                  <td style="font-weight: 500 !important;border-bottom: none !important;">
                    {{ item.dated }}
                  </td>
                  <td style="border-bottom: none !important;">
                    <div class="d-flex">
                      <v-btn
                            color="green"
                            variant="text" @click="editMainCategory(item)"
                            icon="mdi-pencil-outline"
                          >  <v-tooltip location="top" activator="parent">Edit</v-tooltip>
</v-btn>
                      <v-btn
                            color="red" variant="text"
                            :disabled="isDeleteLoading"
                            @click="openDeleteConfirm(item.category_id)"
                            icon="mdi-trash-can-outline"
                          >  <v-tooltip location="top" activator="parent">Delete</v-tooltip>
</v-btn>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="3">
                    <v-text-field
                      class="mt-4"
                      v-model="item.tag_line"
                      label="Tagline"
                      variant="outlined"
                      density="compact"
                      required
                      @change="saveTagLine(item.category_id, item.category_name, item.tag_line)"
                    ></v-text-field>
                  </td>
                  <td colspan="2">
                    <v-text-field
                      class="mt-4"
                      v-model="item.link_name"
                      label="Link Name"
                      variant="outlined"
                      density="compact"
                      required
                      @change="saveLinkName(item.category_id, item.category_name, item.link_name)"
                    ></v-text-field>
                  </td>
                  <td colspan="2">
                    <v-text-field
                      class="mt-4"
                      v-model="item.button_name"
                      label="Button Name"
                      variant="outlined"
                      density="compact"
                      required
                      @change="saveButtonName(item.category_id, item.category_name, item.button_name)"
                    ></v-text-field>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
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
          <v-btn color="success" text @click="deleteMainCategory">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent width="auto" v-model="isOpenMainImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4">
          Upload Main Image - Main Categories</v-card-title
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
    <v-dialog persistent width="auto" v-model="isOpenLongImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4">
          Upload Long Image - Main Categories</v-card-title
        >
        <v-card-text>
          <image-upload
            :image-file="longImageFile"
            @update-image-file="updateLongImageFile"
            @delete-image-file="deleteLongImageFile"
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
            @click="saveLongImage"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent width="auto" v-model="isOpenIconImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4">
          Upload Icon Image - Main Categories</v-card-title
        >
        <v-card-text>
          <image-upload
            :image-file="iconImageFile"
            @update-image-file="updateIconImageFile"
            @delete-image-file="deleteIconImageFile"
          />
        </v-card-text>
        <v-card-actions class="mt-16">
          <v-spacer></v-spacer>
          <v-btn
            style="text-transform: none"
            color="error"
            text
            @click="closeIconImage"
            >Cancel</v-btn
          >
          <v-btn
            style="background-color: #9ddcff; text-transform: none"
            color="black"
            @click="saveIconImage"
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
    longImageFile: [],
    iconImageFile: [],
    propertyDataToMainImage: {
      category_id: 0,
      category_name: null,
      description: null,
    },
    propertyDataToLongImage: {
      category_id: 0,
      category_name: null,
      description: null,
    },
    propertyDataToIconImage: {
      category_id: 0,
      category_name: null,
      description: null,
    },
    isOpenMainImage: false,
    isOpenLongImage: false,
    isOpenIconImage: false,
    successMessage: '',
    errorMessage: '',
    input: {
      category_id: 0,
      category_name: null,
      description: null,
    },
    resource: {
      app: [],
    },
    rules: {
      nameRules: [
        (value) => {
          if (value) return true;
          return 'Category name is required.';
        },
      ],
      descriptionRules: [
        (value) => {
          if (value) return true;
          return 'Category description is required.';
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
    this.getMainCategoriesData();
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.items;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.items.filter(
        (item) =>
          item.category_name.toLowerCase().includes(searchTextLower) ||
          item.description.toLowerCase().includes(searchTextLower)
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
    updateLongImageFile(newImageFile) {
      this.longImageFile.push(newImageFile);
    },
    deleteLongImageFile() {
      this.isSending = true;
      axios
        .delete(
          `/4walls-main-categories/${this.propertyDataToLongImage.category_id}/long-image`
        )
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getMainCategoriesData();
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
          this.longImageFile = [];
        });
    },
    updateMainImageFile(newImageFile) {
      this.mainImageFile.push(newImageFile);
    },
    deleteMainImageFile() {
      this.isSending = true;
      axios
        .delete(
          `/4walls-main-categories/${this.propertyDataToMainImage.category_id}/main-image`
        )
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getMainCategoriesData();
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
    updateIconImageFile(newImageFile) {
      this.iconImageFile.push(newImageFile);
    },
    deleteIconImageFile() {
      this.isSending = true;
      axios
        .delete(
          `/4walls-main-categories/${this.propertyDataToIconImage.category_id}/icon-image`
        )
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getMainCategoriesData();
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
          this.iconImageFile = [];
        });
    },
    openIconImage(prop) {
      this.isOpenIconImage = true;
      this.propertyDataToIconImage = {
        category_id: prop.category_id,
        category_name: prop.category_name,
        description: prop.description,
      };
      this.iconImageFile =
        prop.icon_image != null
          ? [
              {
                file: {
                  name: prop.icon_image,
                  size: '',
                  base64: '',
                  format: '',
                },
              },
            ]
          : [];
    },
    closeIconImage() {
      this.isOpenIconImage = false;
      this.iconImageFile = [];
      this.propertyDataToIconImage = {
        category_id: 0,
        category_name: null,
        description: null,
      };
    },
    saveIconImage() {
      this.isSending = true;
      const payload = {
        category_id: this.propertyDataToIconImage.category_id,
        category_name: this.propertyDataToIconImage.category_name,
        description: this.propertyDataToIconImage.description,
        icon_image: this.iconImageFile[0],  
      };
      http
        .post(`/4walls-main-categories/update`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => { 
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getMainCategoriesData();
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
          this.propertyDataToIconImage = {
            category_id: 0,
            category_name: null,
            description: null,
          };
          this.isOpenIconImage = false;
          this.iconImageFile = [];
        });
    },
    openLongImage(prop) {
      this.isOpenLongImage = true;
      this.propertyDataToLongImage = {
        category_id: prop.category_id,
        category_name: prop.category_name,
        description: prop.description,
      };
      this.longImageFile =
        prop.long_image != null
          ? [
              {
                file: {
                  name: prop.long_image,
                  size: '',
                  base64: '',
                  format: '',
                },
              },
            ]
          : [];
    },
    closeLongImage() {
      this.isOpenLongImage = false;
      this.longImageFile = [];
      this.propertyDataToLongImage = {
        category_id: 0,
        category_name: null,
        description: null, 
      };
    },
    saveLongImage() { 
      this.isSending = true;
      const payload = {
        category_id: this.propertyDataToLongImage.category_id,
        category_name: this.propertyDataToLongImage.category_name,
        description: this.propertyDataToLongImage.description,
        long_image: this.longImageFile[0],
      };
      http
        .post(`/4walls-main-categories/update`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getMainCategoriesData();
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
          this.propertyDataToLongImage = {
            category_id: 0,
            category_name: null,
            description: null,
          };
          this.isOpenLongImage = false;
          this.longImageFile = [];
        });
    },
    openMainImage(prop) {
      this.isOpenMainImage = true;
      this.propertyDataToMainImage = {
        category_id: prop.category_id,
        category_name: prop.category_name,
        description: prop.description,
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
        category_id: 0,
        category_name: null,
        description: null,
      };
    },
    saveMainImage() {
      this.isSending = true;
      const payload = {
        category_id: this.propertyDataToMainImage.category_id,
        category_name: this.propertyDataToMainImage.category_name,
        description: this.propertyDataToMainImage.description,
        main_image: this.mainImageFile[0],
      };
      http
        .post(`/4walls-main-categories/update`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getMainCategoriesData();
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
            category_id: 0,
            category_name: null,
            description: null,
          };
          this.isOpenMainImage = false;
          this.mainImageFile = [];
        });
    },
    editMainCategory(prop) {
      this.isEdit = true;
      this.input = {
        category_id: prop.category_id,
        category_name: prop.category_name,
        description: prop.description,
        main_image: prop.main_image,
        long_image: prop.long_image,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        category_id: 0,
        category_name: null,
        description: null,
        main_image: null,
        long_image: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          category_id: this.input.category_id,
          category_name: this.input.category_name,
          description: this.input.description,
        };
        axios
          .post(`/4walls-main-categories/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getMainCategoriesData();
            this.input = {
              category_id: 0,
              category_name: null,
              description: null,
              main_image: null,
              long_image: null,
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
    saveTagLine(category_id, category_name, tag_line) {
      this.isSending = true;
      const payload = {
        category_id: category_id,
        category_name: category_name,
        tag_line: tag_line,
      };
      axios
        .post(`/4walls-main-categories/update`, payload)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getMainCategoriesData();
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
    saveLinkName(category_id, category_name, link_name) {
      this.isSending = true;
      const payload = {
        category_id: category_id,
        category_name: category_name,
        link_name: link_name,
      };
      axios
        .post(`/4walls-main-categories/update`, payload)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getMainCategoriesData();
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
    saveButtonName(category_id, category_name, button_name) {
      this.isSending = true;
      const payload = {
        category_id: category_id,
        category_name: category_name,
        button_name: button_name,
      };
      axios
        .post(`/4walls-main-categories/update`, payload)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getMainCategoriesData();
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
    saveData() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          category_name: this.input.category_name,
          description: this.input.description,
        };
        axios
          .post(`/4walls-main-categories`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getMainCategoriesData();
            this.input = {
              category_id: 0,
              category_name: null,
              description: null,
              main_image: null,
              long_image: null,
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
    deleteMainCategory() {
      this.isDeleteLoading = true;
      axios
        .delete(`/4walls-main-categories/${this.propertyIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getMainCategoriesData();
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
    getMainCategoriesData() {
      this.isLoading = true;
      axios
        .get(`/4walls-main-categories`)
        .then((response) => {
          const data = response.data.data;
          this.items = data.map((item) => {
            console.log(item);
            return {
              category_id: item.category_id || 1,
              category_name: item.category_name || '',
              description: item.description || '',
              long_image: item.long_image || null,
              main_image: item.main_image || null,
              icon_image: item.icon_image || null,
              isActive:
                item.active == 'N' ? false : item.active == 'Y' ? true : null,
              user: item.user || '',
              dated: item.dated || '',
              tag_line: item.tag_line || '',
              link_name: item.link_name || '',
              button_name: item.button_name || '',
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
    activeMainCategory(category_id) {
      this.isSending2 = true;
      axios
        .get(`/4walls-main-categories/toggle-active/${category_id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getMainCategoriesData();
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
