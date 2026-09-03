<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <app-breadcrumb
      :items="[
        { title: 'Dashboard', to: '/' },
        { title: 'Sourcing Basket', to: null },
      ]"
    />
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
        @click="selectOrderFulfillment('all')"
        cols="2"
        class="text-center"
        style="cursor: pointer"
        :class="selectedOrderFulfillment == 'all' ? ' text-blue-darken-1' : undefined"
      >
        <h2 class="font-weight-black">All</h2>
      </v-col>
      <v-col
        v-for="(item, index) in orderFulfillment"
        @click="selectOrderFulfillment(item)"
        :key="index"
        cols="2"
        class="text-center"
        :style="index == 0 ? 'border-left: 3px solid black' : ''"
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
        <p class="text-blue-darken-2 text-body-2 mt-3">({{ item?.total_orders }} Orders)</p>
      </v-col>
    </v-row>
    <v-sheet class="py-6 px-4 mt-10" border rounded width="100%">
      <v-row>
        <v-col cols="12">
          <div class="d-flex">
            <span
              @click="selectBy('product')"
              :class="selectedBy == 'product' ? 'text-blue-darken-1' : undefined"
              class="font-weight-black"
              style="cursor: pointer"
              >By Product</span
            >
            <span class="font-weight-black mx-4">|</span>
            <span
              @click="selectBy('vendor')"
              :class="selectedBy == 'vendor' ? 'text-blue-darken-1' : undefined"
              class="font-weight-black"
              style="cursor: pointer"
              >By Vendor</span
            >
            <span class="font-weight-black mx-4">|</span>
            <span
              @click="selectBy('cart')"
              :class="selectedBy == 'cart' ? 'text-blue-darken-1' : undefined"
              class="font-weight-black"
              style="cursor: pointer"
              >By Cart</span
            >
          </div>
        </v-col>
        <v-col cols="12" v-if="selectedBy == 'cart'">
          <p class="font-weight-black text-grey-darken-1">
            Cart # | Cart Date | Total Items | Amount | Delivery Date
          </p>
          <v-autocomplete
            v-model="selectedOrderCart"
            :items="orderCarts"
            @update:modelValue="getItemsDataCart()"
            density="compact"
            item-value="value"
            item-title="cart_date"
            placeholder="Select Cart"
            variant="outlined"
            style="width: 450px !important"
          >
            <!-- Slot custom daftar dropdown -->
            <template #item="{ props, item }">
              <div v-bind="props" class="d-flex align-center py-2 px-3">
                <span class="text-red font-weight-bold">{{ item.raw.cart_id }}</span>
                <span class="text-blue"> - {{ item.raw.cart_date }}</span>
                <span class="text-red font-weight-bold"> - {{ item.raw.total_items }} Items</span>
                <span class="text-blue">
                  - S$ {{ parseFloat(item.raw.final_amount).toFixed(2) }}</span
                >
                <span class="text-red font-weight-bold"> | {{ item.raw.delivery_date }}</span>
              </div>
            </template>

            <!-- Slot custom tampilan input (selected) -->
            <template #selection="{ props, item }">
              <div v-bind="props">
                <span class="text-red font-weight-bold">{{ item.raw.cart_id }}</span>
                <span class="text-blue"> - {{ item.raw.cart_date }}</span>
                <span class="text-red font-weight-bold"> - {{ item.raw.total_items }} Items</span>
                <span class="text-blue">
                  - S$ {{ parseFloat(item.raw.final_amount).toFixed(2) }}</span
                >
                <span class="text-red font-weight-bold"> | {{ item.raw.delivery_date }}</span>
              </div>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col cols="12" v-if="selectedBy == 'vendor'">
          <v-autocomplete
            density="compact"
            v-model="selectedVendor"
            :items="onboardMerchants"
            @update:modelValue="getItemsDataVendor()"
            placeholder="No Vendors in Sourcing Basket"
            item-title="name"
            item-value="id"
            hide-details
            style="width: 500px !important"
            variant="outlined"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12">
          <v-table class="country-table">
            <tbody>
              <template v-for="item in items" :key="item.id">
                <tr>
                  <td style="border: none !important" colspan="9" class="pa-0">
                    <v-table class="mb-4">
                      <tbody>
                        <tr class="font-weight-bold">
                          <td class="">
                            <span class="text-red-darken-4 mr-8 font-weight-bold">
                              {{ item?.product_name }}
                              ({{ item?.quantity_name }})
                            </span>
                            <span class="text-blue-darken-3 text-h6 font-weight-black">
                              {{ item?.total_items }} items
                            </span>
                          </td>

                          <td></td>
                          <td></td>
                        </tr>
                      </tbody>
                    </v-table>
                  </td>
                </tr>

                <!-- <tr>
                  <td style="border: none !important" colspan="9">
                    <h3 class="text-black font-weight-bold">
                      {{ selectedOrderFulfillment?.delivery_date }} -
                      {{
                        checkIfToday(selectedOrderFulfillment?.delivery_day)
                          ? 'Today'
                          : selectedOrderFulfillment?.delivery_day
                      }}
                    </h3>
                  </td>
                </tr> -->

                <template v-if="selectedBy == 'cart'">
                  <!-- <tr
                                v-for="del in d?.cart_details"
                                :key="del?.cd_id"
                              > -->
                  <tr>
                    <td style="border-bottom: none !important" class="pt-4">
                      {{ item?.cart_detail?.cd_id }}
                    </td>
                    <td style="border-bottom: none !important" class="pt-4">
                      {{ item?.product_name }}
                      ({{ item?.quantity_name }})
                    </td>
                    <td style="border-bottom: none !important" class="pt-4 text-no-wrap">
                      <span v-if="item?.cart_detail?.rate">S$</span>
                      {{ item?.cart_detail?.rate }}
                    </td>
                    <td style="border-bottom: none !important" class="pt-4">
                      {{ item?.cart_detail?.qty }}
                    </td>
                    <td style="border-bottom: none !important" class="pt-4 text-no-wrap">
                      <span v-if="item?.cart_detail?.amount">S$</span>
                      {{ item?.cart_detail?.amount }}
                    </td>
                    <td>
                      <v-autocomplete
                        density="compact"
                        v-model="item.cart_detail.vendor_basket"
                        :items="onboardMerchants"
                        item-title="name"
                        item-value="id"
                        hide-details
                        style="min-width: 150px !important"
                        variant="outlined"
                        disabled
                      ></v-autocomplete>
                    </td>
                  </tr>
                </template>

                <template v-if="item?.groups_by_delivery_date?.length > 0">
                  <template v-for="(d, index) in item?.groups_by_delivery_date" :key="index">
                    <tr v-if="selectedBy != 'cart'">
                      <!-- <td></td> -->
                      <td style="border: none !important" colspan="9">
                        <h3 class="text-black font-weight-bold">
                          {{ d?.delivery_date }}
                          -
                          {{ checkDateLabel(d?.delivery_date) }}
                        </h3>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="8" class="pa-0">
                        <v-table>
                          <tbody>
                            <tr v-for="del in d?.cart_details" :key="del?.cd_id">
                              <td style="border-bottom: none !important" class="pt-4">
                                {{ del?.cd_id }}
                              </td>
                              <td style="border-bottom: none !important" class="pt-4">
                                {{ item?.product_name }}
                                ({{ item?.quantity_name }})
                              </td>
                              <td style="border-bottom: none !important" class="pt-4 text-no-wrap">
                                <span v-if="del?.rate">S$</span>
                                {{ del?.rate }}
                              </td>
                              <td style="border-bottom: none !important" class="pt-4">
                                {{ del?.qty }}
                              </td>
                              <td style="border-bottom: none !important" class="pt-4 text-no-wrap">
                                <span v-if="del?.amount">S$</span>
                                {{ del?.amount }}
                              </td>
                              <td v-if="selectedBy == 'product'">
                                <v-autocomplete
                                  density="compact"
                                  v-model="del.vendor_basket"
                                  :items="onboardMerchants"
                                  item-title="name"
                                  item-value="id"
                                  hide-details
                                  style="min-width: 150px !important"
                                  variant="outlined"
                                  disabled
                                ></v-autocomplete>
                              </td>
                              <td v-else style="width: 300px; border-bottom: none !important"></td>
                            </tr>
                          </tbody>
                        </v-table>
                      </td>
                    </tr>
                  </template>
                </template>
              </template>
            </tbody>
          </v-table>
          <skeleton-table v-if="isLoading" :rows="5" :columns="5" />
          <empty-state
            v-if="!isLoading && (!items || items.length === 0)"
            title="No Data Found"
            subtitle="There are no records to display."
          />
        </v-col>
      </v-row>
    </v-sheet>

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
    <v-dialog persistent width="500" v-model="cancelVendor">
      <v-card>
        <v-card-text> Do you wish to delete this Vendor . ? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelCancelVendor">No</v-btn>
          <v-btn color="success" text @click="deleteVendor">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import SkeletonTable from '@/components/SkeletonTable.vue';
