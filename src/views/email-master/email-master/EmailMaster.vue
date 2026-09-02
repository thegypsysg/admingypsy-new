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
          <v-col cols="12" md="5">
            <v-combobox
              density="compact"
              label="Email Template Name"
              placeholder="Type Email Template Name"
              :items="templates"
              v-model="input.template"
              variant="outlined"
              required
            ></v-combobox>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              density="compact"
              label="App Name"
              placeholder="Type App Name"
              :items="apps"
              item-title="name"
              item-value="id"
              v-model="input.app"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="9">
            <v-text-field
              v-model="input.subject"
              label="Email Subject"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="2">
            <v-btn
              :prepend-icon="isEdit ? 'mdi-account-multiple-check' : 'mdi-account-multiple-plus'"
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
                <th class="text-left">Id</th>
                <th class="text-left">Template Name</th>
                <th class="text-left">Email Subject</th>
                <th class="text-left">App Name</th>
                <th class="text-left">User</th>
                <th class="text-left">Dated</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in filteredItems" :key="item.id">
                <tr class="country-table-body">
                  <td style="font-weight: 500 !important; border-bottom: none !important">
                    {{ item.id }}
                  </td>
                  <td style="font-weight: 500 !important; border-bottom: none !important">
                    {{ item.template_name }}
                  </td>
                  <td style="font-weight: 500 !important; border-bottom: none !important">
                    {{ item.email_subject }}
                  </td>
                  <td style="font-weight: 500 !important; border-bottom: none !important">
                    {{ item.app_name }}
                  </td>
                  <td style="font-weight: 500 !important; border-bottom: none !important">
                    {{ item.name }}
                  </td>
                  <td style="font-weight: 500 !important; border-bottom: none !important">
                    {{ item.dated }}
                  </td>

                  <td style="border-bottom: none !important">
                    <div class="d-flex">
                      <v-btn color="green" variant="text" @click="editEmail(item)" icon>
                        <v-icon>mdi-pencil-outline</v-icon>
                        <v-tooltip location="top" activator="parent">Edit</v-tooltip>
                      </v-btn>
                      <v-btn
                        color="red"
                        variant="text"
                        :disabled="isDeleteLoading"
                        @click="openDeleteConfirm(item.id)"
                        icon
                      >
                        <v-icon>mdi-trash-can-outline</v-icon>
                        <v-tooltip location="top" activator="parent">Delete</v-tooltip>
                      </v-btn>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="border-bottom: 1px solid rgb(188, 188, 188) !important" colspan="7">
                    <div class="d-flex justify-start" style="gap: 20px">
                      <v-table class="text-left">
                        <tr>
                          <td style="width: 70px"></td>
                          <td class="pr-6 pt-2 pb-4">
                            <div class="d-flex justify-start" style="gap: 20px">
                              <router-link
                                class="text-decoration-none"
                                :to="`/email-master/main-info/${item.id}`"
                              >
                                <span>Main Info</span>
                              </router-link>
                            </div>
                          </td>
                        </tr>
                      </v-table>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </v-table>
          <skeleton-table v-if="isLoading" :rows="5" :columns="7" />
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
      @confirm="deleteEmail"
    />
  </v-container>
</template>

<script>
import SkeletonTable from '@/components/SkeletonTable.vue';
import EmptyState from '@/components/EmptyState.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import { useNotificationStore } from '@/stores/notification';
import axios from '@/util/axios';
import { setAuthHeader } from '@/util/axios';
// import app from '@/util/eventBus';

export default {
  name: 'EmailMaster',
  components: {
    ConfirmDialog,
    EmptyState,
    SkeletonTable,
  },
  setup() {
    const notification = useNotificationStore();
    return { notification };
  },
  data: () => ({
    // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    valid: false,
    isLoading: false,
    isSending: false,
    isEdit: false,
    isDelete: false,
    isDeleteLoading: false,
    emailIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    imageFile: [],
    isOpenImage: false,
    input: {
      id: 0,
      template: null,
      app: null,
      subject: null,
    },
    search: '',
    items: [],
    templates: [],
    apps: [],
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.getEmailData();
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
          item.template_name.toLowerCase().includes(searchTextLower) ||
          item.app_name.toLowerCase().includes(searchTextLower) ||
          item.email_subject.toLowerCase().includes(searchTextLower)
      );
    },
  },
  methods: {
    editEmail(email) {
      this.isEdit = true;
      this.input = {
        id: email.id,
        template: email.template_name,
        app: email.app_id,
        subject: email.email_subject,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        id: 0,
        template: null,
        app: null,
        subject: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          template_id: this.input.id,
          template_name: this.input.template,
          app_id: this.input.app,
          email_subject: this.input.subject,
        };
        axios
          .post(`/email-masters/update`, payload)
          .then((response) => {
            const data = response.data;
            this.notification.success(data.message);
            this.getEmailData();
            this.input = {
              id: 0,
              template: null,
              app: null,
              subject: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.template_name
              ? error.response.data.template_name[0]
              : error.response.data.email_subject
              ? error.response.data.email_subject[0]
              : error.response.data.app_id
              ? error.response.data.app_id[0]
              : error.response.data.message
              ? error.response.data.message
              : 'Something Wrong!!!';
            this.notification.error(message);
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
          template_name: this.input.template,
          app_id: this.input.app,
          email_subject: this.input.subject,
        };
        axios
          .post(`/email-masters`, payload)
          .then((response) => {
            const data = response.data;
            this.notification.success(data.message);
            this.getEmailData();
            this.input = {
              id: 0,
              template: null,
              app: null,
              subject: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.template_name
              ? error.response.data.template_name[0]
              : error.response.data.email_subject
              ? error.response.data.email_subject[0]
              : error.response.data.app_id
              ? error.response.data.app_id[0]
              : error.response.data.message
              ? error.response.data.message
              : 'Something Wrong!!!';
            this.notification.error(message);
          })
          .finally(() => {
            this.isSending = false;
          });
      }
    },
    cancelDelete() {
      this.emailIdToDelete = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.emailIdToDelete = itemId;
      this.isDelete = true;
    },
    cancelConfirmation() {
      this.emailIdToDelete = null;
      this.isDelete = false;
    },
    deleteEmail() {
      this.isDeleteLoading = true;
      axios
        .delete(`/email-masters/${this.emailIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getEmailData();
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
          this.emailIdToDelete = null;
          this.isDelete = false;
        });
    },
    getEmailData() {
      this.isLoading = true;
      axios
        .get(`/email-masters`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.items = data
            .sort((a, b) => b.template_id - a.template_id)
            .map((item) => {
              return {
                id: item.template_id || 1,
                ...item,
              };
            })
            .slice(0, 10);
          this.templates = data.map((item) => item.template_name);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === '' ? 'Something Wrong!!!' : error.response.data.message;
          this.notification.error(message);
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
            error.response.data.message === '' ? 'Something Wrong!!!' : error.response.data.message;
          this.notification.error(message);
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
