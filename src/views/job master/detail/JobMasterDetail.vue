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
    <h2 class="ml-4 mb-6 text-grey">Main Info</h2>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col class="pt-10" cols="12" md="3">
            <v-autocomplete
              density="compact"
              label="Job Country"
              placeholder="Select Country"
              :items="resource.country"
              item-title="name"
              item-value="id"
              v-model="input.country"
              variant="outlined"
              required
            ></v-autocomplete>
          </v-col>
          <v-col class="pt-10" cols="12" md="3">
            <v-autocomplete
              density="compact"
              label="Show in Country"
              placeholder="Select Country"
              :items="resource.showCountry"
              item-title="name"
              item-value="id"
              v-model="input.showCountry"
              variant="outlined"
              required
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="2">
            <div>
              <label>Multiple Locations</label>
              <v-checkbox v-model="input.multiLocations" class="text-black">
              </v-checkbox>
            </div>
          </v-col>
          <v-col class="pt-10" cols="12" md="3">
            <v-autocomplete
              density="compact"
              label="Specific Location"
              placeholder="---Select Job Location---"
              :items="resource.jobLocation"
              item-title="name"
              item-value="id"
              v-model="input.jobLocation"
              variant="outlined"
              required
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row class="mt-n8">
          <v-col class="pt-10" cols="12" md="2">
            <v-text-field
              v-model="input.postedOn"
              label="Job Posted on"
              type="date"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="6" md="3">
            <div class="d-flex justify-space-around">
              <div>
                <label>Add Days</label>
                <v-select
                  class="mt-1"
                  clearable
                  density="compact"
                  :items="resource.days"
                  v-model="input.days"
                  variant="outlined"
                ></v-select>
              </div>
              <div>
                <label>No Expiry</label>
                <v-checkbox v-model="input.expiry" class="text-black">
                </v-checkbox>
              </div>
            </div>
          </v-col>
          <v-col class="pt-10" cols="12" md="3">
            <v-text-field
              v-model="input.expiryDate"
              label="Expiry Date"
              type="date"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
          </v-col>
          <v-col class="pt-10" cols="12" md="3">
            <v-autocomplete
              density="compact"
              label="Job Type"
              placeholder="---Select Job Type---"
              :items="resource.jobType"
              item-title="name"
              item-value="id"
              v-model="input.jobType"
              variant="outlined"
              required
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row class="mt-n4">
          <v-col cols="12" md="4">
            <v-textarea
              v-model="input.salary"
              label="Salary Range (S$)"
              rows="3"
              variant="outlined"
              density="compact"
              required
            ></v-textarea>
          </v-col>
          <v-col cols="12" md="4">
            <v-textarea
              v-model="input.shift"
              label="Shift Details"
              rows="3"
              variant="outlined"
              density="compact"
              required
            ></v-textarea>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              density="compact"
              label="Working Options"
              placeholder="---Select Working Options---"
              :items="resource.workOptions"
              item-title="name"
              item-value="id"
              v-model="input.workOptions"
              variant="outlined"
              required
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row class="mt-n8">
          <v-col cols="12" md="2">
            <div style="width: 100px">
              <label>Number of Positions</label>
              <v-text-field
                v-model="input.numPosition"
                type="number"
                :min="1"
                :max="999"
                variant="outlined"
                density="compact"
                required
              ></v-text-field>
            </div>
          </v-col>
          <v-col class="pt-15" cols="12" md="3">
            <v-autocomplete
              density="compact"
              label="Job Status"
              placeholder="---Select Status---"
              :items="resource.status"
              item-title="name"
              item-value="value"
              v-model="input.status"
              variant="outlined"
              required
            ></v-autocomplete>
          </v-col>
          <v-col cols="4"><v-spacer></v-spacer></v-col>
          <v-col class="pt-15" cols="12" md="2">
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
import moment from 'moment';
// import app from '@/util/eventBus';

