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
            @click="getCartData()"
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
                <th class="text-left text-no-wrap">Order Status</th>
                <th class="text-left text-no-wrap">Total Items</th>
                <th class="text-left text-no-wrap">Sub-total</th>
                <th class="text-left text-no-wrap">Delivery Charges</th>
                <th class="text-left text-no-wrap">Platform Fee</th>
                <th class="text-left text-no-wrap">G.S.T</th>
                <th class="text-left text-no-wrap">Total</th>
                <th class="text-left text-no-wrap">Payment By</th>
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
                  <td>
                    {{ item?.order_status }}
                  </td>
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

                <tr v-if="item?.cart_details.length > 0" class="mt-n4">
                  <td style="border: none !important"></td>
                  <td
                    :class="{
                      'has-border': item?.cart_details.length > 0,
                      'not-border': item?.cart_details.length == 0,
                    }"
                    style="border-bottom: none !important"
                    colspan="6"
                  >
                    <v-table class="">
                      <tr v-for="del in item?.cart_details" :key="del?.cd_id">
                        <td class="pr-6 pt-4">{{ del?.cd_id }}</td>
                        <td class="pr-6 pt-4">
                          {{ del?.products[0]?.product_name }}
                          {{ del?.quantity?.quantity_name }}
                        </td>
                        <td class="pr-6 pt-4">
                          <span v-if="del?.rate">S$</span> {{ del?.rate }}
                        </td>
                        <td class="pr-6 pt-4">{{ del?.qty }}</td>
                        <td class="pr-6 pt-4">
                          <span v-if="del?.amount">S$</span> {{ del?.amount }}
                        </td>
                      </tr>
                    </v-table>
                  </td>
                  <td style="border: none !important"></td>
                  <td style="border: none !important"></td>
                  <td style="border: none !important"></td>
                  <td style="border: none !important"></td>
                </tr>

                <tr>
                  <td></td>
                  <td colspan="6">
                    <v-table class="mt-6">
                      <thead>
                        <tr class="py-0">
                          <th class="text-left py-0">Delivery Full Address</th>
                          <th class="text-left py-0">Town</th>
                          <th class="text-left py-0">Order Instructions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr class="font-weight-bold">
                          <td class="pr-6 py-2">
                            {{ item?.address?.full_address }}
                          </td>
                          <td class="pr-6 py-2">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit.
                          </td>
                          <td class="pr-6 py-2">
                            {{ item?.order_instructions }}
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
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
    currentPage: 1,
    perPage: 5,
    totalPages: 1,
    totalItems: 0,
    successMessage: '',
    errorMessage: '',

    search: '',
    items: [],
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.getCartData();
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
    getCartData() {
      this.isLoading = true;
      axios
        .get(`/cart-master`)
        .then((response) => {
          const data = response.data.data;
          this.items = data;
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
          this.getCartData();
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
