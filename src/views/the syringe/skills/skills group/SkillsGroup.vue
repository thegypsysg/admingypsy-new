<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <div class="d-flex ml-4 mb-6" style="gap: 50px">
      <router-link
        style="color: #293fb8; font-weight: 500"
        class="text-decoration-none"
        to="/healthcare-settings"
      >
        <p>Healthcare Settings</p>
      </router-link>
      <router-link
        style="color: #a93f43; font-weight: 500"
        class="text-decoration-none"
        to="/skills-group"
      >
        <p>Skills</p>
      </router-link>
      <router-link
        style="color: #000; font-weight: 500"
        class="text-decoration-none"
        to="/job-master"
      >
        <p>Job Master</p>
      </router-link>
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
              :rules="rules.groupRules"
              label="Group Name"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-textarea
              density="compact"
              v-model="input.desc"
              :rules="rules.descriptionRules"
              label="Type Description"
              rows="3"
              variant="outlined"
              required
            ></v-textarea>
          </v-col>
          <v-col cols="12" md="2">
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
                <th class="text-left">Description</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="country-table-body"
                v-for="item in filteredItems"
                :key="item.id"
              >
                <td>{{ item.id }}</td>
                <td>
                  <v-img
                    height="40"
                    width="65"
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
                </td>
                <td style="font-weight: 500 !important">
                  {{ item.group }}
                </td>
                <td style="font-weight: 500 !important">
                  {{ item.desc }}
                </td>

                <td>
                  <div class="d-flex">
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          color="green"
                          variant="text"
                          v-bind="props"
                          @click="editSkillGroup(item)"
                          icon="mdi-pencil-outline"
                        ></v-btn>
                      </template>
                      <span>Edit</span>
                    </v-tooltip>
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          color="red"
                          v-bind="props"
                          variant="text"
                          :disabled="isDeleteLoading"
                          @click="openDeleteConfirm(item.id)"
                          icon="mdi-trash-can-outline"
                        ></v-btn>
                      </template>
                      <span>Delete</span>
                    </v-tooltip>
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
        <v-card-text> Are you sure want to delete this user? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelDelete">No</v-btn>
          <v-btn color="success" text @click="deleteSkillGroup">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent width="auto" v-model="isOpenImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4">
          Upload Image - User</v-card-title
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
  name: 'UserMaster',
  data: () => ({
    //fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    valid: false,
    isLoading: false,
    isSending: false,
    isEdit: false,
    isSuccess: false,
    isError: false,
    isDelete: false,
    isDeleteLoading: false,
    userIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    imageFile: [],
    userDataToImage: {
      id: 1,
      name: '',
      description: '',
    },
    isOpenImage: false,
    successMessage: '',
    errorMessage: '',
    input: {
      id: 0,
      group: '',
      desc: '',
      image: null,
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
        id: this.userDataToImage.id,
      };
      axios
        .post(`/skillgroups/deleteImage`, payload, {})
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getSkillsGroupData();
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
          // this.userDataToImage = {
          //   app_id: 1,
          //   app_group_id: 1,
          //   app_name: '',
          //   app_description: '',
          //   app_detail: '',
          // };
          this.imageFile = [];
        });
    },
    openImage(item) {
      this.isOpenImage = true;
      this.userDataToImage = {
        id: item.id,
        name: item.group,
        description: item.desc,
      };
      this.imageFile =
        item.image != null
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
      this.userDataToImage = {
        id: 1,
        name: '',
        description: '',
      };
    },
    saveImage() {
      this.isSending = true;
      const payload = {
        id: this.userDataToImage.id,
        name: this.userDataToImage.name,
        description: this.userDataToImage.description,
        image: this.imageFile[0],
      };

      http
        .post(`/skillgroups/update`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getSkillsGroupData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        .finally(() => {
          this.isEdit = false;
          this.isSending = false;
          this.userDataToImage = {
            id: 1,
            name: '',
            description: '',
          };
          this.isOpenImage = false;
          this.imageFile = [];
        });
    },
    editSkillGroup(user) {
      this.isEdit = true;
      this.input = {
        id: user.id,
        group: user.group,
        desc: user.desc,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        id: 0,
        group: '',
        desc: '',
        image: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          id: this.input.id,
          name: this.input.group,
          description: this.input.desc,
        };
        if (this.input.image !== null) {
          payload['image'] = this.input.image;
        }
        axios
          .post(`/skillgroups/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getSkillsGroupData();
            this.input = { id: 0, group: '', desc: '', image: null };
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
    saveData() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          name: this.input.group,
          description: this.input.desc,
        };
        axios
          .post(`/skillgroups/add`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getSkillsGroupData();
            this.input = { id: 0, group: '', desc: '', image: null };
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
      this.userIdToDelete = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.userIdToDelete = itemId;
      this.isDelete = true;
    },
    cancelConfirmation() {
      this.userIdToDelete = null;
      this.isDelete = false;
    },
    deleteSkillGroup() {
      this.isDeleteLoading = true;
      axios
        .post(`/skillgroups/delete`, {
          id: this.userIdToDelete,
        })
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getSkillsGroupData();
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
          this.userIdToDelete = null;
          this.isDelete = false;
        });
    },
    getSkillsGroupData() {
      this.isLoading = true;
      axios
        .get(`/skillgroups`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.items = data.map((item) => {
            return {
              id: item.sgm_id || 1,
              image: item.image || null,
              group: item.group_name || '',
              desc: item.description || '',
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
