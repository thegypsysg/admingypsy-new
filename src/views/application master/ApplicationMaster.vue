<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <v-sheet class="py-6 px-4 mt-10" border rounded width="100%">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            density="compact"
            v-model="search"
            label="Search by Full Name or Email or Mobile or What's App or Job ID"
            variant="outlined"
            hide-details
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-autocomplete
            density="compact"
            label="--- App Id ---"
            placeholder="Type App"
            :items="resource.app"
            item-title="name"
            item-value="id"
            clearable
            v-model="app"
            variant="outlined"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3">
          <v-autocomplete
            density="compact"
            label="--- Primary Skills ---"
            placeholder="Type Primary Skills"
            clearable
            :items="resource.skills"
            item-title="name"
            item-value="name"
            v-model="skills"
            variant="outlined"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-table class="country-table">
            <thead>
              <tr>
                <th class="text-left">Image</th>
                <th class="text-left">Applicant Ref. #</th>
                <th class="text-left">Applicant Name</th>
                <th class="text-left">Employer Name</th>
                <th class="text-left">Job Ref #</th>
                <th class="text-left">Position</th>
                <th class="text-left">Eligible to Apply</th>
                <th class="text-left">Status</th>
                <!-- <th class="text-left">Actions</th> -->
              </tr>
            </thead>
            <tbody>
              <template v-for="item in filteredItems" :key="item.id">
                <tr class="country-table-body">
                  <td>
                    <v-img
                      height="40"
                      width="60"
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
                  <td class="text-blue-darken-4">
                    {{ item.id }}
                  </td>
                  <td>
                    <p class="text-blue-darken-4">{{ item.name }}</p>
                  </td>
                  <td>
                    <p class="text-blue-darken-4">{{ item.employer }}</p>
                  </td>
                  <td>
                    <p class="text-blue-darken-4">{{ item.job_reference }}</p>
                  </td>
                  <td>
                    <p class="text-blue-darken-4">{{ item.position }}</p>
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
                              v-model="item.isEligible"
                              rounded="5"
                              @click="eligibleUser(item.gypsy_id)"
                            >
                              <v-btn size="27" :value="true"> Yes </v-btn>

                              <v-btn size="27" :value="false"> No </v-btn>
                            </v-btn-toggle>
                  </td>
                  <td>
                    <v-select
                    style="min-width: 120px !important;"
                  density="compact"
                  placeholder="status"
                  item-value="value"
                  item-title="label"
                  :items="resource.status"
                  v-model="item.status"
                  variant="outlined"
                ></v-select>
                  </td>

                  <!-- <td>
                    <div class="d-flex">
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            color="red"
                            v-bind="props"
                            variant="text"
                            :disabled="isDeleteLoading"
                            @click="openDeleteConfirm(item.gypsy_id)"
                            icon="mdi-trash-can-outline"
                          ></v-btn>
                        </template>
                        <span>Delete</span>
                      </v-tooltip>
                    </div>
                  </td> -->
                </tr>

                <tr>
                  <td colspan="8" >
                    <div class="d-flex justify-start">
                      <!-- <span
                        class="ml-2 mt-2 mr-16 text-blue-darken-4"
                        style="width: 50px"
                        >{{ item.gender }}</span
                      > -->
                      <v-table class="text-left">
                        <tr>
                          <th class="pt-2"></th>
                          <th class="pt-2">Submitted On</th>
                          <th class="pt-2">App ID</th>
                          <th class="pt-2">Main Skills</th>
                          <th class="pt-2 pr-6">Registrable</th>
                          <th class="pt-2"></th>
                        </tr>
                        <tr>
                          <td class="pr-16 pt-2 pb-4">
                            <div style="width: 35px"></div>
                          </td>
                          <td class="pr-10 py-2 text-blue-darken-4">
                            {{ item.registered }}
                          </td>
                          <td class="pr-10 py-2 text-blue-darken-4">
                            {{ item.appName }}
                          </td>
                          <td class="pr-10 py-2 text-blue-darken-4">
                            {{ item.skills }}
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
                              v-model="item.isRegistrable"
                              rounded="5"
                              @click="registrableUser(item.gypsy_id)"
                            >
                              <v-btn size="27" :value="true"> Yes </v-btn>

                              <v-btn size="27" :value="false"> No </v-btn>
                            </v-btn-toggle>
                          </td>
                          <td class="pb-4 w-100 d-flex justify-end">
                            <div style="min-width: 200px;"></div>
                            <v-btn
                              color="indigo-accent-2"
                              style="text-transform: none"
                              variant="flat"
                              class="mt-n3 px-2 py-1"
                            >
                              View Details
                            </v-btn>
                          </td>
                        </tr>
                      </v-table>
                    </div>
                  </td>
                </tr>
              </template>
              <tr v-if="isLoading">
                <td :colspan="5" class="text-center">
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
          <v-btn color="success" text @click="deleteUser">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent width="auto" v-model="isOpenImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4">
          Upload Image - Registered User</v-card-title
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
import http from 'axios';
import { setAuthHeader } from '@/util/axios';
// import app from '@/util/eventBus';

