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
        <p class="text-blue-darken-2 text-body-2 mt-3">({{ item?.total_orders }} Orders)</p>
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
                            {{ item?.total_items }} items
                          </td>
                          <td class="d-flex align-center">
                            <v-autocomplete
                              v-model="item.vendor_basket"
                              :items="getFilteredMerchants(item.range_id)"
                              density="compact"
                              item-value="id"
                              item-title="name"
                              placeholder="Select Vendor"
                              hide-details
                              variant="outlined"
                              style="min-width: 150px !important"
                            >
                              <template #item="{ props, item }">
                                <div v-bind="props" class="d-flex align-center py-2 px-3">
                                  <!-- Label Hitam -->
                                  <span class="text-black">
                                    {{
                                      item?.raw?.partner?.partner_name &&
                                      item?.raw?.partner_location?.town?.town_name
                                        ? `${item.raw.partner.partner_name} | ${item.raw.partner_location.town.town_name}`
                                        : item?.raw?.partner?.partner_name &&
                                          item?.raw?.partner_location?.city?.city_name
                                        ? `${item.raw.partner.partner_name} | ${item.raw.partner_location.city.city_name}`
                                        : item?.raw?.partner?.partner_name
                                        ? item.raw.partner.partner_name
                                        : '-'
                                    }}
                                  </span>
                                  <!-- Label Merah -->
                                  <span
                                    v-if="item?.raw?.merchant_price_list?.length"
                                    class="text-red-darken-3 font-weight-bold ml-2"
                                  >
                                    (S$
                                    {{
                                      parseFloat(item.raw.merchant_price_list[0].shop_rate).toFixed(
                                        2
                                      )
                                    }})
                                  </span>
                                </div>
                              </template>

                              <template #selection="{ props, item }">
                                <div v-bind="props">
                                  <!-- Label Hitam -->
                                  <span class="text-black">
                                    {{
                                      item?.raw?.partner?.partner_name &&
                                      item?.raw?.partner_location?.town?.town_name
                                        ? `${item.raw.partner.partner_name} | ${item.raw.partner_location.town.town_name}`
                                        : item?.raw?.partner?.partner_name &&
                                          item?.raw?.partner_location?.city?.city_name
                                        ? `${item.raw.partner.partner_name} | ${item.raw.partner_location.city.city_name}`
                                        : item?.raw?.partner?.partner_name
                                        ? item.raw.partner.partner_name
                                        : '-'
                                    }}
                                  </span>
                                  <!-- Label Merah -->
                                  <span
                                    v-if="item?.raw?.merchant_price_list?.length"
                                    class="text-red-darken-3 font-weight-bold ml-2"
                                  >
                                    (S$
                                    {{
                                      parseFloat(item.raw.merchant_price_list[0].shop_rate).toFixed(
                                        2
                                      )
                                    }})
                                  </span>
                                </div>
                              </template>
                            </v-autocomplete>
                            <v-btn
                              v-if="!item?.vendor_username"
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
                            <div v-else class="d-flex align-center font-weight-black">
                              <span
                                @click="openCancelVendor(item)"
                                class="text-red-darken-4 mx-4"
                                style="cursor: pointer"
                                >Cancel</span
                              >
                              <p>
                                {{ item?.vendor_date }} |
                                {{ item?.vendor_username }}
                              </p>
                            </div>
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
                        <tr v-for="del in item?.cart_details" :key="del?.cd_id">
                          <td style="border-bottom: none !important" class="pt-4">
                            {{ del?.cd_id }}
                          </td>
                          <td style="border-bottom: none !important" class="pt-4">
                            {{ item?.product_name }}
                            ({{ item?.quantity_name }})
                          </td>
                          <td style="border-bottom: none !important" class="pt-4 text-no-wrap">
                            <span v-if="del?.rate">S$</span> {{ del?.rate }}
                          </td>
                          <td style="border-bottom: none !important" class="pt-4">
                            {{ del?.qty }}
                          </td>
                          <td style="border-bottom: none !important" class="pt-4 text-no-wrap">
                            <span v-if="del?.amount">S$</span> {{ del?.amount }}
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </td>
                </tr>
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
  name: 'OrderFulfillment',
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
        .get(`/order-fullfilment/get-cart-details-by-delivery-date?date=${deliveryDate}`)
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
      this.getItemsData(data?.delivery_date);
    },
    getOrderFulfillment() {
      this.isLoading = true;
      axios
        .get(`/order-fullfilment`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.orderFulfillment = data;
          this.selectedOrderFulfillment = data[0];
          this.getItemsData(data[0]?.delivery_date);
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
      this.isLoading = true;
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

          // console.log(this.onboardMerchants);
        })
        .catch((error) => {
          console.log(error);
          const message = error.response?.data?.message || 'Something Wrong!!!';
          this.notification.error(message);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    getFilteredMerchants(rangeId) {
      // Langkah 1: map dan filter merchant_price_list
      const mappedMerchants = this.onboardMerchants.map((merchant) => {
        const filteredList = (merchant.merchant_price_list || [])
          .filter((price) => price.range_id === rangeId)
          .sort((a, b) => {
            const rateA = parseFloat(a.shop_rate) || 0;
            const rateB = parseFloat(b.shop_rate) || 0;
            return rateA - rateB;
          });

        // Ambil rate terkecil untuk sorting merchant
        const lowestShopRate = filteredList.length
          ? parseFloat(filteredList[0].shop_rate) || 0
          : Number.POSITIVE_INFINITY;

        return {
          ...merchant,
          merchant_price_list: filteredList,
          lowestShopRate,
        };
      });

      // Langkah 2: Sort seluruh merchant array
      mappedMerchants.sort((a, b) => {
        // Yang punya price_list muncul dulu
        const hasPriceListA = a.lowestShopRate !== Number.POSITIVE_INFINITY;
        const hasPriceListB = b.lowestShopRate !== Number.POSITIVE_INFINITY;

        if (hasPriceListA && !hasPriceListB) return -1;
        if (!hasPriceListA && hasPriceListB) return 1;

        // Kalau dua-duanya punya price_list, urut berdasarkan shop_rate terkecil
        if (hasPriceListA && hasPriceListB) {
          return a.lowestShopRate - b.lowestShopRate;
        }

        // Dua-duanya kosong, urut default
        return 0;
      });

      // Langkah 3: Hilangkan field bantu
      return mappedMerchants.map((m) => {
        // eslint-disable-next-line no-unused-vars
        const { lowestShopRate, ...rest } = m;
        console.log(rest);
        return rest;
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
    openCancelVendor(item) {
      // console.log(item);
      this.cancelVendorData = item;
      this.cancelVendor = true;
    },
    cancelCancelVendor() {
      this.cancelVendorData = null;
      this.cancelVendor = false;
      // this.getItemsData(this.selectedOrderFulfillment?.delivery_date);
    },
    saveAddVendor() {
      // console.log(this.addVendorData);
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
          this.notification.success(data.message);
          this.addVendor = false;
          this.getItemsData(this.selectedOrderFulfillment?.delivery_date);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.error === '' ? 'Something Wrong!!!' : error.response.data.error;
          this.notification.error(message);
        });
    },
    deleteVendor() {
      const payload = {
        of_ids: this.cancelVendorData.cart_details?.map((item) => item.of_id),
      };
      axios
        .delete(`/order-fullfilment/delete-vendor-data`, {
          data: payload,
        })
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.cancelVendor = false;
          this.getItemsData(this.selectedOrderFulfillment?.delivery_date);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.error === '' ? 'Something Wrong!!!' : error.response.data.error;
          this.notification.error(message);
        });
      // .finally(() => {
      //   this.isDeleteLoading = false;
      //   this.countryIdToDelete = null;
      //   this.isDelete = false;
      // });
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
