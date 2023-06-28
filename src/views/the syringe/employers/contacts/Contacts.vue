<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <div class="d-flex ml-4 mb-6" style="gap: 50px">
      <router-link
        style="color: #293fb8; font-size: 13px"
        class="text-decoration-none"
        to="/employers"
      >
        <p>Back</p>
      </router-link>
    </div>
    <h3 class="ml-4 mb-6">Contacts</h3>
    <h4 class="ml-4 mb-6" style="color: #293fb8; font-weight: 400">
      Woodlands Health Care
    </h4>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="input.contact"
              :rules="rules.contactCodeRules"
              label="Contact"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
            <v-text-field
              v-model="input.telephone"
              :rules="rules.telephoneRules"
              label="Telephone"
              variant="outlined"
              type="phone"
              density="compact"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="input.position"
              :rules="rules.positionRules"
              label="Position Held"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
            <v-text-field
              v-model="input.mobile"
              :rules="rules.mobileRules"
              label="Mobile"
              type="phone"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="input.email"
              :rules="rules.emailRules"
              label="Enter Email"
              type="email"
              density="compact"
              variant="outlined"
              required
            ></v-text-field>
            <v-text-field
              v-model="input.whatsapp"
              :rules="rules.whatsappRules"
              label="What'sApp"
              type="phone"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
          </v-col>
          <v-col class="ml-4" cols="12" md="2">
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
              class="w-100 mt-6"
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
        <v-col cols="12">
          <v-table class="country-table">
            <thead>
              <tr>
                <th class="text-left">Contact Person</th>
                <th class="text-left">Position Held</th>
                <th class="text-left">Telephone</th>
                <th class="text-left">Mobile</th>
                <th class="text-left">What'sApp</th>
                <th class="text-left">Emmail</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in filteredItems" :key="item.id">
                <tr class="country-table-body">
                  <td>{{ item.contact }}</td>
                  <td>
                    {{ item.position }}
                  </td>
                  <td>
                    {{ item.telephone }}
                  </td>
                  <td>
                    {{ item.mobile }}
                  </td>
                  <td>
                    {{ item.whatsapp }}
                  </td>
                  <td>
                    {{ item.email }}
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
  </v-container>
</template>

<script>
import axios from '@/util/axios';
// import http from 'axios';
import { setAuthHeader } from '@/util/axios';
// import app from '@/util/eventBus';

export default {
  name: 'EmployersVue',
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
      contact: '',
      telephone: '',
      position: '',
      mobile: '',
      email: '',
      whatsapp: '',
    },
    rules: {
      contactRules: [
        (value) => {
          if (value) return true;
          return 'Contact Person is required.';
        },
      ],
      telephoneRules: [
        (value) => {
          if (value) return true;
          return 'Telephone is required.';
        },
      ],
      positionRules: [
        (value) => {
          if (value) return true;
          return 'Position Held is required.';
        },
      ],
      mobileRules: [
        (value) => {
          if (value) return true;
          return 'Mobile is required.';
        },
      ],
      emailRules: [
        (value) => {
          if (value) return true;
          return 'E-mail is requred.';
        },
        (value) => {
          if (/.+@.+\..+/.test(value)) return true;
          return 'E-mail must be valid.';
        },
      ],
      whatsappRules: [
        (value) => {
          if (value) return true;
          return "What'sApp is required.";
        },
      ],
      // websiteRules: [
      //   (value) => !!value || 'Required.',
      //   (value) => {
      //     const regex =
      //       /(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}/gm;
      //     return regex.test(value) || 'Invalid Url Format!!';
      //   },
      // ],
    },
    search: '',
    items: [],
    itemsTry: [
      {
        id: 1,
        contact: 'Charlton Mendes',
        position: 'HR Manager',
        telephone: '68352000',
        mobile: '91992000',
        whatsapp: '91992000',
        email: 'charltonmendes@gmail.com',
      },
      {
        id: 2,
        contact: 'Charlton Mendes',
        position: 'HR Manager',
        telephone: '68352000',
        mobile: '91992000',
        whatsapp: '91992000',
        email: 'charltonmendes@gmail.com',
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
        contact: user.contact,
        telephone: user.telephone,
        position: user.position,
        mobile: user.mobile,
        email: user.email,
        whatsapp: user.whatsapp,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        id: 0,
        contact: '',
        telephone: '',
        position: '',
        mobile: '',
        email: '',
        whatsapp: '',
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
        //       contact: '',
        //       telephone: '',
        //       position: '',
        //       mobile: '',
        //       email: '',
        //       whatsapp: '',
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
        //       contact: '',
        //       telephone: '',
        //       position: '',
        //       mobile: '',
        //       email: '',
        //       whatsapp: '',
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
  font-weight: 500;
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
