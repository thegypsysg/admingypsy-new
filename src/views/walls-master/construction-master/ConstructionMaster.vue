<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <HeaderWallMaster />
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              class="mt-8"
              v-model="input.construction_name"
              label="Construction Name"
              variant="outlined"
              density="compact"
              :rules="rules.construction_nameRules"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              class="mt-8"
              v-model="input.cc_id"
              :rules="rules.cc_idRules"
              item-title="category_name"
              item-value="cc_id"
              label="Construction Category"
              variant="outlined"
              density="compact"
              required
              :items="constructionCategory"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-autocomplete
              class="mt-8"
              density="compact"
              label="Building Type"
              placeholder="Building Type"
              :items="buildingType"
              :rules="rules.bt_idRules"
              item-title="building_type"
              item-value="bt_id"
              v-model="input.bt_id"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn
              :prepend-icon="isEdit ? 'mdi-account-multiple-check' : 'mdi-account-multiple-plus'"
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
                <th class="text-left font-weight-bold text-black">id</th>
                <th class="text-left font-weight-bold text-black">Image</th>
                <th class="text-left font-weight-bold text-black">Long Image</th>
                <th class="text-left font-weight-bold text-black">Construction Name</th>
                <th class="text-left font-weight-bold text-black">Construction Category</th>
                <th class="text-left font-weight-bold text-black">Building Type</th>
                <th class="text-left font-weight-bold text-black">User</th>
                <th class="text-left font-weight-bold text-black">Dated</th>
                <th class="text-left font-weight-bold text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(item, index) in filteredItems" :key="item.id">
                <tr class="country-table-body">
                  <td>{{ item.construction_id }}</td>
                  <td>
                    <div class="image-upload-cont">
                      <v-img
                        class="image-upload-item"
                        height="40"
                        @click="openMainImage(item)"
                        style="cursor: pointer"
                        :src="
                          item.main_image != null
                            ? $fileURL + item.main_image
                            : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                        "
                      >
                        <template #placeholder> <div class="skeleton" /> </template
                      ></v-img>
                    </div>
                  </td>
                  <td>
                    <div class="image-upload-cont">
                      <v-img
                        class="image-upload-item"
                        height="40"
                        @click="openLongImage(item)"
                        style="cursor: pointer"
                        :src="
                          item.long_image != null
                            ? $fileURL + item.long_image
                            : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                        "
                      >
                        <template #placeholder> <div class="skeleton" /> </template
                      ></v-img>
                    </div>
                  </td>
                  <td>{{ item.construction_name }}</td>
                  <td>{{ item?.construction_category?.category_name }}</td>
                  <td>{{ item?.building_type?.building_type }}</td>
                  <td>{{ item.user }}</td>
                  <td>{{ item.dated }}</td>
                  <td>
                    <div class="d-flex">
                      <v-btn
                        color="green"
                        variant="text"
                        @click="editConstructionMaster(item)"
                        icon
                      >
                        <v-icon>mdi-pencil-outline</v-icon>
                        <v-tooltip location="top" activator="parent">Edit</v-tooltip>
                      </v-btn>
                      <v-btn
                        color="red"
                        variant="text"
                        :disabled="isDeleteLoading"
                        @click="openDeleteConfirm(item.construction_id)"
                        icon
                      >
                        <v-icon>mdi-trash-can-outline</v-icon>
                        <v-tooltip location="top" activator="parent">Delete</v-tooltip>
                      </v-btn>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="border-bottom: none !important" colspan="2">
                    <v-select
                      density="compact"
                      v-model="item.agent_id"
                      label="Agent"
                      variant="outlined"
                      hide-details
                      :items="resource.agents"
                      item-title="agent_name"
                      item-value="pa_id"
                      @update:modelValue="saveAgent(item.agent_id, item)"
                    ></v-select>
                  </td>
                  <td style="border-bottom: none !important">
                    <label>Country</label>
                    <v-select
                      v-model="item.country_id"
                      variant="outlined"
                      density="compact"
                      item-title="country_name"
                      item-value="country_id"
                      :items="resource.countries"
                      @update:modelValue="
                        saveCountry(
                          item.country_id,
                          index,
                          item.bt_id,
                          item.cc_id,
                          item.construction_name
                        )
                      "
                    ></v-select>
                  </td>
                  <td style="border-bottom: none !important">
                    <label>City</label>
                    <v-select
                      v-model="item.city_id"
                      variant="outlined"
                      density="compact"
                      :items="filterCity(item.country_id)"
                      item-title="city_name"
                      item-value="city_id"
                      @update:modelValue="
                        saveCity(
                          item.city_id,
                          index,
                          item.bt_id,
                          item.cc_id,
                          item.construction_name
                        )
                      "
                    ></v-select>
                  </td>
                  <td style="border-bottom: none !important">
                    <label>Town</label>
                    <v-select
                      v-model="item.town_id"
                      variant="outlined"
                      density="compact"
                      :items="filterTown(item.city_id)"
                      item-title="town_name"
                      item-value="town_id"
                      @update:modelValue="
                        saveTown(
                          item.town_id,
                          index,
                          item.bt_id,
                          item.cc_id,
                          item.construction_name
                        )
                      "
                    ></v-select>
                  </td>
                  <td colspan="2" style="border-bottom: none !important">
                    <label>Latitude</label>
                    <v-text-field
                      v-model="item.latitude"
                      variant="outlined"
                      density="compact"
                      @change="
                        saveLatitude(
                          item.latitude,
                          index,
                          item.bt_id,
                          item.cc_id,
                          item.construction_name
                        )
                      "
                    ></v-text-field>
                  </td>
                  <td colspan="2" style="border-bottom: none !important">
                    <label>Longitude</label>
                    <v-text-field
                      v-model="item.longitude"
                      variant="outlined"
                      density="compact"
                      @change="
                        saveLongitude(
                          item.longitude,
                          index,
                          item.bt_id,
                          item.cc_id,
                          item.construction_name
                        )
                      "
                    ></v-text-field>
                  </td>
                </tr>
                <tr>
                  <td style="border-bottom: none !important"></td>
                  <td class="justify-center align-center" style="border-bottom: none !important">
                    <span class="font-weight-bold">Under Construction</span>
                    <v-btn-toggle
                      style="
                        font-size: 10px !important;
                        font-weight: 200 !important;
                        height: 22px !important;
                        width: 54px !important;
                      "
                      class="d-flex align-center"
                      v-model="item.isUnderConstruction"
                      :disabled="isSending2"
                      rounded="5"
                      @click="underConstructionConstructionMaster(item.construction_id)"
                    >
                      <v-btn size="27" :value="true"> Yes </v-btn>

                      <v-btn size="27" :value="false"> No </v-btn>
                    </v-btn-toggle>
                  </td>
                  <td colspan="2" style="border-bottom: none !important">
                    <v-row>
                      <v-col cols="12" md="4" class="d-flex justify-center align-center">
                        <span class="font-weight-bold align-center">Completion :</span>
                      </v-col>
                      <v-col cols="12" md="4">
                        <label class="font-weight-bold">Month</label>
                        <v-text-field
                          v-model="item.completion_month"
                          variant="outlined"
                          density="compact"
                          @change="saveCompletionMonth(item.completion_month, item)"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <label class="font-weight-bold">Year</label>
                        <v-text-field
                          v-model="item.completion_year"
                          variant="outlined"
                          density="compact"
                          @change="saveCompletionYear(item.completion_year, item)"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </td>
                  <td class="justify-center align-center" style="border-bottom: none !important">
                    <span class="font-weight-bold">Move In</span>
                    <v-btn-toggle
                      style="
                        font-size: 10px !important;
                        font-weight: 200 !important;
                        height: 22px !important;
                        width: 54px !important;
                      "
                      class="d-flex align-center"
                      v-model="item.isMoveIn"
                      :disabled="isSending2"
                      rounded="5"
                      @click="moveInConstructionMaster(item.construction_id)"
                    >
                      <v-btn size="27" :value="true"> Yes </v-btn>

                      <v-btn size="27" :value="false"> No </v-btn>
                    </v-btn-toggle>
                  </td>
                  <td style="border-bottom: none !important">
                    <label>Year Built</label>
                    <v-text-field
                      v-model="item.year_built"
                      variant="outlined"
                      density="compact"
                      @change="
                        saveYearBuilt(
                          item.construction_id,
                          item.year_built,
                          item.construction_category.cc_id,
                          item.building_type.bt_id,
                          item.construction_name
                        )
                      "
                    ></v-text-field>
                  </td>
                  <td colspan="3" style="border-bottom: none !important"></td>
                </tr>
                <tr>
                  <td>
                    <router-link
                      active-class="text-blue-accent-4"
                      style="color: blue"
                      font-weight="bold"
                      class="text-decoration-none"
                      :to="`/construction_master/main_info/${item.construction_id}`"
                    >
                      <h4>Main Info</h4>
                    </router-link>
                  </td>
                  <td>
                    <router-link
                      active-class="text-blue-accent-4"
                      style="color: blue"
                      font-weight="bold"
                      class="text-decoration-none"
                      :to="`/construction_master/facility/${item.construction_id}`"
                    >
                      <h4>Facility</h4>
                    </router-link>
                  </td>
                  <td colspan="7">
                    <router-link
                      active-class="text-blue-accent-4"
                      style="color: blue"
                      font-weight="bold"
                      class="text-decoration-none"
                      :to="`/construction_master/apartment/${item.construction_id}`"
                    >
                      <h4>Apartment Type</h4>
                    </router-link>
                  </td>
                </tr>
              </template>
            </tbody>
          </v-table>
          <skeleton-table v-if="isLoading" :rows="5" :columns="9" />
          <empty-state
            v-if="!isLoading && (!filteredItems || filteredItems.length === 0)"
            title="No Data Found"
            subtitle="There are no records to display."
          />
        </v-col>
      </v-row>
    </v-sheet>

    <confirm-dialog
      v-model="isDelete"
      title="Confirmation"
      message="Are you sure you want to delete this item? This action cannot be undone."
      :loading="isDeleteLoading"
      @confirm="deleteConstructionMaster"
    />
    <v-dialog persistent width="auto" v-model="isOpenMainImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4">
          Upload Main Image - Construction Master</v-card-title
        >
        <v-card-text>
          <image-upload
            :image-file="imageFile"
            @update-image-file="updateMainImageFile"
            @delete-image-file="deleteMainImageFile"
          />
        </v-card-text>
        <v-card-actions class="mt-16">
          <v-spacer></v-spacer>
          <v-btn style="text-transform: none" color="error" text @click="closeImage">Cancel</v-btn>
          <v-btn
            style="background-color: #9ddcff; text-transform: none"
            color="black"
            @click="saveMainImage()"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent width="auto" v-model="isOpenLongImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4">
          Upload Long Image - Construction Master</v-card-title
        >
        <v-card-text>
          <image-upload
            :image-file="imageFile"
            @update-image-file="updateLongImageFile"
            @delete-image-file="deleteLongImageFile"
          />
        </v-card-text>
        <v-card-actions class="mt-16">
          <v-spacer></v-spacer>
          <v-btn style="text-transform: none" color="error" text @click="closeImage">Cancel</v-btn>
          <v-btn
            style="background-color: #9ddcff; text-transform: none"
            color="black"
            @click="saveLongImage()"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import SkeletonTable from '@/components/SkeletonTable.vue';
