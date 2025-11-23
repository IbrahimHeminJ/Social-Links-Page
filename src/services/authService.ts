import api from './api'

export interface LoginCredentials {
  userCredential: string  // Can be email or username
  password: string
}

export interface SignupData {
  username: string
  name: string
  email: string
  password: string
  phone?: string
  tag?: string
}

export interface User {
  id: number
  username: string
  name: string
  email: string
  phone?: string
  tag?: string
  role: 'user' | 'admin' | 'superadmin'
  createdAt?: string
  updatedAt?: string
}

export interface AuthResponse {
  token?: string
  access_token?: string
  accessToken?: string
  user?: User
  data?: {
    token?: string
    access_token?: string
    user?: User
  }
  [key: string]: any // Allow other fields
}

class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/login', credentials)
    return response.data
  }

  /**
   * Register new user
   */
  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/signup', data)
    return response.data
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<any> {
    // Backend endpoint is /user (not /auth/me)
    const response = await api.get('/user')
    // Backend returns: { message: "...", data: { ...user data with role... } }
    return response.data?.data || response.data
  }

  /**
   * Refresh auth token
   */
  async refreshToken(): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/refresh')
    return response.data
  }

  /**
   * Check if user is authenticated (has valid token)
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken')
  }

  /**
   * Get stored user data
   */
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch {
        return null
      }
    }
    return null
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem('authToken')
  }
}

export default new AuthService()

