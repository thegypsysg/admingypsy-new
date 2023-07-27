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
        to="/jobs-master"
      >
        <p>Back</p>
      </router-link>
    </div>
    <div class="d-flex">
      <h2 class="ml-4 mb-6" style="color: #293fb8; font-weight: 600">
        {{ itemData?.id || '' }}
      </h2>
      <h2 class="ml-8 mb-6" style="color: #293fb8; font-weight: 600">
        {{ itemData?.position || '' }}
      </h2>
    </div>
    <div class="d-flex ml-4 mb-4" style="gap: 50px">
      <router-link
        style="font-weight: 500; font-size: 13px"
        class="text-grey text-decoration-none"
        :to="`/jobs-master/${idJob}`"
      >
        <h2>Main Info</h2>
      </router-link>
      <router-link
        style="color: black; font-weight: 500; font-size: 13px"
        class="text-decoration-none"
        :to="`/jobs-master/desc/${idJob}`"
      >
        <h2>Job Description</h2>
      </router-link>
    </div>
    <!-- <v-form v-model="valid" @submit.prevent> -->
    <v-container>
      <v-row class="mt-n6">
        <v-col cols="12" md="10"
          ><QuillEditor
            theme="snow"
            toolbar="full"
            contentType="html"
            v-model:content="input.desc"
        /></v-col>
        <v-col cols="12" md="2">
          <v-btn
            color="indigo-accent-2"
            style="text-transform: none"
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
    <!-- </v-form> -->
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
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
// import app from '@/util/eventBus';

export default {
  name: 'PartnerMaster',
  components: {
    QuillEditor,
  },
  data: () => ({
    // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    valid: false,
    idJob: null,
    isLoading: false,
    isSending: false,
    isError: false,
    isSuccess: false,
    successMessage: '',
    errorMessage: '',
    input: {
      id: null,
      skillsId: null,
      positionId: null,
      partnerId: null,
      desc: '',
    },
    content: null,
    search: '',
    itemData: {},
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.idJob = this.$route.params.id;
    this.getJobData();
  },
  methods: {
    saveData() {
      // if (this.valid) {
      // console.log(this.input.desc);
      this.isSending = true;
      const payload = {
        job_id: this.input.id,
        skills_id: this.input.skillsId,
        position_id: this.input.positionId,
        partner_id: this.input.partnerId,
        job_description: this.input.desc,
      };
      axios
        .post(`/jobs/update`, payload)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getJobData();
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
      // }
    },
    getJobData() {
      this.isLoading = true;
      const id = this.$route.params.id;
      axios
        .get(`/jobs/${id}`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.itemData = {
            ...data,
            id: data.job_reference_no || '',
            job_id: data.job_id || 1,
            position: data.position.position_name || '',
          };
          this.input = {
            id: data.job_id || 0,
            positionId: data.position_id || 0,
            skillsId: data.skills_id || 0,
            partnerId: data.partner_id || 0,
            desc: data.job_description || '',
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
  },
};
</script>

<style lang="scss" scoped>
.country-table {
  font-size: 12px;
}

.country-table-body {
  margin-top: 50px !important;
  margin-bottom: 50px !important;
}

.country-table-body td {
  border-bottom: none !important;
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

.skeleton {
  width: 100%;
  height: 100%;
  border-radius: 0;

  background: linear-gradient(-90deg, #f2f2f2 0%, #e1e1e1 50%, #f2f2f2 100%);
  background-size: 400% 400%;
  animation: skeleton 1.6s ease infinite;
  margin: 0 auto;
}
</style>
