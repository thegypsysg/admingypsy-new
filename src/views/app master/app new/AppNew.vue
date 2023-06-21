<!-- eslint-disable vue/valid-v-slot -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <h1>App Master</h1>
    <v-form class="mt-4 mb-n2" v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <!-- <div class="d-flex h-100 flex-column"> -->
            <v-text-field
              v-model="input.name"
              :rules="rules.nameRules"
              :counter="20"
              label="App Name"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
            <v-text-field
              class="mt-3"
              v-model="input.description"
              :rules="rules.descriptionRules"
              label="App Description (Short)"
              variant="outlined"
              required
              density="compact"
            ></v-text-field>
            <!-- </div> -->
          </v-col>
          <v-col cols="12" md="4">
            <v-textarea
              v-model="input.details"
              :rules="rules.detailsRules"
              label="App Details"
              rows="3"
              variant="outlined"
              required
            ></v-textarea>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              clearable
              density="compact"
              :rules="rules.groupRules"
              label="App Group"
              :items="resource.groups"
              item-title="name"
              item-value="value"
              v-model="input.group"
              variant="outlined"
            ></v-autocomplete>
            <div class="d-flex justify-space-between mt-3">
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
                @click="isEdit ? saveEdit() : saveData()"
                :disabled="isSending"
                :loading="isSending"
              >
                <template v-slot:prepend>
                  <v-icon color="white"></v-icon>
                </template>

                {{ isEdit ? 'SAVE' : 'ADD' }}
              </v-btn>
              <v-btn
                v-if="isEdit"
                prepend-icon="mdi-account-multiple-remove"
                color="red"
                style="text-transform: none"
                variant="flat"
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
    <v-sheet class="py-6 px-4" border rounded width="100%">
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="search"
            label="Search Apps"
            variant="outlined"
            density="compact"
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-table class="app-table">
            <thead>
              <tr>
                <th style="width: 5%" class="text-left">Id</th>
                <th style="width: 10%" class="text-left">App Logo</th>
                <th style="width: 10%" class="text-left">Main Image</th>
                <th style="width: 10%" class="text-left">App Name</th>
                <th style="width: 25%" class="text-left">
                  App Description (Short)
                </th>
                <th style="width: 35%" class="text-left">App Details</th>
                <th style="width: 5%" class="text-left"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredItems" :key="item.id">
                <td>
                  <div class="app-column">
                    {{ item.id }}
                  </div>
                  <v-table class="app-column-table"></v-table>
                </td>
                <td>
                  <div class="app-column app-img-cont-1">
                    <v-img
                      height="40"
                      width="60"
                      @click="openImage(item.image, item.id)"
                      class="app-img"
                      :src="
                        item.logo != null
                          ? fileURL + item.logo
                          : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                      "
                    ></v-img>
                  </div>
                  <v-table class="app-column-table">
                    <tr>
                      <th>Active</th>
                    </tr>
                    <tr>
                      <td>
                        <v-btn-toggle
                          mandatory
                          style="
                            font-size: 10px !important;
                            font-weight: 200 !important;
                            height: 22px !important;
                            width: 54px !important;
                          "
                          class="d-flex align-center"
                          v-model="item.isActive"
                          @change="activeApp(item.id)"
                          rounded="5"
                        >
                          <v-btn
                            size="27"
                            v-model="item.isActive"
                            :value="true"
                          >
                            Yes
                          </v-btn>

                          <v-btn
                            size="27"
                            v-model="item.isActive"
                            :value="false"
                          >
                            No
                          </v-btn>
                        </v-btn-toggle>
                      </td>
                    </tr>
                  </v-table>
                </td>
                <td>
                  <div class="app-column app-img-cont-2">
                    <v-img
                      height="40"
                      width="60"
                      @click="openImage(item)"
                      class="app-img-2"
                      :src="
                        item.image != null
                          ? fileURL + item.image
                          : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                      "
                    ></v-img>
                  </div>
                  <v-table class="app-column-table">
                    <tr>
                      <th>Favorite</th>
                    </tr>
                    <tr>
                      <td>
                        <v-btn-toggle
                          mandatory
                          style="
                            font-size: 10px !important;
                            font-weight: 200 !important;
                            height: 22px !important;
                            width: 54px !important;
                          "
                          class="d-flex align-center"
                          v-model="item.isFav"
                          rounded="5"
                          @change="favoriteApp(item.id)"
                        >
                          <v-btn size="27" :value="true"> Yes </v-btn>

                          <v-btn size="27" :value="false"> No </v-btn>
                        </v-btn-toggle>
                      </td>
                    </tr>
                  </v-table>
                </td>

                <td>
                  <div class="app-column">
                    {{ item.name }}
                  </div>

                  <v-table class="app-column-table">
                    <tr>
                      <th>App Group</th>
                    </tr>
                    <tr style="color: black; font-weight: 600">
                      <td>
                        {{ item.group }}
                      </td>
                    </tr>
                  </v-table>
                </td>
                <td>
                  <div class="app-column">
                    {{ item.description }}
                  </div>
                  <v-table class="app-column-table">
                    <tr>
                      <th>User</th>
                      <th>Created on</th>
                    </tr>
                    <tr style="color: black; font-weight: 600">
                      <td>
                        {{ item.user }}
                      </td>
                      <td>
                        {{ item.created }}
                      </td>
                    </tr>
                  </v-table>
                </td>
                <td>
                  <div class="app-column">
                    {{ item.details }}
                  </div>
                  <v-table class="app-column-table">
                    <tr>
                      <th>Views</th>
                      <th>Likes</th>
                      <th>Shares</th>
                    </tr>
                    <tr style="color: #2196f3; font-weight: 600">
                      <td>
                        {{ item.views }}
                      </td>
                      <td>
                        {{ item.likes }}
                      </td>
                      <td>
                        {{ item.shares }}
                      </td>
                    </tr>
                  </v-table>
                </td>
                <td>
                  <div class="d-flex app-column">
                    <v-btn
                      color="green"
                      variant="text"
                      @click="editUser(item)"
                      icon="mdi-pencil-outline"
                    ></v-btn>
                    <v-btn
                      color="red"
                      variant="text"
                      :disabled="isDeleteLoading"
                      @click="openDeleteConfirm(item.id)"
                      icon="mdi-trash-can-outline"
                    ></v-btn>
                  </div>
                  <v-table class="app-column-table"></v-table>
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
        <v-card-text> Are you sure want to delete this app? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelDelete">No</v-btn>
          <v-btn color="success" text @click="deleteApp">{{
            isDeleteLoading ? 'Deleting...' : 'Yes'
          }}</v-btn>
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
import http from 'axios';
import { setAuthHeader } from '@/util/axios';
// import app from '@/util/eventBus';

