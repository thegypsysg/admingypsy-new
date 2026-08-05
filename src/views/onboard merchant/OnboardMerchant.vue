<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <h1>Onboard Merchant</h1>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-autocomplete
              density="compact"
              label="Partner Name"
              placeholder="Select Partner Name"
              :items="resource.partners"
              item-title="name"
              item-value="id"
              v-model="input.partner"
              @update:modelValue="getLocationContact"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              density="compact"
              label="---App Id---"
              placeholder="Type App Id"
              :items="resource.app"
              item-title="name"
              item-value="id"
              v-model="input.app"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row class="mt-n4">
          <v-col cols="12" md="4">
            <v-autocomplete
              density="compact"
              label="---Select Location---"
              placeholder="Type Location"
              :items="resource.location"
              item-title="name"
              item-value="id"
              v-model="input.location"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              density="compact"
              label="===Select Contact==="
              placeholder="Type Contact"
              :items="resource.contacts"
              item-title="name"
              item-value="id"
              v-model="input.contact"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row class="mt-n4">
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
          <v-col v-if="isEdit" cols="12" md="2">
            <v-btn
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
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-table class="country-table">
            <thead>
              <tr>
                <th class="text-left text-no-wrap">OM ID</th>
                <th class="text-left text-no-wrap">Partner Name</th>
                <th class="text-left text-no-wrap">App Id</th>
                <th class="text-left text-no-wrap">City</th>
                <th class="text-left text-no-wrap">Town</th>
                <th class="text-left text-no-wrap">Email Id</th>
                <th class="text-left text-no-wrap">Contact Person</th>
                <th class="text-left text-no-wrap">Contact Number</th>
                <th class="text-left text-no-wrap">User</th>
                <th class="text-left text-no-wrap">Dated</th>
                <th class="text-left text-no-wrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in filteredItems" :key="item.id">
                <tr class="country-table-body">
                  <td>{{ item.id }}</td>
                  <td>
                    {{ item?.partner?.partner_name || '-' }}
                  </td>
                  <td>
                    {{ item?.app?.app_name || '-' }}
                  </td>
                  <td>
                    {{ item?.partner_location?.city?.city_name || '-' }}
                  </td>
                  <td>
                    {{ item?.partner_location?.town?.town_name || '-' }}
                  </td>
                  <td>
                    {{ item?.partner_contact?.email || '-' }}
                  </td>
                  <td>
                    {{ item?.partner_contact?.name || '-' }}
                  </td>
                  <td>
                    {{ item?.partner_contact?.telephone || '-' }}
                  </td>
                  <td>
                    {{ item?.user?.name || '-' }}
                  </td>

                  <td>
                    {{ item.dated }}
                  </td>

                  <td>
                    <div class="d-flex">
                      <v-btn
                            color="green"
                            variant="text" @click="editOnboard(item)"
                            icon="mdi-pencil-outline"
                          >  <v-tooltip location="top" activator="parent">Edit</v-tooltip>
</v-btn>
                      <v-btn
                            color="red" variant="text"
                            :disabled="isDeleteLoading"
                            @click="openDeleteConfirm(item.id)"
                            icon="mdi-trash-can-outline"
                          >  <v-tooltip location="top" activator="parent">Delete</v-tooltip>
</v-btn>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td class="not-border" colspan="8">
                    <div class="d-flex justify-start" style="gap: 20px">
                      <v-table class="text-left font-weight-bold">
                        <tr>
                          <td style="width: 50px"></td>

                          <td class="pr-10 pt-2 pb-4">
                            <span class="text-blue-darken-3">
                              {{ item?.partner_location?.unit_number || '-' }}
                            </span>
                          </td>
                          <td
                            v-if="item?.partner_contact?.whatsapp"
                            class="pr-10 pt-2 pb-4"
                          >
                            <a
                              :href="
                                item?.partner_contact?.whatsapp
                                  ? `https://api.whatsapp.com/send?phone=${item?.partner_contact?.whatsapp}&text=Hello`
                                  : ''
                              "
                              class="text-decoration-none text-blue-darken-3 text-no-wrap"
                            >
                              {{ item?.partner_contact?.whatsapp
                              }}<v-icon
                                color="#4EC053"
                                size="20"
                                class="ml-2 fab fa-whatsapp"
                              ></v-icon>
                            </a>
                          </td>
                        </tr>
                      </v-table>
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
        <v-card-text>
          Are you sure want to delete this onboard merchant?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelDelete">No</v-btn>
          <v-btn color="success" text @click="deleteOnboard">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from '@/util/axios';
import { setAuthHeader } from '@/util/axios';

