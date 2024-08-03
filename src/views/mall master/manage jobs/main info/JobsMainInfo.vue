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
        to="/manage_jobs"
      >
        <p>Back</p>
      </router-link>
    </div>
    <div class="d-flex align-center justify-space-between gap-2 pr-16">
      <h3 class="ml-4 mr-10 mb-6">Main Info</h3>
      <div class="d-flex w-66 align-center gap-4" style="gap: 40px">
        <v-btn
          class="mt-n4"
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
    </div>

    <h4 class="ml-4 mb-6" style="color: #293fb8; font-weight: 400">
      {{ partnerName[0]?.name || '' }}
      <!-- Kids Magic Show -->
    </h4>
    <h4 class="ml-4 mb-6 text-red" style="font-weight: 400">
      {{ partnerName[0]?.mall || '' }}
      <!-- Kids Magic Show -->
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
            <p class="mb-2">Description</p>
            <v-textarea
              density="compact"
              v-model="input.desc"
              rows="8"
              variant="outlined"
              required
            ></v-textarea>
            <p class="mb-2">How to Apply</p>
            <v-textarea
              density="compact"
              v-model="input.apply"
              rows="4"
              variant="outlined"
              required
            ></v-textarea>
          </v-col>
          <!-- <v-col class="ml-4" cols="12" md="2">
          </v-col> -->
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
  name: 'MallJobsMainInfo',
  data: () => ({
    // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    idJob: null,
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
      desc: '',
      apply: '',
    },
    resource: {
      status: [
        {
          value: 'F',
          name: 'Finished',
        },
        {
          value: 'U',
          name: 'Upcoming',
        },
        {
          value: 'C',
          name: 'Current',
        },
      ],
      paid: [
        {
          value: 'F',
          name: 'Free',
        },
        {
          value: 'Y',
          name: 'Paid',
        },
      ],
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
    this.idJob = parseInt(this.$route.params.id);
    this.getJobData();
  },
  methods: {
    formatDate(date) {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    },
    getJobData() {
      this.isLoading = true;
      axios
        .get(`/mall-jobs`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          const dataItem = data.filter((i) => i.job_id == this.idJob);
          this.partnerName = dataItem.map((item) => {
            return {
              id: item.job_id,
              name: item.position_title,
              mall: item.mall_name || '',
            };
          });
          this.input = {
            id: dataItem[0].job_id,
            desc: dataItem[0].job_description || '',
            apply: dataItem[0].how_to_apply || '',
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
          job_id: this.idJob,
          job_description: this.input.desc,
          how_to_apply: this.input.apply,
        };
        axios
          .post(`/mall-jobs/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.job_description
              ? 'Please fill the Description field'
              : error.response.data.how_to_apply
              ? 'Please fill the how to apply on field'
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
