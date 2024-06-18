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
        to="/displayed-banners"
      >
        <p>Back</p>
      </router-link>
    </div>
    <div class="d-flex align-items-center gap-2">
      <h3 class="ml-4 mr-10 mb-6">Main Info</h3>

      <v-btn
        color="indigo-accent-2"
        style="text-transform: none"
        type="submit"
        variant="flat"
        @click="saveData()"
        :disabled="isSending"
        :loading="isSending"
      >
        Update
      </v-btn>
    </div>

    <h4 class="ml-4 mb-6" style="color: #293fb8; font-weight: 400">
      {{ partnerName[0]?.name || '' }}
    </h4>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
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
            <p class="mb-2">Display Header</p>
            <v-text-field
              v-model="input.name"
              placeholder="Type Display Header"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
            <p class="mb-2">Display Description</p>
            <v-textarea
              density="compact"
              v-model="input.desc"
              placeholder="Display Description"
              rows="7"
              variant="outlined"
              required
            ></v-textarea>
            <div class="d-flex" style="gap: 20px">
              <div class="w-50 mb-4">
                <p class="mb-2">Starts on</p>
                <VueDatePicker
                  v-model="input.start"
                  text-input
                  :enable-time-picker="false"
                ></VueDatePicker>
              </div>
              <div class="w-50">
                <p class="mb-2">Ends on</p>
                <VueDatePicker
                  v-model="input.end"
                  text-input
                  :enable-time-picker="false"
                ></VueDatePicker>
              </div>
            </div>
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
import moment from 'moment';
// import http from 'axios';
import { setAuthHeader } from '@/util/axios';
// import app from '@/util/eventBus';

export default {
  name: 'MainInfo',
  data: () => ({
    // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    idBanner: null,
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
      name: '',
      desc: '',
      // amount: 0,
      // was: 0,
      // offer: '',
      start: null,
      end: null,
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
    this.idBanner = parseInt(this.$route.params.id);
    this.getPartnerData();
  },
  methods: {
    getPartnerData() {
      this.isLoading = true;
      axios
        .get(`/mall-displays`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          const dataItem = data.filter((i) => i.md_id == this.idBanner);
          this.partnerName = dataItem.map((item) => {
            return {
              id: item.md_id,
              name: item.partner_name,
            };
          });
          this.input = {
            id: dataItem[0].md_id,
            name: dataItem[0].display_header || '',
            desc: dataItem[0].display_description || '',
            // amount: dataItem[0].amount ? dataItem[0].amount.toFixed(2) : null,
            // was: dataItem[0].was_amount
            //   ? dataItem[0].was_amount.toFixed(2)
            //   : null,
            // offer: dataItem[0].other_offer || '',
            start: dataItem[0].start_date
              ? moment(dataItem[0].start_date, 'DD/MM/YYYY').toISOString()
              : null,
            end: dataItem[0].end_date
              ? moment(dataItem[0].end_date, 'DD/MM/YYYY').toISOString()
              : null,
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
          md_id: this.idBanner,
          display_header: this.input.name,
          display_description: this.input.desc,
          // amount: this.input.amount,
          // was_amount: this.input.was,
          // other_offer: this.input.offer,
          start_date: this.input.start
            ? moment(this.input.start).format('DD/MM/YYYY')
            : this.input.start,
          end_date: this.input.end
            ? moment(this.input.end).format('DD/MM/YYYY')
            : this.input.end,
        };
        axios
          .post(`/mall-displays/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.display_header
              ? 'Please fill the name field'
              : error.response.data.display_description
              ? 'Please fill the description field'
              : error.response.data.start_date
              ? 'Please fill the Banner Starts on field'
              : error.response.data.message === ''
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
