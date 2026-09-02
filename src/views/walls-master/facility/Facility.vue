<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <HeaderWallMaster />
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              class="mt-8"
              v-model="input.facility_name"
              label="Facility Name"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn
              :prepend-icon="isEdit ? 'mdi-account-multiple-check' : 'mdi-account-multiple-plus'"
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
          <v-col cols="12" md="2">
            <v-btn
              v-if="isEdit"
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

              CANCEL
            </v-btn>
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
                <th class="text-left font-weight-bold text-black">id</th>
                <th class="text-left font-weight-bold text-black">Image</th>
                <th class="text-left font-weight-bold text-black">Facility Name</th>
                <th class="text-left font-weight-bold text-black">User</th>
                <th class="text-left font-weight-bold text-black">Dated</th>
                <th class="text-left font-weight-bold text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in filteredItems" :key="item.id">
                <tr class="country-table-body">
                  <td>{{ item.facility_id }}</td>
                  <td>
                    <div class="image-upload-cont">
                      <v-img
                        class="image-upload-item"
                        height="40"
                        @click="openImage(item)"
                        style="cursor: pointer"
                        :src="
                          item.image != null
                            ? $fileURL + item.image
                            : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                        "
                      >
                        <template #placeholder> <div class="skeleton" /> </template
                      ></v-img>
                    </div>
                  </td>
                  <td>{{ item.facility_name }}</td>
                  <td>
                    {{ item.user }}
                  </td>
                  <td>
                    {{ item.dated }}
                  </td>
                  <td>
                    <div class="d-flex">
                      <v-btn color="green" variant="text" @click="editFacility(item)" icon>
                        <v-icon>mdi-pencil-outline</v-icon>
                        <v-tooltip location="top" activator="parent">Edit</v-tooltip>
                      </v-btn>
                      <v-btn
                        color="red"
                        variant="text"
                        :disabled="isDeleteLoading"
                        @click="openDeleteConfirm(item.facility_id)"
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
          <skeleton-table v-if="isLoading" :rows="5" :columns="6" />
          <empty-state
            v-if="!isLoading && (!filteredItems || filteredItems.length === 0)"
            title="No Facilities Found"
            subtitle="There are no facility records to display."
          />
        </v-col>
      </v-row>
    </v-sheet>
    <confirm-dialog
      v-model="isDelete"
      title="Delete Facility"
      message="Are you sure you want to delete this facility? This action cannot be undone."
      :loading="isDeleteLoading"
      @confirm="deleteLocation"
    />
    <v-dialog persistent width="auto" v-model="isOpenImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4"> Upload Image - Building Type</v-card-title>
        <v-card-text>
          <image-upload
            :image-file="imageFile"
            @update-image-file="updateImageFile"
            @delete-image-file="deleteImageFile"
          />
        </v-card-text>
        <v-card-actions class="mt-16">
          <v-spacer></v-spacer>
          <v-btn style="text-transform: none" color="error" text @click="closeImage">Cancel</v-btn>
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
import HeaderWallMaster from '@/components/HeaderWallMaster.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import EmptyState from '@/components/EmptyState.vue';
import SkeletonTable from '@/components/SkeletonTable.vue';
import axios from '@/util/axios';
import { setAuthHeader } from '@/util/axios';
import { useNotificationStore } from '@/stores/notification';

