import api from "../api";

export interface Payment {
  id: number;
  user_id: number;
  payment_id: string;
  amount: number;
  currency: string;
  status: string;
  declining_reason?: string | null;
  declined_at?: string | null;
  paid_by_name?: string | null;
  paid_by_iban?: string | null;
  created_at: string;
}

class SuperAdminPaymentsService {
  /**
   * Get all payment history
   * @returns Array of payments
   */
  async getPayments(): Promise<Payment[]> {
    const response = await api.get<{ message?: string; data: any }>(
      "/user/payments"
    );
    const rawPayments = response.data?.data || response.data || [];

    // Handle array response or nested data structure
    if (Array.isArray(rawPayments)) {
      return rawPayments.map((payment: any) => this.mapPayment(payment));
    }

    // If it's a single payment object or wrapped in data
    if (rawPayments.data && Array.isArray(rawPayments.data)) {
      return rawPayments.data.map((payment: any) => this.mapPayment(payment));
    }

    return [];
  }

  /**
   * Map API payment data to Payment interface
   */
  private mapPayment(payment: any): Payment {
    // Handle nested data structure
    const paymentData = payment.data || payment;

    return {
      id: paymentData.id || payment.id,
      user_id: paymentData.user_id || paymentData.userId || payment.user_id || payment.userId || 0,
      payment_id: paymentData.payment_id || paymentData.paymentId || payment.payment_id || payment.paymentId || "",
      amount: parseFloat(paymentData.amount || payment.amount || 0),
      currency: paymentData.currency || payment.currency || "",
      status: paymentData.status || payment.status || "",
      declining_reason: paymentData.declining_reason || paymentData.decliningReason || payment.declining_reason || payment.decliningReason || null,
      declined_at: paymentData.declined_at || paymentData.declinedAt || payment.declined_at || payment.declinedAt || null,
      paid_by_name: paymentData.paid_by_name || paymentData.paidByName || payment.paid_by_name || payment.paidByName || null,
      paid_by_iban: paymentData.paid_by_iban || paymentData.paidByIban || payment.paid_by_iban || payment.paidByIban || null,
      created_at: paymentData.created_at || paymentData.createdAt || payment.created_at || payment.createdAt || "",
    };
  }
}

export default new SuperAdminPaymentsService();
