<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <div class="d-flex ml-4 mb-4" style="gap: 40px">
      <router-link
        active-class="text-black"
        style="color: #3e4aaf"
        class="text-decoration-none"
        to="/country-master"
      >
        <h1>Country Master</h1>
      </router-link>
      <router-link
        active-class="text-black"
        style="color: #3e4aaf"
        class="text-decoration-none"
        to="/city-master"
      >
        <h1>City Master</h1>
      </router-link>
      <router-link
        active-class="text-black"
        style="color: #3e4aaf"
        class="text-decoration-none"
        to="/town-master"
      >
        <h1>Town Master</h1>
      </router-link>
      <router-link
        active-class="text-black"
        style="color: #3e4aaf"
        class="text-decoration-none"
        to="/zone-master"
      >
        <h1>Zone Master</h1>
      </router-link>
    </div>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="3">
            <v-combobox
              clearable
              density="compact"
              :rules="rules.cityRules"
              label="Select City"
              placeholder="Type a City"
              :items="resource.city"
              item-title="name"
              item-value="id"
              v-model="input.city"
              variant="outlined"
            ></v-combobox>
          </v-col>
          <v-col cols="12" md="3">
            <v-combobox
              clearable
              density="compact"
              :rules="rules.countryRules"
              label="Select Country"
              placeholder="Type a Country"
              :items="resource.country"
              item-title="name"
              item-value="id"
              v-model="input.country"
              variant="outlined"
            ></v-combobox>
          </v-col>
        </v-row>
        <v-row class="mt-n2">
          <v-col cols="12" md="3">
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
          <v-col v-if="isEdit" cols="12" md="3">
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
    <v-sheet class="py-6 px-4 mt-6" border rounded width="100%">
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            density="compact"
            v-model="search"
            label="Search a City"
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
                <th class="text-left">City Name</th>
                <th class="text-left">Country</th>
                <th class="text-left">Active</th>
                <th class="text-left">Favorite</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="country-table-body"
                v-for="item in filteredItems"
                :key="item.id"
              >
                <td style="font-weight: 500 !important">
                  {{ item.city }}
                </td>
                <td style="font-weight: 500 !important">
                  {{ item.country }}
                </td>
                <td>
                  <v-btn-toggle
                    style="
                      font-size: 10px !important;
                      font-weight: 200 !important;
                      height: 22px !important;
                      width: 54px !important;
                    "
                    class="d-flex align-center"
                    v-model="item.isActive"
                    rounded="5"
                  >
                    <v-btn size="27" :value="true"> Yes </v-btn>

                    <v-btn size="27" :value="false"> No </v-btn>
                  </v-btn-toggle>
                </td>
                <td>
                  <v-btn-toggle
                    style="
                      font-size: 10px !important;
                      font-weight: 200 !important;
                      height: 22px !important;
                      width: 54px !important;
                    "
                    class="d-flex align-center"
                    v-model="item.isFav"
                    rounded="5"
                  >
                    <v-btn size="27" :value="true"> Yes </v-btn>

                    <v-btn size="27" :value="false"> No </v-btn>
                  </v-btn-toggle>
                </td>
                <td>
                  <div class="d-flex">
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          color="green"
                          variant="text"
                          v-bind="props"
                          @click="editUser(item)"
                          icon="mdi-pencil-outline"
                        ></v-btn>
                      </template>
                      <span>Edit</span>
                    </v-tooltip>

                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          color="red"
                          variant="text"
                          v-bind="props"
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
    <v-dialog persistent width="500" v-model="isDelete">
      <v-card>
        <v-card-title>Confirmation</v-card-title>
        <v-card-text> Are you sure want to delete this user? </v-card-text>
        <v-card-actions>
          <v-btn color="error" text @click="cancelDelete">No</v-btn>
          <v-btn color="success" text @click="deleteUser">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent width="auto" v-model="isOpenImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4">
          Upload Image - User</v-card-title
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
// import http from 'axios';
import { setAuthHeader } from '@/util/axios';
// import app from '@/util/eventBus';

