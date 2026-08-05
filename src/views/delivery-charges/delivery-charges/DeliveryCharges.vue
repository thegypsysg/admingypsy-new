<template>
  <v-container>
		<div class="d-flex align-center ml-4 mb-4" style="gap: 30px">
      <router-link class="text-decoration-none text-black" to="/delivery-charges">
        <h1>Delivery Charges</h1>
      </router-link>
    </div>
    <v-form v-model="valid" @submit.prevent ref="formRef">
      <v-container>
        <v-row>
          <v-col cols="4">
						<v-autocomplete
              density="compact"
              label="---Select App---"
              placeholder="Type App"
              :items="resource.appsData"
              item-title="name"
              item-value="id"
              v-model="deliveryChargesForm.app_id"
              :rules="rules.appRules"
							@update:modelValue="onSelect"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
          <v-col cols="4">
            <v-autocomplete
              clearable
              density="compact"
              label="Select Country"
              placeholder="Type a Country"
              :items="resource.countriesData"
              item-title="name"
              item-value="country_id"
              v-model="deliveryChargesForm.country_id"
              :rules="rules.countryRules"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="deliveryChargesForm.description"
              :rules="rules.deliveryDescriptionRules"
              label="Delivery Description"
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
                  : 'mdi-account-multiple-plus'"
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
            @keyup="getDeliveryChargesData()"
          ></v-text-field>
        </v-col>
        <!-- <v-col cols="12" md="2">
          <v-btn
            prepend-icon="mdi-magnify"
            color="indigo-accent-2"
            style="text-transform: none"
            variant="flat"
            class="w-100"
            @click="getDeliveryChargesData()"
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
            @update:modelValue="getDeliveryChargesData"
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
                <th class="text-left font-weight-bold text-black">Delivery Description</th>
                <th class="text-left font-weight-bold text-black">Rate</th>
                <th class="text-left font-weight-bold text-black">User</th>
                <th class="text-left font-weight-bold text-black">Dated</th>
                <th class="text-left font-weight-bold text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(item, index) in deliveryData" :key="index">
								{{ item.last_page }}
                <tr class="delivery-charges-table-body">
                  <td>{{ item.dc_id }}</td>
                  <td>{{ item.app.app_name }}</td>
                  <td>{{ item.country.country_name }}</td>
                  <td>{{ item.description }}</td>
                  <td>S$ {{ item.rate }}</td>
                  <td>{{ item?.user?.name || 'N/A' }}</td>
                  <td>{{ item?.dated || 'N/A' }}</td>
                  <td>
                    <div class="d-flex">
                      <v-btn
                            color="green"
                            variant="text" @click="editDeliveryCharges(item)"
                            icon="mdi-pencil-outline"
                          >  <v-tooltip location="top" activator="parent">Edit</v-tooltip>
