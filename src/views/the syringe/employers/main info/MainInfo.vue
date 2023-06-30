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
    <h3 class="ml-4 mb-6">Main Info</h3>
    <h4 class="ml-4 mb-6" style="color: #293fb8; font-weight: 400">
      Woodlands Health Care
    </h4>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="3">
            <v-combobox
              density="compact"
              :rules="rules.typeRules"
              label="Employer Type"
              placeholder="Type Employer Type"
              :items="resource.type"
              item-title="name"
              item-value="id"
              v-model="input.type"
              variant="outlined"
            ></v-combobox>
            <v-textarea
              density="compact"
              v-model="input.address"
              :rules="rules.addressRules"
              label="Address"
              rows="3"
              variant="outlined"
              required
            ></v-textarea>
            <v-text-field
              v-model="input.postalCode"
              :rules="rules.postalCodeRules"
              label="Postal Code"
              class="mt-2"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
            <v-text-field
              v-model="input.website"
              :rules="rules.websiteRules"
              label="Website"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="input.telephone"
              :rules="rules.telephoneRules"
              label="Telephone"
              type="phone"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
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
              :rules="rules.townRules"
              label="Select Town"
              placeholder="Type Town"
              :items="resource.town"
              item-title="name"
              item-value="id"
              v-model="input.town"
              variant="outlined"
            ></v-combobox>
            <v-text-field
              v-model="input.latitude"
              :rules="rules.latitudeRules"
              label="Latitude"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="input.whatsapp"
              :rules="rules.whatsappRules"
              label="What'sApp"
              type="phone"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
            <v-combobox
              density="compact"
              :rules="rules.cityRules"
              label="Select City"
              placeholder="Type City"
              :items="resource.city"
              item-title="name"
              item-value="id"
              v-model="input.city"
              variant="outlined"
            ></v-combobox>
            <v-combobox
              density="compact"
              :rules="rules.zoneRules"
              label="Select Zone"
              placeholder="Type Zone"
              :items="resource.zone"
              item-title="name"
              item-value="id"
              v-model="input.zone"
              variant="outlined"
            ></v-combobox>
            <v-text-field
              v-model="input.longitude"
              :rules="rules.longitudeRules"
              label="Longitude"
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
          </v-col>
        </v-row>
      </v-container>
    </v-form>
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
    // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
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
      type: null,
      address: '',
      postalCode: '',
      website: '',
      telephone: '',
      country: null,
      town: null,
      latitude: '',
      whatsapp: '',
      city: null,
      zone: null,
      longitude: '',
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
      typeRules: [
        (value) => {
          if (value) return true;
          return 'Employer type is required.';
        },
      ],
      addressRules: [
        (value) => {
          if (value) return true;
          return 'Address is required.';
        },
      ],
      postalCodeRules: [
        (value) => {
          if (value) return true;
          return 'Postal Code is required.';
        },
      ],
      websiteRules: [
        (value) => !!value || 'Required.',
        (value) => {
          const regex =
            /(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}/gm;
          return regex.test(value) || 'Invalid Url Format!!';
        },
      ],
      telephoneRules: [
        (value) => {
          if (value) return true;
          return 'Telephone is required.';
        },
      ],
      countryRules: [
        (value) => {
          if (value) return true;
          return 'Country is required.';
        },
      ],
      townRules: [
        (value) => {
          if (value) return true;
          return 'Town is required.';
        },
      ],
      latitudeRules: [
        (value) => {
          if (value) return true;
          return 'Latitude is required.';
        },
      ],
      whatsappRules: [
        (value) => {
          if (value) return true;
          return "What'sApp is required.";
        },
      ],
      cityRules: [
        (value) => {
          if (value) return true;
          return 'City is required.';
        },
      ],
      zoneRules: [
        (value) => {
          if (value) return true;
          return 'Zone is required.';
        },
      ],
      longitudeRules: [
        (value) => {
          if (value) return true;
          return 'Lotitude is required.';
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
        //       name: '',
        //       type: null,
        //       country: null,
        //       city: null,
        //       town: null,
        //       zone: null,
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
        //       name: '',
        //       type: null,
        //       country: null,
        //       city: null,
        //       town: null,
        //       zone: null,
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
