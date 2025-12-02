<template>
  <div class="p-4 md:p-6">
    <h1 class="text-2xl font-bold mb-6 text-gray-900">
      Payment History
    </h1>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-8">
      <p class="text-gray-600">Loading payment history...</p>
    </div>

    <!-- Payments Table -->
    <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User ID
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment ID
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Currency
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Declining Reason
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Declined At
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paid By Name
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paid By IBAN
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="payments.length === 0">
              <td colspan="11" class="px-4 py-8 text-center text-gray-500">
                No payments found
              </td>
            </tr>
            <tr v-for="payment in payments" :key="payment.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {{ payment.id }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {{ payment.user_id }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {{ payment.payment_id || "-" }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">
                {{ formatAmount(payment.amount, payment.currency) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600 uppercase">
                {{ payment.currency || "-" }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    getStatusClass(payment.status)
                  ]"
                >
                  {{ payment.status || "-" }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                {{ payment.declining_reason || "-" }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                {{ payment.declined_at ? formatDate(payment.declined_at) : "-" }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                {{ payment.paid_by_name || "-" }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600 font-mono">
                {{ payment.paid_by_iban || "-" }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                {{ formatDate(payment.created_at) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <ToastMessage :show="toast.show" :type="toast.type" :title="toast.title" :message="toast.message"
      @close="closeToast" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { superAdminPaymentsService, type Payment } from "../../services/superAdmin";
import ToastMessage from "../../components/alerts/toastMessage.vue";

const { t } = useI18n();

const payments = ref<Payment[]>([]);
const isLoading = ref(false);

// Toast state
const toast = ref({
  show: false,
  type: 'info' as 'success' | 'error' | 'info',
  title: '',
  message: ''
});

const showToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
  toast.value = { show: true, type, title, message };
};

const closeToast = () => {
  toast.value.show = false;
};

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatAmount = (amount: number, currency: string) => {
  if (!amount) return "-";
  // Format number with 2 decimal places
  const formattedAmount = amount.toFixed(2);
  // Add currency symbol based on currency code
  if (currency === "EUR" || currency === "eur") {
    return `€${formattedAmount}`;
  } else if (currency === "USD" || currency === "usd") {
    return `$${formattedAmount}`;
  } else {
    return `${formattedAmount} ${currency}`;
  }
};

const getStatusClass = (status: string) => {
  if (!status) return "bg-gray-100 text-gray-800";
  
  const statusLower = status.toLowerCase();
  if (statusLower === "success" || statusLower === "completed" || statusLower === "paid") {
    return "bg-green-100 text-green-800";
  } else if (statusLower === "pending" || statusLower === "processing") {
    return "bg-yellow-100 text-yellow-800";
  } else if (statusLower === "failed" || statusLower === "declined" || statusLower === "cancelled") {
    return "bg-red-100 text-red-800";
  }
  return "bg-gray-100 text-gray-800";
};

// Fetch payments from API
const fetchPayments = async () => {
  try {
    isLoading.value = true;
    const fetchedPayments = await superAdminPaymentsService.getPayments();
    payments.value = fetchedPayments;
  } catch (err: any) {
    showToast('error', 'Error', err.response?.data?.message || "Failed to fetch payment history. Please try again.");
  } finally {
    isLoading.value = false;
  }
};

// Fetch payments when component mounts
onMounted(() => {
  fetchPayments();
});
</script>
