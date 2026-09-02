<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <div class="d-flex ml-4 mb-8" style="gap: 30px">
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/mall_master"
        >
          <h4>On-Board Mall</h4>
        </router-link>
        <router-link
          active-class="text-purple-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/mall-country"
        >
          <h4 class="mt-4">Country / City</h4>
        </router-link>
        <router-link
          active-class="text-purple-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/manage_parking_info"
        >
          <h4 class="mt-4">Manage Parking Info</h4>
        </router-link>
      </div>
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/merchants_master"
        >
          <h4>On-Board Merchants</h4>
        </router-link>

        <router-link
          active-class="text-purple-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/manage_events"
        >
          <h4 class="mt-4">Manage Events</h4>
        </router-link>
        <router-link
          active-class="text-purple-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/manage_mall_promos"
        >
          <h4 class="mt-4">Manage Mall Promos</h4>
        </router-link>
      </div>

      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/outlets_master"
        >
          <h4>On-Board Outlets</h4>
        </router-link>

        <router-link
          active-class="text-red-darken-4"
          style="color: black"
          class="text-decoration-none"
          to="/manage_levels"
        >
          <h4 class="mt-4">Manage Levels</h4>
        </router-link>
        <router-link
          active-class="text-red-darken-4"
          style="color: black"
          class="text-decoration-none"
          to="/manage_jobs"
        >
          <h4 class="mt-4">Manage Jobs</h4>
        </router-link>
      </div>
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/promotions_master"
        >
          <h4>On-Board Promotions</h4>
        </router-link>

        <router-link
          active-class="text-blue-darken-4"
          style="color: black"
          class="text-decoration-none"
          to="/manage_services"
        >
          <h4 class="mt-4">Manage Services</h4>
        </router-link>
      </div>

      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/tag-header"
        >
          <h4>Tag Header</h4>
        </router-link>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/displayed-banners"
        >
          <h4 class="mt-4">Displayed Banners</h4>
        </router-link>
      </div>
      <router-link
        active-class="text-blue-accent-4"
        style="color: black"
        class="text-decoration-none"
        to="/tag-master"
      >
        <h4>Tag Master</h4>
      </router-link>
    </div>
    <div class="d-flex ml-4 my-4" style="gap: 40px">
      <router-link
        active-class="text-black"
        style="color: #3e4aaf"
        class="text-decoration-none"
        to="/mall-country"
      >
        <h1>Country</h1>
      </router-link>
      <router-link
        active-class="text-black"
        style="color: #3e4aaf"
        class="text-decoration-none"
        to="/mall-city"
      >
        <h1>City</h1>
      </router-link>
    </div>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="3">
            <v-autocomplete
              clearable
              density="compact"
              label="Select Country"
              placeholder="Type a Country"
              :items="resource.country"
              item-title="name"
              item-value="id"
              v-model="input.country"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row class="mt-n2">
          <v-col cols="12" md="3">
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
          <v-col v-if="isEdit" cols="12" md="3">
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
            label="Search a Country"
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
                <th class="text-left">Country Name</th>
                <th class="text-left">User</th>
                <th class="text-left">Dated</th>
              </tr>
            </thead>
            <tbody>
              <tr class="country-table-body" v-for="item in filteredItems" :key="item.id">
                <td>
                  <v-img
                    height="40"
                    width="65"
                    :src="
                      item.image != null
                        ? $fileURL + item.image
                        : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                    "
                    ><template #placeholder> <div class="skeleton" /> </template
                  ></v-img>
                </td>
                <td style="font-weight: 500 !important">
                  {{ item.country }}
                </td>
                <td style="font-weight: 500 !important">
                  {{ item.user }}
                </td>
                <td style="font-weight: 500 !important">
                  {{ item.dated }}
                </td>
              </tr>
            </tbody>
          </v-table>
          <skeleton-table v-if="isLoading" :rows="5" :columns="4" />
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
      @confirm="deleteCountry"
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
  name: 'CountryMaster',
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
    countryIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    imageFile: [],
    countryDataToImage: {
      id: 0,
      country: null,
      code: null,
      national: null,
    },
    isOpenImage: false,
    input: {
      id: 0,
      image: null,
      country: null,
      code: null,
      national: null,
    },
    resource: {
      country: [],
      nationality: [],
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
      codeRules: [
        (value) => {
          if (value) return true;
          return 'Country code is requred.';
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
      nationalRules: [
        (value) => {
          if (value) return true;
          return 'Nationality is requred.';
        },
      ],
      countryRules: [
        (value) => {
          if (value) return true;
          return 'Country is requred.';
        },
      ],
    },
    search: '',
    items: [],
    // itemsTry: [
    //   {
    //     id: 1,
    //     image: '@/assets/indonesia.jpeg',
    //     country: 'Indonesia',
    //     code: '+62',
    //     national: 'Indonesian',
    //     isActive: true,
    //     isFav: true,
    //   },
    // ],
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.getCountryData();
    this.getCountryList();
    //this.getCountry();
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.items;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.items.filter((item) => item.country.toLowerCase().includes(searchTextLower));
    },
  },
  methods: {
    saveData() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          country_id: this.input.country,
        };
        axios
          .post(`/mall-country`, payload)
          .then((response) => {
            const data = response.data;
            this.notification.success(data.message);
            this.getCountryData();
            this.input = {
              id: 0,
              image: null,
              country: null,
              code: null,
              national: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message =
              error.response.data.message === ''
                ? 'Something Wrong!!!'
                : error.response.data.message;
            this.notification.error(message);
          })
          .finally(() => {
            this.isSending = false;
          });
      }
    },
    getCountryData() {
      this.isLoading = true;
      axios
        .get(`/mall-country`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);

          this.items = data.map((item) => {
            return {
              id: item.mc_id || 1,
              country_id: item.country_id || 1,
              country: item.country_name || '',
              image: item.flag || null,
              user: item.name || '',
              dated: item.dated || '',
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
    getCountryList() {
      this.isLoading = true;
      axios
        .get(`/countries`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);

          this.resource.country = data
            .sort((a, b) => a.country_name.localeCompare(b.country_name))
            .map((country) => {
              return {
                id: country.country_id || 1,
                name: country.country_name || '',
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
