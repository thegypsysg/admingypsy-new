<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <div class="d-flex ml-4 mb-4" style="gap: 40px">
      <router-link
        active-class="text-black"
        style="color: #3e4aaf"
        class="text-decoration-none"
        to="/email-master"
      >
        <h3>Email Management</h3>
      </router-link>
      <router-link
        active-class="text-black"
        style="color: #3e4aaf"
        class="text-decoration-none"
        to="/smtp-master"
      >
        <h3>SMTP Management</h3>
      </router-link>
    </div>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-label class="text-black text-body-2 mb-2">App Name</v-label>
            <v-autocomplete
              density="compact"
              placeholder="--- App Id ---"
              :items="apps"
              item-title="name"
              item-value="id"
              v-model="input.app"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-label class="text-black text-body-2 mb-2"
              >User Name (Email)</v-label
            >
            <v-text-field
              v-model="input.username"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-label class="text-black text-body-2 mb-2"
              >Incoming Server</v-label
            >
            <v-text-field
              v-model="input.incoming"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-label class="text-black text-body-2 mb-2"
              >Outgoing Server</v-label
            >
            <v-text-field
              v-model="input.outgoing"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
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
          <v-col v-if="isEdit" cols="12" md="2">
            <v-btn
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

              Cancel
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
                <th class="text-left text-no-wrap">SMTP ID</th>
                <th class="text-left">App Name</th>
                <th class="text-left">User Name</th>
                <th class="text-left">Incoming Server</th>
                <th class="text-left">Outgoing Server</th>
                <th class="text-left">User</th>
                <th class="text-left">Dated</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in filteredItems" :key="item.id">
                <tr class="country-table-body">
                  <td
                    style="
                      font-weight: 500 !important;
                      border-bottom: none !important;
                    "
                  >
                    {{ item.id }}
                  </td>
                  <td
                    class="text-no-wrap"
                    style="
                      font-weight: 500 !important;
                      border-bottom: none !important;
                    "
                  >
                    {{ item.app_name }}
                  </td>
                  <td
                    class="text-no-wrap"
                    style="
                      font-weight: 500 !important;
                      border-bottom: none !important;
                    "
                  >
                    {{ item.user_name }}
                  </td>
                  <td
                    class="text-no-wrap"
                    style="
                      font-weight: 500 !important;
                      border-bottom: none !important;
                    "
                  >
                    {{ item.incoming_server }}
                  </td>
                  <td
                    class="text-no-wrap"
                    style="
                      font-weight: 500 !important;
                      border-bottom: none !important;
                    "
                  >
                    {{ item.outgoing_server }}
                  </td>
                  <td
                    class="text-no-wrap"
                    style="
                      font-weight: 500 !important;
                      border-bottom: none !important;
                    "
                  >
                    {{ item.name }}
                  </td>
                  <td
                    style="
                      font-weight: 500 !important;
                      border-bottom: none !important;
                    "
                  >
                    {{ item.dated }}
                  </td>

                  <td style="border-bottom: none !important">
                    <div class="d-flex">
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            color="green"
                            variant="text"
                            v-bind="props"
                            @click="editSMTP(item)"
                            icon="mdi-pencil-outline"
                          ></v-btn>
                        </template>
                        <span>Edit</span>
                      </v-tooltip>
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            color="red"
                            variant="text"
                            v-bind="props"
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
                  <td style="border-bottom: none !important" colspan="8">
                    <div class="d-flex justify-start" style="gap: 20px">
                      <v-table class="text-left">
                        <tr>
                          <td style="width: 180px"></td>
                          <td class="pr-16">
                            <v-label
                              class="text-black text-caption font-weight-medium mb-2"
                              >Password</v-label
                            >
                            <v-text-field
                              v-model="item.password"
                              variant="outlined"
                              type="text"
                              style="min-width: 150px"
                              density="compact"
                              required
                              @input="
                                debouncedUpdate(
                                  item.id,
                                  item.password,
                                  'password'
                                )
                              "
                            ></v-text-field>
                          </td>
                          <td class="pr-4">
                            <v-label
                              class="text-black text-caption font-weight-medium mb-2"
                              >IMAP Port</v-label
                            >
                            <v-text-field
                              v-model="item.imap_port"
                              variant="outlined"
                              type="text"
                              style="min-width: 100px"
                              density="compact"
                              required
                              @input="
                                debouncedUpdate(item.id, item.imap_port, 'imap')
                              "
                            ></v-text-field>
                          </td>
                          <td class="pr-4">
                            <v-label
                              class="text-black text-caption font-weight-medium mb-2"
                              >POP3 Port</v-label
                            >
                            <v-text-field
                              v-model="item.pop3_port"
                              variant="outlined"
                              type="text"
                              style="min-width: 100px"
                              density="compact"
                              required
                              @input="
                                debouncedUpdate(item.id, item.pop3_port, 'pop3')
                              "
                            ></v-text-field>
                          </td>
                          <td class="">
                            <v-label
                              class="text-black text-caption font-weight-medium mb-2"
                              >SMTP Port</v-label
                            >
                            <v-text-field
                              v-model="item.smtp_port"
                              variant="outlined"
                              type="text"
                              style="min-width: 100px"
                              density="compact"
                              required
                              @input="
                                debouncedUpdate(item.id, item.smtp_port, 'smtp')
                              "
                            ></v-text-field>
                          </td>
                        </tr>
                      </v-table>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      border-bottom: 1px solid rgb(188, 188, 188) !important;
                    "
                    colspan="8"
                  >
                    <div class="d-flex justify-start" style="gap: 20px">
                      <v-table class="text-left">
                        <tr>
                          <td style="width: 180px"></td>

                          <td class="pr-4">
                            <v-label
                              class="text-black text-caption font-weight-medium mb-2"
                              >Sender Name</v-label
                            >
                            <v-text-field
                              v-model="item.sender_name"
                              variant="outlined"
                              type="text"
                              style="min-width: 250px"
                              density="compact"
                              required
                              @input="
                                debouncedUpdate(
                                  item.id,
                                  item.sender_name,
                                  'sender name'
                                )
                              "
                            ></v-text-field>
                          </td>
                          <td class="pr-4">
                            <v-label
                              class="text-black text-caption font-weight-medium mb-2"
                              >Sender Email</v-label
                            >
                            <v-text-field
                              v-model="item.sender_email"
                              variant="outlined"
                              type="text"
                              style="min-width: 250px"
                              density="compact"
                              required
                              @input="
                                debouncedUpdate(
                                  item.id,
                                  item.sender_email,
                                  'sender email'
                                )
                              "
                            ></v-text-field>
                          </td>
                        </tr>
                      </v-table>
                    </div>
                  </td>
                </tr>
              </template>
              <tr v-if="isLoading">
                <td :colspan="8" class="text-center">
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
        <v-card-text> Are you sure want to delete this SMTP? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelDelete">No</v-btn>
          <v-btn color="success" text @click="deleteSMTP">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from '@/util/axios';
