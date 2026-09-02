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
          to="/construction_master"
        >
          <p>Back</p>
        </router-link>
        <h3 class="ml-4 mr-10 mb-6">Main Info</h3>
      </div>
    </div>
    <div class="d-flex align-center justify-space-between pr-16 pl-4">
      <div class="d-flex" style="gap: 10px">
        <div style="min-width: 100px">
          <h3 style="color: blue">{{ this.constructionData.construction_name }}</h3>
        </div>
        <div style="min-width: 100px">
          <h3 style="color: blue">{{ this.constructionData?.building_type?.building_type }}</h3>
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
              <p class="mb-2 font-weight-bold">Tag Line</p>
            </div>
            <v-textarea
              density="compact"
              v-model="input.tag_line"
              rows="9"
              variant="outlined"
              required
            ></v-textarea>
          </v-col>
          <v-col cols="12" md="6">
            <v-row>
              <v-col cols="12" md="6">
                <div class="d-flex justify-space-between">
                  <p class="mb-2 font-weight-bold">Construction Started On</p>
                </div>
                <v-text-field
                  type="date"
                  density="compact"
                  v-model="input.project_start_on"
                  variant="outlined"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <div class="d-flex justify-space-between">
                  <p class="mb-2 font-weight-bold">Expected Completion Date</p>
                </div>
                <v-text-field
                  type="date"
                  density="compact"
                  v-model="input.project_completion_on"
                  variant="outlined"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <div class="d-flex justify-space-between">
                  <p class="mb-2 font-weight-bold">Under Construction</p>
                </div>
                <v-btn-toggle
                  style="
                    font-size: 10px !important;
                    font-weight: 200 !important;
                    height: 22px !important;
                    width: 54px !important;
                  "
                  class="d-flex align-center"
                  v-model="input.under_construction"
                  rounded="5"
                >
                  <v-btn size="27" :value="true"> Yes </v-btn>

                  <v-btn size="27" :value="false"> No </v-btn>
                </v-btn-toggle>
              </v-col>
              <v-col cols="12" md="6">
                <div class="d-flex justify-space-between">
                  <p class="mb-2 font-weight-bold">T.O.P(Key Handed)</p>
                </div>
                <v-btn-toggle
                  style="
                    font-size: 10px !important;
                    font-weight: 200 !important;
                    height: 22px !important;
                    width: 54px !important;
                  "
                  class="d-flex align-center"
                  v-model="input.top"
                  rounded="5"
                >
                  <v-btn size="27" :value="true"> Yes </v-btn>

                  <v-btn size="27" :value="false"> No </v-btn>
                </v-btn-toggle>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="2">
                <div class="d-flex justify-space-between">
                  <p class="mb-2 font-weight-bold">Total Floor</p>
                </div>
                <v-text-field
                  density="compact"
                  v-model="input.total_floors"
                  variant="outlined"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <div class="d-flex justify-space-between">
              <p class="mb-2 font-weight-bold">Brief Details</p>
            </div>
            <v-textarea
              density="compact"
              v-model="input.brief_details"
              rows="9"
              variant="outlined"
              required
            ></v-textarea>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-container>
</template>

<script>
import { useNotificationStore } from '@/stores/notification';
import axios from '@/util/axios';
// import moment from 'moment';
import { setAuthHeader } from '@/util/axios';
// import app from '@/util/eventBus';
import moment from 'moment';
export default {
  name: 'ConstructionMasterMainInfo',
  setup() {
    const notification = useNotificationStore();
    return { notification };
  },
  data: () => ({
    // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    constructionId: null,
    constructionData: [],
    valid: false,
    isLoading: false,
    isSending: false,
    isEdit: false,
    isDelete: false,
    isDeleteLoading: false,
    isOpenImage: false,
    input: {
      cc_id: 0,
      bt_id: 0,
      construction_name: '',
      tag_line: '',
      brief_details: '',
      project_start_on: '',
      project_completion_on: '',
      under_construction: '',
      top: '',
      total_floor: '',
    },
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.isLoading = true;
    this.constructionId = parseInt(this.$route.params.id);
    this.getConstructionData();
  },
  methods: {
    getConstructionData() {
      this.isLoading = true;
      axios
        .get(`/4walls-construction-masters/${this.constructionId}`)
        .then((response) => {
          this.constructionData = response.data.data;
          this.input.under_construction =
            this.constructionData.under_construction == 'Y' ? true : false;
          this.input.top = this.constructionData.top == 'Y' ? true : false;
          this.input.total_floors = this.constructionData.total_floors;
          this.input.project_start_on = this.formatDateDisplay(
            this.constructionData.project_start_on
          );
          this.input.project_completion_on = this.formatDateDisplay(
            this.constructionData.project_completion_on
          );
          this.input.tag_line = this.constructionData.tag_line;
          this.input.brief_details = this.constructionData.brief_details;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    formatDateDatabase(date) {
      return moment(date).format('DD/MM/YYYY');
    },
    formatDateDisplay(date) {
      return date.split('/')[2] + '-' + date.split('/')[1] + '-' + date.split('/')[0];
    },
    saveData() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          construction_id: this.constructionData.construction_id,
          cc_id: this.constructionData.cc_id,
          bt_id: this.constructionData.bt_id,
          construction_name: this.constructionData.construction_name,
          tag_line: this.input.tag_line,
          brief_details: this.input.brief_details,
          project_start_on: this.formatDateDatabase(this.input.project_start_on),
          project_completion_on: this.formatDateDatabase(this.input.project_completion_on),
          under_construction: this.input.under_construction ? 'Y' : 'N',
          top: this.input.top ? 'Y' : 'N',
          total_floors: this.input.total_floors,
        };
        axios
          .post(`/4walls-construction-masters/update`, payload)
          .then((response) => {
            const data = response.data;
            this.notification.success(data.message);
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.construction_name
              ? 'Please fill the header field'
              : error.response.data.tag_line
              ? 'Please fill the description field'
              : error.response.data.message;
            this.notification.error(message);
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
