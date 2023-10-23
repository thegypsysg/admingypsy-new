<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <v-container>
    <div class="d-flex ml-4 mb-4" style="gap: 40px">
      <router-link
      active-class="text-black"
      style="color: #3e4aaf"
      class="text-decoration-none"
      to="/course_master"
    >
      <h2 class="text-blue-darken-2">Course Master</h2>
      </router-link>
      <router-link
      style="color: #940F1B"
      class="text-decoration-none"
      to="/university_master"
    >
      <h2>University Master</h2>
      </router-link>
    </div>
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-combobox
              density="compact"
              label="Select University"
              placeholder="Type University"
              :items="resource.university"
              v-model="input.university"
              variant="outlined"
            ></v-combobox>
          </v-col>
          <v-col cols="12" md="4">
            <div class="w-100 d-flex align-center">
              <div
                v-if="input.country"
                style="
                  border-top: 2px solid rgb(239, 239, 239);
                  border-bottom: 2px solid rgb(239, 239, 239);
                  border-left: 2px solid rgb(239, 239, 239);
                  border-radius: 5px 0 0px 5px;
                  height: 47px;
                "
                class="d-flex align-center justify-center"
              >
                <span
                  class="fi ml-2 pr-4 mr-4"
                  :class="['fi-' + input.country.toLowerCase()]"
                />
              </div>
              <MazSelect
                v-slot="{ option }"
                v-model="input.country"
                item-height="40"
                :options="options"
                search
                label="- Select Country -"
                size="md"
                class="w-100"
                search-placeholder="Search in country"
                :class="{ 'ml-n1': input.country }"
              >
                <div
                  class="flex items-center"
                  style="
                    padding-top: 0.5rem;
                    padding-bottom: 0.5rem;
                    width: 100%;
                    gap: 1rem;
                  "
                >
                  <span
                    class="fi"
                    :class="['fi-' + option.value.toLowerCase()]"
                  />
                  <span class="pl-2">
                    {{ option.label }}
                  </span>
                </div>
              </MazSelect>
            </div>
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
          <v-col cols="12" md="4">
            <h4 class="mb-2">Sub-Industry</h4>
            <v-autocomplete
              density="compact"
              label="Type Sub Industry Name"
              placeholder="Enter Sub Industry Name"
              :items="resource.subIndustry"
              item-title="name"
              item-value="id"
              v-model="input.subIndustry"
              variant="outlined"
            ></v-autocomplete>
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
                <th class="text-left">University / School Name</th>
                <th class="text-left">Country</th>
                <th class="text-left">Sub Industry</th>
                <th class="text-left">User</th>
                <th class="text-left">Dated</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in filteredItems" :key="item.id">
                <tr class="country-table-body">
                  <td style="font-weight: 500 !important">
                    {{ item.id }}
                  </td>
                  <td style="font-weight: 500 !important">
                    {{ item.university }}
                  </td>
                  <td style="font-weight: 500 !important">
                    {{ item.country }}
                  </td>
                  <td style="font-weight: 500 !important">
                    {{ item.subIndustry }}
                  </td>
                  <td style="font-weight: 500 !important">
                    {{ item.user }}
                  </td>
                  <td style="font-weight: 500 !important">
                    {{ item.dated }}
                  </td>

                  <td>
                    <div class="d-flex">
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            color="green"
                            variant="text"
                            v-bind="props"
                            @click="editUniversity(item)"
                            icon="mdi-pencil-outline"
                          ></v-btn>
                        </template>
                        <span>Edit</span>
                      </v-tooltip>
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            color="red"
                            variant="text"
                            v-bind="props"
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
        <v-card-text> Are you sure want to delete this university? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelDelete">No</v-btn>
          <v-btn color="success" text @click="deleteUniversity">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from '@/util/axios';
// import http from 'axios';
import { setAuthHeader } from '@/util/axios';
// import app from '@/util/eventBus';
import MazSelect from "maz-ui/components/MazSelect";

