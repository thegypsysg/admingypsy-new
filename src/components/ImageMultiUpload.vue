<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12" xs="12">
        <v-btn color="#2598F3" @click="openInputImage" class="mb-4">
          <span class="text-white">INSERT FILE</span>
        </v-btn>
        <v-row>
          <v-col cols="12" lg="12" md="12" xs="12">
            <v-table>
              <thead>
                <tr>
                  <th class="text-left">Thumb</th>
                  <th class="text-left">Size</th>
                  <th class="text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(attachment, index) in tempAttachment"
                  :key="`attachment-${index}`"
                >
                  <td>
                    <template
                      v-if="
                        attachment.file.name.split('.').pop().toLowerCase() ==
                          'jpg' ||
                        attachment.file.name.split('.').pop().toLowerCase() ==
                          'jpeg' ||
                        attachment.file.name.split('.').pop().toLowerCase() ==
                          'png' ||
                        attachment.file.name.split('.').pop().toLowerCase() ==
                          'tif' ||
                        attachment.file.name.split('.').pop().toLowerCase() ==
                          'bmp'
                      "
                    >
                      <v-img
                        style="margin: 10px"
                        :src="
                          attachment.file.file
                            ? attachment.file.file
                            : $fileURL + attachment.file.name
                        "
                        height="50px"
                        width="50px"
                      ></v-img>
                    </template>
                    <template v-else>
                      <v-icon
                        v-if="
                          attachment.file.name
                            .split('.')
                            .pop()
                            .toLowerCase() === 'pdf'
                        "
                        style="margin-left: 10px"
                        size="50"
                        file-word-outline
                        color="red darken-1"
                        >mdi-file-pdf-outline</v-icon
                      >
                      <v-icon
                        v-else-if="
                          attachment.file.name
                            .split('.')
                            .pop()
                            .toLowerCase() === 'doc' ||
                          attachment.file.name
                            .split('.')
                            .pop()
                            .toLowerCase() === 'docx' ||
                          attachment.file.name
                            .split('.')
                            .pop()
                            .toLowerCase() === 'odt'
                        "
                        style="margin-left: 10px"
                        size="50"
                        file-word-outline
                        color="blue darken-1"
                        >mdi-file-word-outline</v-icon
                      >
                      <v-icon
                        v-else-if="
                          attachment.file.name
                            .split('.')
                            .pop()
                            .toLowerCase() === 'xls' ||
                          attachment.file.name
                            .split('.')
                            .pop()
                            .toLowerCase() === 'xlsx'
                        "
                        style="margin-left: 10px"
                        size="50"
                        file-word-outline
                        color="teal darken-1"
                        >mdi-file-excel-outline</v-icon
                      >
                      <v-icon
                        v-else-if="
                          attachment.file.name
                            .split('.')
                            .pop()
                            .toLowerCase() === 'pptx' ||
                          attachment.file.name
                            .split('.')
                            .pop()
                            .toLowerCase() === 'pptm' ||
                          attachment.file.name
                            .split('.')
                            .pop()
                            .toLowerCase() === 'ppt'
                        "
                        style="margin-left: 10px"
                        size="50"
                        file-word-outline
                        color="orange darken-3"
                        >mdi-file-powerpoint-outline</v-icon
                      >
                      <v-icon
                        v-else-if="
                          attachment.file.name
                            .split('.')
                            .pop()
                            .toLowerCase() === 'mp4' ||
                          attachment.file.name
                            .split('.')
                            .pop()
                            .toLowerCase() === 'mov' ||
                          attachment.file.name
                            .split('.')
                            .pop()
                            .toLowerCase() === 'flv' ||
                          attachment.file.name
                            .split('.')
                            .pop()
                            .toLowerCase() === 'wmv' ||
                          attachment.file.name
                            .split('.')
                            .pop()
                            .toLowerCase() === 'avi'
                        "
                        style="margin-left: 10px"
                        size="50"
                        file-word-outline
                        color="red lighten-1"
                        >mdi-file-video-outline</v-icon
                      >
                      <v-icon
                        v-else-if="
                          attachment.file.name
                            .split('.')
                            .pop()
                            .toLowerCase() === 'dwg'
                        "
                        style="margin-left: 10px"
                        size="50"
                        file-word-outline
                        color="indigo lighten-2"
                        >mdi-file-cad</v-icon
                      >
                      <v-icon
                        v-else-if="
                          attachment.file.name
                            .split('.')
                            .pop()
                            .toLowerCase() === 'zip' ||
                          attachment.file.name
                            .split('.')
                            .pop()
                            .toLowerCase() === 'rar' ||
                          attachment.file.name
                            .split('.')
                            .pop()
                            .toLowerCase() === '7-zip'
                        "
                        size="120"
                        file-word-outline
                        color="lime lighten-1"
                        >mdi-folder-zip-outline</v-icon
                      >
                      <v-icon
                        v-else-if="
                          attachment.file.name
                            .split('.')
                            .pop()
                            .toLowerCase() === 'txt'
                        "
                        style="margin-left: 10px"
                        size="50"
                        file-word-outline
                        color="light-green darken-3"
                        >mdi-script-text-outline</v-icon
                      >
                      <v-icon
                        v-else
                        x-large
                        file-word-outline
                        color="indigo lighten-1"
                        >mdi-file-question-outline</v-icon
                      >
                    </template>
                  </td>
                  <td>
                    <v-card-subtitle
                      v-if="
                        Number((attachment.file.size / 1000).toFixed(1)) < 1024
                      "
                      class="mt2"
                    >
                      <v-chip color="teal lighten-2" label text-color="white">
                        {{
                          Number((attachment.file.size / 1000).toFixed(1)) +
                          ' kb'
                        }}
                        <v-icon right>mdi-harddisk</v-icon>
                      </v-chip>
                    </v-card-subtitle>
                    <v-card-subtitle
                      v-if="
                        Number((attachment.file.size / 1000).toFixed(1)) > 1024
                      "
                    >
                      <v-chip color="teal lighten-2" label text-color="white">
                        {{
                          Number(
                            (attachment.file.size / 1000 / 1024).toFixed(1)
                          ) + ' mb'
                        }}
                        <v-icon right>mdi-harddisk</v-icon>
                      </v-chip>
                    </v-card-subtitle>
                  </td>
                  <td>
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          icon
                          variant="text"
                          color="red"
                          v-bind="props"
                          @click="openDeleteDialog(index, '')"
                        >
                          <v-icon>mdi-delete</v-icon></v-btn
                        >
                      </template>
                      <span>Delete</span>
                    </v-tooltip>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-dialog
        v-model="isInsertImage"
        :scrollable="false"
        persistent
        width="50%"
      >
        <v-card>
          <v-card-title>
            <v-icon @click="isInsertImage = false">mdi-close</v-icon>
          </v-card-title>
          <v-card-text class="BYekan">
            <v-file-input
              color="#3098EB"
              counter
              accept=".jpg, .jpeg, .png"
              label="Insert File"
              prepend-icon="mdi-paperclip"
              variant="outlined"
              :show-size="1000"
              ref="imageinput"
              @change="onImageInput"
            >
              <template v-slot:selection="{ fileNames }">
                <template
                  v-for="(fileName, index) in fileNames"
                  :key="fileName"
                >
                  <v-chip
                    v-if="index < 2"
                    color="#3098EB"
                    label
                    size="small"
                    class="me-2"
                  >
                    {{ fileName }}
                  </v-chip>

                  <!-- <span
                    v-else-if="index === 2"
                    class="text-overline text-grey-darken-3 mx-2"
                  >
                    +{{ tempAttachment.length - 2 }} File(s)
                  </span> -->
                </template>
              </template>
            </v-file-input>
          </v-card-text>
          <v-card-actions>
            <v-btn
              class="BYekan"
              :disabled="tempAttachment == null || btnLoader"
              :loading="btnLoader"
              style="background-color: #329ef4 !important"
              @click="saveNewImage"
              ><span class="text-white">Add</span></v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-snackbar
      class="BYekan"
      v-model="fileUploaderSnackBarAlert"
      right
      bottom
      :color="fileUploaderSnackBarAlertColor"
      :timeout="3000"
    >
      {{ fileUploaderSnackText }}
      <v-btn color="white" text @click="fileUploaderSnackBarAlert = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>

    <v-row justify="center">
      <v-dialog v-model="isDeleteImage" persistent width="30%">
        <v-card>
          <v-card-text class="BYekan mt-2">
            Are you sure you want to delete the file?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class="BYekan"
              color="green darken-1"
              text
              @click="isDeleteImage = false"
              >Cancel</v-btn
            >
            <v-btn
              class="BYekan text-white"
              style="background-color: #2b81d6"
              :disabled="btnLoader"
              :loading="btnLoader"
              @click="deleteImage"
              >Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
