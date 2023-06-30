<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12" xs="12">
        <v-btn
          v-if="tempAttachment.length === 0"
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
                          image[0].image_path !== ''
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
  name: 'ImageUpload',
  props: {
    imageFile: [Array],
  },
  data() {
    return {
      // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
      isInsertImage: false,
      isDeleteImage: false,

      image: [
        {
          image_path: '',
          image: null,
        },
      ],

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
    // console.log(this.tempAttachment);
  },
  unmounted() {
    this.tempAttachment = [];
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
      this.tempAttachment.splice(this.selectedIndex, 1);
      this.$emit('delete-image-file');
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
      this.image[0].image = files[0];
      this.image[0].image_path = URL.createObjectURL(files[0]);
      // console.log(this.image[0]);
    },

    saveNewImage() {
      this.tempAttachment = this.image.map((img) => {
        return {
          file: {
            name: img.image.name,
            size: img.image.size,
            file: img.image_path,
            format: img.image.type,
          },
        };
      });
      this.documentAttachmentAPI = this.image[0].image;
      this.$emit('update-image-file', this.documentAttachmentAPI);
      this.isInsertImage = false;
    },

    // getShowDetailState(index) {
    //   this.showDetailState[index] = !this.showDetailState[index];
    //   console.log('showDetailState' + JSON.stringify(this.showDetailState));
    // },

    // handleUpload(fileAttachment) {
    //   let reader = new FileReader();
    //   return new Promise(function (resolve) {
    //     reader.onloadend = () => {
    //       resolve(reader.result);
    //     };
    //     reader.readAsDataURL(fileAttachment);
    //   });
    // },

    /**
     * asynchronous method to insert selected file(s)
     *
     * @public
     * @returns {Array} selected file(s)
     */

    // async uploadFieldChange() {
    //   this.btnLoader = true;
    //   for (let [index, item] of this.tempAttachment.entries()) {
    //     if (this.documentAttachment.length <= 1) {
    //       if ((item.size / 1000).toFixed(1) > this.maxFileSize) {
    //         this.fileUploaderSnackBarAlertColor = 'red';
    //         this.fileUploaderSnackText = `Max file Size is 2 MB`;
    //         this.fileUploaderSnackBarAlert = true;
    //       } else {
    //         let tempFile = {};
    //         let file = {};
    //         try {
    //           // console.log(item);
    //           this.readerFile = await this.handleUpload(item);
    //         } catch (e) {
    //           console.log(e);
    //         }
    //         let fullFileType = this.readerFile.split(';');
    //         let fileType = fullFileType[0].split(':');
    //         let sizeInKb = 0;
    //         // let  status = true;
    //         let imgFile = await this.compressImage(
    //           this.readerFile,
    //           fileType[1]
    //         );
    //         //tempFile.subject= this.tempAttachmentChanged[index].name + '.' + this.tempAttachmentChanged[index].format;
    //         let strTemp = this.readerFile.split(',');
    //         let imgTemp = imgFile.split(',');
    //         tempFile.base64 = imgTemp[1];
    //         sizeInKb = new Buffer(imgFile, 'base64').length;
    //         tempFile.size = String(sizeInKb);
    //         tempFile.name =
    //           this.tempAttachmentChanged[index].name +
    //           '.' +
    //           this.tempAttachmentChanged[index].format;
    //         // if (this.tempAttachmentChanged[index].tags === undefined)
    //         //   tempFile.tags = [];
    //         // else tempFile.tags = this.tempAttachmentChanged[index].tags;
    //         // if (this.tempAttachmentChanged[index].description === undefined)
    //         //   tempFile.description = "";
    //         // else
    //         //   tempFile.description = this.tempAttachmentChanged[
    //         //     index
    //         //   ].description;
    //         tempFile.showDetailState = false;

    //         tempFile.format = strTemp[0].replace('data:', '');
    //         file.file = tempFile;
    //         /* const convertedToFile = this.convertBase64ToFile(
    //           imgFile,
    //           tempFile.name
    //         ); */
    //         // console.log(convertedToFile)
    //         this.registryDocFile.push(file);
    //         this.$emit('update:documentAttachment', this.registryDocFile);
    //       }
    //     } else {
    //       this.fileUploaderSnackBarAlertColor = 'red';
    //       this.fileUploaderSnackText = `Max file count is 1`;
    //       this.fileUploaderSnackBarAlert = true;
    //     }
    //   }
    //   this.documentAttachmentAPI = [];
    //   this.tempAttachmentChanged = [];
    //   this.isInsertImage = false;
    // },

    // compressImage(base64) {
    //   const canvas = document.createElement('canvas');
    //   const img = document.createElement('img');

    //   return new Promise((resolve, reject) => {
    //     let imageCompressLevelTemp = 0.8;
    //     img.onload = function () {
    //       let width = img.width;
    //       let height = img.height;
    //       canvas.width = width;
    //       canvas.height = height;

    //       const ctx = canvas.getContext('2d');
    //       ctx.drawImage(img, 0, 0, width, height);

    //       resolve(canvas.toDataURL('image/jpeg', imageCompressLevelTemp));
    //     };
    //     img.onerror = function (err) {
    //       reject(err);
    //     };
    //     img.src = base64;
    //   });
    // },

    // convertBase64ToFile(base64, fileName) {
    //   const byteString = atob(base64.split(',')[1]);
    //   const ab = new ArrayBuffer(byteString.length);
    //   const ia = new Uint8Array(ab);
    //   for (let i = 0; i < byteString.length; i += 1) {
    //     ia[i] = byteString.charCodeAt(i);
    //   }
    //   const newBlob = new Blob([ab], {
    //     type: 'image/jpeg',
    //   });
    //   return new File([newBlob], fileName);
    // },

    // async getAttachmentDetails(selectedAttachment) {
    //   for (let item of selectedAttachment) {
    //     try {
    //       this.readerFile = await this.handleUpload(item);
    //     } catch (e) {
    //       console.log(e);
    //     }
    //     let obj = {};
    //     let name = '';
    //     name = item.name.split('.');
    //     obj.format = item.name.substr(item.name.lastIndexOf('.') + 1);
    //     obj.name = name[0];
    //     obj.base64 = this.readerFile;
    //     this.tempAttachmentChanged.push(obj);
    //   }
    // },
  },
};
</script>

<style lang="scss" scoped></style>