export default {
  name: 'ApplicantMaster',
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
    userIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    imageFile: [],
    logoFile: [],
    userDataToImage: {
      id: 0,
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
      skills: [],
      app: [],
      status: [
        {
          value: 'P',
          label: 'Pending'
        },
        {
          value: 'R',
          label: 'Rejected'
        }
      ]
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
    app: null,
    skills: null,
    items: [],
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.getPrimarySkillData();
    this.getAppActive();
    this.getUserData();
  },
  computed: {
    filteredItems() {
      if (!this.search && this.app === null && this.skills === null) {
        return this.items;
      } else if (this.search && this.app === null && this.skills === null) {
      const searchTextLower = this.search.toLowerCase();
      return this.items.filter(
        (item) =>
          item.id.toLowerCase().includes(searchTextLower) ||
          item.applicant_id.toLowerCase().includes(searchTextLower) ||
          item.name.toLowerCase().includes(searchTextLower) ||
          item.email.toLowerCase().includes(searchTextLower) ||
          item.mobile.toLowerCase().includes(searchTextLower) ||
          item.whatsapp.toLowerCase().includes(searchTextLower)
      );
      } else if (!this.search && this.app === null && this.skills !== null) {
        const filteredData = this.items.filter((item) => {
          return this.skills
            ? item.skills.toLowerCase() ===
                this.skills.toLowerCase()
            : true;
        });
        return filteredData;
      } else if (!this.search && this.app !== null && this.skills === null) {
        const filteredData = this.items.filter((item) => {
          return this.app
            ? item.appName.toLowerCase() ===
                this.app.toLowerCase()
            : true;
        });
        return filteredData;
      } else if (this.search && this.app !== null && this.skills === null) {
        const searchTextLower = this.search.toLowerCase();
        const filteredData = this.items.filter((item) => {
          return (
            (item.name.toLowerCase().includes(searchTextLower) ||
            item.email.toLowerCase().includes(searchTextLower) ||
            item.mobile.toLowerCase().includes(searchTextLower) ||
            item.whatsapp.toLowerCase().includes(searchTextLower)) &&
            (this.app
            ? item.appName.toLowerCase() ===
                this.app.toLowerCase()
            : true)
          );
        });
        return filteredData;
      } else if (this.search && this.app === null && this.skills !== null) {
        const searchTextLower = this.search.toLowerCase();
        const filteredData = this.items.filter((item) => {
          return (
            (item.name.toLowerCase().includes(searchTextLower) ||
            item.email.toLowerCase().includes(searchTextLower) ||
            item.mobile.toLowerCase().includes(searchTextLower) ||
            item.whatsapp.toLowerCase().includes(searchTextLower)) &&
            (this.skills
            ? item.skills.toLowerCase() ===
                this.skills.toLowerCase()
            : true)
          );
        });
        return filteredData;
      } else {
        const searchTextLower = this.search.toLowerCase();
        const filteredData = this.items.filter((item) => {
          return (
            (item.name.toLowerCase().includes(searchTextLower) ||
            item.email.toLowerCase().includes(searchTextLower) ||
            item.mobile.toLowerCase().includes(searchTextLower) ||
            item.whatsapp.toLowerCase().includes(searchTextLower)) &&
            (this.skills
            ? item.skills.toLowerCase() ===
                this.skills.toLowerCase()
            : true) && 
            (this.app
            ? item.appName.toLowerCase() ===
                this.app.toLowerCase()
            : true)
          );
        });
        return filteredData;
      }
    },
    //filteredItems() {
    //  if (!this.search) {
    //    return this.items;
    //  }
    //  const searchTextLower = this.search.toLowerCase();
    //  return this.items.filter(
    //    (item) =>
    //      item.name.toLowerCase().includes(searchTextLower) ||
    //      item.email.toLowerCase().includes(searchTextLower) ||
    //      item.mobile.toLowerCase().includes(searchTextLower) ||
    //      item.whatsapp.toLowerCase().includes(searchTextLower)
    //  );
    //},
  },
  methods: {
    countAge(date) {
     // if (!date) return null;
//
     // const today = new Date();
     // const birthDate = new Date(date);
     // let age = today.getFullYear() - birthDate.getFullYear();
     // const monthDiff = today.getMonth() - birthDate.getMonth();
//
     // if (
     //   monthDiff < 0 ||
     //   (monthDiff === 0 && today.getDate() < birthDate.getDate())
     // ) {
     //   age--;
     // }
//
     // return age;

            if (!date) return null;

      const [day, month, year] = date.split("/").map(Number);
      if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

      const today = new Date();
      const birthDate = new Date(year, month - 1, day); // Month is 0-based in JavaScript

      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age;
    },
    updateImageFile(newImageFile) {
      this.imageFile.push(newImageFile);
    },
    deleteImageFile() {
      this.isSending = true;
      axios
        .delete(`/gypsy-registration/${this.userDataToImage.id}/image`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getUserData();
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
          // this.userDataToImage = {
          //   app_id: 1,
          //   app_group_id: 1,
          //   app_name: '',
          //   app_description: '',
          //   app_detail: '',
          // };
          this.imageFile = [];
        });
    },
    openImage(item) {
      this.isOpenImage = true;
      this.userDataToImage = {
        id: item.gypsy_id,
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
    closeImage() {
      this.isOpenImage = false;
      this.imageFile = [];
      this.userDataToImage = {
        id: 0,
      };
    },
    saveImage() {
      this.isSending = true;
      const payload = {
        gypsy_id: this.userDataToImage.id,
        image: this.imageFile[0],
      };

      http
        .post(`/gypsy-registration/update`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getUserData();
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
          this.userDataToImage = {
            id: 0,
          };
          this.isOpenImage = false;
          this.imageFile = [];
        });
    },
    cancelDelete() {
      this.userIdToDelete = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.userIdToDelete = itemId;
      this.isDelete = true;
    },
    cancelConfirmation() {
      this.userIdToDelete = null;
      this.isDelete = false;
    },
    deleteUser() {
      this.isDeleteLoading = true;
      axios
        .delete(`/gypsy-registration/${this.userIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getUserData();
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
          this.userIdToDelete = null;
          this.isDelete = false;
        });
    },
    getUserData() {
      this.isLoading = true;
      axios
        .get(`/applications`)
        .then((response) => {
          const data = response.data.data;
          console.log(data);
          this.items = data.map((item) => {
            return {
              image: item.image || null,
              appName: item.app_name || '',
              gypsy_id: item.gypsy_id || 0,
              id: item.application_ref_no || '',
              applicant_id: item.applicant_ref_no || '',
              name: item.name || '',
              email: item.email_id || '',
              verifiedEmail:
                item.email_verified == 'Y' ? 'verified' : 'Not verified',
              country_id: item.country_current || null,
              country: item.country?.country_name || '',
              city: item.city_name || '',
              town: item.town_name || '',
              nationality: item.country?.nationality || '',
              mobile: item.mobile_number || '',
              verifiedMobile:
                item.mobile_verified == 'Y' ? 'verified' : 'Not verified',
              whatsapp: item.whats_app || '',
              verifiedWhatsApp:
                item.whatsapp_verified == 'Y' ? 'verified' : 'Not verified',
              gender:
                item.gender == 'M'
                  ? 'Male'
                  : item.gender == 'F'
                  ? 'Female'
                  : '',
              genderCode: item.gender || '',
              registered: item.dated || '',
              isEligible:
                item.eligible == 'N' ? false : item.eligible == 'Y' ? true : null,
              isRegistrable:
                item.registrable == 'N' ? false : item.registrable == 'Y' ? true : null,
              lastLogin: item.last_login || '',
              registeredBy:
                item.social_type == 'G'
                  ? 'Google'
                  : item.social_type == 'L'
                  ? 'LinkedIn'
                  : item.social_type == 'X'
                  ? 'Twitter'
                  : item.social_type == 'F'
                  ? 'Facebook'
                  : item.social_type == 'T'
                  ? 'Tiktok'
                  : item.social_type == 'E'
                  ? 'Email'
                  : '',
              registeredType:
                item.registered_type == 'M'
                  ? 'Mobile'
                  : item.registered_type == 'W'
                  ? 'Web'
                  : '',
              maritalStatus:
                item.marital_status == 'M'
                  ? 'Married'
                  : item.marital_status == 'S'
                  ? 'Single'
                  : item.marital_status == 'O'
                  ? 'Others'
                  : '',
              date: item.date_of_birth || '',
              skills: item.skills_name || '',
              position: item.position_name || '',
              employer: item.employer || '',
              job_reference: item.job_reference_no || '',
              status: item.status || null,
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
    eligibleUser(id) {
      console.log(id)
      //this.isSending = true;
      //axios
      //  .get(`/gypsy-registration/toggle-active/${id}`)
      //  .then((response) => {
      //    const data = response.data;
      //    this.successMessage = data.message;
      //    this.isSuccess = true;
      //    this.getUserData();
      //  })
      //  .catch((error) => {
      //    // eslint-disable-next-line
      //    console.log(error);
      //    const message =
      //      error.response.data.message === ''
      //        ? 'Something Wrong!!!'
      //        : error.response.data.message;
      //    this.errorMessage = message;
      //    this.isError = true;
      //  })
      //  .finally(() => {
      //    this.isSending = false;
      //  });
    },
    employedUser(id) {
      this.isSending = true;
      axios
        .get(`/gypsy-registration/toggle-employed/${id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getUserData();
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
    blockUser(id) {
      this.isSending = true;
      axios
        .get(`/gypsy-registration/toggle-block/${id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getUserData();
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
    getAppActive() {
      axios
        .get(`/app/active`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.resource.app = data
            .sort((a, b) => a.app_id < b.app_id)
            .map((app) =>  app.app_name);
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
    getPrimarySkillData() {
      this.isLoading = true;
      axios
        .get(`/skills`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);

          this.resource.skills = data
            .sort((a, b) => a.skills_id > b.skills_id)
            .map((item) => {
              return {
                id: item.skills_id || 1,
                name: item.skills_name || '',
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
