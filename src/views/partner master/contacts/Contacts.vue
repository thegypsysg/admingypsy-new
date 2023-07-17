<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <div class="d-flex ml-4 mb-6" style="gap: 50px">
      <router-link
        style="color: #293fb8; font-size: 13px"
        class="text-decoration-none"
        to="/partner_master"
      >
        <p>Back</p>
      </router-link>
    </div>
    <h3 class="ml-4 mb-6">Contacts</h3>
    <h4 class="ml-4 mb-6" style="color: #293fb8; font-weight: 400">
      Woodlands Health Care
    </h4>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="input.contact"
              :rules="rules.contactCodeRules"
              label="Contact"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
            <v-text-field
              v-model="input.telephone"
              :rules="rules.telephoneRules"
              label="Telephone"
              variant="outlined"
              type="phone"
              density="compact"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="input.position"
              :rules="rules.positionRules"
              label="Position Held"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
            <v-text-field
              v-model="input.mobile"
              :rules="rules.mobileRules"
              label="Mobile"
              type="phone"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="input.email"
              :rules="rules.emailRules"
              label="Enter Email"
              type="email"
              density="compact"
              variant="outlined"
              required
            ></v-text-field>
            <v-text-field
              v-model="input.whatsapp"
              :rules="rules.whatsappRules"
              label="What'sApp"
              type="phone"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="mt-n5">
          <v-col cols="12" md="3">
            <v-text-field
              v-model="input.contactedOn"
              :rules="rules.contactedOnRules"
              label="Contacted on"
              type="date"
              @input="changeFormatDate"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-textarea
              v-model="input.remarks"
              :rules="rules.remarksRules"
              label="Remarks"
              rows="2"
              variant="outlined"
              density="compact"
              required
            ></v-textarea>
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
            <v-btn
              v-if="isEdit"
              prepend-icon="mdi-account-multiple-remove"
              color="red"
              style="text-transform: none"
              variant="flat"
              class="w-100 mt-2"
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
        <v-col cols="12">
          <v-table class="country-table">
            <thead>
              <tr>
                <th class="text-left">Visiting Card</th>
                <th class="text-left">Contact Person</th>
                <th class="text-left">Position Held</th>
                <th class="text-left">Telephone</th>
                <th class="text-left">Mobile</th>
                <th class="text-left">What'sApp</th>
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
                  <td>{{ item.contact }}</td>
                  <td>
                    {{ item.position }}
                  </td>
                  <td>
                    {{ item.telephone }}
                  </td>
                  <td>
                    {{ item.mobile }}
                  </td>
                  <td>
                    {{ item.whatsapp }}
                  </td>
                  <td>
                    <div class="d-flex">
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            color="green"
                            variant="text"
                            v-bind="props"
                            @click="editPartnerContact(item)"
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
                  <td></td>
                  <td
                    class="pb-2"
                    colspan="6"
                    style="border-top: none !important"
                  >
                    <div class="d-flex" style="gap: 20px">
                      <v-table class="text-left">
                        <tr>
                          <th class="pt-2">Email</th>
                          <th class="pt-2">Contacted On</th>
                        </tr>
                        <tr>
                          <td class="pr-14 pt-2">
                            {{ item.email }}
                          </td>
                          <td class="pr-6 pt-2">
                            {{ item.contactedOn }}
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
          Are you sure want to delete this partner contact?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelDelete">No</v-btn>
          <v-btn color="success" text @click="deletePartnerContact">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent width="auto" v-model="isOpenImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4">
          Upload Image - Visiting Card</v-card-title
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
  name: 'ContactsVue',
  data: () => ({
    // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    idPartnerContact: null,
    valid: false,
    isLoading: false,
    isSending: false,
    isEdit: false,
    isSuccess: false,
    isError: false,
    isDelete: false,
    isDeleteLoading: false,
    partnerContactIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    imageFile: [],
    partnerContactDataToImage: {
      id: 0,
      contact: null,
      telephone: null,
      position: null,
      mobile: null,
      email: null,
      whatsapp: null,
      contactedOn: null,
      remarks: null,
    },
    isOpenImage: false,
    successMessage: '',
    errorMessage: '',
    input: {
      id: 0,
      contact: null,
      telephone: null,
      position: null,
      mobile: null,
      email: null,
      whatsapp: null,
      contactedOn: null,
      remarks: null,
      image: null,
    },
    formattedDate: null,
    rules: {
      contactRules: [
        (value) => {
          if (value) return true;
          return 'Contact Person is required.';
        },
      ],
      telephoneRules: [
        (value) => {
          if (value) return true;
          return 'Telephone is required.';
        },
      ],
      positionRules: [
        (value) => {
          if (value) return true;
          return 'Position Held is required.';
        },
      ],
      mobileRules: [
        (value) => {
          if (value) return true;
          return 'Mobile is required.';
        },
      ],
      emailRules: [
        (value) => {
          if (value) return true;
          return 'E-mail is requred.';
        },
        (value) => {
          if (/.+@.+\..+/.test(value)) return true;
          return 'E-mail must be valid.';
        },
      ],
      whatsappRules: [
        (value) => {
          if (value) return true;
          return "What'sApp is required.";
        },
      ],
      contactedOnRules: [
        (value) => {
          if (value) return true;
          return 'Contacted on is required.';
        },
      ],
      remarksRules: [
        (value) => {
          if (value) return true;
          return 'Remarks is required.';
        },
      ],
      // websiteRules: [
      //   (value) => !!value || 'Required.',
      //   (value) => {
      //     const regex =
      //       /(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}/gm;
      //     return regex.test(value) || 'Invalid Url Format!!';
      //   },
      // ],
    },
    search: '',
    items: [],
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.idPartnerContact = this.$route.params.id;
    this.getPartnerContactData();
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.items;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.items.filter(
        (item) =>
          item.contact.toLowerCase().includes(searchTextLower) ||
          item.position.toLowerCase().includes(searchTextLower) ||
          item.telephone.toLowerCase().includes(searchTextLower) ||
          item.mobile.toLowerCase().includes(searchTextLower) ||
          item.whatsapp.toLowerCase().includes(searchTextLower) ||
          item.email.toLowerCase().includes(searchTextLower)
      );
    },
  },
  methods: {
    reverseFormatDate(date) {
      const arrayDate = date.split('/');
      const formattedDate = `${arrayDate[2]}-${arrayDate[1]}-${arrayDate[0]}`;
      return formattedDate;
    },
    changeFormatDate() {
      if (this.input.contactedOn) {
        const arrayDate = this.input.contactedOn.split('-');
        const formattedDate = `${arrayDate[2]}/${arrayDate[1]}/${arrayDate[0]}`;
        this.formattedDate = formattedDate;
      }
    },
    updateImageFile(newImageFile) {
      this.imageFile.push(newImageFile);
    },
    deleteImageFile() {
      this.isSending = true;
      axios
        .delete(
          `/partner-contacts/${this.partnerContactDataToImage.id}/visiting-card`
        )
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPartnerContactData();
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
          // this.partnerContactDataToImage = {
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
      this.partnerContactDataToImage = {
        id: item.id,
        contact: item.contact,
        telephone: item.telephone,
        position: item.position,
        mobile: item.mobile,
        email: item.email,
        whatsapp: item.whatsapp,
        contactedOn: item.contactedOn,
        remarks: item.remarks,
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
      this.partnerContactDataToImage = {
        id: 0,
        contact: null,
        telephone: null,
        position: null,
        mobile: null,
        email: null,
        whatsapp: null,
        contactedOn: null,
        remarks: null,
      };
    },
    saveImage() {
      this.isSending = true;
      const payload = {
        partner_contact_id: this.partnerContactDataToImage.id,
        name: this.partnerContactDataToImage.contact,
        position: this.partnerContactDataToImage.position,
        email: this.partnerContactDataToImage.email,
        telephone: this.partnerContactDataToImage.telephone,
        mobile: this.partnerContactDataToImage.mobile,
        whatsapp: this.partnerContactDataToImage.whatsapp,
        reference: this.partnerContactDataToImage.remarks,
        contact_on: this.partnerContactDataToImage.contactedOn,
        visiting_card: this.imageFile[0],
      };

      http
        .post(`/partner-contacts/update`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPartnerContactData();
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
          this.partnerContactDataToImage = {
            id: 0,
            contact: null,
            telephone: null,
            position: null,
            mobile: null,
            email: null,
            whatsapp: null,
            contactedOn: null,
            remarks: null,
            image: null,
          };
          this.isOpenImage = false;
          this.imageFile = [];
        });
    },
    editPartnerContact(item) {
      this.isEdit = true;
      this.input = {
        id: item.id,
        contact: item.contact,
        telephone: item.telephone,
        position: item.position,
        mobile: item.mobile,
        email: item.email,
        whatsapp: item.whatsapp,
        contactedOn: this.reverseFormatDate(item.contactedOn),
        remarks: item.remarks,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        id: 0,
        contact: null,
        telephone: null,
        position: null,
        mobile: null,
        email: null,
        whatsapp: null,
        contactedOn: null,
        remarks: null,
        image: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          partner_contact_id: this.input.id,
          name: this.input.contact,
          position: this.input.position,
          email: this.input.email,
          telephone: this.input.telephone,
          mobile: this.input.mobile,
          whatsapp: this.input.whatsapp,
          reference: this.input.remarks,
          contact_on: this.formattedDate,
        };
        if (this.input.image !== null) {
          payload['visiting_card'] = this.input.image;
        }
        axios
          .post(`/partner-contacts/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getPartnerContactData();
            this.input = {
              id: 0,
              contact: null,
              telephone: null,
              position: null,
              mobile: null,
              email: null,
              whatsapp: null,
              contactedOn: null,
              remarks: null,
              image: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.name
              ? error.response.data.name[0]
              : error.response.data.message
              ? error.response.data.message
              : 'Something Wrong!!!';
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
          partner_id: this.idPartnerContact,
          name: this.input.contact,
          position: this.input.position,
          email: this.input.email,
          telephone: this.input.telephone,
          mobile: this.input.mobile,
          whatsapp: this.input.whatsapp,
          reference: this.input.remarks,
          contact_on: this.formattedDate,
        };
        axios
          .post(`/partner-contacts`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getPartnerContactData();
            this.input = {
              id: 0,
              contact: null,
              telephone: null,
              position: null,
              mobile: null,
              email: null,
              whatsapp: null,
              contactedOn: null,
              remarks: null,
              image: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.name
              ? error.response.data.name[0]
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
      this.partnerContactIdToDelete = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.partnerContactIdToDelete = itemId;
      this.isDelete = true;
    },
    cancelConfirmation() {
      this.partnerContactIdToDelete = null;
      this.isDelete = false;
    },
    deletePartnerContact() {
      this.isDeleteLoading = true;
      axios
        .delete(`/partner-contacts/${this.partnerContactIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPartnerContactData();
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
          this.partnerContactIdToDelete = null;
          this.isDelete = false;
        });
    },
    getPartnerContactData() {
      this.isLoading = true;
      axios
        .get(`/partner-contacts/${this.idPartnerContact}`)
        .then((response) => {
          const data = response.data.data;
          //console.log(data);
          this.items = data.map((item) => {
            return {
              id: item.partner_contact_id || 1,
              image: item.visiting_card || null,
              contact: item.name || '',
              position: item.position || '',
              telephone: item.telephone || '',
              mobile: item.mobile || '',
              whatsapp: item.whatsapp || '',
              email: item.email || '',
              contactedOn: item.contact_on || '',
              remarks: item.reference || '',
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
  color: black !important;
}

.country-table-body {
  margin-top: 50px !important;
  margin-bottom: 50px !important;
  font-weight: 500;
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
