<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <div class="d-flex align-center ml-4 mb-4" style="gap: 30px">
      <router-link class="text-decoration-none text-black" to="/gst-master">
        <h1>GST</h1>
      </router-link>
    </div>
    <v-form v-model="valid" @submit.prevent ref="formRef">
      <v-container>
        <v-row>
          <v-col cols="3">
            <v-autocomplete
              density="compact"
              label="---Select App---"
              placeholder="Type App"
              :items="resource.appsData"
              item-title="name"
              item-value="id"
              v-model="gstMasterForm.app_id"
              :rules="rules.appRules"
              @update:modelValue="onSelect"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
          <v-col cols="3">
            <v-autocomplete
              clearable
              density="compact"
              label="Select Country"
              placeholder="Type a Country"
              :items="resource.countriesData"
              item-title="name"
              item-value="country_id"
              v-model="gstMasterForm.country_id"
              :rules="rules.countryRules"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
          <v-col cols="2">
            <v-text-field
              prefix="%"
              v-model="gstMasterForm.tax_rate"
              :rules="rules.taxRateRules"
              label="Tax Rate"
              variant="outlined"
              density="compact"
              required
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <v-btn
              :prepend-icon="
                isEdit
                  ? 'mdi-account-multiple-check'
                  : 'mdi-account-multiple-plus'
              "
              color="indigo-accent-2"
              style="text-transform: none"
              variant="flat"
              class="w-100"
              @click="isEdit ? saveEdit() : saveData()"
              :disabled="isSending"
              :loading="isSending"
            >
              <template v-slot:prepend>
                <v-icon color="white"></v-icon>
              </template>

              {{ isEdit ? 'Save' : 'Add' }}
            </v-btn>
          </v-col>
          <v-col cols="2" v-if="isEdit">
            <v-btn
              v-if="isEdit"
              prepend-icon="mdi-account-multiple-remove"
              color="red"
              style="text-transform: none"
              variant="flat"
              class="w-100"
              @click="cancelEdit"
              :disabled="isSending"
            >
              <template v-slot:prepend>
                <v-icon color="white"></v-icon>
              </template>
              Cancel
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>

    <v-sheet class="py-6 px-4 mt-10" border rounded width="100%">
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            density="compact"
            v-model="search"
            label="Search"
            variant="outlined"
            @keyup="getGstMasterData()"
          ></v-text-field>
        </v-col>
        <!-- <v-col cols="12" md="2">
          <v-btn
            prepend-icon="mdi-magnify"
            color="indigo-accent-2"
            style="text-transform: none"
            variant="flat"
            class="w-100"
            @click="getGstMasterData()"
            :disabled="isLoading"
            :loading="isLoading"
          >
            <template v-slot:prepend>
              <v-icon color="white"></v-icon>
            </template>
            Search
          </v-btn>
        </v-col> -->
      </v-row>
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
            @update:modelValue="getGstMasterData"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-table class="country-table">
            <thead>
              <tr>
                <th class="text-left font-weight-bold text-black">ID</th>
                <th class="text-left font-weight-bold text-black">App Name</th>
                <th class="text-left font-weight-bold text-black">Country</th>
                <th class="text-left font-weight-bold text-black">GST</th>
                <th class="text-left font-weight-bold text-black">
                  Applicable
                </th>
                <th class="text-left font-weight-bold text-black">User</th>
                <th class="text-left font-weight-bold text-black">Dated</th>
                <th class="text-left font-weight-bold text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(item, index) in gstData" :key="index">
                {{ item.last_page }}
                <tr class="gst-master-table-body">
                  <td>{{ item.gst_id }}</td>
                  <td>{{ item.app.app_name }}</td>
                  <td>{{ item.country.country_name }}</td>
                  <td>
                    <span class="border rounded py-1 pl-3 pr-7 text-left">
                      <strong class="mr-2">%</strong>
                      <span class="text-red-darken-4 font-weight-bold">{{
                        item.tax_rate
                      }}</span>
                    </span>
                  </td>
                  <td>
                    <v-btn-toggle
                      mandatory
                      style="
                        font-size: 10px !important;
                        font-weight: 200 !important;
                        height: 22px !important;
                        width: 54px !important;
                      "
                      class="d-flex align-center"
                      v-model="item.is_active"
                      @click="activeGst(item.gst_id)"
                      :disabled="isSending2"
                      rounded="5"
                    >
                      <v-btn size="27" :value="true"> Yes </v-btn>
                      <v-btn size="27" :value="false"> No </v-btn>
                    </v-btn-toggle>
                  </td>
                  <td>{{ item?.user?.name || 'N/A' }}</td>
                  <td>{{ item?.dated || 'N/A' }}</td>
                  <td>
                    <div class="d-flex">
                      <v-btn
                            color="green"
                            variant="text" @click="editGst(item)"
                            icon
                          >
  <v-icon>mdi-pencil-outline</v-icon>  <v-tooltip location="top" activator="parent">Edit</v-tooltip>