export default {
  name: 'UserMaster',
  data: () => ({
    fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    valid: false,
    isLoading: false,
    isSending: false,
    isEdit: false,
    isSuccess: false,
    isDelete: false,
    isDeleteLoading: false,
    userIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    imageFile: [],
    userIdToImage: null,
    isOpenImage: false,
    successMessage: '',
    input: {
      id: 0,
      country: null,
      city: null,
    },
    resource: {
      country: [],
      city: [
        {
          name: 'Jakarta',
          id: 1,
        },
        {
          name: 'Semarang',
          id: 2,
        },
        {
          name: 'Yogyakarta',
          id: 3,
        },
      ],
    },
    rules: {
      countryRules: [
        (value) => {
          if (value) return true;
          return 'Country is requred.';
        },
      ],
      cityRules: [
        (value) => {
          if (value) return true;
          return 'Country is requred.';
        },
      ],
    },
    search: '',
    items: [],
    itemsTry: [
      {
        id: 1,
        city: 'Jakarta',
        country: 'Indonesia',
        isActive: true,
        isFav: true,
      },
      {
        id: 2,
        city: 'Semarang',
        country: 'Indonesia',
        isActive: true,
        isFav: true,
      },
      {
        id: 3,
        city: 'Yogyakarta',
        country: 'Indonesia',
        isActive: true,
        isFav: true,
      },
    ],
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    // this.getUserData();
    this.getCountry();
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.itemsTry;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.itemsTry.filter((item) =>
        item.city.toLowerCase().includes(searchTextLower)
      );
    },
  },
  methods: {
    updateImageFile(newImageFile) {
      this.imageFile.push(newImageFile);
    },
    deleteImageFile() {
      this.isSending = true;
      const payload = {
        id: this.userIdToImage,
      };
      setTimeout(() => {
        console.log(payload);
        this.isEdit = false;
        this.isSending = false;
        this.userIdToImage = null;
        this.imageFile = [];
      }, 2000);
      // axios
      //   .post(`/user/deleteImage`, payload, {})
      //   .then((response) => {
      //     const data = response.data;
      //     this.successMessage = data.message;
      //     this.isSuccess = true;
      //     this.getUserData();
      //     // app.config.globalProperties.$eventBus.$emit('update-image');
      //   })
      //   .catch((error) => {
      //     // eslint-disable-next-line
      //     console.log(error);
      //   })
      //   .finally(() => {
      //     this.isEdit = false;
      //     this.isSending = false;
      //     this.userIdToImage = null;
      //     this.imageFile = [];
      //   });
    },
    openImage(image, id) {
      this.isOpenImage = true;
      this.userIdToImage = id;
      this.imageFile =
        image != null
          ? [
              {
                file: {
                  name: image,
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
      this.userIdToImage = null;
    },
    saveImage() {
      this.isSending = true;
      const payload = {
        id: this.userIdToImage,
        file: this.imageFile[0],
      };
      setTimeout(() => {
        console.log(payload);
        this.isEdit = false;
        this.isSending = false;
        this.userIdToImage = null;
        this.isOpenImage = false;
        this.imageFile = [];
      }, 2000);
      // http
      //   .post(`/user/update`, payload, {
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //     },
      //   })
      //   .then((response) => {
      //     const data = response.data;
      //     this.successMessage = data.message;
      //     this.isSuccess = true;
      //     this.getUserData();
      //     // app.config.globalProperties.$eventBus.$emit('update-image');
      //   })
      //   .catch((error) => {
      //     // eslint-disable-next-line
      //     console.log(error);
      //   })
      //   .finally(() => {
      //     this.isEdit = false;
      //     this.isSending = false;
      //     this.userIdToImage = null;
      //     this.isOpenImage = false;
      //     this.imageFile = [];
      //   });
    },
    editUser(user) {
      this.isEdit = true;
      this.input = {
        id: user.id,
        city: user.city,
        country: user.country,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        id: 0,
        country: null,
        city: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          id: this.input.id,
          name: this.input.username,
          email: this.input.email,
          role: this.input.role,
          country_id: this.input.country,
        };
        if (this.input.image !== null) {
          payload['file'] = this.input.image;
        }
        setTimeout(() => {
          console.log(payload);
          this.isSending = false;
          this.isEdit = false;
        }, 2000);
        // axios
        //   .post(`/user/update`, payload)
        //   .then((response) => {
        //     const data = response.data;
        //     this.successMessage = data.message;
        //     this.isSuccess = true;
        //     this.getUserData();
        //     this.input = {
        //       id: 0,
        //       country: null,
        //       city: null,
        //     };
        //   })
        //   .catch((error) => {
        //     // eslint-disable-next-line
        //     console.log(error);
        //   })
        //   .finally(() => {
        //     this.isEdit = false;
        //     this.isSending = false;
        //   });
      }
    },
    saveData() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          name: this.input.username,
          email: this.input.email,
          role: this.input.role,
          country_id: this.input.country,
        };
        if (this.input.image !== null) {
          payload['file'] = this.input.image;
        }
        setTimeout(() => {
          console.log(payload);
          this.isSending = false;
        }, 2000);
        // axios
        //   .post(`/register`, payload)
        //   .then((response) => {
        //     const data = response.data;
        //     this.successMessage = data.message;
        //     this.isSuccess = true;
        //     this.getUserData();
        //     this.input = {
        //       id: 0,
        //       country: null,
        //       city: null,
        //     };
        //   })
        //   .catch((error) => {
        //     // eslint-disable-next-line
        //     console.log(error);
        //   })
        //   .finally(() => {
        //     this.isSending = false;
        //   });
      }
    },
    cancelDelete() {
      this.userIdToDelete = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.userIdToDelete = itemId;
      this.isDelete = true;
    },
    cancelConfirmation() {
      this.userIdToDelete = null;
      this.isDelete = false;
    },
    deleteUser() {
      this.isDeleteLoading = true;
      setTimeout(() => {
        console.log(this.userIdToDelete);
        this.isDeleteLoading = false;
        this.userIdToDelete = null;
        this.isDelete = false;
      }, 2000);
      // axios
      //   .post(`/user/delete`, {
      //     id: this.userIdToDelete,
      //   })
      //   .then((response) => {
      //     const data = response.data;
      //     this.successMessage = data.message;
      //     this.isSuccess = true;
      //     this.getUserData();
      //   })
      //   .catch((error) => {
      //     // eslint-disable-next-line
      //     console.log(error);
      //   })
      //   .finally(() => {
      //     this.isDeleteLoading = false;
      //     this.userIdToDelete = null;
      //     this.isDelete = false;
      //   });
    },
    getUserData() {
      this.isLoading = true;
      setTimeout(() => {
        console.log('OK');
        this.isLoading = false;
      }, 2000);
      // axios
      //   .get(`/user`)
      //   .then((response) => {
      //     const data = response.data.data;
      //     // console.log(data);
      //     this.items = data.map((item) => {
      //       return {
      //         id: item.id || 1,
      //         name: item.name || '',
      //         email: item.email || '',
      //         registered_on: item.registered_on || '',
      //         role: item.role || '',
      //         roleName:
      //           item.role == 'S'
      //             ? 'Superadmin'
      //             : item.role == 'A'
      //             ? 'Admin'
      //             : '',
      //         image: item.image || null,
      //         country_id: item.country_id || 1,
      //         country_name: item.country_name || '',
      //       };
      //     });

      //     app.config.globalProperties.$eventBus.$emit(
      //       'update-image',
      //       this.items
      //     );
      //   })
      //   .catch((error) => {
      //     // eslint-disable-next-line
      //     console.log(error);
      //   })
      //   .finally(() => {
      //     this.isLoading = false;
      //   });
    },
    getCountry() {
      axios
        .get(`/country`)
        .then((response) => {
          const data = response.data.data;
          this.resource.country = data.map((country) => {
            return {
              id: country.country_id,
              name: country.country_name,
            };
          });
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
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
