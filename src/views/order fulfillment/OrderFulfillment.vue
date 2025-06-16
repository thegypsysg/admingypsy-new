<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <div class="d-flex ml-4 mb-4" style="gap: 40px">
      <router-link
        active-class="text-black"
        style="color: #3e4aaf"
        class="text-decoration-none"
        to="/cart_master"
      >
        <h1>Cart Master</h1>
      </router-link>
      <router-link
        active-class="text-black"
        style="color: #3e4aaf"
        class="text-decoration-none"
        to="/order_fulfillment"
      >
        <h1>Order Fulfillment</h1>
      </router-link>
      <router-link
        active-class="text-black"
        style="color: #3e4aaf"
        class="text-decoration-none"
        to="/sourcing_basket"
      >
        <h1>Sourcing Basket</h1>
      </router-link>
    </div>

    <v-row align="center" class="mt-6">
      <v-col
        v-for="(item, index) in orderFulfillment"
        @click="selectOrderFulfillment(item)"
        :key="index"
        cols="2"
        class="text-center"
        style="cursor: pointer"
        :class="
          selectedOrderFulfillment?.delivery_date == item?.delivery_date
            ? 'bg-grey-lighten-1'
            : undefined
        "
      >
        <h2 class="font-weight-black">{{ item?.delivery_date }}</h2>
        <h3 class="text-grey-darken-1 font-weight-medium mt-2">
          {{ checkIfToday(item?.delivery_day) ? 'Today' : item?.delivery_day }}
        </h3>
        <p class="text-blue-darken-2 text-body-2 mt-3">
          ({{ item?.total_orders }} Orders)
        </p>
      </v-col>
    </v-row>
    <v-sheet class="py-6 px-4 mt-10" border rounded width="100%">
      <v-row>
        <v-col cols="12">
          <v-table class="country-table">
            <tbody>
              <template v-for="item in items" :key="item.id">
                <tr>
                  <td style="border: none !important" colspan="8">
                    <h3 class="text-black font-weight-bold">
                      {{ selectedOrderFulfillment?.delivery_date }} -
                      {{
                        checkIfToday(selectedOrderFulfillment?.delivery_day)
                          ? 'Today'
                          : selectedOrderFulfillment?.delivery_day
                      }}
                    </h3>
                  </td>
                </tr>

                <tr>
                  <td style="border: none !important" colspan="8" class="pa-0">
                    <v-table class="mb-4">
                      <tbody>
                        <tr class="font-weight-bold">
                          <td class="text-red-darken-4 font-weight-bold">
                            {{ item?.product_name }}
                            ({{ item?.quantity_name }})
                          </td>
                          <td class="text-blue-darken-4 font-weight-bold">
                            {{ item?.cart_details.length }} items
                          </td>
                          <td class="d-flex align-center">
                            <v-autocomplete
                              density="compact"
                              v-model="item.selectedVendor"
                              :items="onboardMerchants"
                              placeholder="Select Vendor"
                              item-title="name"
                              item-value="id"
                              hide-details
                              style="min-width: 150px !important"
                              variant="outlined"
                            ></v-autocomplete>
                            <v-btn
                              class="w-25 ml-6"
                              color="indigo-accent-2"
                              style="text-transform: none"
                              variant="flat"
                              @click="openAddVendor(item)"
                              :disabled="isSending"
                              :loading="isSending"
                            >
                              ADD
                            </v-btn>
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </v-table>
                  </td>
                </tr>

                <tr v-if="item?.cart_details.length > 0">
                  <td></td>
                  <td colspan="7" class="pa-0">
                    <v-table class="w-50">
                      <tbody>
                        <tr
                          v-for="(del, index) in item?.cart_details"
                          :key="index"
                        >
                          <td
                            style="border-bottom: none !important"
                            class="pt-4"
                          >
                            {{ index + 1 }}
                          </td>
                          <td
                            style="border-bottom: none !important"
                            class="pt-4"
                          >
                            {{ item?.product_name }}
                            ({{ item?.quantity_name }})
                          </td>
                          <td
                            style="border-bottom: none !important"
                            class="pt-4 text-no-wrap"
                          >
                            <span v-if="del?.rate">S$</span> {{ del?.rate }}
                          </td>
                          <td
                            style="border-bottom: none !important"
                            class="pt-4"
                          >
                            {{ del?.qty }}
                          </td>
                          <td
                            style="border-bottom: none !important"
                            class="pt-4 text-no-wrap"
                          >
                            <span v-if="del?.amount">S$</span> {{ del?.amount }}
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </td>
                </tr>
              </template>
              <tr v-if="isLoading">
                <td :colspan="8" class="text-center">
                  <v-progress-circular
                    indeterminate
                    color="indigo-accent-2"
                  ></v-progress-circular>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </v-sheet>
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
    <v-dialog persistent width="500" v-model="addVendor">
      <v-card>
        <v-card-text> Do you wish to select this Vendor . ? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelAddVendor">No</v-btn>
          <v-btn color="success" text @click="saveAddVendor">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from '@/util/axios';
