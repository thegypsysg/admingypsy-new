<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <h1>The Gypsy Registration</h1>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="input.fullName"
              :counter="40"
              :rules="rules.nameRules"
              label="Full Name"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              v-model="input.email"
              :rules="rules.emailRules"
              label="Email"
              type="email"
              density="compact"
              variant="outlined"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-radio-group
              v-model="input.gender"
              style="
                border: 1px solid rgb(166, 166, 166);
                border-radius: 5px;
                height: 42px;
              "
              inline
            >
              <!-- density="compact" -->
              <v-radio label="Male" value="M">
                <!-- :class="{
              'mr-2': !isSmall,
              'gender-small': isSmall,
            }" -->
                <template #label>
                  <span>Male</span>
                </template>
              </v-radio>
              <v-radio value="F">
                <template #label>
                  <span>Female</span>
                </template>
              </v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row class="mt-n2">
          <v-col cols="12" md="3">
            <v-select
              clearable
              density="compact"
              label="Select Country"
              :items="resource.country"
              item-title="name"
              item-value="id"
              v-model="input.country"
              variant="outlined"
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <div class="d-flex">
              <div class="d-flex w-100">
                <v-text-field
                  v-model="input.code"
                  type="text"
                  class="w-33"
                  placeholder="Code"
                  variant="outlined"
                  density="compact"
                  :persistent-hint="true"
                />
                <v-text-field
                  v-model="input.mobile"
                  type="number"
                  class="w-66"
                  variant="outlined"
                  placeholder="Phone Number"
                  :persistent-hint="true"
                  density="compact"
                />
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              density="compact"
              label="--- Primary Skills ---"
              placeholder="Type Primary Skills"
              :items="resource.skills"
              item-title="name"
              item-value="id"
              v-model="input.skills"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row class="mt-n2">
          <v-col cols="12" md="3">
            <v-autocomplete
              density="compact"
              label="--- App Id ---"
              placeholder="Type App"
              :items="resource.app"
              class="mt-1"
              item-title="name"
              item-value="id"
              v-model="input.app"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-textarea
              v-model="input.remarks"
              label="Remarks"
              rows="2"
              variant="outlined"
              density="compact"
              required
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row class="mt-n2">
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
              @click="isEdit ? saveEdit() : saveData()"
              :disabled="isSending"
              :loading="isSending"
            >
              <template v-slot:prepend>
                <v-icon color="white"></v-icon>
              </template>

              {{ isEdit ? 'Save Contact' : 'Add Contact' }}
            </v-btn>
          </v-col>
          <v-col v-if="isEdit" cols="12" md="2">
            <v-btn
              prepend-icon="mdi-account-multiple-remove"
              color="red"
              style="text-transform: none"
              variant="flat"
              @click="cancelEdit"
              :disabled="isSending"
            >
              <template v-slot:prepend>
                <v-icon color="white"></v-icon>
              </template>

              Cancel Edit
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <v-sheet class="py-6 px-4 mt-6" border rounded width="100%">
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            density="compact"
            v-model="search"
            label="Search Contacts"
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
                <th class="text-left">Id</th>
                <th class="text-left">Name / Email</th>
                <th class="text-left">Gender</th>
                <th class="text-left">Mobile #</th>
                <th class="text-left">Country</th>
                <th class="text-left">Invited on</th>
                <th class="text-left">User</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in filteredItems" :key="item.id">
                <tr class="country-table-body">
                  <td>{{ item.id }}</td>
                  <td style="min-width: 250px !important">
                    <v-list-item
                      @click="openImage(item)"
                      :prepend-avatar="
                        item.image != null
                          ? $fileURL + item.image
                          : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                      "
                    >
                      <v-list-item-content>
                        <v-list-item-title style="font-size: 14px">{{
                          item.name
                        }}</v-list-item-title>
                        <v-list-item-subtitle style="font-size: 12px">{{
                          item.email
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </td>
                  <td>
                    {{ item.gender }}
                  </td>
                  <td>
                    {{ item.code + item.phone
                    }}<v-icon
                      v-if="item.phone"
                      color="#4EC053"
                      size="20"
                      class="ml-2 fab fa-whatsapp"
                    ></v-icon>
                  </td>
                  <td>{{ item.country_name }}</td>
                  <td>{{ item.registered_on }}</td>
                  <td>{{ item.user }}</td>
                  <td>
                    <div class="d-flex">
                      <v-btn
                        color="green"
                        variant="text"
                        @click="editUser(item)"
                        icon="mdi-pencil-outline"
                      ></v-btn>
                      <v-btn
                        color="red"
                        variant="text"
                        :disabled="isDeleteLoading"
                        @click="openDeleteConfirm(item.id)"
                        icon="mdi-trash-can-outline"
                      ></v-btn>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="has-border" colspan="8">
                    <div class="d-flex justify-start" style="gap: 20px">
                      <v-table class="text-left font-weight-bold">
                        <tr>
                          <td style="width: 60px"></td>
                          <td class="pr-6 pt-2 pb-4">
                            <p class="text-blue-accent-4">
                              Met in a Networking group
                            </p>
                          </td>
                          <td style="width: 220px"></td>
                          <td class="pr-10 pt-2 pb-4">
                            Skills:
                            <span class="text-blue-accent-4">{{
                              item.skills
                            }}</span>
                          </td>
                          <td class="pr-10 pt-2 pb-4">
                            App Id:
                            <span class="text-blue-accent-4">{{
                              item.app
                            }}</span>
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
        <v-card-text> Are you sure want to delete this user? </v-card-text>
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
          Upload Image - User</v-card-title
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

export default {
  name: 'UserMaster',
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
    userDataToImage: {
      id: 0,
      fullName: null,
      email: null,
      gender: null,
      country: null,
      code: null,
      mobile: null,
      skills: null,
      app: null,
      remarks: null,
    },
    isOpenImage: false,
    successMessage: '',
    errorMessage: '',
    input: {
      id: 0,
      fullName: null,
      email: null,
      gender: null,
      country: null,
      code: null,
      mobile: null,
      skills: null,
      app: null,
      remarks: null,
      image: null,
    },
    resource: {
      country: [],
      code: [],
      skills: [],
      app: [],
      gender: [
        {
          name: 'Male',
          value: 'M',
        },
        {
          name: 'Female',
          value: 'F',
        },
      ],
    },
    rules: {
      nameRules: [
        (value) => {
          if (value) return true;
          return 'Name is requred.';
        },
        // (value) => {
        //   if (value?.length >= 4) return true;
        //   return 'Username must be more than 4 characters.';
        // },
        // (value) => {
        //   if (value?.length <= 20) return true;
        //   return 'Username must be less than 20 characters.';
        // },
      ],
      emailRules: [
        (value) => {
          if (/.+@.+\..+/.test(value) || value == null || value == '')
            return true;
          return 'E-mail must be valid.';
        },
      ],
      countryRules: [
        (value) => {
          if (value) return true;
          return 'Country is requred.';
        },
      ],
      roleRules: [
        (value) => {
          if (value) return true;
          return 'Role is requred.';
        },
      ],
    },
    search: '',
    items: [],
  }),
  watch: {
    // eslint-disable-next-line no-unused-vars
    'input.country': function (newVal, oldVal) {
      // this.getCityData(newVal);
      this.getCountryCode(newVal);
    },
  },
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.getCountryCode2();
    setTimeout(() => {
      this.getUserData();
      this.getCountry();
      this.getPrimarySkillData();
      this.getAppActive();
    }, 500);
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
          item.email.toLowerCase().includes(searchTextLower) ||
          item.phone.toLowerCase().includes(searchTextLower) ||
          item.gender.toLowerCase().includes(searchTextLower) ||
          item.skills.toLowerCase().includes(searchTextLower) ||
          item.app.toLowerCase().includes(searchTextLower) ||
          item.country_name.toLowerCase().includes(searchTextLower) ||
          item.registered_on.toLowerCase().includes(searchTextLower) ||
          item.user.toLowerCase().includes(searchTextLower)
      );
    },
  },
  methods: {
    updateImageFile(newImageFile) {
      this.imageFile.push(newImageFile);
    },
    deleteImageFile() {
      this.isSending = true;
      axios
        .delete(`/invites/${this.userDataToImage.id}/image`)
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
          // this.productDataToImage = {
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
        id: item.id,
        fullName: item.name,
        email: item.email,
        gender: item.genderCode,
        country: item.country_id,
        code: this.input.code,
        mobile: parseInt(item.phone),
        skills: item.skills_id,
        app: item.app_id,
        remarks: 'Met in a Networking group',
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
      this.productDataToImage = {
        id: 0,
        fullName: null,
        email: null,
        gender: null,
        country: null,
        code: null,
        mobile: null,
        skills: null,
        app: null,
        remarks: null,
      };
    },
    saveImage() {
      this.isSending = true;
      const payload = {
        invite_id: this.userDataToImage.id,
        full_name: this.userDataToImage.fullName,
        email: this.userDataToImage.email,
        mobile_number: this.userDataToImage.mobile,
        gender: this.userDataToImage.gender,
        skills_id: this.userDataToImage.skills,
        app_id: this.userDataToImage.app,
        from_country: this.userDataToImage.country,
        remarks: this.userDataToImage.remarks,
        image: this.imageFile[0],
      };

      http
        .post(`/invites/update`, payload, {
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
          this.productDataToImage = {
            id: 0,
            fullName: null,
            email: null,
            gender: null,
            country: null,
            code: null,
            mobile: null,
            skills: null,
            app: null,
            remarks: null,
          };
          this.isOpenImage = false;
          this.imageFile = [];
        });
    },
    editUser(invite) {
      this.isEdit = true;
      this.input = {
        id: invite.id,
        fullName: invite.name,
        email: invite.email,
        gender: invite.genderCode,
        country: invite.country_id,
        code: this.input.code,
        mobile: parseInt(invite.phone),
        skills: invite.skills_id,
        app: invite.app_id,
        remarks: 'Met in a Networking group',
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        id: 0,
        fullName: null,
        email: null,
        gender: null,
        country: null,
        code: null,
        mobile: null,
        skills: null,
        app: null,
        remarks: null,
        image: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          invite_id: this.input.id,
          full_name: this.input.fullName,
          email: this.input.email,
          mobile_number: this.input.mobile,
          gender: this.input.gender,
          skills_id: this.input.skills,
          app_id: this.input.app,
          from_country: this.input.country,
          remarks: this.input.remarks,
        };
        axios
          .post(`/invites/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getUserData();
            this.input = {
              id: 0,
              fullName: null,
              email: null,
              gender: null,
              country: null,
              code: null,
              mobile: null,
              skills: null,
              app: null,
              remarks: null,
              image: null,
            };
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
          });
      }
    },
    saveData() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          full_name: this.input.fullName,
          email: this.input.email,
          mobile_number: this.input.mobile,
          gender: this.input.gender,
          skills_id: this.input.skills,
          app_id: this.input.app,
          from_country: this.input.country,
          remarks: this.input.remarks,
        };
        axios
          .post(`/invites`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getUserData();
            this.input = {
              id: 0,
              fullName: null,
              email: null,
              gender: null,
              country: null,
              code: null,
              mobile: null,
              skills: null,
              app: null,
              remarks: null,
              image: null,
            };
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
      }
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
        .delete(`/invites/${this.userIdToDelete}`)
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
        .get(`/invites`)
        .then((response) => {
          const data = response.data.data;
          console.log(data);
          this.items = data.map((item) => {
            return {
              id: item.invite_id || 0,
              name: item.full_name || '',
              email: item.email || '',
              code:
                this.resource.code.filter((i) => i.id == item.from_country)[0]
                  ?.code || '',
              phone: item.mobile_number || '',
              gender:
                item.gender == 'M'
                  ? 'Male'
                  : item.gender == 'F'
                  ? 'Female'
                  : '',
              genderCode: item.gender || '',
              skills_id: item.skills_id || null,
              skills: item.skills?.skills_name || '',
              app_id: item.app_id || null,
              app: item.app?.app_name || '',
              image: item.image || null,
              country_id: item.from_country || null,
              country_name: item.country?.country_name || '',
              registered_on: item.invited_on || '',
              user_id: item.user_id || null,
              user: item.user?.name || '',
            };
          });
          console.log(this.items);
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
    getCountryCode(country) {
      axios
        .get(`/country`)
        .then((response) => {
          const data = response.data.data;
          this.input.code = data
            .filter((i) => i.country_id == country)
            .map((country) => country.country_code);
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
    getCountryCode2() {
      axios
        .get(`/country`)
        .then((response) => {
          const data = response.data.data;
          this.resource.code = data.map((country) => {
            return { id: country.country_id, code: country.country_code };
          });
          console.log(this.resource.code);
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
    getCountry() {
      axios
        .get(`/country`)
        .then((response) => {
          const data = response.data.data;
          this.resource.country = data.map((country) => {
            return {
              id: country.country_id,
              name: country.country_name,
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

.has-border {
  border-bottom: 1px solid rgb(188, 188, 188) !important;
}

.not-border {
  border-bottom: none !important;
}
</style>
