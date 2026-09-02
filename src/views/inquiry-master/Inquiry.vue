<template>
  <v-container>
    <h1>Inquiry Master</h1>
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
      <v-row align="center" justify="space-between">
        <v-col cols="8">
          <span> Showing {{ startItem }} - {{ endItem }} from {{ totalItems }} item </span>
        </v-col>
        <v-col cols="4" class="text-right">
          <v-select
            v-model="perPage"
            :items="[5, 10, 15, 20]"
            label="Items per page"
            density="compact"
            variant="outlined"
            hide-details
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-table class="country-table">
            <thead>
              <tr>
                <th class="text-left font-weight-bold">ID</th>
                <th class="text-left font-weight-bold">Business Name</th>
                <th class="text-left font-weight-bold">Contact Person</th>
                <th class="text-left font-weight-bold">Whats app</th>
                <th class="text-left font-weight-bold">Email Id</th>
                <th class="text-left font-weight-bold">City</th>
                <th class="text-left font-weight-bold">Inquiry Date</th>
                <th class="text-center font-weight-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in items" :key="item.inquiry_id">
                <tr>
                  <td style="border-bottom: none !important">
                    {{ item.inquiry_id }}
                  </td>
                  <td style="border-bottom: none !important">
                    {{ item.company_name || '-' }}
                  </td>
                  <td style="border-bottom: none !important">
                    {{ item.contact_person || '-' }}
                  </td>
                  <td style="border-bottom: none !important">
                    {{ item.contact_number || '-' }}
                  </td>
                  <td style="border-bottom: none !important">
                    {{ item.email_id || '-' }}
                  </td>
                  <td style="border-bottom: none !important">
                    {{ item.city || '-' }}
                  </td>
                  <td style="border-bottom: none !important">
                    {{ item.inquiry_date || '-' }}
                  </td>
                  <td style="border-bottom: none !important">
                    <div class="d-flex justify-center">
                      <v-btn color="green" variant="text" @click="editInquiry(item)" icon>
                        <v-icon>mdi-pencil-outline</v-icon>
                        <v-tooltip location="top" activator="parent">Edit</v-tooltip>
                      </v-btn>
                      <v-btn
                        color="red"
                        variant="text"
                        :disabled="isDeleteLoading"
                        @click="openDeleteConfirm(item.inquiry_id)"
                        icon
                      >
                        <v-icon>mdi-trash-can-outline</v-icon>
                        <v-tooltip location="top" activator="parent">Delete</v-tooltip>
                      </v-btn>
                    </div>
                  </td>
                </tr>
              </template>
              <tr v-if="items.length === 0 && !isLoading">
                <td colspan="8" class="text-center py-4 text-grey">No inquiry data found</td>
              </tr>
            </tbody>
          </v-table>
          <skeleton-table v-if="isLoading" :rows="5" :columns="8" />
          <empty-state
            v-if="!isLoading && (!items || items.length === 0)"
            title="No Data Found"
            subtitle="There are no records to display."
          />
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            @update:modelValue="getInquiriesData"
          ></v-pagination>
        </v-col>
      </v-row>
    </v-sheet>

    <!-- Delete Confirmation Dialog -->
    <confirm-dialog
      v-model="isDelete"
      title="Confirmation"
      message="Are you sure you want to delete this item? This action cannot be undone."
      :loading="isDeleteLoading"
      @confirm="deleteInquiry"
    />

    <!-- Edit Dialog -->
    <v-dialog persistent width="600" v-model="isEdit">
      <v-card>
        <v-card-title class="bg-primary text-white px-4 py-3"> Edit Inquiry </v-card-title>
        <v-card-text class="pt-4">
          <v-form ref="editForm" v-model="valid">
            <v-text-field
              v-model="input.company_name"
              label="Business Name"
              variant="outlined"
              density="compact"
              class="mb-3"
            ></v-text-field>
            <v-text-field
              v-model="input.contact_person"
              label="Contact Person"
              variant="outlined"
              density="compact"
              class="mb-3"
            ></v-text-field>
            <v-text-field
              v-model="input.contact_number"
              label="Whats app"
              variant="outlined"
              density="compact"
              class="mb-3"
            ></v-text-field>
            <v-text-field
              v-model="input.email_id"
              label="Email Id"
              variant="outlined"
              density="compact"
              class="mb-3"
            ></v-text-field>
            <v-text-field
              v-model="input.city"
              label="City"
              variant="outlined"
              density="compact"
              class="mb-3"
            ></v-text-field>
            <v-text-field
              v-model="input.inquiry_date"
              label="Inquiry Date"
              variant="outlined"
              density="compact"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="px-4 pb-4">
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" @click="cancelEdit">Cancel</v-btn>
          <v-btn color="primary" variant="flat" :loading="isSending" @click="saveEdit">Save</v-btn>
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
import apiClient from '@/util/apiClient';