import moment from 'moment';
import { setAuthHeader } from '@/util/axios';
// import app from '@/util/eventBus';

export default {
  name: 'OrderFulfillment',
  data: () => ({
    // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    valid: false,
    isLoading: false,
    isSending: false,
    isSending2: false,
    isSuccess: false,
    isError: false,
    addVendor: false,
    cancelVendor: false,
    addVendorData: null,
    currentPage: 1,
    perPage: 5,
    totalPages: 1,
    totalItems: 0,
    successMessage: '',
    errorMessage: '',
    search: '',
    items: [],
    orderFulfillment: [],
    selectedOrderFulfillment: null,
    paymentStatuses: [],
    paymentTypes: [],
    users: [],
    onboardMerchants: [],
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.getOrderFulfillment();
    this.getOnboardMerchants();
  },

  methods: {
    checkIfToday(dateString) {
      const inputDate = moment(dateString, 'DD/MM/YYYY');
      const today = moment();

      return inputDate.isSame(today, 'day');
    },
    getItemsData(deliveryDate) {
      this.isLoading = true;
      axios
        .get(
          `/order-fullfilment/get-cart-details-by-delivery-date?date=${deliveryDate}`
        )
        .then((response) => {
          const data = response.data;
          this.items = data.data.map((item) => {
            return {
              ...item,
              selectedVendor: null,
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
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    selectOrderFulfillment(data) {
      this.selectedOrderFulfillment = data;
      this.getItemsData(data?.delivery_date);
    },
    getOrderFulfillment() {
      this.isLoading = true;
      axios
        .get(`/order-fullfilment`)
        .then((response) => {
          const data = response.data.data;
          console.log(data);
          this.orderFulfillment = data;
          this.selectedOrderFulfillment = data[0];
          this.getItemsData(data[0]?.delivery_date);
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
    getOnboardMerchants() {
      axios
        .get(`/onboard-merchants/3/1`)
        .then((response) => {
          const data = response.data.data;

          this.onboardMerchants = data.map((item) => {
            return {
              ...item,
              id: item?.partner_id,
              name:
                item?.partner?.partner_name &&
                item?.partner_location?.town?.town_name
                  ? `${item.partner.partner_name} | ${item.partner_location.town.town_name}`
                  : item?.partner?.partner_name &&
                    item?.partner_location?.city?.city_name
                  ? `${item.partner.partner_name} | ${item.partner_location.city.city_name}`
                  : item?.partner?.partner_name
                  ? item.partner.partner_name
                  : '-',
            };
          });

          console.log(this.onboardMerchants);
        })
        .catch((error) => {
          console.log(error);
          const message = error.response?.data?.message || 'Something Wrong!!!';
          this.errorMessage = message;
          this.isError = true;
        });
    },
    openAddVendor(item) {
      // console.log(item);
      this.addVendorData = item;
      this.addVendor = true;
    },
    cancelAddVendor() {
      this.addVendorData = null;
      this.addVendor = false;
      // this.getItemsData(this.selectedOrderFulfillment?.delivery_date);
    },
    saveAddVendor() {
      console.log(this.addVendorData);
      const payload = {
        range_id: this.addVendorData?.range_id,
        pq_id: this.addVendorData?.pq_id,
        vendor_basket: this.addVendorData?.vendor_basket,
        delivery_date: this.selectedOrderFulfillment?.delivery_date,
      };
      axios
        .post(`/order-fullfilment/add-vendor-data`, payload)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.addVendor = false;
          this.getItemsData(this.selectedOrderFulfillment?.delivery_date);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.error === ''
              ? 'Something Wrong!!!'
              : error.response.data.error;
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
  color: rgb(100, 100, 100) !important;
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

.has-border {
  border-top: 1px solid rgb(188, 188, 188) !important;
}

.not-border {
  border-top: none !important;
}
</style>
