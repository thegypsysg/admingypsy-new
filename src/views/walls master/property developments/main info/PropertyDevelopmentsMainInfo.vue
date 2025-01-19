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
        <h3 class="ml-4 mr-10 mb-6">Main Info</h3>
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

    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <div class="d-flex justify-space-between">
              <p class="mb-2 font-weight-bold">Project Header</p>
            </div>
            <v-textarea
              density="compact"
              v-model="input.project_header"
              rows="9"
              variant="outlined"
              required
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <div class="d-flex justify-space-between">
              <p class="mb-2 font-weight-bold">Project Description</p>
            </div>
            <v-textarea
              density="compact"
              v-model="input.project_description"
              rows="9"
              variant="outlined"
              required
            ></v-textarea>
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
// import moment from 'moment';
// import http from 'axios';
import { setAuthHeader } from '@/util/axios';
// import app from '@/util/eventBus';

export default {
  name: 'ParkingMainInfo',
  data: () => ({
    // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    developmentId: null,
    developementData: [],
    valid: false,
    isLoading: false,
    isSending: false,
    isError: false,
    isEdit: false,
    isSuccess: false,
    isDelete: false,
    isDeleteLoading: false,
    isOpenImage: false,
    successMessage: '',
    errorMessage: '',
    input: {
      development_id: 0,
      project_header: '',
      project_description: '',
    },
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.isLoading = true;
    this.developmentId = parseInt(this.$route.params.id);
    this.getDevelopementData();
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
    
    saveData() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          development_id: this.developmentId,
          developer_id : this.developementData.developer_id,
          project_name : this.developementData.project_name,
          project_header: this.input.project_header,
          project_description: this.input.project_description,
        };
        axios
          .post(`/4walls-property-developments/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
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
