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
          to="/property_developments"
        >
          <p>Back</p>
        </router-link>
        <h3 class="ml-4 mr-10 mb-6">Construction</h3>
      </div>
    </div>
    <div class="d-flex align-center justify-space-between pr-16 pl-4">
      <div class="d-flex" style="gap: 10px">
        <div style="min-width: 100px">
          <h3 style="color: blue">{{ this.developementData.project_name }}</h3>
        </div>
        <div style="min-width: 100px">
          <h3 style="color: blue">{{ this.developementData.developer?.partner?.partner_name }}</h3>
        </div>
      </div>
    </div>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-autocomplete
              class="mt-8"
              v-model="input.construction_id"
              :rules="rules.construction_idRules"
              item-title="construction_name"
              item-value="construction_id"
              label="Construction Name"
              variant="outlined"
              density="compact"
              required
              :items="constructionData"
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
                <th class="text-left font-weight-bold text-black">Image</th>
                <th class="text-left font-weight-bold text-black">Construction Name</th>
                <th class="text-left font-weight-bold text-black">Construction Category</th>
                <th class="text-left font-weight-bold text-black">Building Type</th>
                <th class="text-left font-weight-bold text-black">User</th>
                <th class="text-left font-weight-bold text-black">Dated</th>
                <th class="text-left font-weight-bold text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in filteredItems" :key="item.pdc_id">
                <tr class="country-table-body">
                  <td>{{ item.pdc_id }}</td>
                  <td>
                    <div class="image-upload-cont">
                      <v-img
                        class="image-upload-item"
                        height="40"
                        style="cursor: pointer"
                        :src="
                          item.construction.main_image != null
                            ? $fileURL + item.construction.main_image
                            : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                        "
                      >
                        <template #placeholder>
                          <div class="skeleton" /> </template
                      ></v-img>
                    </div>
                  </td>
                  <td>{{ item?.construction?.construction_name }}</td>
                  <td>
                    {{ item?.construction?.construction_category?.category_name }}
                  </td>
                  <td>
                    {{ item?.construction?.building_type?.building_type }}
                  </td>
                  <td>
                    {{ item?.user.name }}
                  </td>
                  <td>
                    {{ item?.dated }}
                  </td>
                  <td>
                    <div class="d-flex">
                      <v-btn
                            color="green"
                            variant="text" @click="editDevelopmentConstruction(item)"
                            icon
                          >
  <v-icon>mdi-pencil-outline</v-icon>  <v-tooltip location="top" activator="parent">Edit</v-tooltip>
</v-btn>
                      <v-btn
                            color="red" variant="text"
                            :disabled="isDeleteLoading"
                            @click="openDeleteConfirm(item.pdc_id)"
                            icon
                          >
  <v-icon>mdi-trash-can-outline</v-icon>  <v-tooltip location="top" activator="parent">Delete</v-tooltip>
