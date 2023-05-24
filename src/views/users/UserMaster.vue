<template>
  <v-container>
    <h1>Users Master</h1>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="input.username"
              :rules="rules.nameRules"
              :counter="20"
              label="Enter Username"
              variant="outlined"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field
              v-model="input.email"
              :rules="rules.emailRules"
              label="Enter Email"
              type="email"
              variant="outlined"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="3">
            <v-select
              clearable
              :rules="rules.countryRules"
              label="Select Country"
              :items="resource.country"
              item-title="name"
              item-value="id"
              v-model="input.country"
              variant="outlined"
            ></v-select>
          </v-col>

          <v-col cols="12" md="3">
            <v-select
              clearable
              :rules="rules.roleRules"
              :items="resource.role"
              item-title="name"
              item-value="value"
              label="Select Role"
              v-model="input.role"
              variant="outlined"
            ></v-select>
          </v-col>
        </v-row>
        <v-row class="mt-n2">
          <v-col cols="12" md="3">
            <v-btn
              prepend-icon="mdi-account-multiple-plus"
              color="indigo-accent-2"
              style="text-transform: none"
              type="submit"
              variant="flat"
              @click="save"
              :disabled="isSending"
              :loading="isSending"
            >
              <template v-slot:prepend>
                <v-icon color="white"></v-icon>
              </template>

              Add Contact
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <v-sheet class="pa-8 mt-6" border rounded width="100%">
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="search"
            label="Search Contacts"
            variant="outlined"
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-table class="user-table">
            <thead>
              <tr>
                <th class="text-left">Id</th>
                <th class="text-left">User Info</th>
                <th class="text-left">Role</th>
                <th class="text-left">Country</th>
                <th class="text-left">Registered on</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredItems" :key="item.id">
                <td>{{ item.id }}</td>
                <td>
                  <v-list-item
                    :prepend-avatar="
                      item.image != null
                        ? item.image
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
                  <v-chip
                    color="blue-darken-4"
                    label
                    style="background-color: #ecf0fc !important"
                  >
                    {{ item.roleName }}
                  </v-chip>
                </td>
                <td>{{ item.country_name }}</td>
                <td>{{ item.registered_on }}</td>
                <td>
                  <div class="d-flex">
                    <v-btn
                      color="green"
                      variant="text"
                      icon="mdi-pencil-outline"
                    ></v-btn>
                    <v-btn
                      color="red"
                      variant="text"
                      icon="mdi-trash-can-outline"
                    ></v-btn>
                  </div>
                </td>
              </tr>
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
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UserMaster',
  data: () => ({
    valid: false,
    isLoading: false,
    isSending: false,
    isSuccess: false,

    successMessage: '',

    input: {
      username: '',
      email: '',
      country: null,
      role: null,
      image: null,
    },

    resource: {
      country: [],
      role: [
        {
          name: 'Super Admin',
          value: 'S',
        },
        {
          name: 'Admin',
          value: 'A',
        },
      ],
    },

    rules: {
      nameRules: [
        (value) => {
          if (value) return true;

          return 'Name is requred.';
        },
        (value) => {
          if (value?.length >= 4) return true;

          return 'Username must be more than 4 characters.';
        },
        (value) => {
          if (value?.length <= 20) return true;

          return 'Username must be less than 20 characters.';
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
  mounted() {
    this.getUserData();
    this.getCountry();
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
          item.roleName.toLowerCase().includes(searchTextLower) ||
          item.country_name.toLowerCase().includes(searchTextLower)
      );
    },
  },
  methods: {
    save() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          name: this.input.username,
          email: this.input.email,
          role: this.input.role,
          country_id: this.input.country,
        };
        if (this.input.image !== null) {
          payload['file'] = this.input.image;
        }
        axios
          .post(`/register`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getUserData();
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
          })
          .finally(() => {
            this.isSending = false;
          });
      }
    },
    getUserData() {
      this.isLoading = true;
      axios
        .get(`/user`)
        .then((response) => {
          const data = response.data.data;
          console.log(data);
          this.items = data.map((item) => {
            return {
              id: item.id || 1,
              name: item.name || '',
              email: item.email || '',
              registered_on: item.registered_on || '',
              role: item.role || '',
              roleName:
                item.role == 'S'
                  ? 'Superadmin'
                  : item.role == 'A'
                  ? 'Admin'
                  : '',
              image: item.image || null,
              country_id: item.country_id || 1,
              country_name: item.country_name || '',
            };
          });
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
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
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.user-table {
  font-size: 12px;
  color: black !important;
}
</style>
