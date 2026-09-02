<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container v-if="isLoading">
    <div class="h-100 d-flex justify-center align-center">
      <p>Loading...</p>
    </div>
  </v-container>
  <v-container v-else>
    <div class="d-flex ml-4 mb-6" style="gap: 50px">
      <router-link
        style="color: #293fb8; font-size: 13px"
        class="text-decoration-none"
        to="/email-master"
      >
        <p>Back</p>
      </router-link>
    </div>
    <v-row>
      <v-col cols="5">
        <h3 class="ml-4 mb-6">Main Info</h3>
      </v-col>
      <v-col cols="4">
        <v-btn
          color="indigo-accent-2"
          style="text-transform: none"
          type="submit"
          variant="flat"
          @click="saveData()"
          :disabled="isSending"
          :loading="isSending"
        >
          Update
        </v-btn>
      </v-col>
    </v-row>
    <h4 class="ml-4 mb-6" style="color: #293fb8; font-weight: 400">
      {{ emailName || '' }}
    </h4>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <v-label class="text-black text-body-2 mb-2">Email Subject</v-label>
            <v-text-field
              v-model="input.subject"
              type="phone"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
            <v-label class="text-black text-body-2 mb-2"
              >Email Description</v-label
            >
            <v-textarea
              density="compact"
              v-model="input.desc"
              rows="6"
              variant="outlined"
              required
            ></v-textarea>
          </v-col>
          <v-col cols="12" md="4">
            <v-label class="text-black text-body-2 mb-2">Email Sender</v-label>
            <v-autocomplete
              v-model="input.sender"
              :items="senders"
              item-title="name"
              item-value="id"
              placeholder="Select SMTP User Email"
              variant="outlined"
              density="compact"
              @update:modelValue="handleSender"
              required
            ></v-autocomplete>
            <v-label class="text-black text-body-2 mb-2">Reply To</v-label>
            <v-text-field
              v-model="input.reply"
              type="email"
              readonly
              density="compact"
              variant="outlined"
              required
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
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
  </v-container>
</template>

<script>
import axios from '@/util/axios';
import { setAuthHeader } from '@/util/axios';
// import app from '@/util/eventBus';

export default {
  name: 'MainInfo',
  data: () => ({
    // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    idEmail: null,
    emailName: [],
    valid: false,
    isLoading: false,
    isSending: false,
    isError: false,
    isEdit: false,
    isSuccess: false,
    isDelete: false,
    isDeleteLoading: false,
    userIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    imageFile: [],
    userIdToImage: null,
    isOpenImage: false,
    successMessage: '',
    errorMessage: '',
    input: {
      id: 0,
      subject: null,
      desc: null,
      sender: null,
      reply: null,
    },
    senders: [],
    senderEmails: [],
    emailRules: [
      (value) => {
        if (/.+@.+\..+/.test(value)) return true;
        return 'E-mail must be valid.';
      },
    ],
    search: '',
    items: [],
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    const id = parseInt(this.$route.params.id);
    this.idEmail = id;
    this.getEmailData(id);
    this.getSenders();
  },
  methods: {
    getSenders() {
      axios
        .get(`/smtp-masters`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.senders = data.map((app) => {
            return {
              id: app.smtp_id || 0,
              name:
                app.sender_name && app.user_name
                  ? `${app.sender_name} | ${app.user_name}`
                  : !app.sender_name && app.user_name
                  ? `${app.user_name}`
                  : app.sender_name && !app.user_name
                  ? `${app.sender_name}`
                  : '-',
            };
          });
          this.senderEmails = data.map((app) => {
            return {
              id: app.smtp_id || 0,
              email: app.sender_email || '-',
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
    getEmailData(id) {
      this.isLoading = true;
      axios
        .get(`/email-masters/${id}`)
        .then((response) => {
          const data = response.data.data;
          console.log(data);
          this.emailName = data.template_name;
          this.input = {
            id: data.template_id,
            subject: data.email_subject,
            desc: data.email_description,
            sender: data.smtp_id,
            reply: data.sender_email,
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
          this.isLoading = false;
        });
    },
    handleSender() {
      this.input.reply =
        this.senderEmails.find((app) => app.id === this.input.sender).email ||
        '';
    },
    saveData() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          template_id: this.idEmail,
          email_subject: this.input.subject,
          email_description: this.input.desc,
          smtp_id: this.input.sender,
        };
        axios
          .post(`/email-masters/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.template_name
              ? 'Template Name is Required'
              : error.response.data.email_subject
              ? 'Email Subject is Required'
              : error.response.data.smtp_id
              ? 'Email Sender is Required'
              : error.response.data.email_description
              ? 'Email Description is Required'
              : error.response.data.message === ''
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
