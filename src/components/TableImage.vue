<template>
  <div>
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
                    attachment.file.name.split('.').pop().toLowerCase() == 'bmp'
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
                      attachment.file.name.split('.').pop().toLowerCase() ===
                      'pdf'
                    "
                    style="margin-left: 10px"
                    size="50"
                    file-word-outline
                    color="red darken-1"
                    >mdi-file-pdf-outline</v-icon
                  >
                  <v-icon
                    v-else-if="
                      attachment.file.name.split('.').pop().toLowerCase() ===
                        'doc' ||
                      attachment.file.name.split('.').pop().toLowerCase() ===
                        'docx' ||
                      attachment.file.name.split('.').pop().toLowerCase() ===
                        'odt'
                    "
                    style="margin-left: 10px"
                    size="50"
                    file-word-outline
                    color="blue darken-1"
                    >mdi-file-word-outline</v-icon
                  >
                  <v-icon
                    v-else-if="
                      attachment.file.name.split('.').pop().toLowerCase() ===
                        'xls' ||
                      attachment.file.name.split('.').pop().toLowerCase() ===
                        'xlsx'
                    "
                    style="margin-left: 10px"
                    size="50"
                    file-word-outline
                    color="teal darken-1"
                    >mdi-file-excel-outline</v-icon
                  >
                  <v-icon
                    v-else-if="
                      attachment.file.name.split('.').pop().toLowerCase() ===
                        'pptx' ||
                      attachment.file.name.split('.').pop().toLowerCase() ===
                        'pptm' ||
                      attachment.file.name.split('.').pop().toLowerCase() ===
                        'ppt'
                    "
                    style="margin-left: 10px"
                    size="50"
                    file-word-outline
                    color="orange darken-3"
                    >mdi-file-powerpoint-outline</v-icon
                  >
                  <v-icon
                    v-else-if="
                      attachment.file.name.split('.').pop().toLowerCase() ===
                        'mp4' ||
                      attachment.file.name.split('.').pop().toLowerCase() ===
                        'mov' ||
                      attachment.file.name.split('.').pop().toLowerCase() ===
                        'flv' ||
                      attachment.file.name.split('.').pop().toLowerCase() ===
                        'wmv' ||
                      attachment.file.name.split('.').pop().toLowerCase() ===
                        'avi'
                    "
                    style="margin-left: 10px"
                    size="50"
                    file-word-outline
                    color="red lighten-1"
                    >mdi-file-video-outline</v-icon
                  >
                  <v-icon
                    v-else-if="
                      attachment.file.name.split('.').pop().toLowerCase() ===
                      'dwg'
                    "
                    style="margin-left: 10px"
                    size="50"
                    file-word-outline
                    color="indigo lighten-2"
                    >mdi-file-cad</v-icon
                  >
                  <v-icon
                    v-else-if="
                      attachment.file.name.split('.').pop().toLowerCase() ===
                        'zip' ||
                      attachment.file.name.split('.').pop().toLowerCase() ===
                        'rar' ||
                      attachment.file.name.split('.').pop().toLowerCase() ===
                        '7-zip'
                    "
                    size="120"
                    file-word-outline
                    color="lime lighten-1"
                    >mdi-folder-zip-outline</v-icon
                  >
                  <v-icon
                    v-else-if="
                      attachment.file.name.split('.').pop().toLowerCase() ===
                      'txt'
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
                  v-if="Number((attachment.file.size / 1000).toFixed(1)) < 1024"
                  class="mt2"
                >
                  <v-chip color="teal lighten-2" label text-color="white">
                    {{
                      Number((attachment.file.size / 1000).toFixed(1)) + ' kb'
                    }}
                    <v-icon right>mdi-harddisk</v-icon>
                  </v-chip>
                </v-card-subtitle>
                <v-card-subtitle
                  v-if="Number((attachment.file.size / 1000).toFixed(1)) > 1024"
                >
                  <v-chip color="teal lighten-2" label text-color="white">
                    {{
                      Number((attachment.file.size / 1000 / 1024).toFixed(1)) +
                      ' mb'
                    }}
                    <v-icon right>mdi-harddisk</v-icon>
                  </v-chip>
                </v-card-subtitle>
              </td>
              <td>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      color="red"
                      v-on="on"
                      @click="openDeleteDialog(index, '')"
                      ><v-icon>mdi-delete</v-icon></v-btn
                    >
                  </template>
                  <span>Delete</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      text
                      fab
                      v-on="on"
                      @click="openEditDocumentDialog(attachment, index)"
                      ><v-icon color="green">mdi-pencil-outline</v-icon></v-btn
                    >
                  </template>
                  <span class="BYekan">Edit</span>
                </v-tooltip>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    imageFile: [Array],
  },
  data: () => ({}),
  methods: {
    openDeleteDialog(index, deleteId) {
      this.$emit('openDeleteDialog', index, deleteId);
    },
    openEditDocumentDialog(item, index) {
      this.$emit('openEditDocumentDialog', item, index);
    },
  },
};
</script>