</v-btn>
                      <v-btn
                            color="red" variant="text"
                            :disabled="isDeleteLoading"
                            @click="openDeleteConfirm(item.gst_id)"
                            icon
                          >
  <v-icon>mdi-trash-can-outline</v-icon>  <v-tooltip location="top" activator="parent">Delete</v-tooltip>
</v-btn>
                    </div>
                  </td>
                </tr>
              </template>
              <tr v-if="isLoading">
                <td :colspan="6" class="text-center">
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
            @update:modelValue="getGstMasterData"
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

    <v-dialog persistent width="500" v-model="isDelete">
      <v-card>
        <v-card-title>Confirmation</v-card-title>
        <v-card-text> Are you sure want to delete this GST? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelDelete">No</v-btn>
          <v-btn color="success" text @click="deleteGst">{{
            isDeleteLoading ? 'Deleting...' : 'Yes'
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import axios from '@/util/axios';
import { setAuthHeader } from '@/util/axios';
import { apiCache } from '@/composables/useApiWithCache';
const token = JSON.parse(localStorage.getItem('token'));
setAuthHeader(token);

const search = ref('');
// const items = ref([])
const gstData = ref([]);
const currentPage = ref(1);
const perPage = ref(5);
const totalPages = ref(1);
const totalItems = ref(0);
const isLoading = ref(false);
const isEdit = ref(false);
const isSuccess = ref(false);
const successMessage = ref('');
const isError = ref(false);
const errorMessage = ref('');
const idGst = ref(null);
const isDelete = ref(false);
const isDeleteLoading = ref(false);
const valid = ref(false);
const isSending = ref(false);
const isSending2 = ref(false);
const appId = ref(null);
const formRef = ref(null);

const gstMasterForm = ref({
  id: 0,
  app_id: '',
  country_id: '',
  tax_rate: '',
});

const resource = ref({
  countriesData: [],
  appsData: [],
});

const rules = ref({
  taxRateRules: [
    (value) => {
      if (value) return true;
      return 'Tax Rate is required.';
    },
  ],
  appRules: [
    (value) => {
      if (value) return true;
      return 'App is required.';
    },
  ],
  countryRules: [
    (value) => {
      if (value) return true;
      return 'Country is required.';
    },
  ],
});

const startItem = computed(() => {
  return (currentPage.value - 1) * perPage.value + 1;
});

const endItem = computed(() => {
  return Math.min(currentPage.value * perPage.value, totalItems.value);
});

const onSelect = (value) => {
  appId.value = value;
  // getCountries();
};

const getAppActive = () => {
  apiCache
    .fetch(`/app/active`)
    .then((response) => {
      const data = response.data.data;
      resource.value.appsData = data
        .sort((a, b) => a.app_id < b.app_id)
        .map((app) => {
          appId.value = app.id;
          return {
            id: app.app_id || 0,
            name: app.app_name || '',
          };
        });
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error);
      const message =
        error.response?.data?.message === ''
          ? 'Something Wrong!!!'
          : error.response?.data?.message || 'Error loading apps';
      errorMessage.value = message;
      isError.value = true;
    });
};

const getCountries = () => {
  apiCache
    .fetch(`/countries`)
    .then((response) => {
      const data = response.data.data;
      resource.value.countriesData = data
        .sort((a, b) => a.country_name.localeCompare(b.country_name))
        .map((country) => {
          return {
            id: country.ac_id || 1,
            country_id: country.country_id || 1,
            name: country.country_name || '',
          };
        });
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error);
      const message =
        error.response?.data?.message === ''
          ? 'Something Wrong!!!'
          : error.response?.data?.message || 'Error loading countries';
      errorMessage.value = message;
      isError.value = true;
    });
};

