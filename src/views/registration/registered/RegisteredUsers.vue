<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <v-sheet class="py-6 px-4 mt-10" border rounded width="100%">
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            density="compact"
            v-model="search"
            label="Search Contact"
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
                <th class="text-left">Image</th>
                <th class="text-left">Gypsy Id</th>
                <th class="text-left">Full Name</th>
                <th class="text-left">Email</th>
                <th class="text-left">From Country</th>
                <th class="text-left">Mobile $</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in filteredItems" :key="item.id">
                <tr class="country-table-body">
                  <td>
                    <v-img
                      height="40"
                      width="65"
                      @click="openImage(item)"
                      style="cursor: pointer"
                      :src="
                        item.image != null
                          ? $fileURL + item.image
                          : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                      "
                      ><template #placeholder>
                        <div class="skeleton" /> </template
                    ></v-img>
                  </td>
                  <td>{{ item.id }}</td>
                  <td>
                    {{ item.name }}
                  </td>
                  <td>
                    {{ item.email }}
                  </td>
                  <td>
                    {{ item.country }}
                  </td>
                  <td>
                    {{ item.mobile }}
                  </td>

                  <td>
                    <div class="d-flex">
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            color="green"
                            variant="text"
                            v-bind="props"
                            @click="editPartner(item)"
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
                            @click="openDeleteConfirm(item.id)"
                            icon="mdi-trash-can-outline"
                          ></v-btn>
                        </template>
                        <span>Delete</span>
                      </v-tooltip>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td colspan="4">
                    <div class="d-flex justify-start">
                      <span
                        class="ml-2 mt-2 mr-16 text-blue-darken-4"
                        style="width: 50px"
                        >{{ item.gender }}</span
                      >
                      <v-table class="text-left">
                        <tr>
                          <th class="pt-2">Registered</th>
                          <th class="pt-2">Active</th>
                          <th class="pt-2">Block</th>
                          <th class="pt-2"></th>
                        </tr>
                        <tr>
                          <td class="pr-16">{{ item.registered }}</td>
                          <td class="pr-6 pt-2 pb-4">
                            <v-btn-toggle
                              style="
                                font-size: 10px !important;
                                font-weight: 200 !important;
                                height: 22px !important;
                                width: 54px !important;
                              "
                              class="d-flex align-center"
                              v-model="item.isActive"
                              rounded="5"
                              @click="activePartner(item.id)"
                            >
                              <v-btn size="27" :value="true"> Yes </v-btn>

                              <v-btn size="27" :value="false"> No </v-btn>
                            </v-btn-toggle>
                          </td>
                          <td class="pr-6 pt-2 pb-4">
                            <v-btn-toggle
                              style="
                                font-size: 10px !important;
                                font-weight: 200 !important;
                                height: 22px !important;
                                width: 54px !important;
                              "
                              class="d-flex align-center"
                              v-model="item.isBlock"
                              rounded="5"
                              @click="favoritePartner(item.id)"
                            >
                              <v-btn size="27" :value="true"> Yes </v-btn>

                              <v-btn size="27" :value="false"> No </v-btn>
                            </v-btn-toggle>
                          </td>
                          <td class="pr-6 pt-2 pb-4">
                            <div
                              class="d-flex justify-center"
                              style="gap: 20px"
                            >
                              <router-link
                                class="text-decoration-none"
                                :to="`registered_users/main-info/${item.id}`"
                              >
                                <span>Main Info</span>
                              </router-link>
                              <router-link
                                class="text-decoration-none"
                                :to="`registered_users/socials/${item.id}`"
                              >
                                <span>Socials</span>
                              </router-link>
                            </div>
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
        <v-card-text> Are you sure want to delete this users? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelDelete">No</v-btn>
          <v-btn color="success" text @click="deletePartner">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent width="auto" v-model="isOpenImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4">
          Upload Image - Partner</v-card-title
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

    <v-dialog persistent width="auto" v-model="isOpenLogo">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4">
          Upload Logo - Partner</v-card-title
        >
        <v-card-text>
          <image-upload
            :image-file="logoFile"
            @update-image-file="updateLogoFile"
            @delete-image-file="deleteLogoFile"
          />
        </v-card-text>
        <v-card-actions class="mt-16">
          <v-spacer></v-spacer>
          <v-btn
            style="text-transform: none"
            color="error"
            text
            @click="closeLogo"
            >Cancel</v-btn
          >
          <v-btn
            style="background-color: #9ddcff; text-transform: none"
            color="black"
            @click="saveLogo()"
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
import http from 'axios';
import { setAuthHeader } from '@/util/axios';
// import app from '@/util/eventBus';