// import { Buffer } from 'buffer';

export default {
  name: 'ImageMultiUpload',
  props: {
    imageFile: [Array],
  },
  data() {
    return {
      // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
      isInsertImage: false,
      isDeleteImage: false,
      isEmptyImageFile: true,

      image: [],

      tempAttachment: [],
      tempAttachmentChanged: [],
      documentAttachmentAPI: {},

      fileUploaderSnackBarAlert: false,
      fileUploaderSnackText: '',
      fileUploaderSnackBarAlertColor: 'green',
      // readerFile: null,
      // registryDocFile: [],
      btnLoader: false,
      showDetail: false,
      showDetailState: [],
      selectedIndex: '',
      selectedId: '',
      returnedRecord: {},
      //Card Theme
      outlined: false,
      raised: false,
      shaped: false,
      tile: false,
      selectedLang: {},
      beforeInsertAttachments: {},
      attachmentIndex: '',
    };
  },
  // watch: {
  //   tempAttachment: function (newValue) {
  //     if (this.tempAttachment.length > 0) this.getAttachmentDetails(newValue);
  //     else this.tempAttachmentChanged = [];
  //   },
  // },
  mounted() {
    this.tempAttachment = this.imageFile;
    if (this.imageFile.length > 0) {
      this.isEmptyImageFile = false;
    } else if (this.imageFile.length == 0) {
      this.isEmptyImageFile = true;
    }
  },
  unmounted() {
    this.tempAttachment = [];
  },
  methods: {
    openInputImage() {
      this.btnLoader = false;
      // this.tempAttachment = [];
      if (this.isEmptyImageFile == false) {
        this.image = [...this.tempAttachment];
      }
      console.log(this.image);
      this.isInsertImage = true;
    },
    openDeleteDialog(index, deleteId) {
      this.btnLoader = false;
      this.selectedIndex = index;
      this.selectedId = deleteId;
      this.isDeleteImage = true;
    },
    deleteImage() {
      this.tempAttachment.splice(this.selectedIndex, 1);
      this.$emit('delete-image-file', this.selectedIndex);
      // this.$emit('update:documentAttachment', this.registryDocFile);
      this.isDeleteImage = false;
    },

    onImageInput(e) {
      var files = e.target.files || e.dataTransfer.files;
      // console.log(files);
      if (!files.length) return;
      else if (files[0].size > 5242880) {
        this.fileUploaderSnackText = 'File size cannot more than 5 mb';
        this.fileUploaderSnackBarAlert = true;
        this.fileUploaderSnackBarAlertColor = 'red';
        return;
      }
      // this.image[0].image = files[0];
      // this.image[0].image_path = URL.createObjectURL(files[0]);
      const newImage = {
        image_path: URL.createObjectURL(files[0]),
        image: files[0],
      };
      this.image.push(newImage);
      console.log(this.image);
    },

    saveNewImage() {
      if (this.isEmptyImageFile == false) {
        this.tempAttachment = this.image.map((img) => {
          return {
            file: {
              name: img.image.name || '',
              size: img.image.size || '',
              file: img.image_path || img.file.name,
              format: img.image.type || '',
            },
          };
        });
      } else {
        this.tempAttachment = this.image.map((img) => {
          return {
            file: {
              name: img.image.name || '',
              size: img.image.size || '',
              file: img.image_path || '',
              format: img.image.type || '',
            },
          };
        });
      }
      // console.log(this.tempAttachment);
      this.documentAttachmentAPI = this.image.map((img) => img.image);
      this.$emit('update-image-file', this.documentAttachmentAPI);
      this.isInsertImage = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
