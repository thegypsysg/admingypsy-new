<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container v-if="isLoading">
    <div class="h-100 d-flex justify-center align-center">
      <p>Loading...</p>
    </div>
  </v-container>
  <v-container v-else>
    <div class="d-flex ml-4 mb-6" style="gap: 50px">
      <router-link
        style="color: #293fb8; font-size: 13px"
        class="text-decoration-none"
        to="/partner_master"
      >
        <p>Back</p>
      </router-link>
    </div>
    <h3 class="ml-4 mb-6">Main Info</h3>
    <h4 class="ml-4 mb-6" style="color: #293fb8; font-weight: 400">
      {{ partnerName[0]?.name || '' }}
    </h4>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <!-- <v-combobox
              density="compact"
              label="Employer Type"
              placeholder="Type Employer Type"
              :items="resource.type"
              item-title="name"
              item-value="id"
              v-model="input.type"
              variant="outlined"
            ></v-combobox> -->
            <v-textarea
              density="compact"
              v-model="input.address"
              label="Address"
              rows="3"
              variant="outlined"
              required
            ></v-textarea>
            <v-text-field
              v-model="input.telephone"
              label="Telephone"
              type="phone"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
            <v-text-field
              v-model="input.whatsapp"
              label="What'sApp"
              type="phone"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
            <v-textarea
              density="compact"
              v-model="input.open"
              label="Opening Hours"
              rows="3"
              variant="outlined"
              required
            ></v-textarea>
          </v-col>
          <v-col cols="12" md="4">
            <v-textarea
              density="compact"
              v-model="input.about"
              label="About Us"
              rows="3"
              variant="outlined"
              required
            ></v-textarea>
            <v-text-field
              v-model="input.website"
              label="Website"
              variant="outlined"
              density="compact"
              required
            ></v-text-field
            ><v-text-field
              v-model="input.email"
              :rules="emailRules"
              label="Official Email"
              type="email"
              density="compact"
              variant="outlined"
              required
            ></v-text-field
            ><v-autocomplete
              v-model="input.manage"
              :items="partnerName"
              item-title="name"
              item-value="id"
              label="Managed by"
              placeholder="Type Managed by"
              variant="outlined"
              density="compact"
              required
            ></v-autocomplete>
            <!-- <v-combobox
              density="compact"
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
              label="Select Town"
              placeholder="Type Town"
              :items="resource.town"
              item-title="name"
              item-value="id"
              v-model="input.town"
              variant="outlined"
            ></v-combobox> -->
          </v-col>
          <v-col class="ml-4" cols="12" md="2">
            <v-btn
              color="indigo-accent-2"
              style="text-transform: none"
              type="submit"
              variant="flat"
              class="w-100"
              @click="saveData()"
              :disabled="isSending"
              :loading="isSending"
            >
              Save
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

    <v-snackbar location="top" color="red" v-model="isError" :timeout="3000">
      {{ errorMessage }}

      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="isError = false">
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
  name: 'MainInfo',
  data: () => ({
    // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    idPartner: null,
    partnerName: [],
    valid: false,
    isLoading: false,
    isSending: false,
    isError: false,
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
    errorMessage: '',
    input: {
      id: 0,
      address: null,
      telephone: null,
      whatsapp: null,
      open: null,
      about: null,
      website: null,
      email: null,
      manage: null,
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
    emailRules: [
      (value) => {
        if (/.+@.+\..+/.test(value)) return true;
        return 'E-mail must be valid.';
      },
    ],
    search: '',
    items: [],
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.idPartner = parseInt(this.$route.params.id);
    this.getPartnerData();
  },
  methods: {
    getPartnerData() {
      this.isLoading = true;
      axios
        .get(`/partners`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          const dataItem = data.filter((i) => i.partner_id == this.idPartner);
          this.partnerName = dataItem.map((item) => {
            return {
              id: item.partner_id,
              name: item.partner_name,
            };
          });
          this.input = {
            id: dataItem[0].partner_id,
            address: dataItem[0].address,
            telephone: dataItem[0].telephone,
            whatsapp: dataItem[0].whats_app,
            open: dataItem[0].opening_hours,
            about: dataItem[0].about_us,
            website: dataItem[0].website,
            email: dataItem[0].official_email,
            manage: dataItem[0].managed_by,
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
          this.isLoading = false;
        });
    },
    saveData() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          partner_id: this.idPartner,
          address: this.input.address,
          about_us: this.input.about,
          telephone: this.input.telephone,
          whats_app: this.input.whatsapp,
          official_email: this.input.email,
          opening_hours: this.input.open,
          website: this.input.website,
          managed_by: this.input.manage,
        };
        axios
          .post(`/partners/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
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
