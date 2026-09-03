<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <div class="d-flex ml-4 mb-4" style="gap: 30px">
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/biryani-home/main-categories"
        >
          <h4>Main Category</h4>
        </router-link>
      </div>
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/biryani-home/onboard-dishes"
        >
          <h4>On-Board Dishes</h4>
        </router-link>
      </div>
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/biryani-home/onboard-tags"
        >
          <h4>On-Board Tags</h4>
        </router-link>
      </div>
      <div>
        <router-link
          active-class="text-blue-accent-4"
          style="color: black"
          class="text-decoration-none"
          to="/biryani-home/onboard-prices"
        >
          <h4>On-Board Biryani Prices</h4>
        </router-link>
      </div>
    </div>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="input.category_name"
              :rules="rules.nameRules"
              label="Category Name"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="d-flex align-baseline mt-n4">
          <v-col cols="12" md="4">
            <v-textarea
              density="compact"
              v-model="input.description"
              label="Category Description"
              rows="3"
              variant="outlined"
              required
              style="height: 100px !important"
            ></v-textarea>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn
              :prepend-icon="isEdit ? 'mdi-account-multiple-check' : 'mdi-account-multiple-plus'"
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
                <th class="text-left">Main Image</th>
                <th class="text-left">Category Name</th>
                <th class="text-left">Category Description</th>
                <th class="text-left">Veg</th>
                <th class="text-left">Non-Veg</th>
                <th class="text-left">User</th>
                <th class="text-left">Dated</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in filteredItems" :key="item.mc_id">
                <tr>
                  <td style="border-bottom: none !important">
                    {{ item.mc_id }}
                  </td>
                  <td style="border-bottom: none !important">
                    <div class="image-upload-cont">
                      <v-img
                        class="image-upload-item"
                        height="40"
                        @click="openMainImage(item)"
                        style="cursor: pointer"
                        :src="
                          item.main_image != null
                            ? $fileURL + item.main_image
                            : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                        "
                        loading="lazy"
                        lazy-src="data:image/svg+xml,%3Csvg xmlns%3D%22http%3A//www.w3.org/2000/svg%22 width%3D%221%22 height%3D%221%22%3E%3C/svg%3E"
                      >
                        <template #placeholder> <div class="skeleton" /> </template
                      ></v-img>
                    </div>
                  </td>
                  <td style="font-weight: 500 !important; border-bottom: none !important">
                    {{ item.category_name }}
                  </td>
                  <td
                    style="
                      font-weight: 500 !important;
                      border-bottom: none !important;
                      max-width: 300px;
                    "
                  >
                    {{ item.description }}
                  </td>
                  <td
                    style="
                      font-weight: 500 !important;
                      border-bottom: none !important;
                      max-width: 300px;
                    "
                  >
                    <v-btn-toggle
                      v-model="item.isVeg"
                      :disabled="isSending2"
                      @click="toggleCategory(item.mc_id, 'veg')"
                      style="
                        font-size: 10px !important;
                        font-weight: 200 !important;
                        height: 22px !important;
                        width: 54px !important;
                      "
                      class="d-flex align-center"
                      rounded="5"
                    >
                      <v-btn size="27" :value="true"> Yes </v-btn>

                      <v-btn size="27" :value="false"> No </v-btn>
                    </v-btn-toggle>
                  </td>
                  <td
                    style="
                      font-weight: 500 !important;
                      border-bottom: none !important;
                      max-width: 300px;
                    "
                  >
                    <v-btn-toggle
                      v-model="item.isNonVeg"
                      :disabled="isSending2"
                      @click="toggleCategory(item.mc_id, 'non_veg')"
                      style="
                        font-size: 10px !important;
                        font-weight: 200 !important;
                        height: 22px !important;
                        width: 54px !important;
                      "
                      class="d-flex align-center"
                      rounded="5"
                    >
                      <v-btn size="27" :value="true"> Yes </v-btn>

                      <v-btn size="27" :value="false"> No </v-btn>
                    </v-btn-toggle>
                  </td>
                  <td style="font-weight: 500 !important; border-bottom: none !important">
                    {{ item.userName }}
                  </td>
                  <td style="font-weight: 500 !important; border-bottom: none !important">
                    {{ item.dated }}
                  </td>
                  <td style="border-bottom: none !important">
                    <div class="d-flex">
                      <v-btn color="green" variant="text" @click="editMainCategory(item)" icon>
                        <v-icon>mdi-pencil-outline</v-icon>
                        <v-tooltip location="top" activator="parent">Edit</v-tooltip>
                      </v-btn>
                      <v-btn
                        color="red"
                        variant="text"
                        :disabled="isDeleteLoading"
                        @click="openDeleteConfirm(item.mc_id)"
                        icon
                      >
                        <v-icon>mdi-trash-can-outline</v-icon>
                        <v-tooltip location="top" activator="parent">Delete</v-tooltip>
                      </v-btn>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </v-table>
          <skeleton-table v-if="isLoading" :rows="5" :columns="9" />
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
      @confirm="deleteMainCategory"
    />
    <v-dialog persistent width="auto" v-model="isOpenMainImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4">
          Upload Main Image - Main Categories</v-card-title
        >
        <v-card-text>
          <image-upload
            :image-file="mainImageFile"
            @update-image-file="updateMainImageFile"
            @delete-image-file="deleteMainImageFile"
          />
        </v-card-text>
        <v-card-actions class="mt-16">
          <v-spacer></v-spacer>
          <v-btn style="text-transform: none" color="error" text @click="closeMainImage"
            >Cancel</v-btn
          >
          <v-btn
            style="background-color: #9ddcff; text-transform: none"
            color="black"
            @click="saveMainImage()"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import SkeletonTable from '@/components/SkeletonTable.vue';