export default {
  name: 'InquiryMaster',
  components: {
    ConfirmDialog,
    EmptyState,
    SkeletonTable,
  },
  setup() {
    const notification = useNotificationStore();
    return { notification };
  },
  data: () => ({
    valid: false,
    isLoading: false,
    isSending: false,
    isEdit: false,
    isDelete: false,
    isDeleteLoading: false,
    inquiryIdToDelete: null,
    search: '',
    searchTimeout: null,
    input: {
      inquiry_id: null,
      company_name: '',
      contact_person: '',
      contact_number: '',
      email_id: '',
      city: '',
      inquiry_date: '',
    },
    allInquiries: [],
    items: [],
    currentPage: 1,
    perPage: 5,
    totalPages: 1,
    totalItems: 0,
  }),
  mounted() {
    this.fetchInquiries();
  },
  computed: {
    startItem() {
      if (this.totalItems === 0) return 0;
      return (this.currentPage - 1) * this.perPage + 1;
    },
    endItem() {
      return Math.min(this.currentPage * this.perPage, this.totalItems);
    },
  },
  watch: {
    perPage() {
      this.currentPage = 1;
      this.getInquiriesData();
    },
    search() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.searchTimeout = setTimeout(() => {
        this.currentPage = 1;
        this.getInquiriesData();
      }, 300);
    },
  },
  methods: {
    async fetchInquiries() {
      this.isLoading = true;
      try {
        const response = await apiClient.get('/inquiry');
        if (response.data && Array.isArray(response.data.data)) {
          this.allInquiries = response.data.data;
        } else if (Array.isArray(response.data)) {
          this.allInquiries = response.data;
        } else {
          this.allInquiries = [];
        }
        this.getInquiriesData();
      } catch (error) {
        this.notification.error(error?.response?.data?.message || 'Failed to fetch inquiry data');
      } finally {
        this.isLoading = false;
      }
    },
    getInquiriesData() {
      let filtered = [...this.allInquiries];
      if (this.search) {
        const q = this.search.toLowerCase();
        filtered = filtered.filter(
          (item) =>
            (item.company_name && String(item.company_name).toLowerCase().includes(q)) ||
            (item.contact_person && String(item.contact_person).toLowerCase().includes(q)) ||
            (item.contact_number && String(item.contact_number).toLowerCase().includes(q)) ||
            (item.email_id && String(item.email_id).toLowerCase().includes(q)) ||
            (item.city && String(item.city).toLowerCase().includes(q)) ||
            (item.inquiry_date && String(item.inquiry_date).toLowerCase().includes(q)) ||
            (item.inquiry_id && String(item.inquiry_id).toLowerCase().includes(q))
        );
      }
      this.totalItems = filtered.length;
      this.totalPages = Math.ceil(this.totalItems / this.perPage) || 1;
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages;
      }
      const start = (this.currentPage - 1) * this.perPage;
      this.items = filtered.slice(start, start + this.perPage);
    },
    editInquiry(item) {
      this.input = { ...item };
      this.isEdit = true;
    },
    cancelEdit() {
      this.isEdit = false;
      this.input = {
        inquiry_id: null,
        company_name: '',
        contact_person: '',
        contact_number: '',
        email_id: '',
        city: '',
        inquiry_date: '',
      };
    },
    saveEdit() {
      this.isSending = true;
      setTimeout(() => {
        const index = this.allInquiries.findIndex((i) => i.inquiry_id === this.input.inquiry_id);
        if (index !== -1) {
          this.allInquiries[index] = { ...this.input };
        }
        this.notification.success('Inquiry updated successfully');
        this.isEdit = false;
        this.isSending = false;
        this.getInquiriesData();
      }, 200);
    },
    openDeleteConfirm(id) {
      this.inquiryIdToDelete = id;
      this.isDelete = true;
    },
    cancelDelete() {
      this.inquiryIdToDelete = null;
      this.isDelete = false;
    },
    deleteInquiry() {
      this.isDeleteLoading = true;
      setTimeout(() => {
        this.allInquiries = this.allInquiries.filter(
          (i) => i.inquiry_id !== this.inquiryIdToDelete
        );
        this.notification.success('Inquiry deleted successfully');
        this.isDeleteLoading = false;
        this.inquiryIdToDelete = null;
        this.isDelete = false;
        this.getInquiriesData();
      }, 200);
    },
  },
};
</script>

<style lang="scss" scoped>
.country-table {
  font-size: 12px;
  color: black !important;
}

.country-table th {
  font-weight: 600 !important;
  color: black !important;
}
</style>
