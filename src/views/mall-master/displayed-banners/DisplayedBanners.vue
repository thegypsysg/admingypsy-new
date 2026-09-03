<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <div class="d-flex ml-4 mb-4" style="gap: 30px">
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
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-autocomplete
              class="mt-8"
              density="compact"
              label="Type Merchant Name"
              placeholder="Type Merchant / Brand Name"
              :items="resource.mall"
              item-title="name"
              item-value="id"
              v-model="input.mall"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="9">
            <v-text-field
              v-model="input.name"
              label="Type Banner Name"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <!-- :prepend-icon="
              isEdit
                ? 'mdi-account-multiple-check'
                : 'mdi-account-multiple-plus'
            " -->
            <div>
              <v-btn
                color="indigo-accent-2"
                style="text-transform: none"
                type="submit"
                variant="flat"
                class="w-100"
                @click="isEdit ? saveEdit() : saveData()"
                :disabled="isSending"
                :loading="isSending"
              >
                <!-- <template v-slot:prepend>
                  <v-icon color="white"></v-icon>
                </template> -->

                {{ isEdit ? 'Save Banner' : 'Add Banner' }}
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
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <v-sheet class="py-6 px-4 mt-10" border rounded width="100%">
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
                <th class="text-left font-weight-bold text-blue-accent-4">Banner id</th>
                <th class="text-left font-weight-bold text-black">Merchant Name</th>
                <th class="text-left font-weight-bold text-blue-accent-4">Banner Header</th>
                <th class="text-left font-weight-bold text-black">User</th>
                <th class="text-left font-weight-bold text-black">Dated</th>
                <th class="text-left font-weight-bold text-black"></th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in filteredItems" :key="item.id">
                <tr class="country-table-body">
                  <td>{{ item.id }}</td>
                  <td>{{ item.partner }}</td>
                  <td>{{ item.name }}</td>

                  <td>
                    {{ item.user }}
                  </td>
                  <td>
                    {{ item.dated }}
                  </td>
                  <td>
                    <div class="d-flex">
                      <v-btn color="green" variant="text" @click="editBanner(item)" icon>
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
                  <td colspan="6">
                    <div class="d-flex flex-column justify-start">
                      <v-table class="text-left mt-2 w-66">
                        <tr>
                          <td class="pl-16">
                            <v-btn-toggle
                              style="
                                font-size: 10px !important;
                                font-weight: 200 !important;
                                height: 22px !important;
                                width: 54px !important;
                              "
                              class="d-flex align-center"
                              v-model="item.isActive"
                              :disabled="isSending2"
                              rounded="5"
                              @click="activeBanners(item.id)"
                            >
                              <v-btn size="27" :value="true"> Yes </v-btn>

                              <v-btn size="27" :value="false"> No </v-btn>
                            </v-btn-toggle>
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
                              v-model="item.isFeatured"
                              :disabled="isSending2"
                              rounded="5"
                              @click="featuredBanner(item.id)"
                            >
                              <v-btn size="27" :value="true"> Yes </v-btn>

                              <v-btn size="27" :value="false"> No </v-btn>
                            </v-btn-toggle>
                          </td>
                          <td class="pl-4">
                            <div class="d-flex justify-start" style="gap: 20px">
                              <router-link
                                class="text-decoration-none"
                                :to="`/displayed-banners/main-info/${item.id}`"
                              >
                                <span>Main Info</span>
                              </router-link>
                              <router-link
                                class="text-decoration-none"
                                :to="`/displayed-banners/outlets/${item.id}/${item.mall_id}`"
                              >
                                <span
                                  >Outlets (<span class="text-red"> {{ item.outlets }} </span
                                  >)</span
                                >
                              </router-link>
                            </div>
                          </td>
                        </tr>
                      </v-table>
                      <v-table class="text-left pt-2 pr-16 w-66">
                        <tr>
                          <td class="pt-2 pr-1 d-flex">
                            <h4 class="mt-2 mr-4">Tags</h4>
                            <v-autocomplete
                              v-model="item.selectedTag"
                              class="form-control search-input"
                              item-title="name"
                              item-value="id"
                              :items="resource.tags"
                              placeholder="Enter Tag Name"
                              density="compact"
                              variant="outlined"
                              color="blue-grey-lighten-2"
                            >
                              <template #item="{ props, item }">
                                <div class="mb-2" v-bind="props">
                                  <div class="d-flex align-center w-100">
                                    <div class="w-25 py-1">
                                      <div>
                                        <v-img
                                          height="40"
                                          loading="lazy"
                                          lazy-src="data:image/svg+xml,%3Csvg xmlns%3D%22http%3A//www.w3.org/2000/svg%22 width%3D%221%22 height%3D%221%22%3E%3C/svg%3E"
                                          :src="item?.raw?.image"
                                        >
                                          <template #placeholder>
                                            <div class="skeleton" />
                                          </template>
                                        </v-img>
                                      </div>
                                    </div>
                                    <div class="w-75" style="font-size: 12px">
                                      <p class="mb-1">
                                        {{ `${item?.raw?.name}` }}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </template>
                            </v-autocomplete>

                            <v-btn
                              class="ml-4"
                              color="indigo-accent-2"
                              style="text-transform: none"
                              type="submit"
                              variant="flat"
                              @click="addTagById(item)"
                              :disabled="item.loadingTag"
                              :loading="item.loadingTag"
                            >
                              Add Tag
                            </v-btn>
                          </td>
                        </tr>
                      </v-table>
                      <v-table class="text-left pt-4 pb-2">
                        <tr>
                          <td>
                            <v-row>
                              <v-col cols="6">
                                <!-- <div
                                  v-for="tag in item.tagHeaderItems.slice(0, 5)"
                                  :key="tag.id"
                                > -->
                                <v-row>
                                  <v-col cols="4">
                                    <p class="mt-2">Category Tag</p>
                                  </v-col>
                                  <v-col cols="1">
                                    <p class="mt-2">:</p>
                                  </v-col>
                                  <v-col class="d-flex flex-wrap" cols="7">
                                    <template v-if="item.tagHeaderItems?.CAT?.length > 0">
                                      <v-chip
                                        v-for="tagItem in item.tagHeaderItems?.CAT"
                                        :key="tagItem.mpt_id"
                                        color="primary"
                                        dark
                                        small
                                        class="mr-1 mb-1"
                                      >
                                        {{ tagItem.tag_name }}
                                        <v-icon
                                          color="red"
                                          small
                                          @click="deleteTagById(tagItem.mdt_id)"
                                        >
                                          mdi-close
                                        </v-icon>
                                      </v-chip>
                                    </template>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="4">
                                    <p class="mt-2">Preference Tag</p>
                                  </v-col>
                                  <v-col cols="1">
                                    <p class="mt-2">:</p>
                                  </v-col>
                                  <v-col class="d-flex flex-wrap" cols="7">
                                    <template v-if="item.tagHeaderItems?.PT?.length > 0">
                                      <v-chip
                                        v-for="tagItem in item.tagHeaderItems?.PT"
                                        :key="tagItem.mpt_id"
                                        color="primary"
                                        dark
                                        small
                                        class="mr-1 mb-1"
                                      >
                                        {{ tagItem.tag_name }}
                                        <v-icon
                                          color="red"
                                          small
                                          @click="deleteTagById(tagItem.mdt_id)"
                                        >
                                          mdi-close
                                        </v-icon>
                                      </v-chip>
                                    </template>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="4">
                                    <p class="mt-2">Meals Tag</p>
                                  </v-col>
                                  <v-col cols="1">
                                    <p class="mt-2">:</p>
                                  </v-col>
                                  <v-col class="d-flex flex-wrap" cols="7">
                                    <template v-if="item.tagHeaderItems?.MT?.length > 0">
                                      <v-chip
                                        v-for="tagItem in item.tagHeaderItems?.MT"
                                        :key="tagItem.mpt_id"
                                        color="primary"
                                        dark
                                        small
                                        class="mr-1 mb-1"
                                      >
                                        {{ tagItem.tag_name }}
                                        <v-icon
                                          color="red"
                                          small
                                          @click="deleteTagById(tagItem.mdt_id)"
                                        >
                                          mdi-close
                                        </v-icon>
                                      </v-chip>
                                    </template>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="4">
                                    <p class="mt-2">People Tag</p>
                                  </v-col>
                                  <v-col cols="1">
                                    <p class="mt-2">:</p>
                                  </v-col>
                                  <v-col class="d-flex flex-wrap" cols="7">
                                    <template v-if="item.tagHeaderItems?.PPLT?.length > 0">
                                      <v-chip
                                        v-for="tagItem in item.tagHeaderItems?.PPLT"
                                        :key="tagItem.mpt_id"
                                        color="primary"
                                        dark
                                        small
                                        class="mr-1 mb-1"
                                      >
                                        {{ tagItem.tag_name }}
                                        <v-icon
                                          color="red"
                                          small
                                          @click="deleteTagById(tagItem.mdt_id)"
                                        >
                                          mdi-close
                                        </v-icon>
                                      </v-chip>
                                    </template>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="4">
                                    <p class="mt-2">Discount Tag</p>
                                  </v-col>
                                  <v-col cols="1">
                                    <p class="mt-2">:</p>
                                  </v-col>
                                  <v-col class="d-flex flex-wrap" cols="7">
                                    <template v-if="item.tagHeaderItems?.DT?.length > 0">
                                      <v-chip
                                        v-for="tagItem in item.tagHeaderItems?.DT"
                                        :key="tagItem.mpt_id"
                                        color="primary"
                                        dark
                                        small
                                        class="mr-1 mb-1"
                                      >
                                        {{ tagItem.tag_name }}
                                        <v-icon
                                          color="red"
                                          small
                                          @click="deleteTagById(tagItem.mdt_id)"
                                        >
                                          mdi-close
                                        </v-icon>
                                      </v-chip>
                                    </template>
                                  </v-col>
                                </v-row>
                                <!-- </div> -->
                              </v-col>
                              <v-col cols="6">
                                <!-- <div
                                  v-for="tag in item.tagHeaderItems.slice(5)"
                                  :key="tag.id"
                                > -->
                                <v-row>
                                  <v-col cols="4">
                                    <p class="mt-2">Days Tag</p>
                                  </v-col>
                                  <v-col cols="1">
                                    <p class="mt-2">:</p>
                                  </v-col>
                                  <v-col class="d-flex flex-wrap" cols="7">
                                    <template v-if="item.tagHeaderItems?.DAYST?.length > 0">
                                      <v-chip
                                        v-for="tagItem in item.tagHeaderItems?.DAYST"
                                        :key="tagItem.mpt_id"
                                        color="primary"
                                        dark
                                        small
                                        class="mr-1 mb-1"
                                      >
                                        {{ tagItem.tag_name }}
                                        <v-icon
                                          color="red"
                                          small
                                          @click="deleteTagById(tagItem.mdt_id)"
                                        >
                                          mdi-close
                                        </v-icon>
                                      </v-chip>
                                    </template>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="4">
                                    <p class="mt-2">Voucher Tag</p>
                                  </v-col>
                                  <v-col cols="1">
                                    <p class="mt-2">:</p>
                                  </v-col>
                                  <v-col class="d-flex flex-wrap" cols="7">
                                    <template v-if="item.tagHeaderItems?.VT?.length > 0">
                                      <v-chip
                                        v-for="tagItem in item.tagHeaderItems?.VT"
                                        :key="tagItem.mpt_id"
                                        color="primary"
                                        dark
                                        small
                                        class="mr-1 mb-1"
                                      >
                                        {{ tagItem.tag_name }}
                                        <v-icon
                                          color="red"
                                          small
                                          @click="deleteTagById(tagItem.mdt_id)"
                                        >
                                          mdi-close
                                        </v-icon>
                                      </v-chip>
                                    </template>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="4">
                                    <p class="mt-2">Other Tag</p>
                                  </v-col>
                                  <v-col cols="1">
                                    <p class="mt-2">:</p>
                                  </v-col>
                                  <v-col class="d-flex flex-wrap" cols="7">
                                    <template v-if="item.tagHeaderItems?.OPT?.length > 0">
                                      <v-chip
                                        v-for="tagItem in item.tagHeaderItems?.OPT"
                                        :key="tagItem.mpt_id"
                                        color="primary"
                                        dark
                                        small
                                        class="mr-1 mb-1"
                                      >
                                        {{ tagItem.tag_name }}
                                        <v-icon
                                          color="red"
                                          small
                                          @click="deleteTagById(tagItem.mdt_id)"
                                        >
                                          mdi-close
                                        </v-icon>
                                      </v-chip>
                                    </template>
                                  </v-col>
                                </v-row>
                                <!-- </div> -->
                              </v-col>
                            </v-row>
                          </td>
                        </tr>
                      </v-table>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </v-table>
          <skeleton-table v-if="isLoading" :rows="5" :columns="6" />
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
      @confirm="deleteBanner"
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
  name: 'DisplayedBanners',
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
    activeMalls: [],
    partnerName: null,
    valid: false,
    isLoading: false,
    requestCount: 0,
    isSending: false,
    isSending2: false,
    isEdit: false,
    isDelete: false,
    isDeleteLoading: false,
    bannerIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    isOpenImage: false,
    imageFile: [],

    bannerDataToImage: {
      id: 0,
      name: null,
      industry: null,
      subIndustry: null,
      country: null,
    },
    tagId: null,
    input: {
      id: 0,
      mall: null,
      name: '',
    },
    rules: {
      countryRules: [
        (value) => {
          if (value) return true;
          return 'Country is required.';
        },
      ],
      townRules: [
        (value) => {
          if (value) return true;
          return 'Town is required.';
        },
      ],

      cityRules: [
        (value) => {
          if (value) return true;
          return 'City is required.';
        },
      ],
      zoneRules: [
        (value) => {
          if (value) return true;
          return 'Zone is required.';
        },
      ],
      locationRules: [
        (value) => {
          if (value) return true;
          return 'Location is required.';
        },
      ],
      latitudeRules: [
        (value) => {
          if (value) return true;
          return 'Latitude is required.';
        },
      ],
      longitudeRules: [
        (value) => {
          if (value) return true;
          return 'Longitude is required.';
        },
      ],
      addressRules: [
        (value) => {
          if (value) return true;
          return 'Address is required.';
        },
      ],
    },
    search: '',
    items: [],
    resource: {
      tags: [],
      mall: [],
      country: [],
      city: [],
      town: [],
      subIndustry: [],
    },
    // itemsTry: [
    //   {
    //     id: 1,
    //     name: 'Pappa Rich',
    //     country: 'Singapore',
    //     isActive: false,
    //     isFeatured: false,
    //     user: 'Charlton',
    //     dated: '15/08/2023',
    //     type: 'Restaurant',
    //     outlets: 5,
    //     malls: 2,
    //   },
    // ],
  }),
  watch: {
    requestCount() {
      if (this.requestCount === 0) {
        this.isLoading = false;
      }
    },
  },
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.getItemsData();
    this.getPartnerData();
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.items.slice(0, 5);
      }
      const searchTextLower = this.search.toLowerCase();
      return this.items
        .filter(
          (item) =>
            item.name.toLowerCase().includes(searchTextLower) ||
            item.partner.toLowerCase().includes(searchTextLower)
        )
        .slice(0, 5);
    },
    mallCountry() {
      return this.resource?.mall.find((item) => item.id === this.input.mall);
    },
  },
  methods: {
    editBanner(item) {
      this.isEdit = true;
      this.input = {
        id: item.id,
        mall: item.mall_id,
        name: item.name,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        id: 0,
        mall: null,
        name: '',
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          md_id: this.input.id,
          merchant_id: this.input.mall,
          display_header: this.input.name,
        };
        axios
          .post(`/mall-displays/update`, payload)
          .then((response) => {
            const data = response.data;
            this.notification.success(data.message);
            this.getItemsData();
            this.input = {
              id: 0,
              mall: null,
              name: '',
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.partner_id
              ? error.response.data.partner_id[0]
              : error.response.data.message === ''
              ? 'Something Wrong!!!'
              : error.response.data.message;
            this.notification.error(message);
            this.input = {
              id: 0,
              mall: null,
              name: '',
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
          merchant_id: this.input.mall,
          display_header: this.input.name,
        };
        axios
          .post(`/mall-displays`, payload)
          .then((response) => {
            const data = response.data;
            this.notification.success(data.message);
            this.getItemsData();
            this.input = {
              id: 0,
              mall: null,
              name: '',
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.partner_id
              ? error.response.data.partner_id[0]
              : error.response.data.merchant_id
              ? error.response.data.merchant_id[0]
              : error.response.data.message === ''
              ? 'Something Wrong!!!'
              : error.response.data.message;
            this.notification.error(message);
          })
          .finally(() => {
            this.isSending = false;
          });
      }
    },
    cancelDelete() {
      this.bannerIdToDelete = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.bannerIdToDelete = itemId;
      this.isDelete = true;
    },
    cancelConfirmation() {
      this.bannerIdToDelete = null;
      this.isDelete = false;
    },
    deleteBanner() {
      this.isDeleteLoading = true;
      axios
        .delete(`/mall-displays/${this.bannerIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getItemsData();
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
          this.bannerIdToDelete = null;
          this.isDelete = false;
        });
    },
    async getItemsData() {
      this.isLoading = true;
      this.requestCount = 0; // Reset request count
      try {
        let items = await this.getBannersData();
        this.items = items;
        this.requestCount++;

        items = await Promise.all(
          items.map(async (item) => {
            const tagHeaderItems = await this.getTagsHeaderDataById(item.id);
            this.requestCount++;
            return {
              ...item,
              selectedTag: null,
              loadingTag: false,
              tagHeaderItems: tagHeaderItems,
            };
          })
        );

        this.items = items;
        console.log(items);
      } catch (error) {
        console.error('Error fetching items data:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async getBannersData() {
      this.isLoading = true;
      try {
        const response = await axios.get(`/mall-displays`);
        const data = response.data.data;

        this.getTagsData();
        return data
          .sort((a, b) => b.md_id - a.md_id)
          .map((item) => {
            return {
              id: item.md_id || 1,
              mall_id: item.merchant_id || 1,
              name: item.display_header || '',
              partner: item.partner_name || '',
              description: item.display_description || '',
              start_date: item.start_date || '',
              end_date: item.end_date || '',
              // partner_id: item.partner_id || null,
              // country: item.country_name || '',
              // country_id: item.country_id || null,
              isActive: item.active == 'N' ? false : item.active == 'Y' ? true : null,
              isFeatured: item.featured == 'N' ? false : item.featured == 'Y' ? true : null,
              image: item.image || null,
              user: item.name || '',
              user_id: item.user_id || '',
              dated: item.dated || '',
              // type: item.sub_industry_name || '',
              // sub_industry_id: item.sub_industry_id || null,
              outlets: item.display_outlet_count || 0,
              // malls: 2,
            };
          });
      } catch (error) {
        console.log(error);
        const message =
          error.response.data.message === '' ? 'Something Wrong!!!' : error.response.data.message;
        this.notification.error(message);
      } finally {
        this.isLoading = false;
      }
    },
    getPartnerData() {
      axios
        .get(`/partners`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.partnerName = data
            .filter((i) => i.partner_id == this.idPartnerLocations)
            .map((item) => item.partner_name || '')[0];
          this.resource.mall = data.map((item) => {
            return {
              id: item.partner_id || 1,
              name: item.partner_name || '',
              country: item?.country,
              sub_industry: item?.sub_industry,
            };
          });
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === '' ? 'Something Wrong!!!' : error.response.data.message;
          this.notification.error(message);
        });
    },
    async getTagsHeaderDataById(id) {
      // this.isLoading = true;
      try {
        const response = await axios.get(`/mall-display-tags/${id}/tags-by-tag-header`);
        const data = response.data.data;
        //const newData = [];
        //for (const key in data) {
        //  if (Object.prototype.hasOwnProperty.call(data, key)) {
        //    let title = '';
        //    if (key === 'DT') {
        //      title = 'Discount Tag';
        //    } else if (key === 'CAT') {
        //      title = 'Category Tag';
        //    } else if (key === 'PPLT') {
        //      title = 'People Tag';
        //    } else if (key === 'MT') {
        //      title = 'Meals Tag';
        //    } else if (key === 'PT') {
        //      title = 'Preference Tag';
        //    } else if (key === 'DAYST') {
        //      title = 'Days Tag';
        //    } else if (key === 'VT') {
        //      title = 'Voucher Tag';
        //    } else if (key === 'OPT') {
        //      title = 'Other Tag';
        //    }
        //    newData.push({
        //      title,
        //      tags: data[key].map((item) => {
        //        return {
        //          id: item.mpt_id || 0,
        //          name: item.tag_name || '',
        //        };
        //      }),
        //    });
        // }
        // }
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
      // finally {
      //   this.isLoading = false;
      // }
    },
    addTagById(item) {
      item.loadingTag = true;
      const payload = {
        tag_id: item.selectedTag,
        md_id: item.id,
      };
      console.log(payload);
      axios
        .post(`/mall-display-tags`, payload)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getItemsData();
          item.selectedTag = null;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message = error.response.data.partner_id
            ? error.response.data.partner_id[0]
            : error.response.data.message === ''
            ? 'Something Wrong!!!'
            : error.response.data.message;
          this.notification.error(message);
        })
        .finally(() => {
          item.loadingTag = false;
        });
    },
    deleteTagById(id) {
      this.isDeleteLoading = true;
      axios
        .delete(`/mall-display-tags/${id}`)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getItemsData();
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
          this.isDelete = false;
        });
    },
    getTagsData() {
      this.isLoading = true;
      axios
        .get(`/tags`)
        .then((response) => {
          const data = response.data.data;
          this.resource.tags = data
            .sort((a, b) => a.tag_name.localeCompare(b.tag_name))
            .map((item) => {
              return {
                id: item.tag_id || 1,
                name: item.tag_name || '',
                image: item.tag_image ? this.$fileURL + item.tag_image : null,
              };
            });
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
    activeBanners(id) {
      this.isSending2 = true;
      axios
        .get(`/mall-displays/toggle-active/${id}`)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getItemsData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === '' ? 'Something Wrong!!!' : error.response.data.message;
          this.notification.error(message);
        })
        .finally(() => {
          this.isSending2 = false;
        });
    },
    featuredBanner(id) {
      this.isSending2 = true;
      axios
        .get(`/mall-displays/toggle-featured/${id}`)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getItemsData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === '' ? 'Something Wrong!!!' : error.response.data.message;
          this.notification.error(message);
        })
        .finally(() => {
          this.isSending2 = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.country-table {
  font-size: 12px;
  color: rgb(100, 100, 100) !important;
  overflow-y: hidden !important;
}

.country-table-body {
  margin-top: 50px !important;
  margin-bottom: 50px !important;
  color: #a12a3d;
  font-weight: 500;
}

.country-table-body td {
  border-bottom: none !important;
}
.app-column {
  display: flex;
  align-items: center;
  min-height: 70px;
  margin-bottom: 10px;
}

.app-column-table {
  min-height: 70px;
  margin-bottom: 10px !important;
}
.app-img {
  border: 1px solid grey !important;
  cursor: pointer !important;
}

.app-column-table th {
  text-align: left;
  font-weight: 600;
  padding-bottom: 5px !important;
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
