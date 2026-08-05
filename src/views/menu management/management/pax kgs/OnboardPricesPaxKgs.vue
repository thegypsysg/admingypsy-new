<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <div class="d-flex ml-4 mb-6" style="gap: 50px">
      <router-link
        style="color: #293fb8; font-size: 13px"
        class="text-decoration-none"
        to="/biryani-home/onboard-prices"
      >
        <p>Back</p>
      </router-link>
    </div>
    <template v-if="itemData != null">
      <h3 class="ml-4">
        <span style="font-weight: 700">{{ itemData?.dishName || '' }}</span>
        <span class="mx-4" style="color: #ccc">|</span>
        <span style="font-weight: 700">{{
          itemData?.restaurantName || ''
        }}</span>
        <span class="mx-4" style="color: #ccc">|</span>
        <span style="font-weight: 700">{{
          itemData?.quantityName || '1 Pax'
        }}</span>
      </h3>
    </template>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="3">
            <v-autocomplete
              density="compact"
              label="...... Select ......"
              placeholder="...... Select ......"
              :items="resource.paxKgs"
              :rules="rules.paxKgsRules"
              item-title="name"
              item-value="id"
              v-model="input.pax_kgs_id"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
          <v-col class="mt-0" cols="12" md="2">
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
          </v-col>
          <v-col class="mt-0" cols="12" md="2">
            <v-btn
              v-if="isEdit"
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

              CANCEL
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <v-sheet class="py-6 px-4 mt-10" border rounded width="100%">
      <v-row>
        <v-col cols="12">
          <v-table class="pax-kgs-table">
            <thead>
              <tr>
                <th class="text-left">Id</th>
                <th class="text-left">Image</th>
                <th class="text-left">Pax / Kgs</th>
                <th class="text-left">Rate</th>
                <th class="text-left">User</th>
                <th class="text-left">Dated</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in filteredItems" :key="item.id">
                <tr class="pax-kgs-table-body">
                  <td>{{ item.id }}</td>
                  <td>
                    <div class="image-upload-cont">
                      <v-img
                        class="image-upload-item"
                        height="50"
                        width="70"
                        @click="openImage(item)"
                        style="cursor: pointer"
                        :src="
                          item?.image != null
                            ? $fileURL + item.image
                            : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                        "
                      >
                        <template #placeholder>
                          <div class="skeleton" />
                        </template>
                      </v-img>
                    </div>
                  </td>
                  <td>
                    <span class="font-weight-bold">{{
                      item.pax_kgs_name
                    }}</span>
                  </td>
                  <td>
                    <div
                      class="d-flex align-content-center p-0"
                      style="
                        height: 40px;
                        overflow-y: hidden;
                        border-radius: 5px;
                        border: 1px grey solid;
                        max-width: 180px;
                      "
                    >
                      <div
                        class="d-flex justify-center align-center"
                        style="
                          background: #e9ecef;
                          min-width: 40px;
                          padding: 0 8px;
                        "
                      >
                        <h4 style="color: #077cff">S$</h4>
                      </div>
                      <v-text-field
                        style="margin-top: -1px"
                        variant="outlined"
                        type="number"
                        inputmode="numeric"
                        density="compact"
                        placeholder="0"
                        v-model="item.rate"
                        @input="debouncedUpdate(item.id, item.rate)"
                      ></v-text-field>
                    </div>
                  </td>
                  <td>
                    {{ item.user }}
                  </td>
                  <td>
                    {{ item.dated }}
                  </td>
                  <td>
                    <div class="d-flex">
                      <v-btn
                            color="green"
                            variant="text" @click="editPaxKgs(item)"
                            icon
                          >
  <v-icon>mdi-pencil-outline</v-icon>  <v-tooltip location="top" activator="parent">Edit</v-tooltip>
</v-btn>
                      <v-btn
                            color="red" variant="text"
                            :disabled="isDeleteLoading"
                            @click="openDeleteConfirm(item.id)"
                            icon
                          >
  <v-icon>mdi-trash-can-outline</v-icon>  <v-tooltip location="top" activator="parent">Delete</v-tooltip>