</v-btn>
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
        <v-card-text> Are you sure want to delete this development construction? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelDelete">No</v-btn>
          <v-btn color="success" text @click="deleteDevelopmentConstruction">{{
            isDeleteLoading ? 'Deleting...' : 'Yes'
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent width="auto" v-model="isOpenImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4">
          Upload Image - Development Construction </v-card-title
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
// import moment from 'moment';
// import http from 'axios';
import { setAuthHeader } from '@/util/axios';
// import app from '@/util/eventBus';

export default {
  name: 'DevelopmentConstruction',
  data: () => ({
    // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    idDevelopmentConstruction: null,
    developmentId: null,
    developementData: [],
    developmentConstructionData: [],
    constructionData: [],
    valid: false,
    isLoading: false,
    isSending: false,
    isError: false,
    isEdit: false,
    isSuccess: false,
    isDelete: false,
    isDeleteLoading: false,
    isOpenImage: false,
    imageFile: [],
    successMessage: '',
    errorMessage: '',
    propertyDataToImage: {
      pdc_id: null,
      construction_id: null,
      image: null,
    },
    input: {
      development_id: 0,
      project_header: '',
      project_description: '',
    },
    rules: {
      construction_idRules: [
        (value) => {
          if (value) return true;
          return 'Construction Name is required.';
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
        return this.developmentConstructionData;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.developmentConstructionData.filter(
        (item) =>
          item.construction.construction_name.toLowerCase().includes(searchTextLower) 
      );
    },
  },
  mounted() {
    this.isLoading = true;
    this.developmentId = parseInt(this.$route.params.id);
    this.getDevelopementData();
    this.getDevelopmentConstructionData();
    this.getConstructionData();
  },
  methods: {
    getDevelopementData() {
      this.isLoading = true;
      axios.get(`/4walls-property-developments/${this.developmentId}`).then((response) => {
        this.developementData = response.data.data;
        this.input.project_header = this.developementData.project_header;
        this.input.project_description = this.developementData.project_description;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.isLoading = false;
      });

    },
    getDevelopmentConstructionData() {
      axios.get(`/4walls-development-constructions/${this.developmentId}`).then((response) => {
        this.developmentConstructionData = response.data.data;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.isLoading = false;
      });
    },
    getConstructionData() {
      axios.get(`/4walls-construction-masters`).then((response) => {
        this.constructionData = response.data.data;
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
          development_id: this.developmentId,
          construction_id: this.input.construction_id,
        };
        axios
          .post(`/4walls-development-constructions`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getDevelopmentConstructionData();
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.project_header
              ? 'Please fill the header field'
              : error.response.data.project_description
              ? 'Please fill the description field'
              : error.response.data.message;
            this.errorMessage = message;
            this.isError = true;
          })
          .finally(() => {
            this.isSending = false;
          });
      }
    },
    editDevelopmentConstruction(item) {
      this.isEdit = true;
      this.input = {
        pdc_id: item.pdc_id,
        construction_id: item.construction_id,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        pdc_id: 0,
        construction_id: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          pdc_id: this.input.pdc_id,
          construction_id: this.input.construction_id,
        };
        axios
          .post(`/4walls-development-constructions/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getDevelopmentConstructionData();
            this.input = {
              pdc_id: 0,
              construction_id: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.construction_id
              ? 'Please fill the construction field'
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
      this.idDevelopmentConstruction = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.idDevelopmentConstruction = itemId;
      this.isDelete = true;
    },
    cancelConfirmation() {
      this.idDevelopmentConstruction = null;
      this.isDelete = false;
    },
    deleteDevelopmentConstruction() {
      this.isDeleteLoading = true;
      axios
        .delete(`/4walls-development-constructions/${this.idDevelopmentConstruction}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getDevelopmentConstructionData();
          this.cancelDelete();
        })
        .catch((error) => {
          console.log(error);
          this.errorMessage = error.response.data.message;
          this.isError = true;
        })
        .finally(() => {
          this.isDeleteLoading = false;
        });
    },
    openImage(prop) {
      this.isOpenImage = true;
      this.propertyDataToImage = {
        pdc_id: prop.pdc_id,
        construction_id: prop.construction_id,
        image: prop.image,
      };
      this.imageFile =
        prop.image != null
          ? [
              {
                file: {
                  name: prop.image,
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
      this.propertyDataToImage = {
        pdc_id: 1,
        construction_id: null,
        image: null,
      };
    },
    saveImage() {
      this.isSending = true;
      const payload = {
        pdc_id: this.propertyDataToImage.pdc_id,
        construction_id: this.propertyDataToImage.construction_id,
        image: this.imageFile[0],
      };

      axios
        .post(`/4walls-development-constructions/update`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getDevelopmentConstructionData();
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
          this.propertyDataToImage = {
            pdc_id: 1,
            construction_id: null,
            image: null,
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
          `/4walls-development-constructions/${this.propertyDataToImage.pdc_id}/image`
        )
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getDevelopmentConstructionData();
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