import EmptyState from '@/components/EmptyState.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import { useNotificationStore } from '@/stores/notification';
import HeaderWallMaster from '@/components/HeaderWallMaster.vue';
import ImageUpload from '@/components/ImageUpload.vue';
import axios from '@/util/axios';
import { setAuthHeader } from '@/util/axios';
// import app from '@/util/eventBus';

export default {
  name: 'ConstructionMaster',
  components: {
    ConfirmDialog,
    EmptyState,
    SkeletonTable,
    ImageUpload,
    HeaderWallMaster,
  },
  setup() {
    const notification = useNotificationStore();
    return { notification };
  },
  data: () => ({
    // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    idConstructionCategory: null,
    valid: false,
    isLoading: false,
    isSending: false,
    isSending2: false,
    isEdit: false,
    isDelete: false,
    isDeleteLoading: false,
    locationIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    isOpenMainImage: false,
    isOpenLongImage: false,
    mainImageFile: [],
    longImageFile: [],
    constructionCategory: [],
    buildingType: [],
    propertyDataToMainImage: {
      construction_id: 0,
      main_image: null,
      cc_id: null,
      bt_id: null,
    },
    propertyDataToLongImage: {
      construction_id: 0,
      long_image: null,
      cc_id: null,
      bt_id: null,
    },

    input: {
      construction_id: 0,
      cc_id: null,
      bt_id: null,
    },
    rules: {
      construction_nameRules: [
        (value) => {
          if (value) return true;
          return 'Construction Name is required.';
        },
      ],
      cc_idRules: [
        (value) => {
          if (value) return true;
          return 'Construction Category is required.';
        },
      ],
      bt_idRules: [
        (value) => {
          if (value) return true;
          return 'Building Type is required.';
        },
      ],
    },
    search: '',
    items: [],
    resource: {
      construction_master: [],
      agents: [],
      countries: [],
      cities: [],
      towns: [],
    },
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  async mounted() {
    await this.getConstructionCategoryData();
    await this.getBuildingTypeData();
    await this.getCountryData();
    await this.getCityData();
    await this.getTownData();
    await this.getAgentsData();
    await this.getConstructionMasterData();
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.items;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.items.filter((item) =>
        item.construction_name.toLowerCase().includes(searchTextLower)
      );
    },
  },
  methods: {
    editConstructionMaster(item) {
      this.isEdit = true;
      this.input = {
        construction_id: item.construction_id,
        construction_name: item.construction_name,
        cc_id: item.construction_category.cc_id,
        bt_id: item.building_type.bt_id,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        construction_id: 0,
        construction_name: null,
        cc_id: null,
        bt_id: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          construction_id: this.input.construction_id,
          construction_name: this.input.construction_name,
          cc_id: this.input.cc_id,
          bt_id: this.input.bt_id,
        };
        axios
          .post(`/4walls-construction-masters/update`, payload)
          .then((response) => {
            const data = response.data;
            this.notification.success(data.message);
            this.getConstructionMasterData();
            this.input = {
              construction_id: 0,
              construction_name: null,
              cc_id: null,
              bt_id: null,
            };
          })
          .catch((error) => {
            console.log(error);
            const message = error.response.data.construction_name
              ? 'Please fill the construction name field'
              : error.response.data.message;
            this.notification.error(message);
          })
          .finally(() => {
            this.isSending = false;
          });
      }
    },
    saveData() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          construction_id: this.input.construction_id,
          construction_name: this.input.construction_name,
          cc_id: this.input.cc_id,
          bt_id: this.input.bt_id,
        };
        axios
          .post(`/4walls-construction-masters`, payload)
          .then((response) => {
            const data = response.data;
            this.notification.success(data.message);
            this.getConstructionMasterData();
            this.input = {
              construction_id: 0,
              construction_name: null,
              cc_id: null,
              bt_id: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.construction_name
              ? error.response.data.construction_name[0]
              : 'Something Wrong!!!';
            this.notification.error(message);
          })
          .finally(() => {
            this.isSending = false;
          });
      }
    },
    cancelDelete() {
      this.idConstructionCategory = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.idConstructionCategory = itemId;
      this.isDelete = true;
    },
    cancelConfirmation() {
      this.idConstructionCategory = null;
      this.isDelete = false;
    },
    deleteConstructionMaster() {
      this.isDeleteLoading = true;
      axios
        .delete(`/4walls-construction-masters/${this.idConstructionCategory}`)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getConstructionMasterData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === '' ? 'Something Wrong!!!' : error.response.data.message;
          this.notification.error(message);
        })
        .finally(() => {
          this.isDeleteLoading = false;
          this.idConstructionMaster = null;
          this.isDelete = false;
        });
    },
    async getConstructionMasterData() {
      this.isLoading = true;
      try {
        const response = await axios.get(`/4walls-construction-masters`);
        const data = response.data.data;
        console.log(data);
        this.items = data.map((item) => {
          let city_id = this.resource.cities
            .filter((city) => city.country_id === item.country_id)
            .filter((city) => city.city_id === item.city_id)[0]?.city_id;
          let town_id = null;
          if (city_id !== null) {
            town_id = this.resource.towns
              .filter((town) => town.city_id === city_id)
              .filter((town) => town.town_id === item.town_id)[0]?.town_id;
          }
          return {
            construction_id: item.construction_id || 1,
            bt_id: item.bt_id || null,
            cc_id: item.cc_id || null,
            main_image: item.main_image || null,
            long_image: item.long_image || null,
            construction_name: item.construction_name || '',
            construction_category: item.construction_category || null,
            building_type: item.building_type || null,
            user: item.user.name || '',
            dated: item.dated || '',
            year_built: item.year_built || '',
            country_id: item.country_id || null,
            city_id: city_id || null,
            town_id: town_id || null,
            latitude: item.latitude || null,
            longitude: item.longitude || null,
            agent_id: item.agent_id || null,
            pa_id: item.agent_id || null,
            isUnderConstruction:
              item.under_construction == 'N' ? false : item.under_construction == 'Y' ? true : null,
            isMoveIn: item.move_in == 'N' ? false : item.move_in == 'Y' ? true : null,
            completion_month: item.completion_month || '',
            completion_year: item.completion_year || '',
          };
        });
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
        const message =
          error.response.data.message === '' ? 'Something Wrong!!!' : error.response.data.message;
        this.notification.error(message);
      } finally {
        this.isLoading = false;
      }
    },
    getConstructionCategoryData() {
      axios
        .get(`/4walls-construction-categories/list`)
        .then((response) => {
          const data = response.data.data;
          if (data) {
            this.constructionCategory = data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getBuildingTypeData() {
      axios
        .get(`/4walls-building-types/list`)
        .then((response) => {
          const data = response.data.data;
          if (data) {
            this.buildingType = data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getCountryData() {
      try {
        const response = await axios.get(`/countries`);
        const data = response.data.data;
        if (data) {
          this.resource.countries = data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getCityData() {
      try {
        const response = await axios.get(`/cities`);
        const data = response.data.data;
        if (data) {
          this.resource.cities = data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getTownData() {
      try {
        const response = await axios.get(`/towns`);
        const data = response.data.data;
        if (data) {
          this.resource.towns = data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    getAgentsData() {
      axios.get(`/4walls-agent-masters`).then((response) => {
        this.resource.agents = response.data.data;
      });
    },
    saveAgent(agent_id, item) {
      this.isSending2 = true;
      axios
        .post(`/4walls-construction-masters/update`, {
          construction_id: item.construction_id,
          construction_name: item.construction_name,
          country_id: item.country_id,
          bt_id: item.bt_id,
          cc_id: item.cc_id,
          agent_id: agent_id,
        })
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getConstructionMasterData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === '' ? 'Something Wrong!!!' : error.response.data.message;
          this.notification.error(message);
        })
        .finally(() => {
          this.isSending2 = false;
        });
    },
    filterCity(country_id) {
      return this.resource.cities.filter((item) => item.country_id === country_id);
    },
    filterTown(city_id) {
      return this.resource.towns.filter((item) => item.city_id === city_id);
    },
    saveCountry(country_id, index, bt_id, cc_id, construction_name) {
      this.items[index].city_id = null;
      this.items[index].town_id = null;
      const payload = {
        construction_id: this.items[index].construction_id,
        country_id: country_id,
        bt_id: bt_id,
        cc_id: cc_id,
        construction_name: construction_name,
      };
      axios
        .post(`/4walls-construction-masters/update`, payload)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    saveCity(city_id, index, bt_id, cc_id, construction_name) {
      this.items[index].town_id = null;
      const payload = {
        construction_id: this.items[index].construction_id,
        city_id: city_id,
        bt_id: bt_id,
        cc_id: cc_id,
        construction_name: construction_name,
      };
      axios
        .post(`/4walls-construction-masters/update`, payload)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    saveTown(town_id, index, bt_id, cc_id, construction_name) {
      const payload = {
        construction_id: this.items[index].construction_id,
        town_id: town_id,
        bt_id: bt_id,
        cc_id: cc_id,
        construction_name: construction_name,
      };
      axios
        .post(`/4walls-construction-masters/update`, payload)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    saveLatitude(latitude, index, bt_id, cc_id, construction_name) {
      this.items[index].latitude = latitude;
      const payload = {
        construction_id: this.items[index].construction_id,
        latitude: latitude,
        bt_id: bt_id,
        cc_id: cc_id,
        construction_name: construction_name,
      };
      axios
        .post(`/4walls-construction-masters/update`, payload)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    saveLongitude(longitude, index, bt_id, cc_id, construction_name) {
      this.items[index].longitude = longitude;
      const payload = {
        construction_id: this.items[index].construction_id,
        longitude: longitude,
        bt_id: bt_id,
        cc_id: cc_id,
        construction_name: construction_name,
      };
      axios
        .post(`/4walls-construction-masters/update`, payload)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    underConstructionConstructionMaster(id) {
      this.isSending2 = true;
      axios
        .get(`/4walls-construction-masters/toggle-under-construction/${id}`)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getConstructionMasterData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === '' ? 'Something Wrong!!!' : error.response.data.message;
          this.notification.error(message);
        })
        .finally(() => {
          this.isSending2 = false;
        });
    },
    moveInConstructionMaster(id) {
      this.isSending2 = true;
      axios
        .get(`/4walls-construction-masters/toggle-move-in/${id}`)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getConstructionMasterData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === '' ? 'Something Wrong!!!' : error.response.data.message;
          this.notification.error(message);
        })
        .finally(() => {
          this.isSending2 = false;
        });
    },
    openMainImage(prop) {
      this.isOpenMainImage = true;
      this.propertyDataToMainImage = {
        construction_id: prop.construction_id,
        main_image: prop.main_image,
        cc_id: prop.construction_category.cc_id,
        bt_id: prop.building_type.bt_id,
        construction_name: prop.construction_name,
      };
      this.imageFile =
        prop.main_image != null
          ? [
              {
                file: {
                  name: prop.main_image,
                  size: '',
                  base64: '',
                  format: '',
                },
              },
            ]
          : [];
    },
    closeMainImage() {
      this.isOpenMainImage = false;
      this.imageFile = [];
      this.propertyDataToMainImage = {
        construction_id: 1,
        main_image: null,
        cc_id: null,
        bt_id: null,
        construction_name: null,
      };
    },
    saveYearBuilt(construction_id, year_built, cc_id, bt_id, construction_name) {
      this.isSending = true;
      const payload = {
        construction_id: construction_id,
        year_built: year_built,
        cc_id: cc_id,
        bt_id: bt_id,
        construction_name: construction_name,
      };
      axios
        .post(`/4walls-construction-masters/update`, payload)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getConstructionMasterData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === '' ? 'Something Wrong!!!' : error.response.data.message;
          this.notification.error(message);
        })
        .finally(() => {
          this.isSending = false;
        });
    },
    saveMainImage() {
      this.isSending = true;
      const payload = {
        construction_id: this.propertyDataToMainImage.construction_id,
        main_image: this.imageFile[0],
        cc_id: this.propertyDataToMainImage.cc_id,
        bt_id: this.propertyDataToMainImage.bt_id,
        construction_name: this.propertyDataToMainImage.construction_name,
      };

      axios
        .post(`/4walls-construction-masters/update`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getConstructionMasterData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === '' ? 'Something Wrong!!!' : error.response.data.message;
          this.notification.error(message);
        })
        .finally(() => {
          this.isEdit = false;
          this.isSending = false;
          this.propertyDataToMainImage = {
            construction_id: 1,
            main_image: null,
            cc_id: null,
            bt_id: null,
            construction_name: null,
          };
          this.isOpenMainImage = false;
          this.imageFile = [];
        });
    },
    updateMainImageFile(newImageFile) {
      this.imageFile.push(newImageFile);
    },
    deleteMainImageFile() {
      this.isSending = true;
      axios
        .delete(
          `/4walls-construction-masters/${this.propertyDataToMainImage.construction_id}/main_image`
        )
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getConstructionMasterData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === '' ? 'Something Wrong!!!' : error.response.data.message;
          this.notification.error(message);
        })
        .finally(() => {
          this.isEdit = false;
          this.isSending = false;
          // this.propertyDataToImage = {
          //   app_id: 1,
          //   app_group_id: 1,
          //   app_name: '',
          //   app_description: '',
          //   app_detail: '',
          // };
          this.imageFile = [];
        });
    },
    openLongImage(prop) {
      this.isOpenLongImage = true;
      this.propertyDataToLongImage = {
        construction_id: prop.construction_id,
        long_image: prop.long_image,
        cc_id: prop.construction_category.cc_id,
        bt_id: prop.building_type.bt_id,
        construction_name: prop.construction_name,
      };
      this.imageFile =
        prop.long_image != null
          ? [
              {
                file: {
                  name: prop.long_image,
                  size: '',
                  base64: '',
                  format: '',
                },
              },
            ]
          : [];
    },
    closeLongImage() {
      this.isOpenLongImage = false;
      this.imageFile = [];
      this.propertyDataToLongImage = {
        construction_id: 1,
        long_image: null,
        cc_id: null,
        bt_id: null,
        construction_name: null,
      };
    },
    saveLongImage() {
      this.isSending = true;
      const payload = {
        construction_id: this.propertyDataToLongImage.construction_id,
        long_image: this.imageFile[0],
        cc_id: this.propertyDataToLongImage.cc_id,
        bt_id: this.propertyDataToLongImage.bt_id,
        construction_name: this.propertyDataToLongImage.construction_name,
      };

      axios
        .post(`/4walls-construction-masters/update`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getConstructionMasterData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === '' ? 'Something Wrong!!!' : error.response.data.message;
          this.notification.error(message);
        })
        .finally(() => {
          this.isEdit = false;
          this.isSending = false;
          this.propertyDataToLongImage = {
            construction_id: 1,
            long_image: null,
            cc_id: null,
            bt_id: null,
            construction_name: null,
          };
          this.isOpenLongImage = false;
          this.imageFile = [];
        });
    },
    updateLongImageFile(newImageFile) {
      this.imageFile.push(newImageFile);
    },
    deleteLongImageFile() {
      this.isSending = true;
      axios
        .delete(
          `/4walls-construction-masters/${this.propertyDataToLongImage.construction_id}/long_image`
        )
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getConstructionMasterData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === '' ? 'Something Wrong!!!' : error.response.data.message;
          this.notification.error(message);
        })
        .finally(() => {
          this.isEdit = false;
          this.isSending = false;
          // this.propertyDataToImage = {
          //   app_id: 1,
          //   app_group_id: 1,
          //   app_name: '',
          //   app_description: '',
          //   app_detail: '',
          // };
          this.imageFile = [];
        });
    },
    saveCompletionMonth(completion_month, item) {
      this.isSending2 = true;
      axios
        .post(`/4walls-construction-masters/update`, {
          construction_id: item.construction_id,
          cc_id: item.construction_category.cc_id,
          bt_id: item.building_type.bt_id,
          construction_name: item.construction_name,
          completion_month: completion_month,
        })
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getConstructionMasterData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === '' ? 'Something Wrong!!!' : error.response.data.message;
          this.notification.error(message);
        })
        .finally(() => {
          this.isSending2 = false;
        });
    },
    saveCompletionYear(completion_year, item) {
      this.isSending2 = true;
      axios
        .post(`/4walls-construction-masters/update`, {
          construction_id: item.construction_id,
          cc_id: item.construction_category.cc_id,
          bt_id: item.building_type.bt_id,
          construction_name: item.construction_name,
          completion_year: completion_year,
        })
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getConstructionMasterData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === '' ? 'Something Wrong!!!' : error.response.data.message;
          this.notification.error(message);
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
