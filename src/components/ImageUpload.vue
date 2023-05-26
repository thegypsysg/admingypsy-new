<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12" xs="12">
        <v-btn
          v-if="imageFile.length === 0"
          color="#2598F3"
          @click="openInputImage"
          class="mb-4"
        >
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
                  v-for="(attachment, index) in imageFile"
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
                          'data:' +
                          attachment.file.format +
                          ',' +
                          attachment.file.base64
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

                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          icon
                          variant="text"
                          @click="openEditDocumentDialog(attachment, index)"
                          v-bind="props"
                        >
                          <v-icon color="green">mdi-pencil-outline</v-icon>
                        </v-btn>
                      </template>
                      <span>Edit</span>
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
            <template v-if="tempAttachment.length === 0">
              <v-file-input
                multiple
                v-model="tempAttachment"
                label="Insert File"
              ></v-file-input>
            </template>
            <template>
              <v-card class="mx-auto" tile>
                <v-list-item
                  v-for="(attachment, index) in tempAttachmentChanged"
                  :key="`attachment-${index}`"
                  style="border-bottom: 1px solid #e0e0e0"
                >
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ attachment.name }}.{{ attachment.format }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </template>
          </v-card-text>
          <v-card-actions>
            <v-btn
              class="BYekan"
              :disabled="tempAttachment == null || btnLoader"
              :loading="btnLoader"
              style="background-color: #329ef4 !important"
              @click="uploadFieldChange"
              ><span class="text-white">Add</span></v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row justify="center">
      <v-dialog
        v-model="isEditImage"
        :scrollable="false"
        persistent
        width="50%"
      >
        <v-card>
          <v-card-title>
            <v-icon @click="isEditImage = false">mdi-close</v-icon>
          </v-card-title>
          <v-card-text
            v-for="(attachment, index) in tempAttachmentChanged"
            :key="`attachment-${index}`"
            class="BYekan"
          >
            <v-row align="center" justify="center">
              <v-col align="center" cols="12" lg="3" md="3" xs="12">
                <template>
                  <h1>EDIT ANJIIING</h1>
                </template>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn
              class="BYekan text-white"
              style="background-color: #2b81d6"
              :disabled="tempAttachment === null || btnLoader"
              :loading="btnLoader"
              @click="editImage"
              >Edit</v-btn
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
import { Buffer } from 'buffer';

export default {
  name: 'ImageUpload',
  props: {
    imageFile: [Array],
  },
  data() {
    return {
      isInsertImage: false,
      isDeleteImage: false,
      isEditImage: false,

      tempAttachment: [],
      tempAttachmentChanged: [],

      fileUploaderSnackBarAlert: false,
      fileUploaderSnackText: '',
      fileUploaderSnackBarAlertColor: 'green',
      readerFile: null,
      registryDocFile: [],
      documentAttachmentAPI: [],
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
  watch: {
    tempAttachment: function (newValue) {
      if (this.tempAttachment.length > 0) this.getAttachmentDetails(newValue);
      else this.tempAttachmentChanged = [];
    },
  },
  mounted() {
    this.registryDocFile = this.imageFile;
    this.documentAttachment = this.imageFile;
  },
  unmounted() {
    this.registryDocFile = [];
  },
  methods: {
    openInputImage() {
      this.btnLoader = false;
      this.tempAttachment = [];
      this.isInsertImage = true;
    },
    openDeleteDialog(index, deleteId) {
      this.btnLoader = false;
      this.selectedIndex = index;
      this.selectedId = deleteId;
      this.isDeleteImage = true;
    },
    deleteImage() {
      this.registryDocFile.splice(this.selectedIndex, 1);
      this.$emit('update:documentAttachment', this.registryDocFile);
      this.isDeleteImage = false;
    },
    openEditDocumentDialog(item, index) {
      this.btnLoader = false;
      this.attachmentIndex = index;
      this.isEditImage = true;
      this.tempAttachmentChanged = item;
    },
    editDocument() {
      this.documentAttachment.splice(
        this.attachmentIndex,
        1,
        this.tempAttachmentChanged
      );
      this.isEditImage = false;
    },
    getShowDetailState(index) {
      this.showDetailState[index] = !this.showDetailState[index];
      console.log('showDetailState' + JSON.stringify(this.showDetailState));
    },

    handleUpload(fileAttachment) {
      let reader = new FileReader();
      return new Promise(function (resolve) {
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(fileAttachment);
      });
    },

    /**
     * asynchronous method to insert selected file(s)
     *
     * @public
     * @returns {Array} selected file(s)
     */

    async uploadFieldChange() {
      this.btnLoader = true;
      for (let [index, item] of this.tempAttachment.entries()) {
        if (this.documentAttachment.length <= 1) {
          if ((item.size / 1000).toFixed(1) > this.maxFileSize) {
            this.fileUploaderSnackBarAlertColor = 'red';
            this.fileUploaderSnackText = `Max file Size is 2 MB`;
            this.fileUploaderSnackBarAlert = true;
          } else {
            let tempFile = {};
            let file = {};
            try {
              // console.log(item);
              this.readerFile = await this.handleUpload(item);
            } catch (e) {
              console.log(e);
            }
            let fullFileType = this.readerFile.split(';');
            let fileType = fullFileType[0].split(':');
            let sizeInKb = 0;
            // let  status = true;
            let imgFile = await this.compressImage(
              this.readerFile,
              fileType[1]
            );
            //tempFile.subject= this.tempAttachmentChanged[index].name + '.' + this.tempAttachmentChanged[index].format;
            let strTemp = this.readerFile.split(',');
            let imgTemp = imgFile.split(',');
            tempFile.base64 = imgTemp[1];
            sizeInKb = new Buffer(imgFile, 'base64').length;
            tempFile.size = String(sizeInKb);
            tempFile.name =
              this.tempAttachmentChanged[index].name +
              '.' +
              this.tempAttachmentChanged[index].format;
            // if (this.tempAttachmentChanged[index].tags === undefined)
            //   tempFile.tags = [];
            // else tempFile.tags = this.tempAttachmentChanged[index].tags;
            // if (this.tempAttachmentChanged[index].description === undefined)
            //   tempFile.description = "";
            // else
            //   tempFile.description = this.tempAttachmentChanged[
            //     index
            //   ].description;
            tempFile.showDetailState = false;

            tempFile.format = strTemp[0].replace('data:', '');
            file.file = tempFile;
            /* const convertedToFile = this.convertBase64ToFile(
              imgFile,
              tempFile.name
            ); */
            // console.log(convertedToFile)
            this.registryDocFile.push(file);
            this.$emit('update:documentAttachment', this.registryDocFile);
          }
        } else {
          this.fileUploaderSnackBarAlertColor = 'red';
          this.fileUploaderSnackText = `Max file count is 1`;
          this.fileUploaderSnackBarAlert = true;
        }
      }
      this.documentAttachmentAPI = [];
      this.tempAttachmentChanged = [];
      this.isInsertImage = false;
    },

    compressImage(base64) {
      const canvas = document.createElement('canvas');
      const img = document.createElement('img');

      return new Promise((resolve, reject) => {
        let imageCompressLevelTemp = 0.8;
        img.onload = function () {
          let width = img.width;
          let height = img.height;
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          resolve(canvas.toDataURL('image/jpeg', imageCompressLevelTemp));
        };
        img.onerror = function (err) {
          reject(err);
        };
        img.src = base64;
      });
    },

    convertBase64ToFile(base64, fileName) {
      const byteString = atob(base64.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i += 1) {
        ia[i] = byteString.charCodeAt(i);
      }
      const newBlob = new Blob([ab], {
        type: 'image/jpeg',
      });
      return new File([newBlob], fileName);
    },

    async getAttachmentDetails(selectedAttachment) {
      for (let item of selectedAttachment) {
        try {
          this.readerFile = await this.handleUpload(item);
        } catch (e) {
          console.log(e);
        }
        let obj = {};
        let name = '';
        name = item.name.split('.');
        obj.format = item.name.substr(item.name.lastIndexOf('.') + 1);
        obj.name = name[0];
        obj.base64 = this.readerFile;
        this.tempAttachmentChanged.push(obj);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