import EmptyState from '@/components/EmptyState.vue';
import { useNotificationStore } from '@/stores/notification';
import axios from '@/util/axios';
import moment from 'moment';
import { setAuthHeader } from '@/util/axios';
// import app from '@/util/eventBus';

export default {
  name: 'SourcingBasket',
  components: {
    EmptyState,
    SkeletonTable,
  },
  setup() {
    const notification = useNotificationStore();
    return { notification };
  },
  data: () => ({
    // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    valid: false,
    isLoading: false,
    isSending: false,
    isSending2: false,
    addVendor: false,
    cancelVendor: false,
    addVendorData: null,
    cancelVendorData: null,
    currentPage: 1,
    perPage: 5,
    totalPages: 1,
    totalItems: 0,
    search: '',
    selectedVendor: null,
    selectedOrderCart: null,
    items: [],
    orderFulfillment: [],
    selectedOrderFulfillment: 'all',
    selectedBy: 'product',
    paymentStatuses: [],
    paymentTypes: [],
    users: [],
    onboardMerchants: [],
    orderCarts: [],
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.getOrderFulfillment();
    this.getOrderCarts();
    if (this.selectedBy == 'product') {
      this.getOnboardMerchants();
      this.getItemsDataProduct();
    } else if (this.selectedBy == 'vendor') {
      this.getOrderVendors();
    } else if (this.selectedBy == 'cart') {
      this.getOnboardMerchants();
      this.items = [];
    }
  },

  methods: {
    checkIfToday(dateString) {
      const inputDate = moment(dateString, 'DD/MM/YYYY');
      const today = moment();

      return inputDate.isSame(today, 'day');
    },
    checkDateLabel(dateString) {
      const inputDate = moment(dateString, 'DD/MM/YYYY');
      const today = moment();

      if (inputDate.isSame(today, 'day')) {
        return 'Today';
      }

      // Format ke 3 huruf nama hari, e.g. "Mon", "Tue"
      return inputDate.format('ddd');
    },
    // getItemsDataProduct(deliveryDate) {

    getOrderFulfillment() {
      this.isLoading = true;
      axios
        .get(`/order-fullfilment`)
        .then((response) => {
          const data = response.data.data;
          console.log(data);
          this.orderFulfillment = data;
          // this.selectedOrderFulfillment = data[0];
          this.getItemsDataProduct(data[0]?.delivery_date);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === '' ? 'Something Wrong!!!' : error.response.data.message;
          this.notification.error(message);
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
                item?.partner?.partner_name && item?.partner_location?.town?.town_name
                  ? `${item.partner.partner_name} | ${item.partner_location.town.town_name}`
                  : item?.partner?.partner_name && item?.partner_location?.city?.city_name
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
          this.notification.error(message);
        });
    },
    getOrderCarts() {
      axios
        .get(`/order-fullfilment/get-carts-by-delivery-status/P`)
        .then((response) => {
          const data = response.data.data;

          this.orderCarts = data.map((item) => ({
            ...item,
            value: item?.cart_id,
          }));
        })
        .catch((error) => {
          console.log(error);
          const message = error.response?.data?.message || 'Something Wrong!!!';
          this.notification.error(message);
        });
    },
    getItemsDataProduct() {
      this.items = [];
      this.isLoading = true;
      axios
        .get(
          // `/order-fullfilment/get-cart-details-by-delivery-date?date=${deliveryDate}`
          `/order-fullfilment/get-cart-details-by-product`
        )
        .then((response) => {
          const data = response.data;
          this.items = data.data;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === '' ? 'Something Wrong!!!' : error.response.data.message;
          this.notification.error(message);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    selectOrderFulfillment(data) {
      this.selectedOrderFulfillment = data;
      this.getItemsDataProduct(data?.delivery_date);
    },

    selectBy(value) {
      this.selectedBy = value;
      if (value == 'product') {
        this.getOnboardMerchants();
        this.getItemsDataProduct();
      } else if (value == 'vendor') {
        this.getOrderVendors();
      } else if (value == 'cart') {
        this.items = [];
        this.getOnboardMerchants();
      }
    },

    async getOrderVendors() {
      this.items = [];
      try {
        const response = await axios.get(`/order-fullfilment/get-vendors`);
        const data = response.data.data;

        this.onboardMerchants = data.map((item) => ({
          ...item,
          id: item?.partner_id,
          name:
            item?.partner_name && item?.town_name
              ? `${item.partner_name} | ${item.town_name}`
              : item?.partner_name && item?.city_name
              ? `${item.partner_name} | ${item.city_name}`
              : item?.partner_name
              ? item?.partner_name
              : '-',
        }));

        console.log(this.onboardMerchants);
        if (this.onboardMerchants.length > 0) {
          this.selectedVendor = this.onboardMerchants[0]?.id;
          this.getItemsDataVendor(this.selectedVendor);
        }
      } catch (error) {
        console.log(error);
        const message = error.response?.data?.message || 'Something Wrong!!!';
        this.notification.error(message);
      }
    },
    async getItemsDataVendor(vendor) {
      this.items = [];
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/order-fullfilment/get-cart-details-by-vendor/${vendor || this.selectedVendor}`
        );
        const data = response.data.data;
        this.items = data;
      } catch (error) {
        console.log(error);
        const message = error.response?.data?.message || 'Something Wrong!!!';
        this.notification.error(message);

        this.items = [];
      } finally {
        this.isLoading = false;
      }
    },
    async getItemsDataCart() {
      this.items = [];
      this.isLoading = true;
      axios
        .get(`/order-fullfilment/get-cart-details-by-cart-id/${this.selectedOrderCart}`)
        .then((response) => {
          const data = response.data;
          this.items = data.data;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === '' ? 'Something Wrong!!!' : error.response.data.message;
          this.notification.error(message);
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