const getGstMasterData = () => {
  isLoading.value = true;
  axios
    .get(`/gst-master/search`, {
      params: {
        query: search.value,
        page: currentPage.value,
        perPage: perPage.value,
      },
    })
    .then((response) => {
      const data = response.data;
      gstData.value = data?.data?.data.map((item) => {
        return {
          ...item,
          gst_id: item.gst_id || null,
          is_active:
            item.applicable == 'N'
              ? false
              : item.applicable == 'Y'
              ? true
              : null,
          app_id: item.app.app_id || null,
          country_id: item.country.country_id || null,
          tax_rate: item.tax_rate || null,
        };
      });
      // Perbarui pagination
      currentPage.value = data?.current_page;
      perPage.value = data?.per_page;
      totalItems.value = data?.total;
      totalPages.value = data?.last_page;
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error);
      const message =
        error.response.data.message === ''
          ? 'Something Wrong!!!'
          : error.response.data.message;
      errorMessage.value = message;
      isError.value = true;
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const editGst = (item) => {
  appId.value = item.app_id;
  // getCountries();
  isEdit.value = true;
  gstMasterForm.value = {
    gst_id: item.gst_id,
    app_id: item.app_id,
    country_id: item.country_id,
    tax_rate: item.tax_rate,
  };
};

const cancelEdit = () => {
  isEdit.value = false;
  gstMasterForm.value = {
    gst_id: null,
    app_id: null,
    country_id: null,
    tax_rate: null,
  };
};

const saveEdit = () => {
  if (valid.value) {
    isSending.value = true;
    const payload = {
      app_id: gstMasterForm.value.app_id,
      country_id: gstMasterForm.value.country_id,
      tax_rate: gstMasterForm.value.tax_rate,
    };
    axios
      .put(`/gst-master/update/${gstMasterForm.value.gst_id}`, payload)
      .then((response) => {
        const data = response.data;
        successMessage.value = data.message;
        isSuccess.value = true;
        getGstMasterData();
        gstMasterForm.value = {
          gst_id: null,
          app_id: null,
          country_id: null,
          tax_rate: null,
        };
        isEdit.value = false;
      })
      .catch((error) => {
        console.log(error);
        const message = error.response.data.tax_rate
          ? 'Please fill the GST field'
          : error.response.data.message;
        errorMessage.value = message;
        isError.value = true;
      })
      .finally(() => {
        isEdit.value = false;
        isSending.value = false;
      });
  }
};

const saveData = async () => {
  if (formRef.value) {
    const { valid: isValid } = await formRef.value.validate();
    if (isValid) {
      isSending.value = true;
      axios
        .post(`/gst-master/save`, gstMasterForm.value)
        .then((response) => {
          const data = response?.data;
          successMessage.value = data?.message;
          isSuccess.value = true;
          getGstMasterData();
          gstMasterForm.value = {
            gst_id: null,
            app_id: null,
            country_id: null,
            tax_rate: null,
          };
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message = error.response?.data?.message
            ? error.response?.data?.message
            : 'Something Wrong!!!';
          errorMessage.value = message;
          isError.value = true;
        })
        .finally(() => {
          isEdit.value = false;
          isSending.value = false;
        });
    }
  }
};

const activeGst = (id) => {
  isSending2.value = true;
  axios
    .get(`/gst-master/toggle-active/${id}`)
    .then((response) => {
      const data = response.data;
      successMessage.value = data.message;
      isSuccess.value = true;
      getGstMasterData();
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error);
    })
    .finally(() => {
      isSending2.value = false;
    });
};

const cancelDelete = () => {
  idGst.value = null;
  isDelete.value = false;
};

const openDeleteConfirm = (itemId) => {
  idGst.value = itemId;
  isDelete.value = true;
};

const deleteGst = () => {
  isDeleteLoading.value = true;
  axios
    .delete(`/gst-master/${idGst.value}`)
    .then((response) => {
      const data = response.data;
      successMessage.value = data.message;
      isSuccess.value = true;
      getGstMasterData();
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error);
      const message =
        error.response.data.message === ''
          ? 'Something Wrong!!!'
          : error.response.data.message;
      errorMessage.value = message;
      isError.value = true;
    })
    .finally(() => {
      isDeleteLoading.value = false;
      idGst.value = null;
      isDelete.value = false;
    });
};

onMounted(() => {
  getGstMasterData();
  getAppActive();
  getCountries();
});

watch(perPage, () => {
  currentPage.value = 1; // Reset to first page when `perPage` changes
  getGstMasterData();
  getAppActive();
});
</script>

<style lang="scss" scoped>
.country-table {
  font-size: 12px;
  color: rgb(100, 100, 100) !important;
}

.gst-master-table-body {
  margin-top: 50px !important;
  margin-bottom: 50px !important;
}

.gst-master-table-body td {
  border-bottom: none !important;
}
.app-column {
  display: flex;
  align-items: center;
  min-height: 70px;
  margin-bottom: 10px;
}

.app-column-table {
  min-height: 70px;
  margin-bottom: 10px !important;
}
.app-img {
  border: 1px solid grey !important;
  cursor: pointer !important;
}

.app-column-table th {
  text-align: left;
  font-weight: 600;
  padding-bottom: 5px !important;
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
