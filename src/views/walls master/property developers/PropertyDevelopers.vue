<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <HeaderWallMaster />
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row class="mt-n4">
          <v-col cols="12" md="4">
            <v-autocomplete
              class="mt-8"
              density="compact"
              label="Property Developer Name"
              placeholder="Property Developer Name"
              :items="resource.partners"
              item-title="name"
              item-value="id"
              v-model="input.partner_id"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn
              :prepend-icon="
                isEdit
                  ? 'mdi-account-multiple-check'
                  : 'mdi-account-multiple-plus'
              "
              color="indigo-accent-2"
              style="text-transform: none"
              type="submit"
              variant="flat"
              class="w-100 mt-8"
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
          <v-col cols="12" md="2">
            <v-btn
              v-if="isEdit"
              prepend-icon="mdi-account-multiple-remove"
              color="red"
              style="text-transform: none"
              variant="flat"
              class="w-100 mt-8"
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
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-table class="country-table">
            <thead>
              <tr>
                <th class="text-left font-weight-bold text-black">
                  Property Developer Name
                </th>
                <th class="text-left font-weight-bold text-black">Country</th>
                <th class="text-left font-weight-bold text-black">Active</th>
                <th class="text-left font-weight-bold text-black">Featured</th>
                <th class="text-left font-weight-bold text-black">User</th>
                <th class="text-left font-weight-bold text-black">Dated</th>
                <th class="text-left font-weight-bold text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(item, index) in filteredItems" :key="item.id">
                <tr class="country-table-body">
                  <td>{{ item.partner_name }}</td>
                  <td>{{ item.country_name }} </td>
                  <td>
                    <v-btn-toggle
                      style="
                        font-size: 10px !important;
                        font-weight: 200 !important;
                        height: 22px !important;
                        width: 54px !important;
                      "
                      class="d-flex align-center"
                      v-model="item.isActive"
                      :disabled="isSending2"
                      rounded="5"
                      @click="activePropertyDeveloper(item.developer_id)"
                    >
                      <v-btn size="27" :value="true"> Yes </v-btn>

                      <v-btn size="27" :value="false"> No </v-btn>
                    </v-btn-toggle>
                  </td>
                  <td>
                    <v-btn-toggle
                      style="
                        font-size: 10px !important;
                        font-weight: 200 !important;
                        height: 22px !important;
                        width: 54px !important;
                      "
                      class="d-flex align-center"
                      v-model="item.isFeatured"
                      :disabled="isSending2"
                      rounded="5"
                      @click="featuredPropertyDeveloper(item.developer_id)"
                    >
                      <v-btn size="27" :value="true"> Yes </v-btn>

                      <v-btn size="27" :value="false"> No </v-btn>
                    </v-btn-toggle>
                  </td>
                  <td>
                    {{ item.user_name }}
                  </td>
                  <td>
                    {{ item.dated }}
                  </td>
                  <td>
                    <div class="d-flex">
                      <!-- <v-btn
                            color="green"
                            variant="text" @click="editPropertyDeveloper(item)"
                            icon="mdi-pencil-outline"
                          >  <v-tooltip location="top" activator="parent">Edit</v-tooltip>
</v-btn> -->
                      <v-btn
                            color="red" variant="text"
                            :disabled="isDeleteLoading"
                            @click="openDeleteConfirm(item.developer_id)"
                            icon="mdi-trash-can-outline"
                          >  <v-tooltip location="top" activator="parent">Delete</v-tooltip>
