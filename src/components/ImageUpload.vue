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
                    <template v-if="isImageFile(getAttachmentName(attachment))">
                      <v-img
                        style="margin: 10px"
                        :src="getAttachmentSrc(attachment)"
                        height="50px"
                        width="50px"
                      ></v-img>
                    </template>
                    <template v-else>
                      <v-icon
                        style="margin-left: 10px"
                        size="50"
                        :color="getFileColor(getAttachmentName(attachment))"
                      >
                        {{ getFileIcon(getAttachmentName(attachment)) }}
                      </v-icon>
                    </template>
                  </td>
                  <td>
                    <v-card-subtitle
                      v-if="
                        Number((getAttachmentSize(attachment) / 1000).toFixed(1)) < 1024 * 10
                      "
                      class="mt2"
                    >
                      <v-chip color="teal lighten-2" label text-color="white">
                        {{
                          Number((getAttachmentSize(attachment) / 1000).toFixed(1)) +
                          ' kb'
                        }}
                        <v-icon right>mdi-harddisk</v-icon>
                      </v-chip>
                    </v-card-subtitle>
                    <v-card-subtitle
                      v-else
                    >
                      <v-chip color="teal lighten-2" label text-color="white">
                        {{
                          Number(
                            (getAttachmentSize(attachment) / 1000 / 1024).toFixed(1)
                          ) + ' mb'
                        }}
                        <v-icon right>mdi-harddisk</v-icon>
                      </v-chip>
                    </v-card-subtitle>
                  </td>
                  <td>
                    <v-btn
                      icon
                      variant="text"
                      color="red"
                      @click="openDeleteDialog(index, '')"
                    >
                      <v-icon>mdi-delete</v-icon>
                      <v-tooltip location="top" activator="parent">Delete</v-tooltip>
                    </v-btn>
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
                </template>
              </template>
            </v-file-input>
          </v-card-text>
          <v-card-actions>
            <v-btn
              class="BYekan"
              :disabled="image[0].image == null || btnLoader"
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

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  imageFile: {
    type: Array,
    default: () => [],
  },
  isVertical: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update-image-file', 'delete-image-file']);

const fileURL = process.env.VUE_APP_FILE_URL || '';

const isInsertImage = ref(false);
const isDeleteImage = ref(false);
const btnLoader = ref(false);
const selectedIndex = ref('');
const selectedId = ref('');
const fileUploaderSnackBarAlert = ref(false);
const fileUploaderSnackText = ref('');
const fileUploaderSnackBarAlertColor = ref('green');

const image = ref([
  {
    image_path: '',
    image: null,
  },
]);

const tempAttachment = ref([]);
const documentAttachmentAPI = ref({});

const fileTypeConfig = {
  // image types
  jpg: { icon: 'mdi-file-image-outline', color: 'blue-grey' },
  jpeg: { icon: 'mdi-file-image-outline', color: 'blue-grey' },
  png: { icon: 'mdi-file-image-outline', color: 'blue-grey' },
  tif: { icon: 'mdi-file-image-outline', color: 'blue-grey' },
  bmp: { icon: 'mdi-file-image-outline', color: 'blue-grey' },
  webp: { icon: 'mdi-file-image-outline', color: 'blue-grey' },
  gif: { icon: 'mdi-file-image-outline', color: 'blue-grey' },
  svg: { icon: 'mdi-file-image-outline', color: 'blue-grey' },
  // document types
  pdf: { icon: 'mdi-file-pdf-outline', color: 'red darken-1' },
  doc: { icon: 'mdi-file-word-outline', color: 'blue darken-1' },
  docx: { icon: 'mdi-file-word-outline', color: 'blue darken-1' },
  odt: { icon: 'mdi-file-word-outline', color: 'blue darken-1' },
  xls: { icon: 'mdi-file-excel-outline', color: 'teal darken-1' },
  xlsx: { icon: 'mdi-file-excel-outline', color: 'teal darken-1' },
  pptx: { icon: 'mdi-file-powerpoint-outline', color: 'orange darken-3' },
  pptm: { icon: 'mdi-file-powerpoint-outline', color: 'orange darken-3' },
  ppt: { icon: 'mdi-file-powerpoint-outline', color: 'orange darken-3' },
  // media types
  mp4: { icon: 'mdi-file-video-outline', color: 'red lighten-1' },
  mov: { icon: 'mdi-file-video-outline', color: 'red lighten-1' },
  flv: { icon: 'mdi-file-video-outline', color: 'red lighten-1' },
  wmv: { icon: 'mdi-file-video-outline', color: 'red lighten-1' },
  avi: { icon: 'mdi-file-video-outline', color: 'red lighten-1' },
  dwg: { icon: 'mdi-file-cad', color: 'indigo lighten-2' },
  // archive types
  zip: { icon: 'mdi-folder-zip-outline', color: 'lime lighten-1' },
  rar: { icon: 'mdi-folder-zip-outline', color: 'lime lighten-1' },
  '7-zip': { icon: 'mdi-folder-zip-outline', color: 'lime lighten-1' },
  // text types
  txt: { icon: 'mdi-script-text-outline', color: 'light-green darken-3' },
};