export default {
  name: 'ConstructionCategory',
  components: {
    ImageUpload,
    HeaderWallMaster,
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
    idFacility: null,
    valid: false,
    isLoading: false,
    isSending: false,
    isSending2: false,
    isEdit: false,
    isDelete: false,
    isDeleteLoading: false,
    locationIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    isOpenImage: false,
    imageFile: [],
    propertyDataToImage: {
      facility_id: 1,
      facility_name: null,
      image: null,
    },
    input: {
      facility_id: 0,
      facility_name: null,
    },
    rules: {
      facility_nameRules: [
        (value) => {
          if (value) return true;
          return 'Facility Name is required.';
        },
      ],
    },
    search: '',
    items: [],
    resource: {
      facility_name: [],
    },
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.idFacility = this.$route.params.id;
    this.getFacilityData();
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.items;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.items.filter((item) =>
        item.facility_name.toLowerCase().includes(searchTextLower)
      );
    },
  },
  methods: {
    editFacility(item) {
      this.isEdit = true;
      this.input = {
        facility_id: item.facility_id,
        facility_name: item.facility_name,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        facility_id: 0,
        facility_name: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          facility_id: this.input.facility_id,
          facility_name: this.input.facility_name,
        };
        axios
          .post(`/4walls-facilities/update`, payload)
          .then((response) => {
            const data = response.data;
            this.notification.success(data.message || 'Facility updated successfully');
            this.getFacilityData();
            this.input = {
              facility_id: 0,
              facility_name: null,
            };
          })
          .catch((error) => {
            console.log(error);
            const message = error?.response?.data?.facility_name
              ? 'Please fill the facility name field'
              : error?.response?.data?.message || 'Failed to update facility';
            this.notification.error(message);
          })
          .finally(() => {
            this.isSending = false;
          });
      }
    },
    saveData() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          facility_id: this.input.facility_id,
          facility_name: this.input.facility_name,
        };
        axios
          .post(`/4walls-facilities`, payload)
          .then((response) => {
            const data = response.data;
            this.notification.success(data.message || 'Facility saved successfully');
            this.getFacilityData();
            this.input = {
              facility_id: 0,
              facility_name: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error?.response?.data?.facility_name
              ? error?.response?.data?.facility_name[0]
              : error?.response?.data?.message || 'Something Wrong!!!';
            this.notification.error(message);
          })
          .finally(() => {
            this.isSending = false;
          });
      }
    },
    cancelDelete() {
      this.idFacility = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.idFacility = itemId;
      this.isDelete = true;
    },
    cancelConfirmation() {
      this.idFacility = null;
      this.isDelete = false;
    },
    deleteLocation() {
      this.isDeleteLoading = true;
      axios
        .delete(`/4walls-facilities/${this.idFacility}`)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message || 'Facility deleted successfully');
          this.getFacilityData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error?.response?.data?.message === ''
              ? 'Something Wrong!!!'
              : error?.response?.data?.message || 'Failed to delete facility';
          this.notification.error(message);
        })
        .finally(() => {
          this.isDeleteLoading = false;
          this.idFacility = null;
        });
    },

    getFacilityData() {
      this.isLoading = true;
      axios
        .get(`/4walls-facilities`)
        .then((response) => {
          const data = response.data.data;
          console.log(data);
          this.items = data.map((item) => {
            return {
              facility_id: item.facility_id || 1,
              image: item.image || null,
              facility_name: item.facility_name || '',
              user: item.user.name || '',
              dated: item.dated || '',
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
    openImage(prop) {
      this.isOpenImage = true;
      this.propertyDataToImage = {
        facility_id: prop.facility_id,
        facility_name: prop.facility_name,
        image: prop.image,
      };
      this.imageFile =
        prop.image != null
          ? [
              {
                file: {
                  name: prop.image,
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
      this.propertyDataToImage = {
        facility_id: 1,
        facility_name: null,
        image: null,
      };
    },
    saveImage() {
      this.isSending = true;
      const payload = {
        facility_id: this.propertyDataToImage.facility_id,
        facility_name: this.propertyDataToImage.facility_name,
        image: this.imageFile[0],
      };

      axios
        .post(`/4walls-facilities/update`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getFacilityData();
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
          this.propertyDataToImage = {
            facility_id: 1,
            facility_name: null,
            image: null,
          };
          this.isOpenImage = false;
          this.imageFile = [];
        });
    },
    updateImageFile(newImageFile) {
      this.imageFile.push(newImageFile);
    },
    deleteImageFile() {
      this.isSending = true;
      axios
        .delete(`/4walls-facilities/${this.propertyDataToImage.facility_id}/image`)
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getFacilityData();
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
          // this.propertyDataToImage = {
          //   app_id: 1,
          //   app_group_id: 1,
          //   app_name: '',
          //   app_description: '',
          //   app_detail: '',
          // };
          this.imageFile = [];
        });
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
