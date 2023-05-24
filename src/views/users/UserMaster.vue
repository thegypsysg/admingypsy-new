<template>
  <v-container>
    <h1>Users Master</h1>
    <v-form validate-on="submit lazy" @submit.prevent="save">
      <v-container>
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="username"
              :rules="nameRules"
              :counter="20"
              label="Enter Username"
              variant="outlined"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="Enter Email"
              type="email"
              variant="outlined"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="3">
            <v-select
              clearable
              :rules="countryRules"
              label="Select Country"
              :items="resource.country"
              item-title="name"
              item-value="id"
              v-model="country"
              variant="outlined"
            ></v-select>
          </v-col>

          <v-col cols="12" md="3">
            <v-select
              clearable
              :rules="roleRules"
              :items="resource.role"
              item-title="name"
              item-value="value"
              label="Select Role"
              v-model="role"
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
              :disabled="!valid"
              @click="save"
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
              <tr v-for="item in items" :key="item.id">
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
                    {{
                      item.role == 'S'
                        ? 'Superadmin'
                        : item.role == 'A'
                        ? 'Admin'
                        : ''
                    }}
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
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </v-sheet>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UserMaster',
  data: () => ({
    valid: true,
    loading: false,

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

    username: '',
    nameRules: [
      (value) => {
        if (value) return true;

        return 'Name is requred.';
      },
      (value) => {
        if (value?.length >= 4) return true;

        return 'Name must be more than 4 characters.';
      },
      (value) => {
        if (value?.length <= 20) return true;

        return 'Name must be less than 20 characters.';
      },
    ],
    email: '',
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
    country: null,
    countryRules: [
      (value) => {
        if (value) return true;

        return 'Country is requred.';
      },
    ],
    role: null,
    roleRules: [
      (value) => {
        if (value) return true;

        return 'Role is requred.';
      },
    ],

    search: '',
    items: [
      {
        id: 1,
        name: 'Beta',
        email: 'beta@the-gypsy.in',
        registered_on: '15/05/2023',
        role: 'A',
        image: null,
        country_id: 1,
        country_name: 'Singapore',
      },
      {
        id: 2,
        name: 'test',
        email: 'test@mail.com',
        registered_on: '22/05/2023',
        role: 'S',
        image: null,
        country_id: 1,
        country_name: 'Singapore',
      },
    ],
  }),
  mounted() {
    this.getCountry();
  },
  methods: {
    save() {
      // this.loading = true;
      console.log(this.username);
      console.log(this.email);
      console.log(this.role);
      console.log(this.country);
    },
    getCountry() {
      axios
        .get(`https://admin1.the-gypsy.sg/api/country`)
        .then((response) => {
          const data = response.data.data;
          console.log(response);
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
