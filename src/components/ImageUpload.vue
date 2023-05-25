<template>
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
              v-if="fileAccept !== ''"
              multiple
              :accept="fileAccept"
              chip
              v-model="tempAttachment"
              :label="selectedLang[lang].insertNewFile"
            ></v-file-input>
            <v-file-input
              v-else
              multiple
              v-model="tempAttachment"
              :label="selectedLang[lang].insertNewFile"
            ></v-file-input>
          </template>
          <template>
            <v-expansion-panels
              v-if="addFileTag || addFileDescription || changeFileName"
            >
              <v-expansion-panel
                v-for="(attachment, index) in tempAttachmentChanged"
                :key="`attachment-${index}`"
              >
                <v-expansion-panel-header>{{
                  attachment.name
                }}</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row align="center" justify="center">
                    <v-col cols="12" lg="9" md="9" xs="12">
                      <v-text-field
                        v-if="changeFileName"
                        :label="selectedLang[lang].fileName"
                        v-model="attachment.name"
                        :prepend-icon="attachment.icon"
                      >
                      </v-text-field>
                      <v-textarea
                        v-if="addFileDescription"
                        :label="selectedLang[lang].fileDescription"
                        auto-grow
                        row-height="1"
                        v-model="attachment.description"
                      >
                      </v-textarea>
                      <v-autocomplete
                        v-if="addFileTag"
                        v-model="attachment.tags"
                        :items="tags"
                        dense
                        chips
                        :label="selectedLang[lang].fileTags"
                        multiple
                      ></v-autocomplete>
                    </v-col>
                    <v-col align="center" cols="12" lg="3" md="3" xs="12">
                      <template
                        v-if="
                          attachment.format === 'jpg' ||
                          attachment.format === 'jpeg' ||
                          attachment.format === 'png' ||
                          attachment.format === 'tif' ||
                          attachment.format === 'bmp'
                        "
                      >
                        <v-card>
                          <v-img :src="attachment.base64"></v-img>
                        </v-card>
                      </template>
                      <template v-else>
                        <select-file-icon-type
                          :file-format="attachment.format"
                          :size="60"
                        >
                        </select-file-icon-type>
                      </template>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            <v-card v-else class="mx-auto" tile>
              <v-list-item
                v-for="(attachment, index) in tempAttachmentChanged"
                :key="`attachment-${index}`"
                style="border-bottom: 1px solid #e0e0e0"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    <select-file-icon-type :file-format="attachment.format">
                    </select-file-icon-type>
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
            :color="btnColor"
            @click="uploadFieldChange"
            >{{ selectedLang[lang].add }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
