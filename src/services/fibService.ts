import axios from "axios";
import type { Optional } from "../types/common.types";

const getBaseURL = () => {
  const env = import.meta.env.VITE_FIB_ENV || 'sandbox' // Default to sandbox if not set
  return `https://fib.${env}.fib.iq`
}

const fibApiClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
fibApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('fibAuthToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const ENDPOINTS = {
  AUTH: "/auth/realms/fib-online-shop/protocol/openid-connect/token",
  CREATE_PAYMENT: "/protected/v1/payments",
  CHECK_PAYMENT: (paymentId: string) =>  `/protected/v1/payments/${paymentId}/status`,
  CANCEL_PAYMENT: (paymentId: string) =>  `/protected/v1/payments/${paymentId}/cancel`,
  REFUND_PAYMENT: (paymentId: string) =>  `/protected/v1/payments/${paymentId}/refund`,
}

interface Payment {
  monetaryValue: {
    amount: string;
    currency: string;
  };
  statusCallbackUrl?: Optional<string> ;
  description: string;
  redirectUri?: Optional<string>;
  expiresIn?: Optional<string>;
  category?: Optional<string>;
  refundableFor?: Optional<string>;
}

interface AuthorizationResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
  not_before_policy: number;
  scope: string;
}

interface CreatePaymentResponse {
  paymentId: string;
  readableCode: string;
  qrCode: string;
  validUntil: string;
  personalAppLink: string;
  businessAppLink: string;
  corporateAppLink: string;
}

interface CheckPaymentResponse {
  paymentId: string;
  status: string;
  validUntil: number;
  paidAt: Optional<string>;
  amount: {
    amount: number;
    currency: string;
  };
  decliningReason: Optional<string>;
  declinedAt: Optional<string>;
  paidBy: Optional<string>;
}

function encodeParams(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([key, value]) => 
      `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
}

export const fibService = {

  async authorize() {
    // Validate environment variables
    const clientId = import.meta.env.VITE_FIB_CLIENT_ID
    const clientSecret = import.meta.env.VITE_FIB_CLIENT_SECRET
    
    if (!clientId || !clientSecret) {
      throw new Error('FIB Client ID and Client Secret are required. Please set VITE_FIB_CLIENT_ID and VITE_FIB_CLIENT_SECRET in your .env file.')
    }

    // Create a separate axios instance for auth (no token needed)
    const baseURL = getBaseURL()
    const authClient = axios.create({
      baseURL,
      timeout: 30000, // Increased timeout
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    const params = new URLSearchParams()
    params.append('grant_type', 'client_credentials')
    params.append('client_id', clientId)
    params.append('client_secret', clientSecret)
    
    try {
      const response = await authClient.post<AuthorizationResponse>(ENDPOINTS.AUTH, params);
      localStorage.setItem('fibAuthToken', response.data.access_token);
      return response.data;
    } catch (error: any) {
      console.error('FIB Authorization Error:', {
        url: `${baseURL}${ENDPOINTS.AUTH}`,
        error: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      throw error
    }
  },

  async createPayment(payment: Payment) {
    const response = await fibApiClient.post(ENDPOINTS.CREATE_PAYMENT, payment);
    return response.data;
  },

  async checkPayment(paymentId: string) {
    const response = await fibApiClient.get(ENDPOINTS.CHECK_PAYMENT(paymentId));
    return response.data;
  },

  async cancelPayment(paymentId: string) {
    const response = await fibApiClient.post(ENDPOINTS.CANCEL_PAYMENT(paymentId));
    return response.data;
  },

  async refundPayment(paymentId: string) {
    const response = await fibApiClient.post(ENDPOINTS.REFUND_PAYMENT(paymentId));
    return response.data;
  },
};