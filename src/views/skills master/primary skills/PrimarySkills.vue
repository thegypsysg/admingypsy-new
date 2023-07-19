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
              v-model="input.primary"
              :rules="rules.primaryRules"
              label="Primary Skills"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
            <v-autocomplete
              density="compact"
              :rules="rules.groupRules"
              label="Select Skills Group"
              placeholder="Type Skills Group"
              :items="resource.group"
              class="mt-1"
              item-title="name"
              item-value="id"
              v-model="input.group"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-textarea
              density="compact"
              v-model="input.desc"
              :rules="rules.descriptionRules"
              label="Description"
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
        <v-row class="mt-n4">
          <v-col cols="12" md="3">
            <v-autocomplete
              density="compact"
              :rules="rules.appRules"
              label="---Select App---"
              placeholder="Type App"
              :items="resource.app"
              item-title="name"
              item-value="id"
              v-model="input.app"
              variant="outlined"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="input.slug"
              :rules="rules.slugRules"
              label="Slug"
              variant="outlined"
              density="compact"
              required
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <v-sheet class="py-6 px-4 mt-4" border rounded width="100%">
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
                <th class="text-left">Primary Skills</th>
                <th class="text-left">Skills Group</th>
                <th class="text-left">Slug</th>
                <th class="text-left">Description</th>
                <th class="text-left">Active</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in filteredItems" :key="item.id">
                <tr class="country-table-body">
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
                      <template #placeholder>
                        <div class="skeleton" /> </template
                    ></v-img>
                  </td>
                  <td style="font-weight: 500 !important">
                    {{ item.primary }}
                  </td>
                  <td style="font-weight: 500 !important">
                    {{ item.group }}
                  </td>
                  <td style="color: #565656; font-weight: 500 !important">
                    {{ item.slug }}
                  </td>
                  <td style="font-weight: 500 !important">
                    {{ item.desc }}
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
                      v-model="item.isActive"
                      @click="activeSkill(item.id)"
                      rounded="5"
                    >
                      <v-btn size="27" :value="true"> Yes </v-btn>

                      <v-btn size="27" :value="false"> No </v-btn>
                    </v-btn-toggle>
                  </td>

                  <td>
                    <div class="d-flex">
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            color="green"
                            variant="text"
                            v-bind="props"
                            @click="editPrimarySkill(item)"
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
                <tr>
                  <td colspan="5">
                    <div class="d-flex justify-center" style="gap: 20px">
                      <v-table class="text-left">
                        <tr>
                          <td>
                            <span class="text-black font-weight-black"
                              >App Name: </span
                            ><span
                              class="text-blue-darken-4 font-weight-bold"
                              >{{ item.app }}</span
                            >
                          </td>
                        </tr>
                      </v-table>
                    </div>
                  </td>
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
          Are you sure want to delete this primary skills?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelDelete">No</v-btn>
          <v-btn color="success" text @click="deletePrimarySkill">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent width="auto" v-model="isOpenImage">
      <v-card width="750">
        <v-card-title class="upload-title px-6 py-4">
          Upload Image - Primary Skills</v-card-title
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
  name: 'PrimarySkillsMaster',
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
    primarySkillsIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    imageFile: [],
    primarySkillsDataToImage: {
      id: 0,
      primary: null,
      group: null,
      app: null,
      desc: null,
      slug: null,
    },
    isOpenImage: false,
    successMessage: '',
    errorMessage: '',
    input: {
      id: 0,
      primary: null,
      group: null,
      app: null,
      desc: null,
      slug: null,
      image: null,
    },
    resource: {
      group: [],
      app: [],
    },
    rules: {
      primaryRules: [
        (value) => {
          if (value) return true;
          return 'Health care is required.';
        },
      ],
      groupRules: [
        (value) => {
          if (value) return true;
          return 'Description is required.';
        },
      ],
      descriptionRules: [
        (value) => {
          if (value) return true;
          return 'Description is required.';
        },
      ],
      slugRules: [
        (value) => {
          if (value) return true;
          return 'Slug is required.';
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
    this.getPrimarySkillData();
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
          item.primary.toLowerCase().includes(searchTextLower) ||
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
        id: this.primarySkillsDataToImage.id,
      };
      axios
        .post(`/skills/deleteImage`, payload, {})
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPrimarySkillData();
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
          // this.primarySkillsDataToImage = {
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
      this.primarySkillsDataToImage = {
        id: item.id,
        sgm_id: item.sgm_id,
        name: item.primary,
        desc: item.desc,
        app: item.app,
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
      this.primarySkillsDataToImage = {
        id: 0,
        primary: null,
        group: null,
        app: null,
        desc: null,
        slug: null,
      };
    },
    saveImage() {
      this.isSending = true;
      const payload = {
        id: this.primarySkillsDataToImage.id,
        sgm_id: this.primarySkillsDataToImage.sgm_id,
        name: this.primarySkillsDataToImage.name,
        description: this.primarySkillsDataToImage.description,
        app_id: this.primarySkillsDataToImage.app,
        image: this.imageFile[0],
      };

      http
        .post(`/skills/update`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPrimarySkillData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message = this.saveErrorResponse(error.response);
          this.errorMessage = message;
          this.isError = true;
        })
        .finally(() => {
          this.isEdit = false;
          this.isSending = false;
          this.primarySkillsDataToImage = {
            id: 0,
            primary: null,
            group: null,
            app: null,
            desc: null,
            slug: null,
          };
          this.isOpenImage = false;
          this.imageFile = [];
        });
    },
    editPrimarySkill(skill) {
      this.isEdit = true;
      this.input = {
        id: skill.id,
        primary: skill.primary,
        group: skill.sgm_id,
        app: skill.app,
        desc: skill.desc,
        slug: skill.slug,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        id: 0,
        primary: null,
        group: null,
        app: null,
        desc: null,
        slug: null,
        image: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          id: this.input.id,
          sgm_id: this.input.group,
          name: this.input.primary,
          description: this.input.desc,
          app_id: this.input.app,
          slug: this.input.slug,
        };
        if (this.input.image !== null) {
          payload['image'] = this.input.image;
        }
        axios
          .post(`/skills/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getPrimarySkillData();
            this.input = {
              id: 0,
              primary: null,
              group: null,
              app: null,
              desc: null,
              slug: null,
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
          name: this.input.primary,
          description: this.input.desc,
          app_id: this.input.app,
          sgm_id: this.input.group,
          slug: this.input.slug,
        };
        axios
          .post(`/skills/add`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getPrimarySkillData();
            this.input = {
              id: 0,
              primary: null,
              group: null,
              app: null,
              desc: null,
              slug: null,
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
            this.errorMessage = message;
            this.isError = true;
          })
          .finally(() => {
            this.isSending = false;
          });
      }
    },
    cancelDelete() {
      this.primarySkillsIdToDelete = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.primarySkillsIdToDelete = itemId;
      this.isDelete = true;
    },
    cancelConfirmation() {
      this.primarySkillsIdToDelete = null;
      this.isDelete = false;
    },
    deletePrimarySkill() {
      this.isDeleteLoading = true;
      axios
        .post(`/skills/delete`, {
          id: this.primarySkillsIdToDelete,
        })
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPrimarySkillData();
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
          this.primarySkillsIdToDelete = null;
          this.isDelete = false;
        });
    },
    getPrimarySkillData() {
      this.isLoading = true;
      axios
        .get(`/skills`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);

          this.items = data
            .sort((a, b) => a.skills_id > b.skills_id)
            .map((item) => {
              return {
                id: item.skills_id || 1,
                sgm_id: item.sgm_id || 1,
                image: item.image || null,
                primary: item.skills_name || '',
                group: item.group_name || '',
                desc: item.description || '',
                slug: item.slug || '',
                app: item.app_name || '',
                app_id: item.app_id || 0,
                isActive:
                  item.active == 'N' ? false : item.active == 'Y' ? true : null,
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
    getSkillsGroupData() {
      this.isLoading = true;
      axios
        .get(`/skillgroups`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.resource.group = data.map((item) => {
            return {
              id: item.sgm_id || 1,
              name: item.group_name || '',
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
            error.response.data.message === ''
              ? 'Something Wrong!!!'
              : error.response.data.message;
          this.errorMessage = message;
          this.isError = true;
        });
    },
    activeSkill(id) {
      this.isSending = true;
      axios
        .get(`/skills/active/${id}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getPrimarySkillData();
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
