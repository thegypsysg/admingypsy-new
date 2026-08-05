<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <div class="d-flex ml-4 mb-4" style="gap: 30px">
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/menu-management"
        >
          <h4>Menu Management</h4>
        </router-link>
      </div>

      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/menu-category"
        >
          <h4>Menu Categories</h4>
        </router-link>
      </div>
    </div>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-autocomplete
              density="compact"
              label="Restaurant Name"
              variant="outlined"
              required
              v-model="input.restaurant_id"
              :items="resource.restaurantName"
              item-title="name"
              item-value="id"
            >
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              density="compact"
              label="Menu Category"
              variant="outlined"
              required
              v-model="input.mc_id"
              :items="resource.categories"
              item-title="name"
              item-value="id"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              density="compact"
              label="Dish Name"
              variant="outlined"
              required
              v-model="input.dish_id"
              :items="resource.dishName"
              item-title="name"
              item-value="id"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <div class="d-flex justify-space-between align-center w-100">
              <div
                class="d-flex align-content-center p-0 mt-n5 mr-2"
                style="
                  height: 40px;
                  overflow-y: hidden;
                  border-radius: 5px;
                  border: 1px grey solid;
                  min-width: 13 0px;
                "
              >
                <div
                  class="d-flex justify-center align-center w-33"
                  style="background: #e9ecef"
                >
                  <h4 style="color: #077cff">S$</h4>
                </div>
                <v-text-field
                  class="w-66"
                  style="margin-top: -1px"
                  variant="outlined"
                  type="number"
                  inputmode="numeric"
                  density="compact"
                  placeholder="0"
                ></v-text-field>
                <!-- v-model="item.rate"
                        @input="debouncedUpdate(item.mrp_id, item.rate, 'rate')" -->
              </div>
              <v-autocomplete
                density="compact"
                label="Quantity"
                variant="outlined"
                required
                :items="resource.quantity"
                item-title="name"
                item-value="id"
                style="min-width: 200px"
              ></v-autocomplete>
              <!-- v-model="item.pq_id"
                      @update:modelValue="updateQuantity(item)" -->
            </div>
          </v-col>
          <v-col cols="12" md="4">
            <div class="pb-4 d-flex ga-4">
              <div style="font-size: 12px; font-weight: 600" class="mr-2">
                <p>Active</p>

                <v-btn-toggle
                  style="
                    font-size: 10px !important;
                    font-weight: 200 !important;
                    height: 22px !important;
                    width: 54px !important;
                  "
                  class="d-flex align-center"
                  :disabled="isSending2"
                  rounded="5"
                >
                  <!-- v-model="item.isActive"
                  @click="togglePrice(item.mrp_id, 'active')" -->
                  <v-btn size="27" :value="true"> Yes </v-btn>

                  <v-btn size="27" :value="false"> No </v-btn>
                </v-btn-toggle>
              </div>

              <div style="font-size: 12px; font-weight: 600">
                <p>Live</p>
                <v-btn-toggle
                  style="
                    font-size: 10px !important;
                    font-weight: 200 !important;
                    height: 22px !important;
                    width: 54px !important;
                  "
                  class="d-flex align-center"
                  :disabled="isSending2"
                  rounded="5"
                >
                  <!-- v-model="item.isLive"
                  @click="togglePrice(item.mrp_id, 'live')" -->
                  <v-btn size="27" :value="true"> Yes </v-btn>

                  <v-btn size="27" :value="false"> No </v-btn>
                </v-btn-toggle>
              </div>

              <div style="font-size: 12px; font-weight: 600" class="ml-2">
                <p>Veg</p>
                <v-btn-toggle
                  style="
                    font-size: 10px !important;
                    font-weight: 200 !important;
                    height: 22px !important;
                    width: 54px !important;
                  "
                  class="d-flex align-center"
                  :disabled="isSending3"
                  rounded="5"
                >
                  <!-- v-model="item.isVeg"
                  @click="toggleField(item.mrp_id, 'veg')" -->
                  <v-btn size="27" :value="true"> Yes </v-btn>

                  <v-btn size="27" :value="false"> No </v-btn>
                </v-btn-toggle>
              </div>
              <div style="font-size: 12px; font-weight: 600" class="ml-1">
                <p>Non Veg</p>
                <v-btn-toggle
                  style="
                    font-size: 10px !important;
                    font-weight: 200 !important;
                    height: 22px !important;
                    width: 54px !important;
                  "
                  class="d-flex align-center"
                  :disabled="isSending3"
                  rounded="5"
                >
                  <!-- v-model="item.isNonVeg"
                  @click="toggleField(item.mrp_id, 'non-veg')" -->
                  <v-btn size="27" :value="true"> Yes </v-btn>

                  <v-btn size="27" :value="false"> No </v-btn>
                </v-btn-toggle>
              </div>
              <div style="font-size: 12px; font-weight: 600" class="ml-2">
                <p>Halal</p>
                <v-btn-toggle
                  style="
                    font-size: 10px !important;
                    font-weight: 200 !important;
                    height: 22px !important;
                    width: 54px !important;
                  "
                  class="d-flex align-center"
                  :disabled="isSending3"
                  rounded="5"
                >
                  <!-- v-model="item.isHalal"
                  @click="toggleField(item.mrp_id, 'halal')" -->
                  <v-btn size="27" :value="true"> Yes </v-btn>

                  <v-btn size="27" :value="false"> No </v-btn>
                </v-btn-toggle>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="4">
            <div class="d-flex align-center justify-space-between">
              <div class="image-upload-cont">
                <v-img
                  class="image-upload-item"
                  height="40"
                  style="cursor: pointer"
                  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                >
                  <!-- @click="openImage(item)"
                        :src="
                          item?.main_image != null
                            ? $fileURL + item.main_image
                            : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                        " -->
                  <template #placeholder> <div class="skeleton" /> </template
                ></v-img>
              </div>
              <div class="d-flex align-center">
                <fieldset
                  style="
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    padding: 0 8px 4px 8px;
                    position: relative;
                    min-width: 200px;
                  "
                >
                  <legend
                    style="
                      font-size: 11px;
                      font-weight: bold;
                      color: #666;
                      padding: 0 4px;
                      margin-left: 8px;
                    "
                  >
                    Preparation Time
                  </legend>
                  <div class="d-flex align-center mt-1">
                    <!-- v-model="item.prep_id"
                  @update:modelValue="updatePrepTime(item)" -->
                    <v-select
                      density="compact"
                      :items="resource.prepTime"
                      variant="plain"
                      hide-details
                      item-title="name"
                      item-value="id"
                      class="pa-0 ma-0 font-weight-bold text-blue-accent-4"
                      style="font-size: 14px"
                    ></v-select>
                  </div>
                </fieldset>
                <div
                  class="d-flex align-center font-weight-bold ml-2"
                  style="font-size: 12px"
                >
                  Mins
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
        <v-row class="d-flex align-baseline">
          <v-col cols="12" md="2">
            <v-btn
              :prepend-icon="
                isEdit
                  ? 'mdi-account-multiple-check'
                  : 'mdi-account-multiple-plus'
              "
              color="indigo-accent-2"
              style="text-transform: none; margin-top: -30px !important"
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
          <v-col cols="12" md="2">
            <v-btn
              v-if="isEdit"
              prepend-icon="mdi-account-multiple-remove"
              color="red"
              style="text-transform: none; margin-top: -30px !important"
              variant="flat"
              class="w-100 mt-8"
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
                <th class="text-left">Dish Name</th>
                <th class="text-left"></th>
                <th class="text-left">Restaurant Name</th>
                <th class="text-left">Neighbourhood</th>
                <th class="text-left">Rate</th>
                <th class="text-left">User</th>
                <th class="text-left">Dated</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in filteredItems" :key="item.mrp_id">
                <tr>
                  <td class="border-b-0 pt-3 pb-2">
                    {{ item.mrp_id }}
                  </td>
                  <td class="border-b-0 pt-3 pb-2">
                    <div class="image-upload-cont">
                      <v-img
                        class="image-upload-item"
                        height="40"
                        @click="openImage(item)"
                        style="cursor: pointer"
                        :src="
                          item?.main_image != null
                            ? $fileURL + item.main_image
                            : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                        "
                      >
                        <template #placeholder>
                          <div class="skeleton" /> </template
                      ></v-img>
                    </div>
                  </td>
                  <td class="border-b-0 font-weight-bold pt-3 pb-2">
                    {{ item?.dish?.dish_name }}
                    <p
                      class="text-blue-darken-1 font-weight-medium text-caption mt-2"
                    >
                      {{ item?.menu_category?.menu_header }}
                    </p>
                  </td>
                  <td
                    style="max-width: 300px"
                    class="border-b-0 font-weight-bold pt-3 pb-2"
                  >
                    {{ item?.restaurant?.partner?.partner_name }}
                  </td>
                  <td class="border-b-0 font-weight-bold pt-3 pb-2">
                    {{
                      item?.restaurant?.partner_location?.town?.town_name || '-'
                    }}
                  </td>
                  <td
                    style="max-width: 300px"
                    class="border-b-0 font-weight-bold pt-3 pb-2"
                  >
                    <div
                      class="d-flex align-content-center p-0"
                      style="
                        height: 40px;
                        overflow-y: hidden;
                        border-radius: 5px;
                        border: 1px grey solid;
                        min-width: 13 0px;
                      "
                    >
                      <div
                        class="d-flex justify-center align-center w-33"
                        style="background: #e9ecef"
                      >
                        <h4 style="color: #077cff">S$</h4>
                      </div>
                      <v-text-field
                        class="w-66"
                        style="margin-top: -1px"
                        variant="outlined"
                        type="number"
                        inputmode="numeric"
                        density="compact"
                        placeholder="0"
                        v-model="item.rate"
                        @input="debouncedUpdate(item.mrp_id, item.rate, 'rate')"
                      ></v-text-field>
                    </div>
                  </td>
                  <td class="border-b-0 font-weight-bold pt-3 pb-2">
                    {{ item.userName }}
                  </td>
                  <td class="border-b-0 font-weight-bold pt-3 pb-2">
                    {{ item.dated }}
                  </td>
                  <td class="border-b-0 pt-3 pb-2">
                    <div class="d-flex">
                      <v-btn
                            color="green"
                            variant="text" @click="editMenuPrices(item)"
                            icon="mdi-pencil-outline"
                          >  <v-tooltip location="top" activator="parent">Edit</v-tooltip>
