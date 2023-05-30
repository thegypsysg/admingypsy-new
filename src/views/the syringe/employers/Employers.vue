<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <div class="d-flex ml-4 mb-6" style="gap: 50px">
      <router-link
        style="color: #293fb8; font-weight: 500"
        class="text-decoration-none"
        to="/healthcare-settings"
      >
        <p>Healthcare Settings</p>
      </router-link>
      <router-link
        style="color: #a93f43; font-weight: 500"
        class="text-decoration-none"
        to="/skills-group"
      >
        <p>Skills</p>
      </router-link>
      <router-link
        style="color: #be6bbe; font-weight: 500"
        class="text-decoration-none"
        to="/employers"
      >
        <p>Employers</p>
      </router-link>
    </div>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="input.name"
              :rules="rules.nameRules"
              label="Employer Name"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
            <v-combobox
              density="compact"
              :rules="rules.typeRules"
              label="Employer Type"
              placeholder="Type Employer Type"
              :items="resource.type"
              class="mt-1"
              item-title="name"
              item-value="id"
              v-model="input.type"
              variant="outlined"
            ></v-combobox>
          </v-col>
          <v-col cols="12" md="3">
            <v-combobox
              density="compact"
              :rules="rules.countryRules"
              label="Select Country"
              placeholder="Type Country"
              :items="resource.country"
              item-title="name"
              item-value="id"
              v-model="input.country"
              variant="outlined"
            ></v-combobox>
            <v-combobox
              density="compact"
              :rules="rules.cityRules"
              label="Select City"
              placeholder="Type City"
              :items="resource.city"
              class="mt-1"
              item-title="name"
              item-value="id"
              v-model="input.city"
              variant="outlined"
            ></v-combobox>
          </v-col>
          <v-col cols="12" md="3">
            <v-combobox
              density="compact"
              :rules="rules.townRules"
              label="Select Town"
              placeholder="Type Town"
              :items="resource.town"
              item-title="name"
              item-value="id"
              v-model="input.town"
              variant="outlined"
            ></v-combobox>
            <v-combobox
              density="compact"
              :rules="rules.zoneRules"
              label="Select Zone"
              placeholder="Type Zone"
              :items="resource.zone"
              class="mt-1"
              item-title="name"
              item-value="id"
              v-model="input.zone"
              variant="outlined"
            ></v-combobox>
          </v-col>
        </v-row>

        <v-row class="mt-n2">
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
          <v-col v-if="isEdit" cols="12" md="2">
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
                <th class="text-left">Id</th>
                <th class="text-left">Logo</th>
                <th class="text-left">Image</th>
                <th class="text-left">Employer Name</th>
                <th class="text-left">Country</th>
                <th class="text-left">City</th>
                <th class="text-left">Town</th>
                <th class="text-left">Active</th>
                <th class="text-left">Favorite</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in filteredItems" :key="item.id">
                <tr class="country-table-body">
                  <td>{{ item.id }}</td>
                  <td>
                    <v-img
                      height="40"
                      width="65"
                      @click="openImage(item.logo, item.id)"
                      style="cursor: pointer"
                      src="@/assets/logo-img.png"
                    ></v-img>
                  </td>
                  <td>
                    <v-img
                      height="40"
                      width="65"
                      @click="openImage(item.image, item.id)"
                      style="cursor: pointer"
                      src="@/assets/other-voucher-img-5.png"
                    ></v-img>
                  </td>
                  <td>
                    {{ item.name }}
                  </td>
                  <td>
                    {{ item.country }}
                  </td>
                  <td>
                    {{ item.city }}
                  </td>
                  <td>
                    {{ item.town }}
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

                <tr>
                  <td colspan="10">
                    <div class="d-flex justify-center" style="gap: 20px">
                      <router-link
                        class="text-decoration-none"
                        :to="`employers/main-info/${item.id}`"
                      >
                        <span>Main Info</span>
                      </router-link>
                      <router-link
                        class="text-decoration-none"
                        :to="`employers/contacts/${item.id}`"
                      >
                        <span>Contacts</span>
                      </router-link>
                      <router-link
                        class="text-decoration-none"
                        :to="`employers/images/${item.id}`"
                      >
                        <span>Images</span>
                      </router-link>
                      <router-link
                        class="text-decoration-none"
                        :to="`employers/socials/${item.id}`"
                      >
                        <span>Socials</span>
                      </router-link>
                      <router-link
                        class="text-decoration-none"
                        :to="`employers/job-locations/${item.id}`"
                      >
                        <span>Job Locations</span>
                      </router-link>
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
import http from 'axios';
import { setAuthHeader } from '@/util/axios';
import app from '@/util/eventBus';