// import http from 'axios';
import { setAuthHeader } from '@/util/axios';
// import app from '@/util/eventBus';

export default {
  name: 'SMTPMaster',
  data: () => ({
    // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    valid: false,
    isLoading: false,
    isSending: false,
    isError: false,
    isEdit: false,
    isSuccess: false,
    isDelete: false,
    isDeleteLoading: false,
    smtpIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    imageFile: [],
    isOpenImage: false,
    successMessage: '',
    errorMessage: '',
    input: {
      id: 0,
      app: null,
      username: null,
      incoming: null,
      outgoing: null,
    },
    search: '',
    items: [],
    apps: [],
    debounceTimers: {},
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.getSMTPData();
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
          item.app_name.toLowerCase().includes(searchTextLower) ||
          item.user_name.toLowerCase().includes(searchTextLower)
      );
    },
  },
  methods: {
    editSMTP(smtp) {
      this.isEdit = true;
      this.input = {
        id: smtp.id,
        app: smtp.app_id,
        username: smtp.user_name,
        incoming: smtp.incoming_server,
        outgoing: smtp.outgoing_server,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        id: 0,
        app: null,
        username: null,
        incoming: null,
        outgoing: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          smtp_id: this.input.id,
          app_id: this.input.app,
          user_name: this.input.username,
          incoming_server: this.input.incoming,
          outgoing_server: this.input.outgoing,
        };
        axios
          .post(`/smtp-masters/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getSMTPData();
            this.input = {
              id: 0,
              app: null,
              username: null,
              incoming: null,
              outgoing: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.app_id
              ? error.response.data.app_id[0]
              : error.response.data.user_name
              ? error.response.data.user_name[0]
              : error.response.data.incoming_server
              ? error.response.data.incoming_server[0]
              : error.response.data.outgoing_server
              ? error.response.data.outgoing_server[0]
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
    debouncedUpdate(id, value, type) {
      // Hapus timer sebelumnya jika ada
      if (this.debounceTimers[id + type]) {
        clearTimeout(this.debounceTimers[id + type]);
      }

      // Buat timer baru untuk debounce
      this.debounceTimers[id + type] = setTimeout(() => {
        this.updateData(id, value, type);
      }, 500); // Tunggu 500ms sebelum memanggil updateData
    },
    updateData(id, body, desc) {
      let payload = null;
      if (desc == 'password') {
        payload = {
          smtp_id: id,
          password: body,
        };
      } else if (desc == 'imap') {
        payload = {
          smtp_id: id,
          imap_port: body,
        };
      } else if (desc == 'pop3') {
        payload = {
          smtp_id: id,
          pop3_port: body,
        };
      } else if (desc == 'smtp') {
        payload = {
          smtp_id: id,
          smtp_port: body,
        };
      } else if (desc == 'sender name') {
        payload = {
          smtp_id: id,
          sender_name: body,
        };
      } else if (desc == 'sender email') {
        payload = {
          smtp_id: id,
          sender_email: body,
        };
      }

      axios
        .post(`/smtp-masters/update`, payload)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          // this.getSMTPData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message = error.response.data.password
            ? error.response.data.password[0]
            : error.response.data.imap_port
            ? error.response.data.imap_port[0]
            : error.response.data.pop3_port
            ? error.response.data.pop3_port[0]
            : error.response.data.smtp_port
            ? error.response.data.smtp_port[0]
            : error.response.data.sender_name
            ? error.response.data.sender_name[0]
            : error.response.data.sender_email
            ? error.response.data.sender_email[0]
            : error.response.data.message
            ? error.response.data.message
            : 'Something Wrong!!!';
          this.errorMessage = message;
          this.isError = true;
        });
    },
    saveData() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          app_id: this.input.app,
          user_name: this.input.username,
          incoming_server: this.input.incoming,
          outgoing_server: this.input.outgoing,
        };
        axios
          .post(`/smtp-masters`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getSMTPData();
            this.input = {
              id: 0,
              app: null,
              username: null,
              incoming: null,
              outgoing: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.app_id
              ? error.response.data.app_id[0]
              : error.response.data.user_name
              ? error.response.data.user_name[0]
              : error.response.data.incoming_server
              ? error.response.data.incoming_server[0]
              : error.response.data.outgoing_server
              ? error.response.data.outgoing_server[0]
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
      this.smtpIdToDelete = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.smtpIdToDelete = itemId;
      this.isDelete = true;
    },
    cancelConfirmation() {
      this.smtpIdToDelete = null;
      this.isDelete = false;
    },
    deleteSMTP() {
      this.isDeleteLoading = true;
      axios
        .delete(`/smtp-masters/${this.smtpIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getSMTPData();
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
          this.smtpIdToDelete = null;
          this.isDelete = false;
        });
    },
    getSMTPData() {
      this.isLoading = true;
      axios
        .get(`/smtp-masters`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.items = data
            .sort((a, b) => b.smtp_id - a.smtp_id)
            .map((item) => {
              return {
                id: item.smtp_id || 1,
                ...item,
              };
            })
            .slice(0, 10);
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
    getAppActive() {
      axios
        .get(`/app/active`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.apps = data
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
  color: black !important;
}

.country-table-body {
  margin-top: 50px !important;
  margin-bottom: 50px !important;
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
</style>
