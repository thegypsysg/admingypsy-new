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
        <div style="min-width: 100px; padding-right: 30px">
          <h2 style="color: blue">{{ this.propertyData?.property_ref_no }}</h2>
        </div>
        <div style="border-left: 2px solid black; padding-left: 30px;"></div>
        <div style="min-width: 50px;">
          <h3 style="color: blue ; padding-top: 5px">{{ this.propertyData?.main_category?.category_name }}</h3>
        </div>
        <div style="min-width: 100px; padding-left: 30px;">
          <v-btn
            color="indigo-accent-2"
            style="text-transform: none"
            type="submit"
            variant="flat"
            @click="saveData()"
            :disabled="isSending"
            :loading="isSending"
          >
            Save
          </v-btn>
        </div>
      </div>
    </div>
    <div class="d-flex align-center justify-space-between pr-16 pl-4 mt-10">
      <div class="d-flex" style="gap: 10px">
        <div style="min-width: 100px; padding-right: 10px">
          <h4 style="color: blue">{{ this.propertyData?.tag_line }}</h4>
        </div>
      </div>
    </div>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <v-row>
              <v-col cols="12" md="12">
                <v-textarea
                  density="compact"
                  v-model="input.property_description"
                  rows="9"
                  variant="outlined"
                  required
                  label="Mention Property Details"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="12">
                <label class="mb-10 font-weight-bold">Selling Price</label>
                <div class="d-flex justify-space-between"> 
                  <p class="mb-2 font-weight-bold" style="align-items: center;padding-top: 20px; padding-left: 10px; padding-right: 10px; background-color: gainsboro; color: blue; height: 60px; border-top-left-radius: 10px; border-bottom-left-radius: 10px; ">{{ this.propertyData?.country?.currency_symbol }}</p>
                  <v-text-field
                    v-model="input.selling_price_local"
                    append-inner-icon="mdi-currency-idr"
                    solo
                    hide-details
                    variant="outlined"
                    required
                    class="price-input"
                  >
                  </v-text-field>
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6">
            <v-row>
              <v-col cols="12" sm="4">
                <label class="font-weight-bold">Building Type</label>
                <p style="color: blue;">{{ this.propertyData?.building_type?.building_type }}</p>
              </v-col>
              <v-col cols="12" sm="4">
                <label class="font-weight-bold">Building Name</label>
                <v-select
                  v-model="input.construction_id"
                  item-title="construction_name"
                  item-value="construction_id"
                  variant="outlined"
                  density="compact"
                  required
                  :items="construction"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="4">
                <label class="font-weight-bold">Year Built</label>
                <p style="color: blue;">{{ this.propertyData?.construction_master?.year_built }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="2">
                <label class="font-weight-bold">Bedroom</label>
                <v-select
                  v-model="input.bedrooms"
                  item-title="bedroom_name"
                  item-value="bedroom_id"
                  variant="outlined"
                  density="compact"
                  required
                  :items="bedroom"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="2">
                <label class="font-weight-bold">Bathroom</label>
                <v-select
                  v-model="input.bathrooms"
                  item-title="bathroom_name"
                  item-value="bathroom_id"
                  variant="outlined"
                  density="compact"
                  required
                  :items="bathroom"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="2">
                <label class="font-weight-bold">Sq Ft</label>
                <v-text-field
                  v-model="input.area"
                  variant="outlined"
                  density="compact"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="2">
                <label class="font-weight-bold">Garage</label>
                <v-select
                  v-model="input.garage"
                  item-title="garage_name"
                  item-value="garage_id"
                  variant="outlined"
                  density="compact"
                  required
                  :items="garage"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="2">
                <label class="font-weight-bold">Garage Size</label>
                <v-text-field
                  v-model="input.garage_area"
                  variant="outlined"
                  density="compact"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="2">
                <label class="mb-5 font-weight-bold d-flex align-center"></label>
                <label class="font-weight-bold d-flex align-center">Sq Ft</label>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="2">
                <label class="font-weight-bold">Car Park</label>
                <v-select
                  v-model="input.car_park"
                  item-title="car_park_name"
                  item-value="car_park_id"
                  variant="outlined"
                  density="compact"
                  required
                  :items="car_park"
                ></v-select>
              </v-col>
            </v-row>
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
    propertyId: null,
    propertyData: [],
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
    construction: [],
    car_park: [
      {
        car_park_id: 1,
        car_park_name: 1,
      },
      {
        car_park_id: 2,
        car_park_name: 2,
      },
      {
        car_park_id: 3,
        car_park_name: 3,
      },
      {
        car_park_id: 4,
        car_park_name: 4,
      },
      {
        car_park_id: 5,
        car_park_name: 5,
      },
      {
        car_park_id: 6,
        car_park_name: 6,
      },
      {
        car_park_id: 7,
        car_park_name: 7,
      },
      {
        car_park_id: 8,
        car_park_name: 8,
      },
      {
        car_park_id: 9,
        car_park_name: 9,
      },
      {
        car_park_id: 10,
        car_park_name: 10,
      },
    ],
    bedroom: [
      {
        bedroom_id: 1,
        bedroom_name: 1,
      },
      {
        bedroom_id: 2,
        bedroom_name: 2,
      },
      {
        bedroom_id: 3,
        bedroom_name: 3,
      },
      {
        bedroom_id: 4,
        bedroom_name: 4,
      },
      {
        bedroom_id: 5,
        bedroom_name: 5,
      },
      {
        bedroom_id: 6,
        bedroom_name: 6,
      },
      {
        bedroom_id: 7,
        bedroom_name: 7,
      },
      {
        bedroom_id: 8,
        bedroom_name: 8,
      },
      {
        bedroom_id: 9,
        bedroom_name: 9,
      },
      {
        bedroom_id: 10,
        bedroom_name: 10,
      },
    ],
    bathroom: [
      {
        bathroom_id: 1,
        bathroom_name: 1,
      },
      {
        bathroom_id: 2,
        bathroom_name: 2,
      },
      {
        bathroom_id: 3,
        bathroom_name: 3,
      },
      {
        bathroom_id: 4,
        bathroom_name: 4,
      },
      {
        bathroom_id: 5,
        bathroom_name: 5,
      },
      {
        bathroom_id: 6,
        bathroom_name: 6,
      },
      {
        bathroom_id: 7,
        bathroom_name: 7,
      },
      {
        bathroom_id: 8,
        bathroom_name: 8,
      },
      {
        bathroom_id: 9,
        bathroom_name: 9,
      },
      {
        bathroom_id: 10,
        bathroom_name: 10,
      },
    ],
    garage: [
      {
        garage_id: 1,
        garage_name: 1,
      },
      {
        garage_id: 2,
        garage_name: 2,
      },
      {
        garage_id: 3,
        garage_name: 3,
      },
      {
        garage_id: 4,
        garage_name: 4,
      },
      {
        garage_id: 5,
        garage_name: 5,
      },
      {
        garage_id: 6,
        garage_name: 6,
      },
      {
        garage_id: 7,
        garage_name: 7,
      },
      {
        garage_id: 8,
        garage_name: 8,
      },
      {
        garage_id: 9,
        garage_name: 9,
      },
      {
        garage_id: 10,
        garage_name: 10,
      },
    ],
    input: {
      property_id: null,
      property_description: null,
      selling_price_local: null,
      construction_id: null,
      bedrooms: null,
      bathrooms: null,
      area: null,
      garage: null,
      garage_area: null,
      car_park: null, 
    },
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.isLoading = true;
    this.propertyId = parseInt(this.$route.params.id);
    this.getPropertyMasterData();
    this.getConstructionData();
  },
  methods: {
    getPropertyMasterData() {
      this.isLoading = true;
      axios.get(`/4walls-property-master/${this.propertyId}`).then((response) => {
        this.propertyData = response.data.data;
        this.input.property_type_id = this.propertyData.property_type_id;
        this.input.cc_id = this.propertyData.cc_id;
        this.input.category_id = this.propertyData.category_id;
        this.input.bt_id = this.propertyData.bt_id;
        this.input.country_id = this.propertyData.country_id;
        this.input.property_description = this.propertyData.property_description;
        this.input.selling_price_local = this.propertyData.selling_price_local;
        this.input.construction_id = this.propertyData.construction_id;
        this.input.bedrooms = this.propertyData.bedrooms;
        this.input.bathrooms = this.propertyData.bathrooms;
        this.input.area = this.propertyData.area;
        this.input.garage = this.propertyData.garage;
        this.input.garage_area = this.propertyData.garage_area;
        this.input.car_park = this.propertyData.car_park;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.isLoading = false;
      });

    },
    getConstructionData() {
      axios.get(`/4walls-construction-masters`).then((response) => {
        this.construction = response.data.data;
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
          property_id: this.propertyId,
          property_type_id: this.propertyData.property_type_id,
          cc_id: this.propertyData.cc_id,
          category_id: this.propertyData.category_id,
          bt_id: this.propertyData.bt_id,
          country_id: this.propertyData.country_id,
          property_description: this.input.property_description,
          selling_price_local: this.input.selling_price_local,
          construction_id: this.input.construction_id,
          bedrooms: this.input.bedrooms,
          bathrooms: this.input.bathrooms,
          area: this.input.area,
          garage: this.input.garage,
          garage_area: this.input.garage_area,
          car_park: this.input.car_park,
        };
        axios
          .post(`/4walls-property-master/update`, payload)
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
