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
        to="/manage_events"
      >
        <p>Back</p>
      </router-link>
    </div>
    <div class="d-flex align-center justify-space-between gap-2 pr-16">
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

            <div class="d-flex justify-space-between">
              <p class="mb-2">Event Details</p>
              <h4 class="ml-4 mb-6" style="color: #293fb8; font-weight: 400">
                {{ partnerName[0]?.mall || '' }}
                <!-- Phoenix Market City Mall -->
              </h4>
            </div>
            <v-textarea
              density="compact"
              v-model="input.detail"
              rows="15"
              variant="outlined"
              required
            ></v-textarea>
          </v-col>
          <v-col cols="12" md="5">
            <v-textarea
              density="compact"
              v-model="input.location"
              label="Event Location"
              rows="3"
              variant="outlined"
              required
            ></v-textarea>
            <div class="mb-4 d-flex">
              <div class="w-50">
                <p class="mb-2">Event Starts on</p>
                <VueDatePicker
                  v-model="input.start"
                  text-input
                  :enable-time-picker="false"
                ></VueDatePicker>
              </div>
              <div class="w-50">
                <p class="mb-2">All Day Event</p>
                <v-checkbox class="mt-n2" v-model="input.all"> </v-checkbox>
              </div>
            </div>
            <div class="w-50 mt-n8">
              <p class="mb-2">Event Ends on</p>
              <VueDatePicker
                v-model="input.end"
                text-input
                :enable-time-picker="false"
              ></VueDatePicker>
            </div>
            <p class="mb-2 mt-4">Event Time</p>
            <v-text-field
              v-model="input.time"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
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
import moment from 'moment';
// import http from 'axios';
import { setAuthHeader } from '@/util/axios';
// import app from '@/util/eventBus';

export default {
  name: 'EventsMainInfo',
  data: () => ({
    // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    idEvent: null,
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
      detail: '',
      location: '',
      all: null,
      start: null,
      end: null,
      time: '',
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
    this.idEvent = parseInt(this.$route.params.id);
    this.getEventData();
  },
  methods: {
    getEventData() {
      this.isLoading = true;
      axios
        .get(`/mall-events`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          const dataItem = data.filter((i) => i.event_id == this.idEvent);
          this.partnerName = dataItem.map((item) => {
            return {
              id: item.event_id,
              name: item.event_header,
              mall: item.mall_name || '',
            };
          });
          this.input = {
            id: dataItem[0].event_id,
            detail: dataItem[0].event_details || '',
            location: dataItem[0].event_location || '',
            all: dataItem[0].all_day_event == 'Y' ? true : null,
            start: dataItem[0].event_start_on
              ? moment(dataItem[0].event_start_on, 'DD/MM/YYYY').toISOString()
              : null,
            end: dataItem[0].event_end_on
              ? moment(dataItem[0].event_end_on, 'DD/MM/YYYY').toISOString()
              : null,
            time: dataItem[0].event_time || '',
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
          event_id: this.idEvent,
          event_details: this.input.detail,
          event_location: this.input.location,
          event_start_on: this.input.start
            ? moment(this.input.start).format('DD/MM/YYYY')
            : this.input.start,
          event_end_on: this.input.end
            ? moment(this.input.end).format('DD/MM/YYYY')
            : this.input.end,
          event_time: this.input.time,
          all_day_event: this.input.all == true ? 'Y' : null,
        };
        axios
          .post(`/mall-events/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.event_details
              ? 'Please fill the detail field'
              : error.response.data.event_location
              ? 'Please fill the location field'
              : error.response.data.event_time
              ? 'Please fill the time field'
              : error.response.data.event_start_on
              ? 'Please fill the Event Starts on field'
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
