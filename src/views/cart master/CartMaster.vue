td
<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <h1>Cart Master</h1>

    <v-sheet class="py-6 px-4 mt-10" border rounded width="100%">
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            density="compact"
            v-model="search"
            label="Search"
            variant="outlined"
            hide-details
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="2">
          <v-btn
            prepend-icon="mdi-magnify"
            color="indigo-accent-2"
            style="text-transform: none"
            variant="flat"
            class="w-100"
            @click="getItemsData()"
            :disabled="isLoading"
            :loading="isLoading"
          >
            <template v-slot:prepend>
              <v-icon color="white"></v-icon>
            </template>

            Search
          </v-btn>
        </v-col>
      </v-row>
      <!-- <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            density="compact"
            v-model="search"
            label="Search"
            variant="outlined"
            hide-details
          ></v-text-field>
        </v-col>
      </v-row> -->
      <v-row align="center" justify="space-between">
        <v-col cols="8">
          <span>
            Showing {{ startItem }} - {{ endItem }} from {{ totalItems }} item
          </span>
        </v-col>
        <v-col cols="4" class="text-right">
          <v-select
            v-model="perPage"
            :items="[5, 10, 15, 20]"
            label="Items per page"
            density="compact"
            variant="outlined"
            hide-details
            @update:modelValue="getItemsData"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-table class="country-table">
            <thead>
              <tr>
                <th class="text-left text-no-wrap">Cart Id</th>
                <th class="text-left text-no-wrap">Customer Name</th>
                <th class="text-left text-no-wrap">Order Date</th>
                <th class="text-left text-no-wrap">Total Items</th>
                <th class="text-left text-no-wrap">Sub-total</th>
                <th class="text-left text-no-wrap">Service Fee</th>
                <th class="text-left text-no-wrap">Delivery Charges</th>
                <th class="text-left text-no-wrap">Platform Fee</th>
                <th class="text-left text-no-wrap">G.S.T</th>
                <th class="text-left text-no-wrap">Total</th>
                <th class="text-left text-no-wrap">Payment By</th>
                <!-- <th class="text-left text-no-wrap">Order Status</th> -->
              </tr>
            </thead>
            <tbody>
              <template v-for="item in items" :key="item.id">
                <tr class="country-table-body text-no-wrap">
                  <td>{{ item?.cart_id }}</td>
                  <td>
                    {{ item?.gypsy?.name }}
                  </td>
                  <td>
                    {{ item?.cart_date }}
                  </td>
                  <!-- <td>
                    {{ item?.order_status }}
                  </td> -->
                  <td class="d-flex align-center">
                    <span>{{ item?.total_items }}</span
                    ><span class="text-blue-lighten-1 font-weight-bold ml-3"
                      >View</span
                    >
                  </td>
                  <td>
                    <span v-if="item?.amount">S$</span> {{ item?.amount }}
                  </td>
                  <td>
                    <span v-if="item?.platform_fee">S$</span>
                    {{ item?.platform_fee }}
                  </td>
                  <td>
                    <span v-if="item?.delivery_charge?.rate">S$</span>
                    {{ item?.delivery_charge?.rate }}
                  </td>
                  <td>
                    <span v-if="item?.platform_fee">S$</span>
                    {{ item?.platform_fee }}
                  </td>
                  <td><span v-if="item?.gst">S$</span> {{ item?.gst }}</td>
                  <td>
                    <span v-if="item?.final_amount">S$</span>
                    {{ item?.final_amount }}
                  </td>
                  <td>
                    <!-- {{ item.dated }} -->
                    Cash
                  </td>
                </tr>

                <tr>
                  <td style="border: none !important"></td>
                  <td style="border: none !important" colspan="8">
                    <v-table class="mb-4">
                      <thead>
                        <tr class="py-0">
                          <th
                            style="border: none !important"
                            class="text-left py-0"
                          >
                            What's App
                          </th>
                          <th
                            style="border: none !important"
                            class="text-left py-0"
                          >
                            Order Status
                          </th>
                          <th
                            style="border: none !important"
                            class="text-left py-0"
                          >
                            Payment Status
                          </th>
                          <th
                            style="border: none !important"
                            class="text-left py-0"
                          >
                            Paid By
                          </th>
                          <th
                            style="border: none !important"
                            class="text-left py-0"
                          >
                            Payment Verified
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr class="font-weight-bold">
                          <td class="">
                            <a
                              :href="
                                item?.gypsy?.whats_app
                                  ? `https://api.whatsapp.com/send?phone=${item?.gypsy?.whats_app}&text=Hello`
                                  : ''
                              "
                              class="text-decoration-none text-blue-darken-3 text-no-wrap"
                            >
                              {{ item?.gypsy?.whats_app }}
                              <v-icon
                                v-if="item?.gypsy?.whats_app"
                                color="#4EC053"
                                size="20"
                                class="ml-2 fab fa-whatsapp"
                              ></v-icon>
                            </a>
                          </td>
                          <td class="">
                            <v-autocomplete
                              density="compact"
                              v-model="item.order_status"
                              :items="orderStatuses"
                              item-title="label"
                              item-value="value"
                              hide-details
                              style="min-width: 100px !important"
                              variant="outlined"
                            ></v-autocomplete>
                          </td>

                          <td class="">
                            <v-autocomplete
                              density="compact"
                              :items="paymentStatuses"
                              item-title="label"
                              item-value="value"
                              hide-details
                              style="min-width: 100px !important"
                              variant="outlined"
                            ></v-autocomplete>
                          </td>
                          <td class="">
                            <v-autocomplete
                              density="compact"
                              v-model="item.payment_type_id"
                              :items="paymentTypes"
                              item-title="label"
                              item-value="value"
                              hide-details
                              style="min-width: 100px !important"
                              variant="outlined"
                            ></v-autocomplete>
                          </td>
                          <td class="">
                            <v-autocomplete
                              density="compact"
                              :items="[]"
                              item-title="label"
                              item-value="value"
                              hide-details
                              style="min-width: 100px !important"
                              variant="outlined"
                            ></v-autocomplete>
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </td>
                </tr>

                <tr v-if="item?.cartDetails.length > 0">
                  <td style="border: none !important"></td>
                  <!-- :class="{
                    'has-border': item?.cart_details.length > 0,
                    'not-border': item?.cart_details.length == 0,
                  }" -->
                  <td style="border-bottom: none !important" colspan="11">
                    <v-table class="">
                      <thead>
                        <tr class="py-0">
                          <th class="text-left py-0"></th>
                          <th class="text-left py-0"></th>
                          <th class="text-left py-0"></th>
                          <th class="text-left py-0"></th>
                          <th class="text-left py-0"></th>
                          <th class="text-left py-0">Order Request</th>
                          <th class="text-left py-0">Request Date</th>
                          <th class="text-left py-0">Request By</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="del in item?.cartDetails" :key="del?.cd_id">
                          <td
                            style="border-bottom: none !important"
                            class="pr-6 pt-4"
                          >
                            {{ del?.cd_id }}
                          </td>
                          <td
                            style="border-bottom: none !important"
                            class="pr-6 pt-4"
                          >
                            {{ del?.products[0]?.product_name }}
                            {{ del?.quantity?.quantity_name }}
                          </td>
                          <td
                            style="border-bottom: none !important"
                            class="pr-6 pt-4 text-no-wrap"
                          >
                            <span v-if="del?.rate">S$</span> {{ del?.rate }}
                          </td>
                          <td
                            style="border-bottom: none !important"
                            class="pr-6 pt-4"
                          >
                            {{ del?.qty }}
                          </td>
                          <td
                            style="border-bottom: none !important"
                            class="pr-6 pt-4 text-no-wrap"
                          >
                            <span v-if="del?.amount">S$</span> {{ del?.amount }}
                          </td>
                          <td
                            style="border-bottom: none !important"
                            class="pr-6 pt-2 pb-4 d-flex align-center"
                          >
                            <v-btn-toggle
                              style="
                                font-size: 10px !important;
                                font-weight: 200 !important;
                                height: 22px !important;
                                width: 54px !important;
                              "
                              class="d-flex align-center"
                              v-model="del.isOrderReq"
                              :disabled="isSending2"
                              rounded="5"
                              @click="orderRequest(del)"
                            >
                              <v-btn size="27" :value="true"> Yes </v-btn>

                              <v-btn
                                size="27"
                                :disabled="del.isOrderReq"
                                :value="false"
                              >
                                No
                              </v-btn>
                            </v-btn-toggle>
                            <span
                              v-if="del.isOrderReq"
                              class="text-red-darken-1 ml-2"
                              >Cancel</span
                            >
                          </td>

                          <td
                            style="border-bottom: none !important"
                            class="pr-6 pt-4"
                          >
                            <span v-if="del.isOrderReq">10/05/2025</span>
                          </td>
                          <td
                            style="border-bottom: none !important"
                            class="pr-6 pt-4"
                          >
                            <span v-if="del.isOrderReq">Charlton</span>
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </td>
                  <!-- <td
                    :class="{
                      'has-border': item?.cart_details.length > 0,
                      'not-border': item?.cart_details.length == 0,
                    }"
                    style="border-bottom: none !important"
                    colspan="4"
                    class="text-body-1 font-weight-bold"
                  >
                    <p class="mt-3">Total Payment : S$ 112.50</p>
                  </td> -->
                </tr>

                <tr>
                  <td style="border: none !important"></td>
                  <td style="border: none !important" colspan="10">
                    <v-table class="mt-4">
                      <thead>
                        <tr class="py-0">
                          <th class="text-left py-0">Delivery Full Address</th>
                          <th class="text-left py-0">Street</th>
                          <th class="text-left py-0">Town</th>
                          <th class="text-left py-0">City</th>
                          <th class="text-left py-0">Landmark</th>
                          <th class="text-left py-0">Delivery Instructions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr class="font-weight-bold">
                          <td class="">
                            <p
                              v-if="item?.address?.full_address"
                              v-html="formatInfo(item?.address?.full_address)"
                            />
                          </td>
                          <td class="">Marine Drive</td>
                          <td class="">
                            {{ item?.address?.address_master?.town?.town_name }}
                          </td>
                          <td class="">
                            {{ item?.address?.address_master?.city?.city_name }}
                          </td>
                          <td class="">Static Data</td>
                          <td class="">
                            {{ item?.order_instructions }}
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </td>
                </tr>

                <tr>
                  <td></td>
                  <td colspan="10">
                    <v-table class="mt-2">
                      <thead>
                        <tr class="py-0">
                          <th class="text-left py-0">Dwelling Type</th>
                          <th class="text-left py-0">Condo / Apartment</th>
                          <th class="text-center py-0">Block | Tower</th>
                          <th class="text-center py-0">Floor - Unit #</th>
                          <th class="text-left py-0"></th>
                          <th class="text-left py-0"></th>
                          <th class="text-left py-0"></th>
                          <th class="text-left py-0"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr class="font-weight-bold">
                          <td class="">Condo</td>
                          <td class="">The Bayshore</td>
                          <td class="d-flex justify-space-around align-center">
                            <span>26</span> <span>2B</span>
                          </td>
                          <td class="text-center"># 12 - 35</td>
                          <td class=""></td>
                          <td class=""></td>
                          <td class=""></td>
                          <td class=""></td>
                        </tr>
                      </tbody>
                    </v-table>
                  </td>
                </tr>
              </template>
              <tr v-if="isLoading">
                <td :colspan="11" class="text-center">
                  <v-progress-circular
                    indeterminate
                    color="indigo-accent-2"
                  ></v-progress-circular>
                </td>
              </tr>
            </tbody>
          </v-table>
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            @update:modelValue="getItemsData"
          ></v-pagination>
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
    <v-dialog persistent width="500" v-model="orderReq">
      <v-card>
        <v-card-text>
          Do you wish to place an order request for this item. ?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelOrderRequest">No</v-btn>
          <v-btn color="success" text @click="saveOrderRequest">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from '@/util/axios';