export default {
  name: 'EmployersVue',
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
    imageFile: [],
    userIdToImage: null,
    isOpenImage: false,
    successMessage: '',
    input: {
      id: 0,
      name: '',
      type: null,
      country: null,
      city: null,
      town: null,
      zone: null,
    },
    resource: {
      type: [
        {
          name: 'Super Admin',
          id: 1,
        },
        {
          name: 'Admin',
          id: 2,
        },
      ],
      country: [
        {
          name: 'Indonesia',
          id: 1,
        },
        {
          name: 'India',
          id: 2,
        },
        {
          name: 'Singapore',
          id: 3,
        },
      ],
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
          name: 'Singapore',
          id: 3,
        },
      ],
      town: [
        {
          name: 'Kota Tua',
          id: 1,
        },
        {
          name: 'Kota Lama',
          id: 2,
        },
        {
          name: 'Woodlands',
          id: 3,
        },
      ],
      zone: [
        {
          name: 'North',
          id: 1,
        },
        {
          name: 'South',
          id: 2,
        },
      ],
    },
    rules: {
      nameRules: [
        (value) => {
          if (value) return true;
          return 'Employer name is required.';
        },
      ],
      typeRules: [
        (value) => {
          if (value) return true;
          return 'Employer type is required.';
        },
      ],
      countryRules: [
        (value) => {
          if (value) return true;
          return 'Country is required.';
        },
      ],
      cityRules: [
        (value) => {
          if (value) return true;
          return 'City is required.';
        },
      ],
      townRules: [
        (value) => {
          if (value) return true;
          return 'Town is required.';
        },
      ],
      zoneRules: [
        (value) => {
          if (value) return true;
          return 'Zone is required.';
        },
      ],
    },
    search: '',
    items: [],
    itemsTry: [
      {
        id: 1,
        logo: '@/assets/logo-img.jpeg',
        image: '@/assets/other-voucher-5.jpeg',
        name: 'Changi General Hospital',
        type: 'Admin',
        country: 'Singapore',
        city: 'Singapore',
        town: 'Woodlands',
        zone: 'North',
        isActive: true,
        isFav: true,
      },
      {
        id: 2,
        logo: '@/assets/logo-img.jpeg',
        image: '@/assets/other-voucher-5.jpeg',
        name: 'Changi General Hospital',
        type: 'Admin',
        country: 'Singapore',
        city: 'Singapore',
        town: 'Woodlands',
        zone: 'North',
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
      return this.itemsTry.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTextLower) ||
          item.country.toLowerCase().includes(searchTextLower) ||
          item.city.toLowerCase().includes(searchTextLower) ||
          item.town.toLowerCase().includes(searchTextLower)
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
      axios
        .post(`/user/deleteImage`, payload, {})
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getUserData();
          // app.config.globalProperties.$eventBus.$emit('update-image');
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
      http
        .post(`/user/update`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getUserData();
          // app.config.globalProperties.$eventBus.$emit('update-image');
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        .finally(() => {
          this.isEdit = false;
          this.isSending = false;
          this.userIdToImage = null;
          this.isOpenImage = false;
          this.imageFile = [];
        });
    },
    editUser(user) {
      this.isEdit = true;
      this.input = {
        id: user.id,
        name: user.name,
        type: user.type,
        country: user.country,
        city: user.city,
        town: user.town,
        zone: user.zone,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        id: 0,
        name: '',
        type: null,
        country: null,
        city: null,
        town: null,
        zone: null,
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
        axios
          .post(`/user/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getUserData();
            this.input = {
              id: 0,
              name: '',
              type: null,
              country: null,
              city: null,
              town: null,
              zone: null,
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
          name: this.input.username,
          email: this.input.email,
          role: this.input.role,
          country_id: this.input.country,
        };
        if (this.input.image !== null) {
          payload['file'] = this.input.image;
        }
        axios
          .post(`/register`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getUserData();
            this.input = {
              id: 0,
              name: '',
              type: null,
              country: null,
              city: null,
              town: null,
              zone: null,
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
    deleteUser() {
      this.isDeleteLoading = true;
      axios
        .post(`/user/delete`, {
          id: this.userIdToDelete,
        })
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getUserData();
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
    getUserData() {
      this.isLoading = true;
      axios
        .get(`/user`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.items = data.map((item) => {
            return {
              id: item.id || 1,
              name: item.name || '',
              email: item.email || '',
              registered_on: item.registered_on || '',
              role: item.role || '',
              roleName:
                item.role == 'S'
                  ? 'Superadmin'
                  : item.role == 'A'
                  ? 'Admin'
                  : '',
              image: item.image || null,
              country_id: item.country_id || 1,
              country_name: item.country_name || '',
            };
          });

          app.config.globalProperties.$eventBus.$emit(
            'update-image',
            this.items
          );
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
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