</v-btn>
                      <v-btn
                            color="red" variant="text"
                            :disabled="isDeleteLoading"
                            @click="openDeleteConfirm(item.mrp_id)"
                            icon="mdi-trash-can-outline"
                          >  <v-tooltip location="top" activator="parent">Delete</v-tooltip>
</v-btn>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="border-b-0"></td>
                  <td class="pb-3 border-b-0" colspan="2">
                    <v-textarea
                      density="compact"
                      v-model="item.dish_description"
                      @input="
                        debouncedUpdate(
                          item.mrp_id,
                          item.dish_description,
                          'dish_description',
                        )
                      "
                      placeholder="Dish Description details"
                      variant="outlined"
                      hide-details
                      rows="2"
                      style="min-width: 200px"
                    ></v-textarea>
                  </td>
                  <td class="pb-3 border-b-0">
                    <v-autocomplete
                      density="compact"
                      label="Quantity"
                      variant="outlined"
                      required
                      v-model="item.pq_id"
                      :items="resource.quantity"
                      item-title="name"
                      item-value="id"
                      @update:modelValue="updateQuantity(item)"
                      style="min-width: 200px"
                    ></v-autocomplete>
                  </td>
                  <td class="border-b-0" colspan="2">
                    <div class="pt-2 pb-4 d-flex ga-4">
                      <div
                        style="font-size: 12px; font-weight: 600"
                        class="mr-2"
                      >
                        <p>Active</p>

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
                          @click="togglePrice(item.mrp_id, 'active')"
                          rounded="5"
                        >
                          <v-btn size="27" :value="true"> Yes </v-btn>

                          <v-btn size="27" :value="false"> No </v-btn>
                        </v-btn-toggle>
                      </div>

                      <div style="font-size: 12px; font-weight: 600">
                        <p>Live</p>
                        <v-btn-toggle
                          style="
                            font-size: 10px !important;
                            font-weight: 200 !important;
                            height: 22px !important;
                            width: 54px !important;
                          "
                          class="d-flex align-center"
                          v-model="item.isLive"
                          :disabled="isSending2"
                          @click="togglePrice(item.mrp_id, 'live')"
                          rounded="5"
                        >
                          <v-btn size="27" :value="true"> Yes </v-btn>

                          <v-btn size="27" :value="false"> No </v-btn>
                        </v-btn-toggle>
                      </div>

                      <div
                        style="font-size: 12px; font-weight: 600"
                        class="ml-2"
                      >
                        <p>Veg</p>
                        <v-btn-toggle
                          style="
                            font-size: 10px !important;
                            font-weight: 200 !important;
                            height: 22px !important;
                            width: 54px !important;
                          "
                          class="d-flex align-center"
                          v-model="item.isVeg"
                          :disabled="isSending3"
                          @click="toggleField(item.mrp_id, 'veg')"
                          rounded="5"
                        >
                          <v-btn size="27" :value="true"> Yes </v-btn>

                          <v-btn size="27" :value="false"> No </v-btn>
                        </v-btn-toggle>
                      </div>
                      <div
                        style="font-size: 12px; font-weight: 600"
                        class="ml-1"
                      >
                        <p>Non Veg</p>
                        <v-btn-toggle
                          style="
                            font-size: 10px !important;
                            font-weight: 200 !important;
                            height: 22px !important;
                            width: 54px !important;
                          "
                          class="d-flex align-center"
                          v-model="item.isNonVeg"
                          :disabled="isSending3"
                          @click="toggleField(item.mrp_id, 'non-veg')"
                          rounded="5"
                        >
                          <v-btn size="27" :value="true"> Yes </v-btn>

                          <v-btn size="27" :value="false"> No </v-btn>
                        </v-btn-toggle>
                      </div>
                      <div
                        style="font-size: 12px; font-weight: 600"
                        class="ml-2"
                      >
                        <p>Halal</p>
                        <v-btn-toggle
                          style="
                            font-size: 10px !important;
                            font-weight: 200 !important;
                            height: 22px !important;
                            width: 54px !important;
                          "
                          class="d-flex align-center"
                          v-model="item.isHalal"
                          :disabled="isSending3"
                          @click="toggleField(item.mrp_id, 'halal')"
                          rounded="5"
                        >
                          <v-btn size="27" :value="true"> Yes </v-btn>

                          <v-btn size="27" :value="false"> No </v-btn>
                        </v-btn-toggle>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="pb-3 border-b-0"></td>
                  <td class="pb-3 border-b-0" colspan="2">
                    <v-textarea
                      density="compact"
                      v-model="item.whats_free"
                      placeholder="What's Free"
                      variant="outlined"
                      hide-details
                      rows="2"
                      style="min-width: 200px"
                      @input="
                        debouncedUpdate(
                          item.mrp_id,
                          item.whats_free,
                          'whats_free',
                        )
                      "
                    ></v-textarea>
                  </td>
                  <td class="pb-3 border-b-0">
                    <v-textarea
                      density="compact"
                      v-model="item.whats_included"
                      placeholder="What's Included. ?"
                      variant="outlined"
                      hide-details
                      rows="2"
                      @input="
                        debouncedUpdate(
                          item.mrp_id,
                          item.whats_included,
                          'whats_included',
                        )
                      "
                    ></v-textarea>
                  </td>
                  <td class="border-b-0" colspan="2">
                    <div class="d-flex ga-4 mb-4 align-center">
                      <div style="flex: 1">
                        <fieldset
                          style="
                            border: 1px solid #ccc;
                            border-radius: 4px;
                            padding: 0 8px 4px 8px;
                            position: relative;
                            min-width: 130px;
                          "
                        >
                          <legend
                            style="
                              font-size: 11px;
                              font-weight: bold;
                              color: #666;
                              padding: 0 4px;
                              margin-left: 8px;
                            "
                          >
                            Preparation Time
                          </legend>
                          <div class="d-flex align-center mt-1">
                            <v-select
                              density="compact"
                              v-model="item.prep_id"
                              :items="resource.prepTime"
                              @update:modelValue="updatePrepTime(item)"
                              variant="plain"
                              hide-details
                              item-title="name"
                              item-value="id"
                              class="pa-0 ma-0 font-weight-bold text-blue-accent-4"
                              style="font-size: 14px"
                            ></v-select>
                          </div>
                        </fieldset>
                      </div>
                      <div
                        class="d-flex align-center font-weight-bold ml-2 mr-4"
                        style="font-size: 12px"
                      >
                        Mins
                      </div>
                      <div>
                        <div
                          style="
                            font-size: 11px;
                            font-weight: bold;
                            color: #666;
                          "
                          class="text-center mb-1 text-no-wrap"
                        >
                          24 hrs Notice
                        </div>
                        <v-btn-toggle
                          style="
                            font-size: 10px !important;
                            font-weight: 200 !important;
                            height: 22px !important;
                            width: 54px !important;
                          "
                          class="d-flex align-center mx-auto"
                          v-model="item.is24h"
                          rounded="5"
                          @click="togglePrice(item.mrp_id, '24_hrs_notice')"
                        >
                          <v-btn size="27" :value="true"> Yes </v-btn>
                          <v-btn size="27" :value="false"> No </v-btn>
                        </v-btn-toggle>
                      </div>
                    </div>
                  </td>

                  <td class="pb-3 border-b-0" colspan="2"></td>
                </tr>

                <tr>
                  <td class="pb-3 border-b-sm"></td>
                  <td class="pb-3 border-b-sm" colspan="2">
                    <!-- Bottom Links -->
                    <div
                      class="d-flex mt-4 font-weight-black"
                      style="font-size: 12px; gap: 8px"
                    >
                      <!-- :to="`/biryani-home/onboard-prices/pax-kgs/${item.mrp_id}`" -->
                      <router-link
                        to="#"
                        class="text-decoration-none text-blue-accent-4"
                        style="color: #0d47a1 !important"
                      >
                        More Range
                      </router-link>
                      <span style="color: #0d47a1">|</span>
                      <router-link
                        to="#"
                        class="text-decoration-none text-blue-accent-4"
                        style="color: #0d47a1 !important"
                      >
                        Tags
                      </router-link>
                    </div>
                  </td>
                  <td class="pb-3 border-b-sm" colspan="6"></td>
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
          Are you sure want to delete this menu rate price?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelDelete">No</v-btn>
          <v-btn color="success" text @click="deleteMenuPrices">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent width="auto" v-model="isOpenImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4">
          Upload Image - Menu Rate Prices</v-card-title
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
  name: 'MenuManagement',

  data: () => ({
    //fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    valid: false,
    isLoading: false,
    isSending: false,
    isSending2: false,
    isSending3: false,
    isEdit: false,
    isSuccess: false,
    isError: false,
    isDelete: false,
    isDeleteLoading: false,
    isOpenImage: false,
    menuPricesIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    imageFile: [],
    menuPricesDataToImage: {
      mrp_id: 0,
    },
    successMessage: '',
    errorMessage: '',
    input: {
      mrp_id: 0,
      restaurant_id: null,
      mc_id: null,
      dish_id: null,
    },
    resource: {
      restaurantName: [],
      dishName: [],
      quantity: [],
      prepTime: [],
      categories: [],
    },
    search: '',
    items: [],
    debounceTimers: {},
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.getMenuPricesData();
    this.getRestaurants();
    this.getDishMasters();
    this.getQuantityData();
    this.getPrepMasters();
    this.getCategoryMasters();
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.items;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.items.filter((item) => {
        const dishName = item.dishName?.toLowerCase() || '';
        const restaurantName = item.restaurantName?.toLowerCase() || '';
        return (
          dishName.includes(searchTextLower) ||
          restaurantName.includes(searchTextLower)
        );
      });
    },
  },
  methods: {
    updateImageFile(newImageFile) {
      this.imageFile.push(newImageFile);
    },
    deleteImageFile() {
      this.isSending = true;
      axios
        .delete(
          `/menu-rate-prices/${this.menuPricesDataToImage.mrp_id}/main-image`,
        )
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getMenuPricesData();
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
          this.imageFile = [];
        });
    },
    openImage(item) {
      console.log(item);
      this.isOpenImage = true;
      this.menuPricesDataToImage = {
        mrp_id: item.mrp_id,
      };
      this.imageFile =
        item?.main_image != null
          ? [
              {
                file: {
                  name: item.main_image,
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
      this.menuPricesDataToImage = {
        mrp_id: 0,
      };
    },
    saveImage() {
      this.isSending = true;
      const payload = {
        mrp_id: this.menuPricesDataToImage.mrp_id,
        main_image: this.imageFile[0],
      };
      http
        .post(`/menu-rate-prices/update`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getMenuPricesData();
          // app.config.globalProperties.$eventBus.$emit('update-image');
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
          this.menuPricesDataToImage = {
            mrp_id: 0,
          };
          this.isOpenImage = false;
          this.imageFile = [];
        });
    },
    editMenuPrices(prop) {
      this.isEdit = true;

      this.input = {
        mrp_id: prop.mrp_id,
        dish_id: prop.dish_id,
        restaurant_id: prop.restaurant_id,
        mc_id: prop.mc_id,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        mrp_id: 0,
        dish_id: null,
        restaurant_id: null,
        mc_id: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          mrp_id: this.input.mrp_id,
          restaurant_id: this.input.restaurant_id,
          dish_id: this.input.dish_id,
          mc_id: this.input.mc_id,
        };
        axios
          .post(`/menu-rate-prices/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getMenuPricesData();
            this.input = {
              mrp_id: 0,
              dish_id: null,
              restaurant_id: null,
              mc_id: null,
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
    debouncedUpdate(id, value, type) {
      const timerKey = `${id}_${type}`;

      // Hapus timer sebelumnya jika ada
      if (this.debounceTimers[timerKey]) {
        clearTimeout(this.debounceTimers[timerKey]);
      }

      // Set debounce baru
      this.debounceTimers[timerKey] = setTimeout(() => {
        this.updateData(id, value, type);
      }, 800);
    },
    updateData(id, val, type) {
      let payload = {};
      let url = '';
      if (type == 'rate') {
        url = 'menu-rate-prices/update-rate';
        payload = {
          mrp_id: id,
          rate: val,
        };
      } else if (type == 'dish_description') {
        url = 'menu-rate-prices/update-dish-description';
        payload = {
          mrp_id: id,
          dish_description: val,
        };
      } else if (type == 'whats_free') {
        url = 'menu-rate-prices/update-whats-free';
        payload = {
          mrp_id: id,
          whats_free: val,
        };
      } else if (type == 'whats_included') {
        url = 'menu-rate-prices/update-whats-included';
        payload = {
          mrp_id: id,
          whats_included: val,
        };
      }

      axios
        .post(url, payload)
        .then((response) => {
          this.successMessage = response.data.message;
          this.isSuccess = true;
        })
        .catch((error) => {
          console.error(error);
          this.errorMessage =
            error.response?.data?.message || 'Something Wrong!!!';
          this.isError = true;
        });
    },
    saveData() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          restaurant_id: this.input.restaurant_id,
          dish_id: this.input.dish_id,
          mc_id: this.input.mc_id,
        };
        axios
          .post(`/menu-rate-prices`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getMenuPricesData();
            this.input = {
              mrp_id: 0,
              dish_id: null,
              restaurant_id: null,
              mc_id: null,
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
      this.menuPricesIdToDelete = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.menuPricesIdToDelete = itemId;
      this.isDelete = true;
    },
    deleteMenuPrices() {
      this.isDeleteLoading = true;
      axios
        .delete(`/menu-rate-prices/${this.menuPricesIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getMenuPricesData();
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
          this.menuPricesIdToDelete = null;
          this.isDelete = false;
        });
    },
    getMenuPricesData() {
      this.isLoading = true;
      axios
        .get(`/menu-rate-prices`)
        .then((response) => {
          const data = response.data.data;
          this.items = data
            .sort((a, b) => b.mrp_id - a.mrp_id)
            .map((item) => {
              console.log(item);
              return {
                ...item,
                dishName: item?.dish?.dish_name || '',
                restaurantName: item?.restaurant?.partner?.partner_name || '',
                userName: item?.user?.name || '',
                isActive:
                  item.active == 'N' ? false : item.active == 'Y' ? true : null,
                isFeatured:
                  item.featured == 'N'
                    ? false
                    : item.featured == 'Y'
                    ? true
                    : null,
                isPlatinum:
                  item.platinum == 'N'
                    ? false
                    : item.platinum == 'Y'
                    ? true
                    : null,
                isPrivileged:
                  item.privileged == 'N'
                    ? false
                    : item.privileged == 'Y'
                    ? true
                    : null,
                isLive:
                  item.live == 'N' ? false : item.live == 'Y' ? true : null,
                isVeg: item.veg == 'N' ? false : item.veg == 'Y' ? true : null,
                isNonVeg:
                  item['non-veg'] == 'N'
                    ? false
                    : item['non-veg'] == 'Y'
                    ? true
                    : null,
                isHalal:
                  item.halal == 'N' ? false : item.halal == 'Y' ? true : null,
                is24h:
                  item['24_hrs_notice'] == 'N'
                    ? false
                    : item['24_hrs_notice'] == 'Y'
                    ? true
                    : null,
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
    getRestaurants() {
      axios
        .get(`/biryani-restaurant-masters`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.resource.restaurantName = data
            .sort((a, b) => a.restaurant_id < b.restaurant_id)
            .map((cat) => {
              return {
                id: cat.restaurant_id || 0,
                name: cat.partner?.partner_name || '',
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
    getDishMasters() {
      axios
        .get(`/biryani-dish-masters`)
        .then((response) => {
          const data = response.data.data;
          //console.log(data);
          this.resource.dishName = data
            .sort((a, b) => a.dish_id < b.dish_id)
            .map((cat) => {
              return {
                id: cat.dish_id || 0,
                name: cat.dish_name || '',
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
    getPrepMasters() {
      axios
        .get(`/prep-master`)
        .then((response) => {
          const data = response.data.data;
          //console.log(data);
          this.resource.prepTime = data
            .sort((a, b) => a.prep_id < b.prep_id)
            .map((cat) => {
              return {
                id: cat.prep_id || 0,
                name: cat?.prep_time || '',
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
    getCategoryMasters() {
      axios
        .get(`/menu-categories`)
        .then((response) => {
          const data = response.data.data;
          //console.log(data);
          this.resource.categories = data
            .sort((a, b) => a.mc_id < b.mc_id)
            .map((cat) => {
              return {
                id: cat.mc_id || 0,
                name: cat?.menu_header || '',
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
    getQuantityData() {
      this.isLoading = true;
      axios
        .get(`/product-quantities`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.resource.quantity = data.map((item) => {
            return {
              id: item.pq_id || 1,
              name: item.quantity_name || '',
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
    updateQuantity(item) {
      const payload = {
        mrp_id: item.mrp_id,
        pq_id: item.pq_id,
      };
      axios
        .post(`/menu-rate-prices/update-quantity`, payload)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
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
    updatePrepTime(item) {
      const payload = {
        mrp_id: item.mrp_id,
        prep_id: item.prep_id,
      };
      axios
        .post(`/menu-rate-prices/update-prep-time`, payload)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
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
    togglePrice(id, type) {
      this.isSending2 = true;
      axios
        .get(`/menu-rate-prices/toggle-field/${type}/${id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getMenuPricesData();
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
          this.isSending2 = false;
        });
    },
    toggleField(id, type) {
      this.isSending3 = true;
      axios
        .get(`/menu-rate-prices/toggle-field/${type}/${id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getMenuPricesData();
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
          this.isSending3 = false;
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

@keyframes skeleton {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}
</style>