export default {
  name: 'UniversityMaster',components: {
    MazSelect,
  },
  data: () => ({
    // fileURL: 'https://admin1.the-gypsy.sg/img/app/',
    options: [
  { phoneNum: "+65", value: "SG", label: "Singapore" },
  { phoneNum: "+880", value: "BD", label: "Bangladesh" },
  { phoneNum: "+91", value: "IN", label: "India" },
  { phoneNum: "+60", value: "MY", label: "Malaysia" },
  { phoneNum: "+44", value: "GB", label: "United Kingdom" },
  { phoneNum: "+63", value: "PH", label: "Philippines" },
  { phoneNum: "+93", value: "AF", label: "Afghanistan" },
  { phoneNum: "+358", value: "AX", label: "Aland Islands" },
  { phoneNum: "+355", value: "AL", label: "Albania" },
  { phoneNum: "+213", value: "DZ", label: "Algeria" },
  { phoneNum: "+1", value: "AS", label: "American Samoa" },
  { phoneNum: "+376", value: "AD", label: "Andorra" },
  { phoneNum: "+244", value: "AO", label: "Angola" },
  { phoneNum: "+1", value: "AI", label: "Anguilla" },
  { phoneNum: "+672", value: "AQ", label: "Antarctica" },
  { phoneNum: "+1", value: "AG", label: "Antigua And Barbuda" },
  { phoneNum: "+54", value: "AR", label: "Argentina" },
  { phoneNum: "+374", value: "AM", label: "Armenia" },
  { phoneNum: "+297", value: "AW", label: "Aruba" },
  { phoneNum: "+61", value: "AU", label: "Australia" },
  { phoneNum: "+43", value: "AT", label: "Austria" },
  { phoneNum: "+994", value: "AZ", label: "Azerbaijan" },
  { phoneNum: "+1", value: "BS", label: "Bahamas" },
  { phoneNum: "+973", value: "BH", label: "Bahrain" },
  { phoneNum: "+1", value: "BB", label: "Barbados" },
  { phoneNum: "+375", value: "BY", label: "Belarus" },
  { phoneNum: "+32", value: "BE", label: "Belgium" },
  { phoneNum: "+501", value: "BZ", label: "Belize" },
  { phoneNum: "+229", value: "BJ", label: "Benin" },
  { phoneNum: "+1", value: "BM", label: "Bermuda" },
  { phoneNum: "+975", value: "BT", label: "Bhutan" },
  { phoneNum: "+591", value: "BO", label: "Bolivia" },
  { phoneNum: "+387", value: "BA", label: "Bosnia And Herzegovina" },
  { phoneNum: "+267", value: "BW", label: "Botswana" },
  { phoneNum: "N/A", value: "BV", label: "Bouvet Island" },
  { phoneNum: "+55", value: "BR", label: "Brazil" },
  { phoneNum: "N/A", value: "IO", label: "British Indian Ocean Territory" },
  { phoneNum: "+673", value: "BN", label: "Brunei Darussalam" },
  { phoneNum: "+359", value: "BG", label: "Bulgaria" },
  { phoneNum: "+226", value: "BF", label: "Burkina Faso" },
  { phoneNum: "+257", value: "BI", label: "Burundi" },
  { phoneNum: "+855", value: "KH", label: "Cambodia" },
  { phoneNum: "+237", value: "CM", label: "Cameroon" },
  { phoneNum: "+1", value: "CA", label: "Canada" },
  { phoneNum: "+238", value: "CV", label: "Cape Verde" },
  { phoneNum: "+1", value: "KY", label: "Cayman Islands" },
  { phoneNum: "+236", value: "CF", label: "Central African Republic" },
  { phoneNum: "+235", value: "TD", label: "Chad" },
  { phoneNum: "+56", value: "CL", label: "Chile" },
  { phoneNum: "+86", value: "CN", label: "China" },
  { phoneNum: "+61", value: "CX", label: "Christmas Island" },
  { phoneNum: "+61", value: "CC", label: "Cocos (Keeling) Islands" },
  { phoneNum: "+57", value: "CO", label: "Colombia" },
  { phoneNum: "+269", value: "KM", label: "Comoros" },
  { phoneNum: "+242", value: "CG", label: "Congo" },
  { phoneNum: "+243", value: "CD", label: "Congo, Democratic Republic" },
  { phoneNum: "+682", value: "CK", label: "Cook Islands" },
  { phoneNum: "+506", value: "CR", label: "Costa Rica" },
  { phoneNum: "+225", value: "CI", label: "Cote D'Ivoire" },
  { phoneNum: "+385", value: "HR", label: "Croatia" },
  { phoneNum: "+53", value: "CU", label: "Cuba" },
  { phoneNum: "+357", value: "CY", label: "Cyprus" },
  { phoneNum: "+420", value: "CZ", label: "Czech Republic" },
  { phoneNum: "+45", value: "DK", label: "Denmark" },
  { phoneNum: "+253", value: "DJ", label: "Djibouti" },
  { phoneNum: "+1", value: "DM", label: "Dominica" },
  { phoneNum: "+1", value: "DO", label: "Dominican Republic" },
  { phoneNum: "+593", value: "EC", label: "Ecuador" },
  { phoneNum: "+20", value: "EG", label: "Egypt" },
  { phoneNum: "+503", value: "SV", label: "El Salvador" },
  { phoneNum: "+240", value: "GQ", label: "Equatorial Guinea" },
  { phoneNum: "+291", value: "ER", label: "Eritrea" },
  { phoneNum: "+372", value: "EE", label: "Estonia" },
  { phoneNum: "+251", value: "ET", label: "Ethiopia" },
  { phoneNum: "+500", value: "FK", label: "Falkland Islands (Malvinas)" },
  { phoneNum: "+298", value: "FO", label: "Faroe Islands" },
  { phoneNum: "+679", value: "FJ", label: "Fiji" },
  { phoneNum: "+358", value: "FI", label: "Finland" },
  { phoneNum: "+33", value: "FR", label: "France" },
  { phoneNum: "+594", value: "GF", label: "French Guiana" },
  { phoneNum: "+689", value: "PF", label: "French Polynesia" },
  { phoneNum: "N/A", value: "TF", label: "French Southern Territories" },
  { phoneNum: "+241", value: "GA", label: "Gabon" },
  { phoneNum: "+220", value: "GM", label: "Gambia" },
  { phoneNum: "+995", value: "GE", label: "Georgia" },
  { phoneNum: "+49", value: "DE", label: "Germany" },
  { phoneNum: "+233", value: "GH", label: "Ghana" },
  { phoneNum: "+350", value: "GI", label: "Gibraltar" },
  { phoneNum: "+30", value: "GR", label: "Greece" },
  { phoneNum: "+299", value: "GL", label: "Greenland" },
  { phoneNum: "+1", value: "GD", label: "Grenada" },
  { phoneNum: "+590", value: "GP", label: "Guadeloupe" },
  { phoneNum: "+1", value: "GU", label: "Guam" },
  { phoneNum: "+502", value: "GT", label: "Guatemala" },
  { phoneNum: "+44", value: "GG", label: "Guernsey" },
  { phoneNum: "+224", value: "GN", label: "Guinea" },
  { phoneNum: "+245", value: "GW", label: "Guinea-Bissau" },
  { phoneNum: "+592", value: "GY", label: "Guyana" },
  { phoneNum: "+509", value: "HT", label: "Haiti" },
  { phoneNum: "N/A", value: "HM", label: "Heard Island & Mcdonald Islands" },
  { phoneNum: "+39", value: "VA", label: "Holy See (Vatican City State)" },
  { phoneNum: "+504", value: "HN", label: "Honduras" },
  { phoneNum: "+852", value: "HK", label: "Hong Kong" },
  { phoneNum: "+36", value: "HU", label: "Hungary" },
  { phoneNum: "+354", value: "IS", label: "Iceland" },
  { phoneNum: "+62", value: "ID", label: "Indonesia" },
  { phoneNum: "+98", value: "IR", label: "Iran, Islamic Republic Of" },
  { phoneNum: "+964", value: "IQ", label: "Iraq" },
  { phoneNum: "+353", value: "IE", label: "Ireland" },
  { phoneNum: "+44", value: "IM", label: "Isle Of Man" },
  { phoneNum: "+972", value: "IL", label: "Israel" },
  { phoneNum: "+39", value: "IT", label: "Italy" },
  { phoneNum: "+1", value: "JM", label: "Jamaica" },
  { phoneNum: "+81", value: "JP", label: "Japan" },
  { phoneNum: "+44", value: "JE", label: "Jersey" },
  { phoneNum: "+962", value: "JO", label: "Jordan" },
  { phoneNum: "+7", value: "KZ", label: "Kazakhstan" },
  { phoneNum: "+254", value: "KE", label: "Kenya" },
  { phoneNum: "+686", value: "KI", label: "Kiribati" },
  { phoneNum: "+82", value: "KR", label: "Korea" },
  { phoneNum: "+965", value: "KW", label: "Kuwait" },
  { phoneNum: "+996", value: "KG", label: "Kyrgyzstan" },
  { phoneNum: "+856", value: "LA", label: "Lao People's Democratic Republic" },
  { phoneNum: "+371", value: "LV", label: "Latvia" },
  { phoneNum: "+961", value: "LB", label: "Lebanon" },
  { phoneNum: "+266", value: "LS", label: "Lesotho" },
  { phoneNum: "+231", value: "LR", label: "Liberia" },
  { phoneNum: "+218", value: "LY", label: "Libyan Arab Jamahiriya" },
  { phoneNum: "+423", value: "LI", label: "Liechtenstein" },
  { phoneNum: "+370", value: "LT", label: "Lithuania" },
  { phoneNum: "+352", value: "LU", label: "Luxembourg" },
  { phoneNum: "+853", value: "MO", label: "Macao" },
  { phoneNum: "+389", value: "MK", label: "Macedonia" },
  { phoneNum: "+261", value: "MG", label: "Madagascar" },
  { phoneNum: "+265", value: "MW", label: "Malawi" },
  { phoneNum: "+960", value: "MV", label: "Maldives" },
  { phoneNum: "+223", value: "ML", label: "Mali" },
  { phoneNum: "+356", value: "MT", label: "Malta" },
  { phoneNum: "+692", value: "MH", label: "Marshall Islands" },
  { phoneNum: "+596", value: "MQ", label: "Martinique" },
  { phoneNum: "+222", value: "MR", label: "Mauritania" },
  { phoneNum: "+230", value: "MU", label: "Mauritius" },
  { phoneNum: "+262", value: "YT", label: "Mayotte" },
  { phoneNum: "+52", value: "MX", label: "Mexico" },
  { phoneNum: "+691", value: "FM", label: "Micronesia, Federated States Of" },
  { phoneNum: "+373", value: "MD", label: "Moldova" },
  { phoneNum: "+377", value: "MC", label: "Monaco" },
  { phoneNum: "+976", value: "MN", label: "Mongolia" },
  { phoneNum: "+382", value: "ME", label: "Montenegro" },
  { phoneNum: "+1", value: "MS", label: "Montserrat" },
  { phoneNum: "+212", value: "MA", label: "Morocco" },
  { phoneNum: "+258", value: "MZ", label: "Mozambique" },
  { phoneNum: "+95", value: "MM", label: "Myanmar" },
  { phoneNum: "+264", value: "NA", label: "Namibia" },
  { phoneNum: "+674", value: "NR", label: "Nauru" },
  { phoneNum: "+977", value: "NP", label: "Nepal" },
  { phoneNum: "+31", value: "NL", label: "Netherlands" },
  { phoneNum: "N/A", value: "AN", label: "Netherlands Antilles" },
  { phoneNum: "N/A", value: "NC", label: "New Caledonia" },
  { phoneNum: "+64", value: "NZ", label: "New Zealand" },
  { phoneNum: "+505", value: "NI", label: "Nicaragua" },
  { phoneNum: "+227", value: "NE", label: "Niger" },
  { phoneNum: "+234", value: "NG", label: "Nigeria" },
  { phoneNum: "+683", value: "NU", label: "Niue" },
  { phoneNum: "+672", value: "NF", label: "Norfolk Island" },
  { phoneNum: "+1", value: "MP", label: "Northern Mariana Islands" },
  { phoneNum: "+47", value: "NO", label: "Norway" },
  { phoneNum: "+968", value: "OM", label: "Oman" },
  { phoneNum: "+92", value: "PK", label: "Pakistan" },
  { phoneNum: "+680", value: "PW", label: "Palau" },
  { phoneNum: "N/A", value: "PS", label: "Palestinian Territory, Occupied" },
  { phoneNum: "+507", value: "PA", label: "Panama" },
  { phoneNum: "+675", value: "PG", label: "Papua New Guinea" },
  { phoneNum: "+595", value: "PY", label: "Paraguay" },
  { phoneNum: "+51", value: "PE", label: "Peru" },
  { phoneNum: "+870", value: "PN", label: "Pitcairn" },
  { phoneNum: "+48", value: "PL", label: "Poland" },
  { phoneNum: "+351", value: "PT", label: "Portugal" },
  { phoneNum: "+1", value: "PR", label: "Puerto Rico" },
  { phoneNum: "+974", value: "QA", label: "Qatar" },
  { phoneNum: "+262", value: "RE", label: "Reunion" },
  { phoneNum: "+40", value: "RO", label: "Romania" },
  { phoneNum: "+7", value: "RU", label: "Russian Federation" },
  { phoneNum: "+250", value: "RW", label: "Rwanda" },
  { phoneNum: "N/A", value: "BL", label: "Saint Barthelemy" },
  { phoneNum: "N/A", value: "SH", label: "Saint Helena" },
  { phoneNum: "N/A", value: "KN", label: "Saint Kitts And Nevis" },
  { phoneNum: "N/A", value: "LC", label: "Saint Lucia" },
  { phoneNum: "N/A", value: "MF", label: "Saint Martin" },
  { phoneNum: "N/A", value: "PM", label: "Saint Pierre And Miquelon" },
  { phoneNum: "N/A", value: "VC", label: "Saint Vincent And Grenadines" },
  { phoneNum: "+685", value: "WS", label: "Samoa" },
  { phoneNum: "+378", value: "SM", label: "San Marino" },
  { phoneNum: "+239", value: "ST", label: "Sao Tome And Principe" },
  { phoneNum: "+966", value: "SA", label: "Saudi Arabia" },
  { phoneNum: "+221", value: "SN", label: "Senegal" },
  { phoneNum: "+381", value: "RS", label: "Serbia" },
  { phoneNum: "+248", value: "SC", label: "Seychelles" },
  { phoneNum: "+232", value: "SL", label: "Sierra Leone" },
  { phoneNum: "+65", value: "SG", label: "Singapore" },
  { phoneNum: "+421", value: "SK", label: "Slovakia" },
  { phoneNum: "+386", value: "SI", label: "Slovenia" },
  { phoneNum: "+677", value: "SB", label: "Solomon Islands" },
  { phoneNum: "+252", value: "SO", label: "Somalia" },
  { phoneNum: "+27", value: "ZA", label: "South Africa" },
  { phoneNum: "N/A", value: "GS", label: "South Georgia And Sandwich Isl." },
  { phoneNum: "N/A", value: "ES", label: "Spain" },
  { phoneNum: "+94", value: "LK", label: "Sri Lanka" },
  { phoneNum: "+249", value: "SD", label: "Sudan" },
  { phoneNum: "+597", value: "SR", label: "Suriname" },
  { phoneNum: "+47", value: "SJ", label: "Svalbard And Jan Mayen" },
  { phoneNum: "+268", value: "SZ", label: "Swaziland" },
  { phoneNum: "+46", value: "SE", label: "Sweden" },
  { phoneNum: "+41", value: "CH", label: "Switzerland" },
  { phoneNum: "+963", value: "SY", label: "Syrian Arab Republic" },
  { phoneNum: "+886", value: "TW", label: "Taiwan" },
  { phoneNum: "+992", value: "TJ", label: "Tajikistan" },
  { phoneNum: "+255", value: "TZ", label: "Tanzania" },
  { phoneNum: "+66", value: "TH", label: "Thailand" },
  { phoneNum: "+670", value: "TL", label: "Timor-Leste" },
  { phoneNum: "+228", value: "TG", label: "Togo" },
  { phoneNum: "+690", value: "TK", label: "Tokelau" },
  { phoneNum: "+676", value: "TO", label: "Tonga" },
  { phoneNum: "+1", value: "TT", label: "Trinidad And Tobago" },
  { phoneNum: "+216", value: "TN", label: "Tunisia" },
  { phoneNum: "+90", value: "TR", label: "Turkey" },
  { phoneNum: "+993", value: "TM", label: "Turkmenistan" },
  { phoneNum: "+1", value: "TC", label: "Turks And Caicos Islands" },
  { phoneNum: "+688", value: "TV", label: "Tuvalu" },
  { phoneNum: "+256", value: "UG", label: "Uganda" },
  { phoneNum: "+380", value: "UA", label: "Ukraine" },
  { phoneNum: "+971", value: "AE", label: "United Arab Emirates" },
  { phoneNum: "+44", value: "GB", label: "United Kingdom" },
  { phoneNum: "+1", value: "US", label: "United States" },
  { phoneNum: "N/A", value: "UM", label: "United States Outlying Islands" },
  { phoneNum: "+598", value: "UY", label: "Uruguay" },
  { phoneNum: "+998", value: "UZ", label: "Uzbekistan" },
  { phoneNum: "+678", value: "VU", label: "Vanuatu" },
  { phoneNum: "+58", value: "VE", label: "Venezuela" },
  { phoneNum: "+84", value: "VN", label: "Vietnam" },
  { phoneNum: "+1", value: "VG", label: "Virgin Islands, British" },
  { phoneNum: "+1", value: "VI", label: "Virgin Islands, U.S." },
  { phoneNum: "+681", value: "WF", label: "Wallis And Futuna" },
  { phoneNum: "N/A", value: "EH", label: "Western Sahara" },
  { phoneNum: "+967", value: "YE", label: "Yemen" },
  { phoneNum: "+260", value: "ZM", label: "Zambia" },
  { phoneNum: "+263", value: "ZW", label: "Zimbabwe" }
],
    valid: false,
    isLoading: false,
    isSending: false,
    isError: false,
    isEdit: false,
    isSuccess: false,
    isDelete: false,
    isDeleteLoading: false,
    universityIdToDelete: null,
    tableHeaders: [{ text: 'Gambar', value: 'image' }],
    imageFile: [],
    isOpenImage: false,
    successMessage: '',
    errorMessage: '',
    input: {
      id: 0,
      university: null,
      country: null,
      countryName: '',
      countryCode: '',
      subIndustry: null,
    },
    resource: {
      university: [],
      subIndustry: [],
    },
    rules: {
      qualificationRules: [
        (value) => {
          if (value) return true;
          return 'Qualification is requred.';
        },
      ],
    },
    search: '',
    items: [],
    // itemsTry: [
    //   {
    //     id: 1,
    //     university: 'Curtin University of Technology',
    //     location: 'Sydney, Australia',
    //     qualifications: 'Master of Physiotherapy',
    //     skills: 'Physiotherapy',
    //     user: 'Charlton',
    //     dated: '27/07/2023',
    //   },
    // ],
  }),
  created() {
    const token = JSON.parse(localStorage.getItem('token'));
    setAuthHeader(token);
  },
  mounted() {
    this.getUniversityData();
    this.getPartnerData();
    this.getSubIndustryData();
  },
  computed: {
    filteredItems() {
      if (!this.search) {
        return this.items;
      }
      const searchTextLower = this.search.toLowerCase();
      return this.items.filter(
        (item) =>
          item.university.toLowerCase().includes(searchTextLower) ||
          item.location.toLowerCase().includes(searchTextLower) ||
          item.qualifications.toLowerCase().includes(searchTextLower) ||
          item.skills.toLowerCase().includes(searchTextLower) ||
          item.user.toLowerCase().includes(searchTextLower) ||
          item.dated.toLowerCase().includes(searchTextLower)
      );
    },
  },  
  watch: {
    // eslint-disable-next-line no-unused-vars
    "input.country": function (newVal, oldVal) {
      const country = this.options.filter((o) => o.value === newVal)[0];
      console.log(country?.label);
      this.input.countryName = country?.label;
      this.input.countryCode = country?.phoneNum;
    },
  },
  methods: {
    editUniversity(university) {
      this.isEdit = true;
      this.input = {
        id: university.id,
        university: university.university,
        country: university.country ? this.options.filter(
                (i) => i.label == university.country
              )[0].value : null,
        subIndustry: university.sub_industry_id,
      };
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        id: 0,
      university: null,
      country: null,
      countryName: '',
      countryCode: '',
      subIndustry: null,
      };
    },
    saveEdit() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          university_id: this.input.id,
          partner_name: this.input.university,
          sub_industry_id: this.input.subIndustry,
          country_prefix: this.input.country,
          country: this.input.countryName,
          country_code: this.input.countryCode,
          flag:
            "https://flagicons.lipis.dev/flags/4x3/" +
            this.input.country.toLowerCase() +
            ".svg",
        };
        axios
          .post(`/university/update`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getUniversityData();
            this.input = {
              id: 0,
              university: null,
              country: null,
              countryName: '',
              countryCode: '',
              subIndustry: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.partner_id
              ? error.response.data.partner_id[0]
              : error.response.data.sub_industry_id
              ? error.response.data.sub_industry_id[0]
              : error.response.data.message
              ? error.response.data.message
              : 'Something Wrong!!!';
            this.errorMessage = message;
            this.isError = true;
            this.input = {
              id: 0,
      university: null,
      country: null,
      countryName: '',
      countryCode: '',
      subIndustry: null,
            };
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
          partner_name: this.input.university,
          sub_industry_id: this.input.subIndustry,
          country_prefix: this.input.country,
          country: this.input.countryName,
          country_code: this.input.countryCode,
          flag:
            "https://flagicons.lipis.dev/flags/4x3/" +
            this.input.country.toLowerCase() +
            ".svg",
        };
        axios
          .post(`/university`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            this.getUniversityData();
            this.input = {
              id: 0,
      university: null,
      country: null,
      countryName: '',
      countryCode: '',
      subIndustry: null,
            };
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.partner_id
              ? error.response.data.partner_id[0]
              : error.response.data.sub_industry_id
              ? error.response.data.sub_industry_id[0]
              : error.response.data.message
              ? error.response.data.message
              : 'Something Wrong!!!';
            this.errorMessage = message;
            this.isError = true;
          })
          .finally(() => {
            this.isSending = false;
          });
      }
    },
    cancelDelete() {
      this.universityIdToDelete = null;
      this.isDelete = false;
    },
    openDeleteConfirm(itemId) {
      this.universityIdToDelete = itemId;
      this.isDelete = true;
    },
    cancelConfirmation() {
      this.universityIdToDelete = null;
      this.isDelete = false;
    },
    deleteUniversity() {
      this.isDeleteLoading = true;
      axios
        .delete(`/university/${this.universityIdToDelete}`)
        .then((response) => {
          const data = response.data;
          this.successMessage = data.message;
          this.isSuccess = true;
          this.getUniversityData();
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
          this.universityIdToDelete = null;
          this.isDelete = false;
        });
    },
    getUniversityData() {
      this.isLoading = true;
      axios
        .get(`/university`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.items = data.map((item) => {
            return {
              id: item.university_id || null,
              university: item.partner_name || '',
              university_id: item.partner_id || null,
              country: item.country_name && item.country_name.includes(' (') == false ? item.country_name : item.country_name && item.country_name.includes(' (') == true ? item.country_name.split(' (')[0]  : '',
              country_id: item.country_id || null,
              pl_id: item.pl_id || null,
              subIndustry: item.sub_industry_name || '',
              sub_industry_id: item.sub_industry_id || null,
              user: item.name || '',
              user_id: item.user_id || null,
              dated: item.dated || '',
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
    getPartnerData() {
      this.isLoading = true;
      axios
        .get(`/partners`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.resource.university = data.sort((a, b) => a.partner_name.localeCompare(b.partner_name)).map((item) => item.partner_name || '',);
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
    getSubIndustryData() {
      this.isLoading = true;
      axios
        .get(`/sub-industries`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.resource.subIndustry = data.map((item) => {
            return {
              id: item.sub_industry_id || 1,
              name: item.sub_industry_name || '',
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

.country-table-body td {
  border-bottom: none !important;
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
</style>