</v-btn>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="border-b-sm pb-2"></td>
                  <td class="border-b-sm pb-2" colspan="2">
                    <div
                      class="font-weight-bold mb-1"
                      style="font-size: 12px; color: #555"
                    >
                      What's Included. ?
                    </div>
                    <v-textarea
                      density="compact"
                      v-model="item.dish_description"
                      @input="
                        debouncedUpdateDescription(
                          item.id,
                          item.dish_description,
                        )
                      "
                      placeholder="Dish Description details"
                      variant="outlined"
                      hide-details
                      rows="4"
                    ></v-textarea>
                  </td>
                  <td class="pb-2 border-b-sm">
                    <div class="d-flex ga-4 mb-2 align-center">
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
                              v-model="item.prep_time_placeholder"
                              :items="['15', '30', '45', '60']"
                              variant="plain"
                              hide-details
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
                          v-model="item.notice_24h_placeholder"
                          rounded="5"
                        >
                          <v-btn size="27" :value="true"> Yes </v-btn>
                          <v-btn size="27" :value="false"> No </v-btn>
                        </v-btn-toggle>
                      </div>
                    </div>
                    <div
                      class="font-weight-bold mb-1"
                      style="font-size: 12px; color: #555"
                    >
                      What's Free
                    </div>
                    <v-textarea
                      density="compact"
                      v-model="item.whats_free_placeholder"
                      placeholder="What's Free"
                      variant="outlined"
                      hide-details
                      rows="2"
                    ></v-textarea>
                  </td>
                  <td class="pb-2 border-b-sm" colspan="3"></td>
                </tr>
              </template>
              <tr v-if="isLoading">
                <td :colspan="7" class="text-center">
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
        <v-card-text> Are you sure want to delete this pax / kgs? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelDelete">No</v-btn>
          <v-btn color="success" text @click="deletePaxKgs">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent width="auto" v-model="isOpenImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4">
          Upload Image - Pax / Kgs</v-card-title
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
  name: 'OnboardPricesPaxKgs',
  data: () => ({
    idBrp: null,
    itemData: null,
    valid: false,
    isLoading: false,
    isSending: false,
    isEdit: false,
    isSuccess: false,
    isError: false,
    isDelete: false,
    isDeleteLoading: false,
    isOpenImage: false,
    paxKgsIdToDelete: null,
    imageFile: [],
    paxKgsDataToImage: {
      brp_id_2: 0,
    },
    successMessage: '',
    errorMessage: '',
    input: {
      id: 0,
      pax_kgs_id: null,
    },

    resource: {
      paxKgs: [],
    },
    rules: {
      paxKgsRules: [
        (value) => {
          if (value) return true;
          return 'Pax / Kgs is required.';
        },
      ],
    },
    search: '',
    items: [],
    debounceTimer: null,
    debounceTimerDesc: null,
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.idBrp = this.$route.params.id;
    this.getOnboardPriceData();
    this.getPaxKgsData();
    this.getPaxKgsResource();
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.items;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.items.filter((item) => {
        const paxKgsName = item.pax_kgs_name?.toLowerCase() || '';
        return paxKgsName.includes(searchTextLower);
      });
    },
  },
  methods: {
    getOnboardPriceData() {
      this.isLoading = true;
      axios
        .get(`/biryani-run-prices`)
        .then((response) => {
          const data = response.data.data;
          const found = data.find((i) => i.brp_id == this.idBrp);
          if (found) {
            this.itemData = {
              brp_id: found.brp_id,
              dishName: found?.dish?.dish_name || '',
              restaurantName: found?.restaurant?.partner?.partner_name || '',
              quantityName: found?.product_quantity?.quantity_name || '1 Pax',
            };
          }
        })
        .catch((error) => {
          console.log(error);
          const message =
            error.response?.data?.message === ''
              ? 'Something Wrong!!!'
              : error.response?.data?.message || 'Something Wrong!!!';
          this.errorMessage = message;
          this.isError = true;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    getPaxKgsData() {
      this.isLoading = true;
      axios
        .get(`/biryani-run-prices2/${this.idBrp}`)
        .then((response) => {
          const data = response.data.data;
          this.items = data.map((item) => {
            return {
              ...item,
              id: item?.brp_id_2 || 0,
              brp_id: item?.brp_id || 0,
              image: item?.dish_image || null,
              dish_description: item?.pq_description || '',
              pax_kgs_id: item?.pq_id || null,
              pax_kgs_name: item?.product_quantity?.quantity_name || '',
              user: item?.user?.name || '',
            };
          });
        })
        .catch((error) => {
          console.log(error);
          const message =
            error.response?.data?.message === ''
              ? 'Something Wrong!!!'
              : error.response?.data?.message || 'Something Wrong!!!';
          this.errorMessage = message;
          this.isError = true;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    getPaxKgsResource() {
      axios
        .get(`/product-quantities`)
        .then((response) => {
          const data = response.data.data;
          this.resource.paxKgs = data.map((item) => {
            return {
              id: item.pq_id,
              name: item.quantity_name,
            };
          });
        })
        .catch((error) => {
          console.log(error);
          const message =
            error.response?.data?.message === ''
              ? 'Something Wrong!!!'
              : error.response?.data?.message || 'Something Wrong!!!';
          this.errorMessage = message;
          this.isError = true;
        });
    },
    editPaxKgs(item) {
      this.isEdit = true;
      this.input = {
        id: item.id,
        pax_kgs_id: item.pax_kgs_id,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        id: 0,
        pax_kgs_id: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          brp_id_2: this.input.id,
          brp_id: this.idBrp,
          pq_id: this.input.pax_kgs_id,
        };
        axios
          .post(`/biryani-run-prices2/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getPaxKgsData();
            this.input = {
              id: 0,
              pax_kgs_id: null,
            };
          })
          .catch((error) => {
            console.log(error);
            const message =
              error.response?.data?.error === ''
                ? 'Something Wrong!!!'
                : error.response?.data?.error || 'Something Wrong!!!';
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
          brp_id: this.idBrp,
          pq_id: this.input.pax_kgs_id,
        };
        axios
          .post(`/biryani-run-prices2`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getPaxKgsData();
            this.input = {
              id: 0,
              pax_kgs_id: null,
            };
          })
          .catch((error) => {
            console.log(error);
            const message =
              error.response?.data?.error === ''
                ? 'Something Wrong!!!'
                : error.response?.data?.error || 'Something Wrong!!!';
            this.errorMessage = message;
            this.isError = true;
          })
          .finally(() => {
            this.isSending = false;
          });
      }
    },
    cancelDelete() {
      this.paxKgsIdToDelete = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.paxKgsIdToDelete = itemId;
      this.isDelete = true;
    },
    deletePaxKgs() {
      this.isDeleteLoading = true;
      axios
        .delete(`/biryani-run-prices2/${this.paxKgsIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPaxKgsData();
        })
        .catch((error) => {
          console.log(error);
          const message =
            error.response?.data?.message === ''
              ? 'Something Wrong!!!'
              : error.response?.data?.message || 'Something Wrong!!!';
          this.errorMessage = message;
          this.isError = true;
        })
        .finally(() => {
          this.isDeleteLoading = false;
          this.paxKgsIdToDelete = null;
          this.isDelete = false;
        });
    },
    debouncedUpdate(id, value) {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      this.debounceTimer = setTimeout(() => {
        this.updateRate(id, value);
      }, 800);
    },
    updateRate(id, val) {
      const payload = {
        brp_id_2: id,
        rate: val,
      };
      axios
        .post(`/biryani-run-prices2/update-rate`, payload)
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
    debouncedUpdateDescription(id, value) {
      if (this.debounceTimerDesc) {
        clearTimeout(this.debounceTimerDesc);
      }
      this.debounceTimerDesc = setTimeout(() => {
        this.updateDescription(id, value);
      }, 800);
    },
    updateDescription(id, val) {
      const payload = {
        brp_id_2: id,
        pq_description: val,
      };
      axios
        .post(`/biryani-run-prices2/update-description`, payload)
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
    openImage(item) {
      console.log(item);
      this.isOpenImage = true;
      this.paxKgsDataToImage = {
        brp_id_2: item.id,
      };
      this.imageFile =
        item?.image != null
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
      this.paxKgsDataToImage = {
        brp_id_2: 0,
      };
    },
    updateImageFile(newImageFile) {
      this.imageFile.push(newImageFile);
    },
    deleteImageFile() {
      this.isSending = true;
      axios
        .delete(`/biryani-run-prices2/${this.paxKgsDataToImage.brp_id_2}/image`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPaxKgsData();
        })
        .catch((error) => {
          console.log(error);
          const message =
            error.response?.data?.message === ''
              ? 'Something Wrong!!!'
              : error.response?.data?.message || 'Something Wrong!!!';
          this.errorMessage = message;
          this.isError = true;
        })
        .finally(() => {
          this.isSending = false;
          this.imageFile = [];
        });
    },
    saveImage() {
      this.isSending = true;
      const payload = {
        brp_id_2: this.paxKgsDataToImage.brp_id_2,
        dish_image: this.imageFile[0],
      };
      http
        .post(`/biryani-run-prices2/update`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPaxKgsData();
        })
        .catch((error) => {
          console.log(error);
          const message =
            error.response?.data?.message === ''
              ? 'Something Wrong!!!'
              : error.response?.data?.message || 'Something Wrong!!!';
          this.errorMessage = message;
          this.isError = true;
        })
        .finally(() => {
          this.isSending = false;
          this.paxKgsDataToImage = {
            brp_id_2: 0,
          };
          this.isOpenImage = false;
          this.imageFile = [];
        });
    },
  },
  components: { ImageUpload },
};
</script>

<style lang="scss" scoped>
.pax-kgs-table {
  font-size: 12px;
  color: black !important;
}

.pax-kgs-table-body {
  margin-top: 50px !important;
  margin-bottom: 50px !important;
  font-weight: 500;
}

.pax-kgs-table-body td {
  border-bottom: none !important;
}

.upload-title {
  background-color: #9ddcff;
  color: white;
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
