<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
		<div class="d-flex align-center ml-4 mb-4" style="gap: 30px">
      <router-link class="text-decoration-none text-black" to="/address-master">
        <h1>Address Master</h1>
      </router-link>
    </div>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12">
						<template v-if="isEdit">
							<v-text-field
								class="mt-8"
								v-model="addressForm.street_address"
								:rules="rules.streetAddressRules"
								label="Street Address"
								variant="outlined"
								density="compact"
								required
							/>
						</template>
						<template v-else>
							<v-text-field
								class="mt-8"
								ref="streetRef"
								v-model="addressForm.street_address"
								:rules="rules.streetAddressRules"
								label="Street Address"
								variant="outlined"
								density="compact"
								required
							/>
						</template>
          </v-col>
				</v-row>
				<v-row cols="2">
          <v-col cols="6">
            <v-text-field
              class="mt-8"
              v-model="addressForm.town"
              :rules="rules.townRules"
              label="Town"
              variant="outlined"
              density="compact"
              required
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              class="mt-8"
              v-model="addressForm.condo_name"
              :rules="rules.condoNameRules"
              label="Condo / Apartment Name"
              variant="outlined"
              density="compact"
              required
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="2">
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
          <v-col cols="12" md="2" v-if="isEdit">
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

              CANCEL
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
            @keyup="getAddressMasterData()"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="2">
          <v-btn
            prepend-icon="mdi-magnify"
            color="indigo-accent-2"
            style="text-transform: none"
            variant="flat"
            class="w-100"
            @click="getAddressMasterData()"
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
            @update:modelValue="getAddressMasterData"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-table class="country-table">
            <thead>
              <tr>
                <th class="text-left font-weight-bold text-black">
									ID
								</th>
                <th class="text-left font-weight-bold text-black">
                  Street Address
                </th>
                <th class="text-left font-weight-bold text-black">
                  Town
                </th>
                <th class="text-left font-weight-bold text-black">
                  City
                </th>
                <th class="text-left font-weight-bold text-black">
                  Country
                </th>
                <th class="text-left font-weight-bold text-black">
                  Condo / Building Name
                </th>
                <th class="text-left font-weight-bold text-black">User</th>
                <th class="text-left font-weight-bold text-black">Dated</th>
                <th class="text-left font-weight-bold text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(item, index) in addressMaster" :key="index">
								{{ item.last_page }}
                <tr class="address-table-body">
                  <td>{{ item.address_id }}</td>
                  <td>{{ item.street_address }}</td>
                  <td>{{ item.town }}</td>
                  <td>{{ item.city }}</td>
                  <td>{{ item.country }}</td>
                  <td>{{ item.condo_name }}</td>
                  <td>
                    {{ item?.user?.name || 'N/A' }}
                  </td>
                  <td>
                    {{ item?.dated || 'N/A' }}
                  </td>
                  <td>
                    <div class="d-flex">
                      <v-btn
                            color="green"
                            variant="text" @click="editAddressMaster(item)"
                            icon
                          >
  <v-icon>mdi-pencil-outline</v-icon>  <v-tooltip location="top" activator="parent">Edit</v-tooltip>