export default {
  name: 'OnboardMerchant',
  data: () => ({
    valid: false,
    isLoading: false,
    isSending: false,
    isEdit: false,
    isSuccess: false,
    isError: false,
    isDelete: false,
    isDeleteLoading: false,
    onboardIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    successMessage: '',
    errorMessage: '',
    input: {
      id: 0,
      partner: null,
      location: null,
      app: null,
      contact: null,
    },
    resource: {
      partners: [],
      app: [],
      location: [],
      contacts: [],
    },
    search: '',
    items: [],
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.getOnboardData();
    this.getPartnerData();
    this.getAppActive();
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.items;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.items.filter(
        (item) =>
          item?.partner?.partner_name.toLowerCase().includes(searchTextLower) ||
          item?.partner_contact?.email
            .toLowerCase()
            .includes(searchTextLower) ||
          item?.partner_contact?.whatsapp
            .toLowerCase()
            .includes(searchTextLower)
      );
    },
  },
  methods: {
    editOnboard(onboard) {
      this.isEdit = true;
      this.input = {
        id: onboard.id,
        partner: onboard.partner.partner_id,
        location: onboard.partner_location.pl_id,
        app: onboard.app.app_id,
        contact: onboard.partner_contact.partner_contact_id,
      };

      this.getLocationData();
      this.getPartnerContactData();
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        id: 0,
        partner: null,
        location: null,
        app: null,
        contact: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          om_id: this.input.id,
          partner_id: this.input.partner,
          pl_id: this.input.location,
          partner_contact_id: this.input.contact,
          app_id: this.input.app,
        };
        axios
          .post(`/onboard-merchants/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getOnboardData();
            this.input = {
              id: 0,
              partner: null,
              location: null,
              app: null,
              contact: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.partner_id
              ? error.response.data.partner_id[0]
              : error.response.data.app_id
              ? error.response.data.app_id[0]
              : error.response.data.pl_id
              ? error.response.data.pl_id[0]
              : error.response.data.partner_contact_id
              ? error.response.data.partner_contact_id[0]
              : error.response.data.message
              ? error.response.data.message
              : 'Something Wrong!!!';
            this.errorMessage = message;
            this.isError = true;
            this.input = {
              id: 0,
              partner: null,
              location: null,
              app: null,
              contact: null,
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
          partner_id: this.input.partner,
          pl_id: this.input.location,
          partner_contact_id: this.input.contact,
          app_id: this.input.app,
        };
        axios
          .post(`/onboard-merchants`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getOnboardData();
            this.input = {
              id: 0,
              partner: null,
              location: null,
              app: null,
              contact: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.partner_id
              ? error.response.data.partner_id[0]
              : error.response.data.app_id
              ? error.response.data.app_id[0]
              : error.response.data.pl_id
              ? error.response.data.pl_id[0]
              : error.response.data.partner_contact_id
              ? error.response.data.partner_contact_id[0]
              : error.response.data.message
              ? error.response.data.message
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
      this.onboardIdToDelete = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.onboardIdToDelete = itemId;
      this.isDelete = true;
    },
    cancelConfirmation() {
      this.onboardIdToDelete = null;
      this.isDelete = false;
    },
    deleteOnboard() {
      this.isDeleteLoading = true;
      axios
        .delete(`/onboard-merchants/${this.onboardIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getOnboardData();
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
          this.onboardIdToDelete = null;
          this.isDelete = false;
        });
    },
    getOnboardData() {
      this.isLoading = true;
      axios
        .get(`/onboard-merchants`)
        .then((response) => {
          const data = response.data.data;
          this.items = data
            .sort((a, b) => b.om_id - a.om_id)
            .map((item) => {
              return {
                ...item,
                id: item.om_id || 1,
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
      this.isLoading = true;
      axios
        .get(`/partners`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.resource.partners = data.map((item) => {
            return {
              id: item.partner_id || 1,
              name: item.partner_name || '',
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
    getLocationContact() {
      this.input.location = null;
      this.input.contact = null;
      this.getLocationData();
      this.getPartnerContactData();
    },
    getLocationData() {
      // this.isLoading = true;
      axios
        .get(`/partner-locations/${this.input.partner}`)
        .then((response) => {
          const data = response.data.data;
          this.resource.location = data
            .sort((a, b) => a.pl_id < b.pl_id)
            .map((item) => {
              return {
                id: item.pl_id || 1,
                name:
                  item.unit_number && item.town.town_name
                    ? `${item.unit_number} - ${item.town.town_name}`
                    : item.town.town_name
                    ? `${item.town.town_name}`
                    : '',
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
      // .finally(() => {
      //   this.isLoading = false;
      // });
    },
    getPartnerContactData() {
      // this.isLoading = true;
      axios
        .get(`/partner-contacts/${this.input.partner}`)
        .then((response) => {
          const data = response.data.data;
          //console.log(data);
          this.resource.contacts = data
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((item) => {
              return {
                id: item.partner_contact_id || 1,
                name: item.name || '',
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
      // .finally(() => {
      //   this.isLoading = false;
      // });
    },
    getAppActive() {
      axios
        .get(`/app/active`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.resource.app = data
            .sort((a, b) => a.app_id < b.app_id)
            .map((app) => {
              return {
                id: app.app_id || 0,
                name: app.app_name || '',
              };
            });
          // console.log(this.items);
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
  border-bottom: 1px solid rgb(188, 188, 188) !important;
}

.not-border {
  border-bottom: none !important;
}
</style>