</v-btn>
                      <v-btn
                            color="red" variant="text"
                            :disabled="isDeleteLoading"
                            @click="openDeleteConfirm(item.dc_id)"
                            icon="mdi-trash-can-outline"
                          >  <v-tooltip location="top" activator="parent">Delete</v-tooltip>
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
            @update:modelValue="getDeliveryChargesData"
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
        <v-card-text>
          Are you sure want to delete these Delivery Charges?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelDelete">No</v-btn>
          <v-btn color="success" text @click="deleteDeliveryCharges">{{
            isDeleteLoading ? 'Deleting...' : 'Yes'
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
  </v-container>
</template>

<script setup>
	import {
		ref,
		watch,
		onMounted,
		computed
	} from "vue";
	import axios from '@/util/axios';
	import { setAuthHeader } from '@/util/axios';
	const token = JSON.parse(localStorage.getItem('token'));
	setAuthHeader(token);

	const search = ref('')
	// const items = ref([])
	const deliveryData = ref([])
	const currentPage = ref(1)
	const perPage = ref(5)
	const totalPages = ref(1)
	const totalItems = ref(0)
	const isLoading = ref(false)
	const isEdit = ref(false)
	const isSuccess = ref(false)
	const successMessage = ref("")
	const isError = ref(false)
	const errorMessage = ref("")
	const idDeliveryCharges = ref(null)
	const isDelete = ref(false)
	const isDeleteLoading = ref(false)
	const valid = ref(false)
	const isSending = ref(false)
	const appId = ref(null)
  const formRef = ref(null);

	const deliveryChargesForm = ref({
		dc_id: 0,
		app_id: "",
		country_id: "",
		description: ""
	})

	const resource = ref({
		countriesData: [],
		appsData: [],
	})

	const rules = ref({
		deliveryDescriptionRules: [
			(value) => {
				if (value) return true;
				return 'Delivery Description is required.';
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
	})

	const startItem = computed(() => {
		return (currentPage.value - 1) * perPage.value + 1;
	})

	const endItem = computed(() => {
		return Math.min(currentPage.value * perPage.value, totalItems.value);
	})

	const onSelect = (value) => {
		appId.value = value
		getCountries()
	}

	const getAppActive = () => {
      axios.get(`/app/active`).then((response) => {
          const data = response.data.data;
          resource.value.appsData = data
            .sort((a, b) => a.app_id < b.app_id)
            .map((app) => {
							appId.value = app.id
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
            error.response.data.message === ''
              ? 'Something Wrong!!!'
              : error.response.data.message;
          this.errorMessage = message;
          this.isError = true;
        });
	}

	const getCountries = () => {
      // axios.get(`/app-country-list/${appId.value}`).then((response) => {
      axios.get(`/app-countries`).then((response) => {
			const data = response.data.data;
			resource.value.countriesData = data
				.sort((a, b) => a.country_name.localeCompare(b.country_name))
				.map((country) => {
					return {
						id: country.dc_id || 1,
						description: country.description || '',
						country_id: country.country_id || 1,
						name: country.country_name || '',
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
	}

	const getDeliveryChargesData = () => {
		isLoading.value = true;
		axios.get(`/delivery-charges/search`, {
				params: {
					query: search.value,
					page: currentPage.value,
					perPage: perPage.value,
				},
			})
			.then((response) => {
				const data = response.data;
				deliveryData.value = data?.data?.data.map((item) => {
						return {
							...item,
							dc_id: item.dc_id || null,
							app_id: item.app.app_id || null,
							description: item.description || null,
							country_id: item.country.country_id || null,
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
	}

	const editDeliveryCharges = (item) => {
		appId.value = item.app_id
		getCountries();
		isEdit.value = true;
		deliveryChargesForm.value = {
			dc_id: item.dc_id,
			app_id: item.app_id,
			country_id: item.country_id,
			description: item.description,
		};
	}
	
	const cancelEdit = () => {
		isEdit.value = false;
		deliveryChargesForm.value = {
			dc_id: null,
			app_id: null,
			country_id: null,
			description: null,
		};
	}

	const saveEdit = () => {
		if (valid.value) {
			isSending.value = true;
			const payload = {
				app_id: deliveryChargesForm.value.app_id,
				country_id: deliveryChargesForm.value.country_id,
				description: deliveryChargesForm.value.description
			};
			axios.put(`/delivery-charges/update/${deliveryChargesForm.value.dc_id}`, payload).then((response) => {
				const data = response.data;
				successMessage.value = data.message;
				isSuccess.value = true;
				getDeliveryChargesData();
				deliveryChargesForm.value = {
					dc_id: null,
					app_id: null,
					country_id: null,
					description: null,
				};
				isEdit.value = false;
			})
			.catch((error) => {
				console.log(error);
				const message = error.response.data.description
					? 'Please fill the Delivery Charges field'
					: error.response.data.message;
				errorMessage.value = message;
				isError.value = true;
			})
			.finally(() => {
				isEdit.value = false;
				isSending.value = false;
			});
		}
	}

	const saveData = async () => {
    if (formRef.value) {
      const { valid: isValid } = await formRef.value.validate();
      if (isValid) {
        isSending.value = true;
        axios.post(`/delivery-charges/save`, deliveryChargesForm.value).then((response) => {
          const data = response?.data;
          successMessage.value = data?.message;
          isSuccess.value = true;
          getDeliveryChargesData();
          deliveryChargesForm.value = {
            dc_id: null,
            app_id: null,
            country_id: null,
            description: null,
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
	}

	const cancelDelete = () => {
		idDeliveryCharges.value = null;
		isDelete.value = false;
	}
	
	const openDeleteConfirm = (itemId) => {
		idDeliveryCharges.value = itemId;
		isDelete.value = true;
	}
	
	const deleteDeliveryCharges = () => {
		isDeleteLoading.value = true;
		axios.delete(`/delivery-charges/${idDeliveryCharges.value}`).then((response) => {
			const data = response.data;
			successMessage.value = data.message;
			isSuccess.value = true;
			getDeliveryChargesData();
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
			idDeliveryCharges.value = null;
			isDelete.value = false;
		});
	}

	onMounted(() => {
		getDeliveryChargesData();
		getAppActive();
	})

	watch(perPage, () => {
		currentPage.value = 1; // Reset to first page when `perPage` changes
		getDeliveryChargesData();
		getAppActive();
	});

</script>

<style lang="scss" scoped>
.country-table {
  font-size: 12px;
  color: rgb(100, 100, 100) !important;
}

.delivery-charges-table-body {
  margin-top: 50px !important;
  margin-bottom: 50px !important;
}

.delivery-charges-table-body td {
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
