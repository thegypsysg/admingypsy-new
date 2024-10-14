<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <div class="d-flex ml-4 mb-4" style="gap: 30px">
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/property_developers"
        >
          <h4>On Board Property Developers</h4>
        </router-link>
        <!-- <router-link
          active-class="text-purple-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/mall-country"
        >
          <h4 class="mt-4">Country / City</h4>
        </router-link> -->
      </div>
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/property_developments"
        >
          <h4>New Projects</h4>
        </router-link>
      </div>
      <div>
        <router-link
          active-class="text-blue-accent-4"
          class="text-decoration-none"
          to=""
        >
          <h4>On-Board Agents</h4>
        </router-link>

        <!-- <router-link
          active-class="text-purple-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/manage_events"
        >
          <h4 class="mt-4">Manage Events</h4>
        </router-link> -->
      </div>

      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to=""
        >
          <h4>Manage Tenants</h4>
        </router-link>

        <!-- <router-link
          active-class="text-red-darken-4"
          style="color: black"
          class="text-decoration-none"
          to="/manage_levels"
        >
          <h4 class="mt-4">Manage Levels</h4>
        </router-link> -->
      </div>
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to=""
        >
          <h4>Country/City</h4>
        </router-link>

        <!-- <router-link
          active-class="text-blue-darken-4"
          style="color: black"
          class="text-decoration-none"
          to="/manage_services"
        >
          <h4 class="mt-4">Manage Services</h4>
        </router-link> -->
      </div>
    </div>
    <div class="d-flex ml-4 mb-4" style="gap: 30px">
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/property_types"
        >
          <h4>Property Types</h4>
        </router-link>
        
      </div>
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/main_categories"
        >
          <h4>Main Categories</h4>
        </router-link>
      </div>
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/construction_category"
        >
          <h4>Construction Category</h4>
        </router-link>
      </div>
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/construction_master"
        >
          <h4>Construction Master</h4>
        </router-link>
      </div>
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/building_type"
        >
          <h4>Building Type</h4>
        </router-link>
      </div>
    </div>
    <div class="d-flex ml-4 mb-4" style="gap: 30px">
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/facilities"
        >
          <h4>Facilities</h4>
        </router-link>
        
      </div>
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/property_master"
        >
          <h4>On-Board Property</h4>
        </router-link>
        
      </div>
    </div>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              class="mt-8"
              v-model="input.agent_name"
              label="Agent Name"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              class="mt-8"
              v-model="input.property_agency"
              item-title="partner_name"
              item-value="partner_id"
              label="Property Agency"
              variant="outlined"
              density="compact"
              required
              :items="partner"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              class="mt-8"
              v-model="input.registration_number"
              label="Registration #"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              class="mt-8"
              v-model="input.country_id"
              item-title="country_name"
              item-value="country_id"
              label="Country"
              variant="outlined"
              density="compact"
              required
              :items="country"
            ></v-select>
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
                <th class="text-left font-weight-bold text-black">id</th>
                <th class="text-left font-weight-bold text-black">Image</th>
                <th class="text-left font-weight-bold text-black">Agent Name</th>
                <th class="text-left font-weight-bold text-black">Registration #</th>
                <th class="text-left font-weight-bold text-black">Property Agent Name</th>
                <th class="text-left font-weight-bold text-black">Country</th>
                <th class="text-left font-weight-bold text-black">User</th>
                <th class="text-left font-weight-bold text-black">Dated</th>
                <th class="text-left font-weight-bold text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in filteredItems" :key="item.id">
                <tr class="country-table-body">
                  <td>{{ item.pa_id }}</td>
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
                        <template #placeholder>
                          <div class="skeleton" /> </template
                      ></v-img>
                    </div>
                  </td>
                    <td>{{ item.agent_name }}</td>
                  <td>
                    {{ item.registration_number }}
                  </td>
                  <td>
                    {{ item?.partner?.partner_name }}
                  </td>
                  <td>
                    {{ item?.country?.country_name }}
                  </td>
                  <td>
                    {{ item?.user?.name }}
                  </td>
                  <td>
                    {{ item.dated }}
                  </td>
                  <td>
                    <div class="d-flex">
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            color="green"
                            variant="text"
                            v-bind="props"
                            @click="editAgentMaster(item)"
                            icon="mdi-pencil-outline"
                          ></v-btn>
                        </template>
                        <span>Edit</span>
                      </v-tooltip>
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            color="red"
                            v-bind="props"
                            variant="text"
                            :disabled="isDeleteLoading"
                            @click="openDeleteConfirm(item.pa_id)"
                            icon="mdi-trash-can-outline"
                          ></v-btn>
                        </template>
                        <span>Delete</span>
                      </v-tooltip>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td>
                    <div class="d-flex align-center">
                      Active 
                      <v-btn-toggle
                        style="
                          font-size: 10px !important;
                          font-weight: 200 !important;
                          height: 22px !important;
                          width: 54px !important;
                          margin-left: 10px;
                        "
                        class="d-flex align-center"
                        v-model="item.isActive"
                        rounded="5"
                        @click="activeAgentMaster(item.pa_id)"
                      >
                        <v-btn size="27" :value="true"> Yes </v-btn>

                        <v-btn size="27" :value="false"> No </v-btn>
                      </v-btn-toggle>
                    </div>
                  </td>
                  <td>
                    <div class="d-flex align-center">
                      Featured 
                      <v-btn-toggle
                        style="
                          font-size: 10px !important;
                          font-weight: 200 !important;
                          height: 22px !important;
                          width: 54px !important;
                          margin-left: 10px;
                        "
                        class="d-flex align-center"
                        v-model="item.isFeatured"
                        rounded="5"
                        @click="featuredAgentMaster(item.pa_id)"
                      >
                        <v-btn size="27" :value="true"> Yes </v-btn>

                        <v-btn size="27" :value="false"> No </v-btn>
                      </v-btn-toggle>
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
        <v-card-text> Are you sure want to delete this agent master? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelDelete">No</v-btn>
          <v-btn color="success" text @click="deleteAgentMaster">{{
            isDeleteLoading ? 'Deleting...' : 'Yes'
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent width="auto" v-model="isOpenMainImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4">
          Upload Image - Agent Master</v-card-title
        >
        <v-card-text>
          <image-upload
            :image-file="mainImageFile"
            @update-image-file="updateMainImageFile"
            @delete-image-file="deleteMainImageFile"
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
            @click="saveMainImage()"
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
// import app from '@/util/eventBus';

export default {
  name: 'AgentMaster',
  data: () => ({
    // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    idAgentMaster: null,
    valid: false,
    isLoading: false,
    isSending: false,
    isSending2: false,
    isError: false,
    isEdit: false,
    isSuccess: false,
    isDelete: false,
    isDeleteLoading: false,
    locationIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'main_image' }],
    isOpenMainImage: false,
    successMessage: '',
    errorMessage: '',
    mainImageFile: [],
    partner: [],
    country: [],
    propertyDataToMainImage: {
      pa_id: null,
      agent_name: null,
      registration_number: null,
      country_id: null,
      property_agency: null,
      main_image: null,
    },
    input: {
      pa_id: null,
      agent_name: null,
      registration_number: null,
      country_id: null,
      property_agency: null,
    },
    rules: {
      agent_nameRules: [
        (value) => {
          if (value) return true;
          return 'Agent Name is required.';
        },
      ],
    },
    search: '',
    items: [],
    resource: {
      agent_master: [],
    },
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.idAgentMaster = this.$route.params.id;
    this.getAgentMasterData();
    this.getPartnerData();
    this.getCountryData();
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.items;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.items.filter(
        (item) =>
          item.agent_name.toLowerCase().includes(searchTextLower) 
      );
    },
  },
  methods: {
    editAgentMaster(item) {
      this.isEdit = true;
      this.input = {
        pa_id: item.pa_id,
        agent_name: item.agent_name,
        registration_number: item.registration_number,
        country_id: item?.country?.country_id,
        property_agency: item?.partner?.partner_id,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        pa_id: null,
        agent_name: null,
        registration_number: null,
        country_id: null,
        property_agency: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          pa_id: this.input.pa_id,
          agent_name: this.input.agent_name,
          registration_number: this.input.registration_number,
          country_id: this.input.country_id,
          property_agency: this.input.property_agency,
        };
        axios
          .post(`/4walls-agent-masters/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getAgentMasterData();
            this.input = {
              pa_id: 0,
              agent_name: null,
              registration_number: null,
              country_id: null,
              property_agency: null,
            };
          })
          .catch((error) => {
            console.log(error);
            const message = error.response.data.agent_name
              ? 'Please fill the agent name field'
              : error.response.data.message;
            this.errorMessage = message;
            this.isError = true;
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
          agent_name: this.input.agent_name,
          registration_number: this.input.registration_number,
          country_id: this.input.country_id,
          property_agency: this.input.property_agency,
        };
        axios
          .post(`/4walls-agent-masters`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getAgentMasterData();
            this.input = {
              pa_id: 0,
              agent_name: null,
              registration_number: null,
              country_id: null,
              property_agency: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.agent_name
              ? error.response.data.agent_name[0]
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
      this.idAgentMaster = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.idAgentMaster = itemId;
      this.isDelete = true;
    },
    cancelConfirmation() {
      this.idAgentMaster = null;
      this.isDelete = false;
    },
    deleteAgentMaster() {
      this.isDeleteLoading = true;
      axios
        .delete(`/4walls-agent-masters/${this.idAgentMaster}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getAgentMasterData();
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
          this.idAgentMaster = null;
          this.isDelete = false;
        });
    },

    getAgentMasterData() {
      this.isLoading = true;
      axios
        .get(`/4walls-agent-masters`)
        .then((response) => {
          this.items = response.data.data.map((item) => {
            return {
              ...item,
              isActive:
                item.active == 'N' ? false : item.active == 'Y' ? true : null,
              isFeatured:
                item.featured == 'N' ? false : item.featured == 'Y' ? true : null,

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
    getPartnerData() {
      axios
        .get(`/partners`)
        .then((response) => {
          this.partner = response.data.data;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        });
    },
    getCountryData() {
      axios
        .get(`/countries`)
        .then((response) => {
          this.country = response.data.data;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        });
    },
    openMainImage(item) {
      this.isOpenMainImage = true;
      this.propertyDataToMainImage = {
        pa_id: item.pa_id,
        agent_name: item.agent_name,
        registration_number: item.registration_number,
        country_id: item.country_id,
        property_agency: item.property_agency,
        main_image: item.main_image,
      };
      this.mainImageFile =
        item.main_image != null
          ? [
              {
                file: {
                  name: item.main_image,
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
      this.mainImageFile = [];
      this.propertyDataToMainImage = {
        pa_id: null,
        agent_name: null,
        registration_number: null,
        country_id: null,
        property_agency: null,
        main_image: null,
      };
    },
    saveMainImage() {
      this.isSending = true;
      const payload = {
        pa_id: this.propertyDataToMainImage.pa_id,
        agent_name: this.propertyDataToMainImage.agent_name,
        registration_number: this.propertyDataToMainImage.registration_number,
        country_id: this.propertyDataToMainImage.country_id,
        property_agency: this.propertyDataToMainImage.property_agency,
        main_image: this.mainImageFile[0],
      };

      axios
        .post(`/4walls-agent-masters/update`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getAgentMasterData();
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
          this.isEdit = false;
          this.isSending = false;
          this.propertyDataToMainImage = {
            pa_id: null,
            agent_name: null,
            registration_number: null,
            country_id: null,
            property_agency: null,
            image: null,
          };
          this.isOpenMainImage = false;
          this.mainImageFile = [];
        });
    },
    updateMainImageFile(newImageFile) {
      this.mainImageFile.push(newImageFile);
    },
    deleteMainImageFile() {
      this.isSending = true;
      axios
        .delete(
          `/4walls-agent-masters/${this.propertyDataToMainImage.pa_id}/main_image`
        )
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getAgentMasterData();
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
          this.isEdit = false;
          this.isSending = false;
          // this.propertyDataToMainImage = {
          //   pa_id: null,
          //   agent_name: null,
          //   registration_number: null,
          //   country_id: null,
          //   property_agency: null,
          //   image: null,
          // };
          this.mainImageFile = [];
        });
    },
    activeAgentMaster(id) {
      this.isSending2 = true;
      axios
        .get(`/4walls-agent-masters/toggle-active/${id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getAgentMasterData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        .finally(() => {
          this.isSending2 = false;
        });
    },  
    featuredAgentMaster(id) {
      this.isSending2 = true;
      axios
        .get(`/4walls-agent-masters/toggle-featured/${id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPropertyMasterData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        .finally(() => {
          this.isSending2 = false;
        });
    },
  },
  components: { ImageUpload },
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