</v-btn>
                      <v-btn
                            color="red" variant="text"
                            :disabled="isDeleteLoading"
                            @click="openDeleteConfirm(item.address_id)"
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
            @update:modelValue="getAddressMasterData"
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
          Are you sure want to delete this address?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelDelete">No</v-btn>
          <v-btn color="success" text @click="deleteAddressMaster">{{
            isDeleteLoading ? 'Deleting...' : 'Yes'
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
		<v-dialog persistent width="auto" v-model="isOpenImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4">
          Upload Image - Construction Category</v-card-title
        >
        <v-card-text>
          <image-upload
            :image-file="imageFile"
            @update-image-file="updateImageFile"
            @delete-image-file="deleteImageFile"
          />
        </v-card-text>
        <v-card-actions class="mt-16">
          <v-spacer></v-spacer>
          <v-btn
            style="text-transform: none"
            color="error"
            text
            @click="closeImage"
            >Cancel</v-btn
          >
          <v-btn
            style="background-color: #9ddcff; text-transform: none"
            color="black"
            @click="saveImage()"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
	import {
		ref,
		nextTick,
		watch,
		onMounted,
		computed
	} from "vue";
	import axios from '@/util/axios';
	// import { setAuthHeader } from '@/util/axios';
	import { Loader } from "@googlemaps/js-api-loader";
import { setAuthHeader } from '@/util/axios';
const token = JSON.parse(localStorage.getItem('token'));
setAuthHeader(token);

	const search = ref('')
	// const items = ref([])
	const addressMaster = ref([])
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
	const idAddressMaster = ref(null)
	const isDelete = ref(false)
	const isDeleteLoading = ref(false)
	const valid = ref(false)
	const isSending = ref(false)

	const addressForm = ref({
		country: null,
		city: null,
		town: null,
		street_address: null,
		postal_code: null,
		condo_name: null,
		latitude: null,
		longitude: null,
	})

	const rules = ref({
		streetAddressRules: [
			(value) => {
				if (value) return true;
				return 'Street Address is required.';
			},
		],
		townRules: [
			(value) => {
				if (value) return true;
				return 'Town is required.';
			},
		],
		condoNameRules: [
			(value) => {
				if (value) return true;
				return 'Condo / Apartment Name is required.';
			},
		],
	})

	const startItem = computed(() => {
		return (currentPage.value - 1) * perPage.value + 1;
	})

	const endItem = computed(() => {
		return Math.min(currentPage.value * perPage.value, totalItems.value);
	})
	
	/* const perPage1 = () => {
		currentPage.value = 1;
		getAddressMasterData()
	}

	const filterCity = (country_id) => {
		return city.value.filter((item) => item.country_id === country_id);
	}

	const filterTown = (city_id) => {
		return town.value.filter((item) => item.city_id === city_id);
	} */

	const getAddressMasterData = () => {
		isLoading.value = true;
		axios.get(`/address-master/search`, {
				params: {
					query: search.value,
					page: currentPage.value,
					perPage: perPage.value,
				},
			})
			.then((response) => {
				const data = response.data;
				console.log('data', data.data.data)
				addressMaster.value = data?.data?.data.map((item) => {
						return {
							...item,
							id: item.address_id || null,
							street_address: item.street_address || null,
							town: item.town.town_name || null,
							city: item.city.city_name || null,
							country: item.country.country_name || null,
							condo_name: item.condo_name || null,
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

	const editAddressMaster = (item) => {
		isEdit.value = true;
		addressForm.value = {
			address_id: item.address_id,
			street_address: item.street_address,
			town: item.town,
			condo_name: item.condo_name,
		};
	}
	
	const cancelEdit = () => {
		isEdit.value = false;
		addressForm.value = {
			address_id: 0,
			cc_id: null,
			building_type_id: null,
			country_id: null,
			address_type_id: null,
		};
	}

	const saveEdit = () => {
		if (valid.value) {
			isSending.value = true;
			const payload = {
				address_id: addressForm.value.address_id,
				cc_id: addressForm.value.cc_id,
				bt_id: addressForm.value.bt_id,
				country_id: addressForm.value.country_id,
				address_type_id: addressForm.value.address_type_id,
			};
			axios.put(`/address-master/update`, payload).then((response) => {
				const data = response.data;
				successMessage.value = data.message;
				isSuccess.value = true;
				getAddressMasterData();
				addressForm.value = {
					address_id: null,
					cc_id: null,
					building_type_id: null,
					country_id: null,
					address_type_id: null,
				};
			})
			.catch((error) => {
				console.log(error);
				const message = error.response.data.address_name
					? 'Please fill the address name field'
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

	const saveData = () => {
		if (valid.value) {
			isSending.value = true;
			axios.post(`/address-master/save-address`, addressForm.value)
				.then((response) => {
					const data = response?.data;
					console.log({data})
					successMessage.value = data?.message;
					isSuccess.value = true;
					getAddressMasterData();
					addressForm.value = {
						address_id: null,
						main_address_id: null,
						construction_address_id: null,
						building_type_id: null,
						country_id: null,
						address_type_id: null,
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

	const cancelDelete = () => {
		idAddressMaster.value = null;
		isDelete.value = false;
	}
	
	const openDeleteConfirm = (itemId) => {
		idAddressMaster.value = itemId;
		isDelete.value = true;
	}
	
	const deleteAddressMaster = () => {
		isDeleteLoading.value = true;
		axios.delete(`/address-master/${idAddressMaster.value}`).then((response) => {
			const data = response.data;
			successMessage.value = data.message;
			isSuccess.value = true;
			getAddressMasterData();
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
			idAddressMaster.value = null;
			isDelete.value = false;
		});
	}

	onMounted(() => {
		getAddressMasterData();
	})

	let autocomplete;
	const streetRef = ref(null);
	const googleMapsApiKey = ref('AIzaSyDepjJJsj2zb9pi5j-9G0beqBTtTtfYhno');
	// const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

	const initAutocomplete = async () => {
		console.log(streetRef.value)
		const loader = new Loader({
			apiKey: googleMapsApiKey.value,
			libraries: ["places"],
		});

		await loader.load();

		nextTick(() => {
			if (streetRef.value) {
				const nativeInput = streetRef.value.$el.querySelector("input");
				if (!nativeInput) {
					console.error("❌ Could not find the actual input inside MazInput!");
					return;
				}

				// eslint-disable-next-line no-undef
				autocomplete = new google.maps.places.Autocomplete(nativeInput, {
					componentRestrictions: { country: "SG" }, // Singapore only
					types: ["address"],
					// eslint-disable-next-line no-dupe-keys
					types: ["geocode"],
					// eslint-disable-next-line no-dupe-keys
					types: ["establishment"],
				});

				autocomplete.addListener("place_changed", () => {
					const place = autocomplete.getPlace();
					if (place.geometry) {

						var placeName = place.name;
						var streetName = "";
						var route = "";
						for (let i = 0; i < place.address_components.length; i++) {
							const component = place.address_components[i];
							if (component.types.includes("street_number")) {
								streetName = component.long_name;
							}
							if (component.types.includes("route")) {
								route = component.long_name;
							}

							if (component.types.includes("locality")) {
								addressForm.value.city = component.long_name; // City
							}
							if (component.types.includes("neighborhood")) {
								addressForm.value.town = component.long_name; // Town
							}
							if (component.types.includes("country")) {
								addressForm.value.country = component.long_name; // Country
							}
							if (component.types.includes("postal_code")) {
								addressForm.value.postal_code = component.long_name; // Postal Code
							}
							else {
								addressForm.value.postal_code = "";
							}
						}
						var mainAddress = [placeName, streetName, route].filter(Boolean).join(' ');
						addressForm.value.street_address = mainAddress
						addressForm.value.condo_name = placeName;
						addressForm.value.latitude = place.geometry.location.lat();
						addressForm.value.longitude = place.geometry.location.lng();
					}
				});
			} else {
				console.error("Invalid input element:", streetRef.value);
			}
		});
	};

	watch((isOpen) => {
		if (isOpen) {
			initAutocomplete();
		}
	});

	watch(perPage, () => {
		currentPage.value = 1; // Reset to first page when `perPage` changes
		getAddressMasterData();
	});

</script>

<style lang="scss" scoped>
.country-table {
  font-size: 12px;
  color: rgb(100, 100, 100) !important;
}

.address-table-body {
  margin-top: 50px !important;
  margin-bottom: 50px !important;
}

.address-table-body td {
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