const getFileExt = (filename) => {
  if (!filename || typeof filename !== 'string') return '';
  return filename.split('.').pop().toLowerCase();
};

const isImageFile = (filename) => {
  const ext = getFileExt(filename);
  const imageExts = ['jpg', 'jpeg', 'png', 'tif', 'tiff', 'bmp', 'webp', 'gif', 'svg'];
  return imageExts.includes(ext);
};

const getFileIcon = (filename) => {
  const ext = getFileExt(filename);
  return (fileTypeConfig[ext] || { icon: 'mdi-file-question-outline' }).icon;
};

const getFileColor = (filename) => {
  const ext = getFileExt(filename);
  return (fileTypeConfig[ext] || { color: 'indigo lighten-1' }).color;
};

const normalizeAttachment = (item) => {
  if (!item) return null;
  if (item.file && typeof item.file === 'object') {
    return {
      file: {
        name: item.file.name || '',
        size: item.file.size || 0,
        file: item.file.file || (item.file.name ? (item.file.name.startsWith('blob:') || item.file.name.startsWith('http') ? item.file.name : fileURL + item.file.name) : ''),
        format: item.file.format || '',
      },
    };
  }
  if (item instanceof File || (item.name && item.size !== undefined)) {
    const blobUrl = image.value[0]?.image_path || (item instanceof Blob ? URL.createObjectURL(item) : '');
    return {
      file: {
        name: item.name,
        size: item.size,
        file: blobUrl,
        format: item.type || '',
      },
    };
  }
  if (typeof item === 'string') {
    return {
      file: {
        name: item,
        size: 0,
        file: item.startsWith('blob:') || item.startsWith('http') ? item : fileURL + item,
        format: '',
      },
    };
  }
  return { file: { name: '', size: 0, file: '', format: '' } };
};

const getAttachmentName = (attachment) => {
  if (!attachment) return '';
  if (attachment.file?.name) return attachment.file.name;
  if (attachment.name) return attachment.name;
  return '';
};

const getAttachmentSize = (attachment) => {
  if (!attachment) return 0;
  if (attachment.file?.size !== undefined) return attachment.file.size;
  if (attachment.size !== undefined) return attachment.size;
  return 0;
};

const getAttachmentSrc = (attachment) => {
  if (!attachment) return '';
  if (attachment.file?.file) return attachment.file.file;
  if (attachment.file?.name) {
    const name = attachment.file.name;
    return name.startsWith('blob:') || name.startsWith('http') ? name : fileURL + name;
  }
  if (image.value[0]?.image_path) return image.value[0].image_path;
  if (attachment.name) {
    return attachment.name.startsWith('blob:') || attachment.name.startsWith('http') ? attachment.name : fileURL + attachment.name;
  }
  return '';
};

watch(
  () => props.imageFile,
  (newVal) => {
    if (Array.isArray(newVal)) {
      tempAttachment.value = newVal.map(normalizeAttachment).filter(Boolean);
    } else {
      tempAttachment.value = [];
    }
  },
  { deep: true, immediate: true }
);

onMounted(() => {
  if (Array.isArray(props.imageFile)) {
    tempAttachment.value = props.imageFile.map(normalizeAttachment).filter(Boolean);
  }
});

onUnmounted(() => {
  tempAttachment.value = [];
});

const openInputImage = () => {
  btnLoader.value = false;
  isInsertImage.value = true;
};

const openDeleteDialog = (index, deleteId) => {
  btnLoader.value = false;
  selectedIndex.value = index;
  selectedId.value = deleteId;
  isDeleteImage.value = true;
};

const deleteImage = () => {
  tempAttachment.value.splice(selectedIndex.value, 1);
  image.value = [{ image_path: '', image: null }];
  emit('delete-image-file');
  isDeleteImage.value = false;
};

const onImageInput = (e) => {
  const files = e.target.files || e.dataTransfer.files;
  if (!files.length) return;

  if (props.isVertical) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        image.value[0].image = files[0];
        image.value[0].image_path = URL.createObjectURL(files[0]);
      };
    };
    reader.readAsDataURL(files[0]);
  } else {
    image.value[0].image = files[0];
    image.value[0].image_path = URL.createObjectURL(files[0]);
  }
};

const saveNewImage = () => {
  const newAttachment = image.value.map((img) => {
    return {
      file: {
        name: img.image?.name || '',
        size: img.image?.size || 0,
        file: img.image_path || '',
        format: img.image?.type || '',
      },
    };
  });
  tempAttachment.value = newAttachment;
  documentAttachmentAPI.value = image.value[0].image;
  emit('update-image-file', documentAttachmentAPI.value);
  isInsertImage.value = false;
};
</script>

<style lang="scss" scoped></style>