export default {
  name: 'PartnerMaster',
  data: () => ({
    // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    valid: false,
    isLoading: false,
    isSending: false,
    isError: false,
    isSuccess: false,
    successMessage: '',
    errorMessage: '',
    input: {
      id: null,
      positionId: null,
      skillsId: null,
      partnerId: null,
      country: null,
      showCountry: null,
      multiLocations: null,
      jobLocation: null,
      postedOn: null,
      days: null,
      expiry: null,
      expiryDate: null,
      jobType: null,
      salary: null,
      shift: null,
      workOptions: null,
      numPosition: null,
      status: null,
    },
    resource: {
      jobType: [],
      workOptions: [],
      jobLocation: [],
      days: ['30', '10'],
      status: [
        {
          value: 'P',
          name: 'Pending',
        },
        {
          value: 'C',
          name: 'Completed',
        },
      ],
    },
    search: '',
    itemData: {},
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.getJobData();
    this.getJobType();
    this.getWorkingOptions();
    this.getCountry();
  },
  methods: {
    saveData() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          //           "{
          //      ""multiple_locations"": ""Y"",
          //      ""pl_id"":2
          // }"
          job_id: this.input.id,
          position_id: this.input.positionId,
          skills_id: this.input.skillsId,
          partner_id: this.input.partnerId,
          expiry: this.input.expiry == true ? 'Y' : 'N',
          expiry_date: moment(this.input.expiryDate, 'yyyy-mm-DD').format(
            'DD/mm/yyyy'
          ),
          num_positions: this.input.numPosition,
          job_type_id: this.input.jobType,
          working_options_id: this.input.workOptions,
          salary_range: this.input.salary,
          multiple_locations: this.input.multiLocations == true ? 'Y' : 'N',
          pl_id: this.input.jobLocation,
          status: this.input.status,
          show_in_country: this.input.showCountry,
          // country: this.input.country,
          // postedOn: this.input.postedOn,
          // days: this.input.days,
          // shift: this.input.shift,
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
      }
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
            postedOn:
              moment(data.job_dated, 'DD/mm/yyyy').format('yyyy-mm-DD') || '',
            days: '30',
            expiry:
              data.expiry == 'N' ? false : data.expiry == 'Y' ? true : false,
            expiryDate:
              moment(data.expiry_date, 'DD/mm/yyyy').format('yyyy-mm-DD') || '',
            numPosition: data.num_positions || 1,
            jobType: data.job_type_id || null,
            workOptions: data.working_options_id || null,
            salary: data.salary_range || '',
            shift: data.partner.shift || '',
            multiLocations:
              data.multiple_locations == 'N'
                ? false
                : data.multiple_locations == 'Y'
                ? true
                : false,
            jobLocation: data.pl_id || null,
            country: data.partner.country_id || null,
            showCountry: data.show_in_country || null,
            status: data.status || null,
          };
          // console.log(this.input);
          this.getJobLocations();
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
    getJobType() {
      axios
        .get(`/job-types`)
        .then((response) => {
          const data = response.data.data;
          this.resource.jobType = data.map((job) => {
            return {
              id: job.job_type_id,
              name: job.job_type,
            };
          });
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
        });
    },
    getWorkingOptions() {
      axios
        .get(`/working-options`)
        .then((response) => {
          const data = response.data.data;
          this.resource.workOptions = data.map((work) => {
            return {
              id: work.working_options_id,
              name: work.name,
            };
          });
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
        });
    },
    getJobLocations() {
      axios
        .get(`/partner-locations/jobs/${this.itemData.job_id}`)
        .then((response) => {
          const data = response.data.data;
          this.resource.jobLocation = data.map((job) => {
            return {
              id: job.pl_id,
              name: `${job.town_name} (${job.zone_name})`,
            };
          });
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
          this.resource.showCountry = data.map((country) => {
            return {
              id: country.country_id,
              name: country.country_name,
            };
          });
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