export default {
  name: 'PartnerMaster',
  data: () => ({
    // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    valid: false,
    isLoading: false,
    isSending: false,
    isEdit: false,
    isSuccess: false,
    isError: false,
    isDelete: false,
    isDeleteLoading: false,
    partnerIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    imageFile: [],
    logoFile: [],
    partnerDataToImage: {
      id: 0,
      name: null,
      industry: null,
      subIndustry: null,
      country: null,
    },
    partnerDataToLogo: {
      id: 0,
      name: null,
      industry: null,
      subIndustry: null,
      country: null,
    },
    isOpenImage: false,
    isOpenLogo: false,
    successMessage: '',
    errorMessage: '',
    input: {
      id: 0,
      name: null,
      industry: null,
      subIndustry: null,
      country: null,
      logo: null,
      image: null,
    },
    resource: {
      name: [],
      industry: [],
      subIndustry: [],
      country: [],
    },
    rules: {
      nameRules: [
        (value) => {
          if (value) return true;
          return 'Employer name is required.';
        },
      ],
      industryRules: [
        (value) => {
          if (value) return true;
          return 'Industry is required.';
        },
      ],
      subIndustryRules: [
        (value) => {
          if (value) return true;
          return 'Sub Industry is required.';
        },
      ],
      countryRules: [
        (value) => {
          if (value) return true;
          return 'Country is required.';
        },
      ],
      cityRules: [
        (value) => {
          if (value) return true;
          return 'City is required.';
        },
      ],
      townRules: [
        (value) => {
          if (value) return true;
          return 'Town is required.';
        },
      ],
      zoneRules: [
        (value) => {
          if (value) return true;
          return 'Zone is required.';
        },
      ],
    },
    search: '',
    items: [],
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.getPartnerData();
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.items;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTextLower) ||
          item.country.toLowerCase().includes(searchTextLower) ||
          item.industry.toLowerCase().includes(searchTextLower) ||
          item.subIndustry.toLowerCase().includes(searchTextLower)
      );
    },
  },
  methods: {
    updateLogoFile(newImageFile) {
      this.logoFile.push(newImageFile);
    },
    updateImageFile(newImageFile) {
      this.imageFile.push(newImageFile);
    },
    deleteLogoFile() {
      this.isSending = true;
      axios
        .delete(`/partners/${this.partnerDataToLogo.id}/logo`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPartnerData();
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
          // this.partnerDataToLogo = {
          //   app_id: 1,
          //   app_group_id: 1,
          //   app_name: '',
          //   app_description: '',
          //   app_detail: '',
          // };
          this.logoFile = [];
        });
    },
    deleteImageFile() {
      this.isSending = true;
      axios
        .delete(`/partners/${this.partnerDataToImage.id}/main-image`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPartnerData();
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
          // this.partnerDataToImage = {
          //   app_id: 1,
          //   app_group_id: 1,
          //   app_name: '',
          //   app_description: '',
          //   app_detail: '',
          // };
          this.imageFile = [];
        });
    },
    openLogo(item) {
      this.isOpenLogo = true;
      this.partnerDataToLogo = {
        id: item.id,
        name: item.name,
        country: item.country_id,
        industry: item.industry_id,
        subIndustry: item.sub_industry_id,
      };
      this.logoFile =
        item.logo != null
          ? [
              {
                file: {
                  name: item.logo,
                  size: '',
                  base64: '',
                  format: '',
                },
              },
            ]
          : [];
    },
    openImage(item) {
      this.isOpenImage = true;
      this.partnerDataToImage = {
        id: item.id,
        name: item.name,
        country: item.country_id,
        industry: item.industry_id,
        subIndustry: item.sub_industry_id,
      };
      this.imageFile =
        item.image != null
          ? [
              {
                file: {
                  name: item.image,
                  size: '',
                  base64: '',
                  format: '',
                },
              },
            ]
          : [];
    },
    closeLogo() {
      this.isOpenLogo = false;
      this.logoFile = [];
      this.partnerDataToLogo = {
        id: 0,
        name: null,
        industry: null,
        subIndustry: null,
        country: null,
      };
    },
    closeImage() {
      this.isOpenImage = false;
      this.imageFile = [];
      this.partnerDataToImage = {
        id: 0,
        name: null,
        industry: null,
        subIndustry: null,
        country: null,
      };
    },
    saveLogo() {
      this.isSending = true;
      const payload = {
        partner_id: this.partnerDataToLogo.id,
        partner_name: this.partnerDataToLogo.name,
        country_id: this.partnerDataToLogo.country,
        sub_industry_id: this.partnerDataToLogo.subIndustry,
        industry_id: this.partnerDataToLogo.industry,
        logo: this.logoFile[0],
      };

      http
        .post(`/partners/update`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPartnerData();
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
          this.partnerDataToLogo = {
            id: 0,
            name: null,
            industry: null,
            subIndustry: null,
            country: null,
          };
          this.isOpenLogo = false;
          this.logoFile = [];
        });
    },
    saveImage() {
      this.isSending = true;
      const payload = {
        partner_id: this.partnerDataToImage.id,
        partner_name: this.partnerDataToImage.name,
        country_id: this.partnerDataToImage.country,
        sub_industry_id: this.partnerDataToImage.subIndustry,
        industry_id: this.partnerDataToImage.industry,
        main_image: this.imageFile[0],
      };

      http
        .post(`/partners/update`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPartnerData();
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
          this.partnerDataToImage = {
            id: 0,
            name: null,
            industry: null,
            subIndustry: null,
            country: null,
          };
          this.isOpenImage = false;
          this.imageFile = [];
        });
    },
    editPartner(partner) {
      this.isEdit = true;
      this.input = {
        id: partner.id,
        name: partner.name,
        country: partner.country_id,
        industry: partner.industry_id,
        subIndustry: partner.sub_industry_id,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        id: 0,
        name: null,
        industry: null,
        subIndustry: null,
        country: null,
        logo: null,
        image: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          partner_id: this.input.id,
          partner_name: this.input.name,
          country_id: this.input.country,
          sub_industry_id: this.input.subIndustry,
          industry_id: this.input.industry,
        };
        if (this.input.logo !== null) {
          payload['logo'] = this.input.logo;
        } else if (this.input.image !== null) {
          payload['main_image'] = this.input.image;
        }
        axios
          .post(`/partners/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getPartnerData();
            this.input = {
              id: 0,
              name: null,
              industry: null,
              subIndustry: null,
              country: null,
              logo: null,
              image: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.partner_name
              ? error.response.data.partner_name[0]
              : error.response.data.message
              ? error.response.data.message
              : 'Something Wrong!!!';
            this.errorMessage = message;
            this.isError = true;
            this.input = {
              id: 0,
              name: null,
              industry: null,
              subIndustry: null,
              country: null,
              logo: null,
              image: null,
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
          partner_name: this.input.name,
          country_id: this.input.country,
          sub_industry_id: this.input.subIndustry,
          industry_id: this.input.industry,
        };
        axios
          .post(`/partners`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getPartnerData();
            this.input = {
              id: 0,
              name: null,
              industry: null,
              subIndustry: null,
              country: null,
              logo: null,
              image: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.partner_name
              ? error.response.data.partner_name[0]
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
      this.partnerIdToDelete = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.partnerIdToDelete = itemId;
      this.isDelete = true;
    },
    cancelConfirmation() {
      this.partnerIdToDelete = null;
      this.isDelete = false;
    },
    deletePartner() {
      this.isDeleteLoading = true;
      axios
        .delete(`/partners/${this.partnerIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPartnerData();
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
          this.partnerIdToDelete = null;
          this.isDelete = false;
        });
    },
    getPartnerData() {
      this.items = [
        {
          image: null,
          id: 'SG-01-2023-08-01',
          name: 'Charlton Mendes',
          email: 'charltonmendes@gmail.com',
          country: 'Singapore',
          mobile: '+6591992000',
          gender: 'Male',
          registered: '07/08/2023',
          isActive: true,
          isBlock: true,
        },
      ];
    },
    activePartner(id) {
      this.isSending = true;
      axios
        .get(`/partners/toggle-active/${id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPartnerData();
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
          this.isSending = false;
        });
    },
    favoritePartner(id) {
      this.isSending = true;
      axios
        .get(`/partners/toggle-favorite/${id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPartnerData();
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
          this.isSending = false;
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
