<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <div class="d-flex ml-4 mb-2" style="gap: 50px">
      <h1 style="color: #293fb8; font-weight: 500">Skills Master</h1>
    </div>
    <div class="d-flex ml-4 mb-4" style="gap: 50px">
      <router-link
        style="color: black; font-weight: 500; font-size: 13px"
        class="text-decoration-none"
        to="/skills-group"
      >
        <p>Skills Group</p>
      </router-link>
      <router-link
        style="color: black; font-weight: 500; font-size: 13px"
        class="text-decoration-none"
        to="/primary-skills"
      >
        <p>Primary Skills</p>
      </router-link>
    </div>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="input.group"
              label="Group Name"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
            <v-autocomplete
              density="compact"
              label="---Select App---"
              placeholder="Type App"
              :items="resource.app"
              item-title="name"
              item-value="id"
              v-model="input.app"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-textarea
              density="compact"
              v-model="input.desc"
              label="Type Description"
              rows="3"
              variant="outlined"
              required
            ></v-textarea>
          </v-col>
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
                <th class="text-left">Image</th>
                <th class="text-left">Group Name</th>
                <th class="text-left">App Name</th>
                <th class="text-left">Description</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr class="country-table-body" v-for="item in filteredItems" :key="item.id">
                <td>{{ item.id }}</td>
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
                <td style="font-weight: 500 !important">
                  {{ item.group }}
                </td>
                <td style="font-weight: 500 !important">
                  {{ item.app }}
                </td>
                <td style="font-weight: 500 !important">
                  {{ item.desc }}
                </td>

                <td>
                  <div class="d-flex">
                    <v-btn color="green" variant="text" @click="editSkillGroup(item)" icon>
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
      @confirm="deleteSkillGroup"
    />
    <v-dialog persistent width="auto" v-model="isOpenImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4"> Upload Image - Skills Group</v-card-title>
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
import SkeletonTable from '@/components/SkeletonTable.vue';
import EmptyState from '@/components/EmptyState.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import { useNotificationStore } from '@/stores/notification';
import ImageUpload from '@/components/ImageUpload.vue';
import axios from '@/util/axios';
import { setAuthHeader } from '@/util/axios';
// import app from '@/util/eventBus';

export default {
  name: 'SkillsGroupMaster',
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
    skillsIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    imageFile: [],
    skillsDataToImage: {
      id: 1,
      name: null,
      description: null,
      app: null,
    },
    isOpenImage: false,
    input: {
      id: 0,
      group: null,
      desc: null,
      app: null,
      image: null,
    },
    resource: {
      app: [],
    },
    rules: {
      groupRules: [
        (value) => {
          if (value) return true;
          return 'Group name is required.';
        },
      ],
      descriptionRules: [
        (value) => {
          if (value) return true;
          return 'Description is required.';
        },
      ],
      appRules: [
        (value) => {
          if (value) return true;
          return 'App is required.';
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
    this.getSkillsGroupData();
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
          item.group.toLowerCase().includes(searchTextLower) ||
          item.app.toLowerCase().includes(searchTextLower) ||
          item.desc.toLowerCase().includes(searchTextLower)
      );
    },
  },
  methods: {
    saveErrorResponse(response) {
      let errorMessage = '';

      for (const key in response.data) {
        errorMessage += `${key}: ${response.data[key][0]}\n`;
      }

      return errorMessage;
    },
    updateImageFile(newImageFile) {
      this.imageFile.push(newImageFile);
    },
    deleteImageFile() {
      this.isSending = true;
      const payload = {
        id: this.skillsDataToImage.id,
      };
      axios
        .post(`/skillgroups/deleteImage`, payload, {})
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getSkillsGroupData();
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
          // this.skillsDataToImage = {
          //   app_id: 1,
          //   app_group_id: 1,
          //   app_name: '',
          //   app_description: '',
          //   app_detail: '',
          // };
          this.imageFile = [];
        });
    },
    openImage(skill) {
      this.isOpenImage = true;
      this.skillsDataToImage = {
        id: skill.id,
        name: skill.group,
        description: skill.desc,
        app: skill.app_id == 0 ? '' : skill.app_id,
      };
      this.imageFile =
        skill.image != null
          ? [
              {
                file: {
                  name: skill.image,
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
      this.skillsDataToImage = {
        id: 1,
        name: null,
        description: null,
        app: null,
      };
    },
    saveImage() {
      this.isSending = true;
      const payload = {
        id: this.skillsDataToImage.id,
        name: this.skillsDataToImage.name,
        app_id: this.skillsDataToImage.app,
        description: this.skillsDataToImage.description,
        image: this.imageFile[0],
      };

      axios
        .post(`/skillgroups/update`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getSkillsGroupData();
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
          this.skillsDataToImage = {
            id: 1,
            name: null,
            description: null,
            app: null,
          };
          this.isOpenImage = false;
          this.imageFile = [];
        });
    },
    editSkillGroup(skill) {
      this.isEdit = true;
      this.input = {
        id: skill.id,
        group: skill.group,
        app: skill.app_id == 0 ? '' : skill.app_id,
        desc: skill.desc,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        id: 0,
        group: null,
        desc: null,
        app: null,
        image: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          id: this.input.id,
          name: this.input.group,
          app_id: this.input.app,
          description: this.input.desc,
        };
        if (this.input.image !== null) {
          payload['image'] = this.input.image;
        }
        axios
          .post(`/skillgroups/update`, payload)
          .then((response) => {
            const data = response.data;
            this.notification.success(data.message);
            this.getSkillsGroupData();
            this.input = {
              id: 0,
              group: null,
              desc: null,
              app: null,
              image: null,
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
          name: this.input.group,
          app_id: this.input.app,
          description: this.input.desc,
        };
        axios
          .post(`/skillgroups/add`, payload)
          .then((response) => {
            const data = response.data;
            this.notification.success(data.message);
            this.getSkillsGroupData();
            this.input = {
              id: 0,
              group: null,
              desc: null,
              app: null,
              image: null,
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
      this.skillsIdToDelete = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.skillsIdToDelete = itemId;
      this.isDelete = true;
    },
    cancelConfirmation() {
      this.skillsIdToDelete = null;
      this.isDelete = false;
    },
    deleteSkillGroup() {
      this.isDeleteLoading = true;
      axios
        .post(`/skillgroups/delete`, {
          id: this.skillsIdToDelete,
        })
        .then((response) => {
          const data = response.data;
          this.notification.success(data.message);
          this.getSkillsGroupData();
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
          this.skillsIdToDelete = null;
          this.isDelete = false;
        });
    },
    getSkillsGroupData() {
      this.isLoading = true;
      axios
        .get(`/skillgroups`)
        .then((response) => {
          const data = response.data.data;
          //console.log(data);
          this.items = data.map((item) => {
            return {
              id: item.sgm_id || 1,
              image: item.image || null,
              group: item.group_name || '',
              desc: item.description || '',
              app: item.app !== null ? item.app.app_name : '',
              app_id: item.app_id || 0,
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
    getAppActive() {
      axios
        .get(`/app/active`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.resource.app = data
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