import EmptyState from '@/components/EmptyState.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import { useNotificationStore } from '@/stores/notification';
import ImageUpload from '@/components/ImageUpload.vue';
import axios from '@/util/axios';
import { setAuthHeader } from '@/util/axios';
// import app from '@/util/eventBus';

export default {
  name: 'MainCategories',
  components: {
    ConfirmDialog,
    EmptyState,
    SkeletonTable,
    ImageUpload,
  },
  setup() {
    const notification = useNotificationStore();
    return { notification };
  },
  data: () => ({
    //fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    valid: false,
    isLoading: false,
    isSending: false,
    isEdit: false,
    isDelete: false,
    isDeleteLoading: false,
    mainCategoryIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    mainImageFile: [],
    mainCategoryDataToMainImage: {
      mc_id: 0,
      category_name: null,
      description: null,
    },
    isOpenMainImage: false,
    input: {
      mc_id: 0,
      category_name: null,
      description: null,
      main_image: null,
    },
    resource: {
      app: [],
    },
    rules: {
      nameRules: [
        (value) => {
          if (value) return true;
          return 'Category name is required.';
        },
      ],
      descriptionRules: [
        (value) => {
          if (value) return true;
          return 'Category description is required.';
        },
      ],
    },
    search: '',
    items: [],
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.getMainCategoriesData();
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.items;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.items.filter((item) => {
        const categoryName = item.category_name?.toLowerCase() || '';
        const description = item.description?.toLowerCase() || '';
        return categoryName.includes(searchTextLower) || description.includes(searchTextLower);
      });
    },
  },
  methods: {
    updateMainImageFile(newImageFile) {
      this.mainImageFile.push(newImageFile);
    },
    deleteMainImageFile() {
      this.isSending = true;
      axios
        .delete(`/main-categories/${this.mainCategoryDataToMainImage.mc_id}/main-image`)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getMainCategoriesData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === '' ? 'Something Wrong!!!' : error.response.data.message;
          this.notification.error(message);
        })
        .finally(() => {
          this.isEdit = false;
          this.isSending = false;
          this.imageFile = [];
        });
    },
    openMainImage(prop) {
      this.isOpenMainImage = true;
      this.mainCategoryDataToMainImage = {
        mc_id: prop.mc_id,
        category_name: prop.category_name,
        description: prop.description,
      };
      this.mainImageFile =
        prop.main_image != null
          ? [
              {
                file: {
                  name: prop.main_image,
                  size: '',
                  base64: '',
                  format: '',
                },
              },
            ]
          : [];
    },
    closeMainImage() {
      this.isOpenMainImage = false;
      this.mainImageFile = [];
      this.mainCategoryDataToMainImage = {
        mc_id: 0,
        category_name: null,
        description: null,
      };
    },
    saveMainImage() {
      this.isSending = true;
      const payload = {
        mc_id: this.mainCategoryDataToMainImage.mc_id,
        category_name: this.mainCategoryDataToMainImage.category_name,
        description: this.mainCategoryDataToMainImage.description,
        main_image: this.mainImageFile[0],
      };
      axios
        .post(`/main-categories/update`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getMainCategoriesData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === '' ? 'Something Wrong!!!' : error.response.data.message;
          this.notification.error(message);
        })
        .finally(() => {
          this.isEdit = false;
          this.isSending = false;
          this.mainCategoryDataToMainImage = {
            mc_id: 0,
            category_name: null,
            description: null,
          };
          this.isOpenMainImage = false;
          this.mainImageFile = [];
        });
    },
    editMainCategory(prop) {
      this.isEdit = true;
      this.input = {
        mc_id: prop.mc_id,
        category_name: prop.category_name,
        description: prop.description,
        main_image: prop.main_image,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        mc_id: 0,
        category_name: null,
        description: null,
        main_image: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          mc_id: this.input.mc_id,
          category_name: this.input.category_name,
          description: this.input.description,
        };
        axios
          .post(`/main-categories/update`, payload)
          .then((response) => {
            const data = response.data;
            this.notification.success(data.message);
            this.getMainCategoriesData();
            this.input = {
              mc_id: 0,
              category_name: null,
              description: null,
              main_image: null,
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
            this.isEdit = false;
            this.isSending = false;
          });
      }
    },
    saveData() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          app_id: 7,
          category_name: this.input.category_name,
          description: this.input.description,
        };
        axios
          .post(`/main-categories`, payload)
          .then((response) => {
            const data = response.data;
            this.notification.success(data.message);
            this.getMainCategoriesData();
            this.input = {
              mc_id: 0,
              category_name: null,
              description: null,
              main_image: null,
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
    cancelDelete() {
      this.mainCategoryIdToDelete = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.mainCategoryIdToDelete = itemId;
      this.isDelete = true;
    },
    deleteMainCategory() {
      this.isDeleteLoading = true;
      axios
        .delete(`/main-categories/${this.mainCategoryIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getMainCategoriesData();
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
          this.mainCategoryIdToDelete = null;
          this.isDelete = false;
        });
    },
    getMainCategoriesData() {
      this.isLoading = true;
      axios
        .get(`/main-categories`)
        .then((response) => {
          const data = response.data.data;
          this.items = data
            .sort((a, b) => b.mc_id - a.mc_id)
            .map((item) => {
              console.log(item);
              return {
                ...item,
                userName: item?.user?.name || '',
                isVeg: item?.veg !== 'Y' ? false : true,
                isNonVeg: item?.non_veg !== 'Y' ? false : true,
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
    toggleCategory(id, type) {
      this.isSending2 = true;
      axios
        .get(`/main-categories/toggle-field/${type}/${id}`)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getMainCategoriesData();
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