import { setAuthHeader } from '@/util/axios';
// import app from '@/util/eventBus';

export default {
  name: 'CartMaster',
  data: () => ({
    // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    valid: false,
    isLoading: false,
    isSending: false,
    isSending2: false,
    isSuccess: false,
    isError: false,
    orderReq: false,
    orderRequestData: null,
    currentPage: 1,
    perPage: 5,
    totalPages: 1,
    totalItems: 0,
    successMessage: '',
    errorMessage: '',
    search: '',
    items: [],
    orderStatuses: [],
    paymentStatuses: [],
    paymentTypes: [],
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.getItemsData();
    this.getOrderStatusData();
    this.getPaymentStatusData();
    this.getPaymentTypesData();
  },
  computed: {
    startItem() {
      return (this.currentPage - 1) * this.perPage + 1;
    },
    endItem() {
      return Math.min(this.currentPage * this.perPage, this.totalItems);
    },
  },
  watch: {
    perPage() {
      this.currentPage = 1; // Reset ke halaman pertama saat `perPage` berubah
      this.getItemsData();
    },
  },
  methods: {
    formatInfo(info) {
      return info.replace(/\n/g, '<br>');
    },
    getItemsData() {
      this.isLoading = true;
      axios
        .get(`/cart-master`, {
          params: {
            query: this.search,
            page: this.currentPage,
            perPage: this.perPage,
          },
        })
        .then((response) => {
          const data = response.data;
          this.items = data.data.map((item) => {
            return {
              ...item,
              cartDetails: item.cart_details.map((del) => {
                return {
                  ...del,
                  isOrderReq: false,
                  isHasOrderReq: false,
                };
              }),
            };
          });

          // Perbarui pagination
          this.currentPage = data?.current_page;
          this.perPage = data?.per_page;
          this.totalItems = data?.total;
          this.totalPages = data?.last_page;
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
    getOrderStatusData() {
      this.isLoading = true;
      axios
        .get(`/order-statuses`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.orderStatuses = data.map((item) => {
            return {
              value: item.order_status_value || '',
              label: item.order_status_name || '',
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
    getPaymentStatusData() {
      this.isLoading = true;
      axios
        .get(`/payment-statuses`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.paymentStatuses = data.map((item) => {
            return {
              value: item.payment_status_value || '',
              label: item.payment_status_name || '',
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
    getPaymentTypesData() {
      this.isLoading = true;
      axios
        .get(`/payment-types`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.paymentTypes = data.map((item) => {
            return {
              value: item.payment_type_id || '',
              label: item.payment_name || '',
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
    viewCart(id) {
      this.isSending2 = true;
      axios
        .get(`/cart-master/toggle-view/${id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getItemsData();
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
          this.isSending2 = false;
        });
    },
    orderRequest(item) {
      console.log(item);
      this.orderRequestData = item;
      if (item.isOrderReq == true) {
        this.orderReq = true;
      }
    },
    cancelOrderRequest() {
      this.orderRequestData = null;
      this.orderReq = false;
    },
    saveOrderRequest() {
      this.orderReq = false;
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