</v-btn>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    <v-select
                      v-model="item.city_id"
                      :items="filterCity(item.country_id)"
                      item-title="city_name"
                      item-value="city_id"
                      variant="outlined"
                      density="compact"
                      label="City"
                      @update:modelValue="saveCity(item.city_id, index)"
                    ></v-select>
                  </td>
                  <td>
                    <v-select
                      v-model="item.town_id"
                      :items="filterTown(item.city_id)"
                      item-title="town_name"
                      item-value="town_id"
                      variant="outlined"
                      density="compact"
                      label="Town"
                      @update:modelValue="saveTown(item.town_id, index)"
                    ></v-select>
                  </td>
                  <td colspan="2">
                    <v-text-field
                      v-model="item.latitude"
                      variant="outlined"
                      density="compact"
                      label="Latitude"
                      @change="saveLatitude(item.latitude, index)"
                    ></v-text-field>
                  </td>
                  <td colspan="2">
                    <v-text-field
                      v-model="item.longitude"
                      variant="outlined"
                      density="compact"
                      label="Longitude"
                      @change="saveLongitude(item.longitude, index)"
                    ></v-text-field>
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
        <v-card-text> Are you sure want to delete this property developer? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelDelete">No</v-btn>
          <v-btn color="success" text @click="deleteLocation">{{
            isDeleteLoading ? 'Deleting...' : 'Yes'
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent width="auto" v-model="isOpenImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4">
          Upload Image - Partner Location</v-card-title
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

<script>
import ImageUpload from '@/components/ImageUpload.vue';
import axios from '@/util/axios';
import { setAuthHeader } from '@/util/axios';
import HeaderWallMaster from '@/components/HeaderWallMaster.vue';
// import app from '@/util/eventBus';

export default {
  name: 'LocationsVue',
  data: () => ({
    // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    idPartnerLocations: null,
    partnerName: null,
    valid: false,
    isLoading: false,
    isSending: false,
    isSending2: false,
    isError: false,
    isEdit: false,
    isSuccess: false,
    isDelete: false,
    isDeleteLoading: false,
    developerIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    isOpenImage: false,
    successMessage: '',
    errorMessage: '',
    imageFile: [],

    input: {
      developer_id:0,
      partner_name:'',
      partner_id:null,
      country_id:0,
      active:'',
      featured:'',
      user_id:0,
      dated:''
    },
    rules: {
      countryRules: [
        (value) => {
          if (value) return true;
          return 'Country is required.';
        },
      ],
      townRules: [
        (value) => {
          if (value) return true;
          return 'Town is required.';
        },
      ],

      cityRules: [
        (value) => {
          if (value) return true;
          return 'City is required.';
        },
      ],
      zoneRules: [
        (value) => {
          if (value) return true;
          return 'Zone is required.';
        },
      ],
      locationRules: [
        (value) => {
          if (value) return true;
          return 'Location is required.';
        },
      ],
      latitudeRules: [
        (value) => {
          if (value) return true;
          return 'Latitude is required.';
        },
      ],
      longitudeRules: [
        (value) => {
          if (value) return true;
          return 'Longitude is required.';
        },
      ],
      addressRules: [
        (value) => {
          if (value) return true;
          return 'Address is required.';
        },
      ],
    },
    search: '',
    items: [],
    resource: {
      partners: [],
      propertyDevelopers: [],
      cities: [],
      towns: [],
    },
    // itemsTry: [
    //   {
    //     id: 1,
    //     name: 'Parkway Parade',
    //     town: 'Marine Parade',
    //     city: 'Singapore',
    //     country: 'Singapore',
    //     isActive: false,
    //     isFeatured: false,
    //     user: 'Charlton',
    //     dated: '15/08/2023',
    //     type: 'Mall',
    //     latitude: 1.3019,
    //     longitude: 103.9028,
    //     managed: 'Lendlease Pte Ltd',
    //     events: 4,
    //     offers: 2,
    //     merchants: 14,
    //   },
    // ],
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  async mounted() {
    this.idPartnerLocations = this.$route.params.id;
    await this.getPartnerData();
    await this.getCityData();
    await this.getTownData();
    await this.getPropertyDevelopersData();

  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.items;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.items.filter(
        (item) =>
          item.partner_name.toLowerCase().includes(searchTextLower) ||
          item.country_name.toLowerCase().includes(searchTextLower) ||
          item.user_name.toLowerCase().includes(searchTextLower)
      );
    },
  },
  methods: {
    editPropertyDeveloper(prop) {
      this.isEdit = true;
      this.input = {
        developer_id: prop.developer_id,
        partner_id: prop.partner_id,
        country_id: prop.country_id,
        active: prop.active,
        featured: prop.featured,
        user_id: prop.user_id,
        dated: prop.dated,
        partner_name: prop.partner_name,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        developer_id:0,
        partner_id:null,
        country_id:0,
        active:'',
        featured:'',
        user_id:0,
        dated:''
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          developer_id:this.input.developer_id,
          partner_id:this.input.partner_id,
          country_id:this.input.country_id,
          active: this.input.active,
          featured: this.input.featured,
          user_id: this.input.user_id,
          dated: this.input.dated,
        };
        axios
          .post(`/4walls-property-developers/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getPropertyDevelopersData();
            this.input = {
              developer_id:0,
              partner_id:null,
              country_id:0,
              active:'',
              featured:'',
              user_id:0,
              dated:''
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.partner_id
              ? error.response.data.partner_id[0]
              : error.response.data.new_city
              ? error.response.data.new_city[0]
              : error.response.data.new_town
              ? error.response.data.new_town[0]
              : error.response.data.message
              ? error.response.data.message
              : 'Something Wrong!!!';
            this.errorMessage = message;
            this.isError = true;
            this.input = {
              developer_id:0,
              partner_id:null,
              country_id:0,
              active:'',
              featured:'',
              user_id:0,
              dated:''
            };
          })
          .finally(() => {
            this.isEdit = false;
            this.isSending = false;
          });
      }
    },
    saveData() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          partner_id:this.input.partner_id,
        };
        axios
          .post(`/4walls-property-developers`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getPropertyDevelopersData();
            this.input = {
              developer_id:0,
              partner_id:null,
              country_id:0,
              active:'',
              featured:'',
              user_id:0,
              dated:''
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.partner_id
              ? error.response.data.partner_id[0]
              : 'Something Wrong!!!';
            this.errorMessage = message;
            this.isError = true;
          })
          .finally(() => {
            this.isSending = false;
          });
      }
    },
    cancelDelete() {
      this.developerIdToDelete = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.developerIdToDelete = itemId;
      this.isDelete = true;
    },
    cancelConfirmation() {
      this.developerIdToDelete = null;
      this.isDelete = false;
    },
    deleteLocation() {
      this.isDeleteLoading = true;
      axios
        .delete(`/4walls-property-developers/${this.developerIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPropertyDevelopersData();
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
          this.isDeleteLoading = false;
          this.developerIdToDelete = null;
          this.isDelete = false;
        });
    },
    async getPropertyDevelopersData() {
      this.isLoading = true;
      try {
        const response = await axios.get(`/4walls-property-developers`);
        const data = response.data.data;
        // console.log(data);
        this.items = data.map((item) => {
          return {
            developer_id: item.developer_id || 1,
            partner_id: item.partner_id || 1,
            partner_name: item.partner_name || '',
            country_id: item.country_id || 1,
            country_name: item.country_name || '',
            user_name: item.user.name || '',
            isActive:
              item.active == 'N' ? false : item.active == 'Y' ? true : null,
            isFeatured:
              item.featured == 'N'
                ? false
                : item.featured == 'Y'
                ? true
                : null,
            dated: item.dated || '',
            city_id: item.city_id || null,
            town_id: this.resource.towns.filter(town => town.city_id === item.city_id).filter(town => town.town_id === item.town_id)[0]?.town_id || null,
            latitude: item.latitude || null,
            longitude: item.longitude || null,
          };
        });
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
        const message =
          error.response.data.message === ''
            ? 'Something Wrong!!!'
            : error.response.data.message;
        this.errorMessage = message;
        this.isError = true;
      } finally {
        this.isLoading = false;
      }
    },
    async getPartnerData() {
      try {
        const response = await axios.get(`/partners`);
        const data = response.data.data;
        // console.log(data);
        this.resource.partners = data.map((item) => {
          return {
            id: item.partner_id || 1,
            name: item.partner_name || '',
          };
        });
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
        const message =
          error.response.data.message === ''
            ? 'Something Wrong!!!'
            : error.response.data.message;
        this.errorMessage = message;
        this.isError = true;
      }
    },
    async getCityData() {
      try {
        const response = await axios.get(`/cities`);
        const data = response.data.data;
        this.resource.cities = data.map((item) => {
          return {
            city_id: item.city_id || 1,
            city_name: item.city_name || '',
            country_id: item.country_id || 1,
          };
        });
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
        const message =
          error.response.data.message === ''
            ? 'Something Wrong!!!'
            : error.response.data.message;
        this.errorMessage = message;
        this.isError = true;
      }
    },
    async getTownData() {
      try {
        const response = await axios.get(`/towns`);
        const data = response.data.data;
        this.resource.towns = data.map((item) => {
          return {
            town_id: item.town_id || 1,
            town_name: item.town_name || '',
            city_id: item.city_id || 1,
          };
        });
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
        const message =
          error.response.data.message === ''
            ? 'Something Wrong!!!'
            : error.response.data.message;
        this.errorMessage = message;
        this.isError = true;
      }
    },
    filterCity(country_id) {
      return this.resource.cities.filter(
        (item) => item.country_id === country_id
      );
    },
    filterTown(city_id) {
      return this.resource.towns.filter(
        (item) => item.city_id === city_id
      );
    },
    saveCity(city_id, index) {
      let payload = {
        developer_id: this.items[index].developer_id,
        city_id: city_id,
      };
      axios
        .post(`/4walls-property-developers/update`, payload)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPropertyDevelopersData();
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
    },
    saveTown(town_id, index) {
      let payload = {
        developer_id: this.items[index].developer_id,
        town_id: town_id,
      };
      axios
        .post(`/4walls-property-developers/update`, payload)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPropertyDevelopersData();
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
    },
    saveLatitude(latitude, index) {
      let payload = {
        developer_id: this.items[index].developer_id,
        latitude: latitude,
      };
      axios
        .post(`/4walls-property-developers/update`, payload)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPropertyDevelopersData();
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
    },
    saveLongitude(longitude, index) {
      let payload = {
        developer_id: this.items[index].developer_id,
        longitude: longitude,
      };
      axios
        .post(`/4walls-property-developers/update`, payload)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPropertyDevelopersData();
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
    },
    featuredPropertyDeveloper(id) {
      this.isSending2 = true;
      axios
        .get(`/4walls-property-developers/toggle-featured/${id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPropertyDevelopersData();
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
    activePropertyDeveloper(developer_id) {
      this.isSending2 = true;
      axios
        .get(`/4walls-property-developers/toggle-active/${developer_id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPropertyDevelopersData();
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
  components: { ImageUpload, HeaderWallMaster },
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