export default {
  name: 'AppNew',
  data: () => ({
    fileURL: 'https://admin1.the-gypsy.sg',
    valid: false,
    isLoading: false,
    isSending: false,
    isEdit: false,
    isSuccess: false,
    isDelete: false,
    isDeleteLoading: false,
    userIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    logoFile: [],
    imageFile: [],
    userDataToImage: {
      app_id: 1,
      app_group_id: 1,
      app_name: '',
      app_description: '',
      app_detail: '',
    },
    isOpenImage: false,
    successMessage: '',
    input: {
      id: 1,
      name: '',
      description: '',
      details: '',
      group: null,
      logo: null,
      image: null,
    },
    resource: {
      groups: [],
    },
    rules: {
      nameRules: [
        (value) => {
          if (value) return true;
          return 'App Name is requred.';
        },
        (value) => {
          if (value?.length >= 4) return true;
          return 'App Name must be more than 4 characters.';
        },

        (value) => {
          if (value?.length <= 20) return true;
          return 'App Name must be less than 20 characters.';
        },
      ],
      descriptionRules: [
        (value) => {
          if (value) return true;
          return 'App Description is requred.';
        },
        (value) => {
          if (value?.length >= 4) return true;
          return 'App Description must be more than 4 characters.';
        },
      ],
      detailsRules: [
        (value) => {
          if (value) return true;
          return 'App Details is requred.';
        },
        (value) => {
          if (value?.length >= 4) return true;
          return 'App Details must be more than 4 characters.';
        },
      ],
      groupRules: [
        (value) => {
          if (value) return true;
          return 'App Group is requred.';
        },
      ],
    },
    search: '',
    items: [],

    headers: [
      { title: 'Id', align: 'start', key: 'id' },
      {
        title: 'App Logo',
        align: 'start',
        key: 'logo',
      },
      {
        title: 'Main Image',
        align: 'start',
        key: 'image',
      },
      { title: 'App Name', align: 'start', key: 'name' },
      { title: 'App Description (Short)', align: 'start', key: 'description' },
      { title: 'App Details', align: 'start', key: 'details' },
      { title: '', key: 'action' },
    ],
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.getAppData();
    // this.getCountry();
    this.getGroups();
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
          item.description.toLowerCase().includes(searchTextLower) ||
          item.details.toLowerCase().includes(searchTextLower) ||
          item.group.toLowerCase().includes(searchTextLower) ||
          item.user.toLowerCase().includes(searchTextLower)
      );
    },
  },
  methods: {
    getButtonClasses(value) {
      return {
        primary: value === this.selectedItem,
        'grey lighten-2': value !== this.selectedItem,
      };
    },
    updateImageFile(newImageFile) {
      this.imageFile.push(newImageFile);
    },
    deleteImageFile() {
      this.isSending = true;
      const payload = {
        app_id: this.userDataToImage.app_id,
      };
      axios
        .post(`/app/deleteImage`, payload, {})
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getAppData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        .finally(() => {
          this.isEdit = false;
          this.isSending = false;
          this.userDataToImage = {
            app_id: 1,
            app_group_id: 1,
            app_name: '',
            app_description: '',
            app_detail: '',
          };
          this.imageFile = [];
        });
    },
    openImage(item) {
      this.isOpenImage = true;
      this.userDataToImage = {
        app_id: item.id,
        app_group_id: item.group_id,
        app_name: item.name,
        app_description: item.description,
        app_detail: item.details,
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
      this.userDataToImage = {
        app_id: 1,
        app_group_id: 1,
        app_name: '',
        app_description: '',
        app_detail: '',
      };
    },
    saveImage() {
      this.isSending = true;
      const payload = {
        app_id: this.userDataToImage.app_id,
        app_group_id: this.userDataToImage.app_group_id,
        app_name: this.userDataToImage.app_name,
        app_description: this.userDataToImage.app_description,
        app_detail: this.userDataToImage.app_detail,
        app_image: this.imageFile[0],
      };

      http
        .post(`/app/edit`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getAppData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        .finally(() => {
          this.isEdit = false;
          this.isSending = false;
          this.userDataToImage = {
            app_id: 1,
            app_group_id: 1,
            app_name: '',
            app_description: '',
            app_detail: '',
          };
          this.isOpenImage = false;
          this.imageFile = [];
        });
    },
    deleteLogoFile() {
      this.isSending = true;
      const payload = {
        app_id: this.userIdToImage,
      };
      axios
        .post(`/app/deleteLogo`, payload, {})
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getAppData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        .finally(() => {
          this.isEdit = false;
          this.isSending = false;
          this.userIdToImage = null;
          this.imageFile = [];
        });
    },
    editUser(user) {
      this.isEdit = true;
      this.input = {
        id: user.id,
        name: user.name,
        description: user.description,
        details: user.details,
        group: user.group,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        id: 0,
        name: '',
        description: '',
        details: '',
        group: null,
        logo: null,
        image: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          app_id: this.input.id,
          app_group_id: this.input.group,
          app_name: this.input.name,
          app_description: this.input.description,
          app_detail: this.input.details,
        };
        if (this.input.logo !== null) {
          payload['app_logo'] = this.input.logo;
        } else if (this.input.image !== null) {
          payload['app_image'] = this.input.image;
        }
        axios
          .post(`/app/edit`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getAppData();
            this.input = {
              id: 1,
              name: '',
              description: '',
              details: '',
              group: null,
              logo: null,
              image: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
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
          app_group_id: this.input.group,
          app_name: this.input.name,
          app_description: this.input.description,
          app_detail: this.input.details,
        };
        if (this.input.logo !== null) {
          payload['app_logo'] = this.input.logo;
        }
        if (this.input.image !== null) {
          payload['app_image'] = this.input.image;
        }
        axios
          .post(`/app/add`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getAppData();
            this.input = {
              id: 1,
              name: '',
              description: '',
              details: '',
              group: null,
              logo: null,
              image: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
          })
          .finally(() => {
            this.isSending = false;
          });
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
    deleteApp() {
      this.isDeleteLoading = true;
      axios
        .post(`/app/delete`, {
          app_id: this.userIdToDelete,
        })
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getAppData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        .finally(() => {
          this.isDeleteLoading = false;
          this.userIdToDelete = null;
          this.isDelete = false;
        });
    },
    getAppData() {
      this.isLoading = true;
      axios
        .get(`/app`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.items = data.map((item) => {
            return {
              id: item.app_id || 1,
              group_id: item.app_group_id || 1,
              logo: item.app_logo || null,
              image: item.app_main_image || null,
              name: item.app_name || '',
              description: item.app_description || '',
              details: item.app_detail || '',
              isActive: item.active == 'N' ? null : false,
              isFav: item.favorite == 'N' ? null : false,
              group: item.app_group_name || '',
              user: item.user_id || 1,
              created: item.dated || '',
              views: item.app_views || '',
              likes: item.app_likes || '',
              shares: item.app_shares || '',
            };
          });

          // app.config.globalProperties.$eventBus.$emit(
          //   'update-image',
          //   this.items
          // );
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    // getCountry() {
    //   axios
    //     .get(`/country`)
    //     .then((response) => {
    //       const data = response.data.data;
    //       this.resource.country = data.map((country) => {
    //         return {
    //           id: country.country_id,
    //           name: country.country_name,
    //         };
    //       });
    //     })
    //     .catch((error) => {
    //       // eslint-disable-next-line
    //       console.log(error);
    //     });
    // },
    getGroups() {
      axios
        .get(`/app/groups`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.resource.groups = data.map((group) => {
            return {
              value: group.app_group_id,
              name: group.app_group_name,
            };
          });
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        });
    },
    activeApp(id) {
      this.isSending = true;
      axios
        .post(`/api/app/active/${id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          // this.getAppData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        .finally(() => {
          this.isSending = false;
        });
    },
    favoriteApp(id) {
      this.isSending = true;
      axios
        .post(`/api/app/favorite/${id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          // this.getAppData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        .finally(() => {
          this.isSending = false;
        });
    },
  },
  components: { ImageUpload },
};
</script>

<style lang="scss" scoped>
.app-table {
  font-size: 12px;
  color: grey !important;
}

.app-column {
  display: flex;
  align-items: center;
  min-height: 70px;
  margin-bottom: 10px;
}

.app-img {
  border: 1px solid grey !important;
  cursor: pointer !important;
}
.app-img-2 {
  border: 1px solid grey !important;
  padding: 2px !important;
  cursor: pointer !important;
}
.app-column-table {
  min-height: 70px;
  margin-bottom: 10px !important;
}

.app-column-table th {
  color: grey;
  text-align: left;
  font-weight: 400;
  padding-bottom: 5px !important;
}

.v-btn-toggle .v-btn:not(.v-btn--active) {
  background-color: #e0e0e0 !important;
}

/* Latar belakang aktif */
.v-btn-toggle .v-btn--active {
  background-color: #2196f3 !important;
  color: #fff !important;
}

.upload-title {
  background-color: #9ddcff;
  color: white;
}

.app-input .v-input__control {
  height: 20px !important;
}
</style>
