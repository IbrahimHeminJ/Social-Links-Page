import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService, { type User, type LoginCredentials, type SignupData } from '../services/authService'
import router from '../router'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(authService.getStoredUser())
  const token = ref<string | null>(authService.getToken())
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  // Allow authentication with just token (user can be fetched later)
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => {
    if (!user.value) return false
    const role = user.value.role
    // Allow "user", "admin", and "superadmin" roles to access admin routes
    return role === 'user' || role === 'admin' || role === 'superadmin'
  })
  const isSuperAdmin = computed(() => {
    if (!user.value) return false
    const role = user.value.role
    // Only allow "admin" or "superadmin" roles to access superadmin routes (NOT "user")
    return role === 'admin' || role === 'superadmin'
  })
  const userRole = computed(() => user.value?.role || null)

  // Actions
  async function login(credentials: LoginCredentials) {
    try {
      isLoading.value = true
      error.value = null

      const response = await authService.login(credentials)
      
      // Debug: Log the full API response
      console.log('API Login Response:', response)
      
      // Backend returns: { message: "...", data: { access_token: "...", user: {...} }, status: 200 }
      // Try different possible token field names (check data object first, then root)
      const authToken = 
        response.data?.access_token ||
        response.data?.token ||
        response.access_token || 
        response.token || 
        response.accessToken ||
        (response as any).token
      
      // Validate response
      if (!authToken) {
        console.error('No token found in response. Response structure:', response)
        throw new Error('No token received from server. Please check backend response format.')
      }
      
      // Store token
      token.value = authToken
      localStorage.setItem('authToken', authToken)
      
      // Try different possible user field names (check data object first, then root)
      const userData = 
        response.data?.user ||
        response.user || 
        response.data ||
        (response as any).user
      
      // Debug: Log the raw user data to see structure
      console.log('Raw user data from API:', userData)
      console.log('User data keys:', userData ? Object.keys(userData) : 'No user data')
      
      // Always fetch complete user data after login to get role (since role is only in auth.user route)
      // The login response might not include role due to conditional logic in UserResource
      console.log('Fetching complete user data to get role...')
      try {
        const fetchedUser = await authService.getCurrentUser()
        
        // Handle UserResource wrapper (Laravel resource wraps data in 'data' field)
        const completeUser = fetchedUser.data || fetchedUser
        
        // Debug: Log the complete user object
        console.log('Complete user object with role:', completeUser)
        console.log('User role value:', completeUser.role)
        console.log('User role type:', typeof completeUser.role)
        console.log('All user fields:', Object.keys(completeUser))
        
        user.value = completeUser as User
        localStorage.setItem('user', JSON.stringify(completeUser))
      } catch (err) {
        console.error('Failed to fetch user data, using login response:', err)
        // Fallback: Use user data from login response if available
        if (userData && typeof userData === 'object' && (userData.id || userData.data?.id)) {
          const actualUser = userData.data || userData
          user.value = actualUser as User
          localStorage.setItem('user', JSON.stringify(actualUser))
        }
      }

      // Debug: Verify storage
      console.log('Login successful - Auth state:', {
        token: token.value ? '***' : null,
        user: user.value,
        isAuthenticated: isAuthenticated.value,
        storedToken: localStorage.getItem('authToken') ? '***' : null,
        storedUser: localStorage.getItem('user')
      })

      return { success: true }
    } catch (err: any) {
      // Log the full error for debugging
      console.error('Login error:', err)
      console.error('API response:', err.response?.data)
      
      // Try to get error message from API response (check multiple possible fields)
      const apiError = 
        err.response?.data?.message || 
        err.response?.data?.error || 
        err.response?.data?.msg ||
        err.message
      
      // Use API error if available, otherwise use default
      error.value = apiError || 'Login failed. Please check your credentials.'
      
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function signup(data: SignupData) {
    try {
      isLoading.value = true
      error.value = null

      const response = await authService.signup(data)
      
      // Extract token and user (handle different response formats)
      const authToken = response.data?.access_token || response.access_token || response.token || null
      const userData = response.data?.user || response.user || null
      
      // Store token and user
      token.value = authToken
      user.value = userData
      if (authToken) {
        localStorage.setItem('authToken', authToken)
      }
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData))
      }

      return { success: true }
    } catch (err: any) {
      // Log the full error for debugging
      console.error('Signup error:', err)
      console.error('API response:', err.response?.data)
      
      // Try to get error message from API response (check multiple possible fields)
      const apiError = 
        err.response?.data?.message || 
        err.response?.data?.error || 
        err.response?.data?.msg ||
        err.response?.data?.errors?.email?.[0] || // Laravel validation format
        err.response?.data?.errors?.email || // Alternative Laravel format
        err.message
      
      // Use API error if available, otherwise use default
      error.value = apiError || 'Signup failed. Please try again.'
      
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    try {
      await authService.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // Clear state regardless of API call success
      token.value = null
      user.value = null
      error.value = null
      
      // Redirect to login
      router.push({ name: 'login' })
    }
  }

  async function fetchCurrentUser() {
    try {
      isLoading.value = true
      const currentUser = await authService.getCurrentUser()
      user.value = currentUser
      localStorage.setItem('user', JSON.stringify(currentUser))
      return currentUser
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch user data'
      // If token is invalid, logout
      if (err.response?.status === 401) {
        logout()
      }
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function initializeAuth() {
    // Check if user is already logged in (from localStorage)
    const storedToken = authService.getToken()
    const storedUser = authService.getStoredUser()
    
    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = storedUser
      
      // Optionally verify token is still valid by fetching current user
      // fetchCurrentUser().catch(() => {
      //   // Token invalid, clear storage
      //   logout()
      // })
    }
  }

  function syncAuthState() {
    // Sync auth state from localStorage (useful for router guards)
    const storedToken = authService.getToken()
    let storedUser = authService.getStoredUser()
    
    // Handle case where "undefined" string was stored
    const userStr = localStorage.getItem('user')
    if (userStr === 'undefined' || userStr === 'null') {
      console.warn('Invalid user data in localStorage, clearing...')
      localStorage.removeItem('user')
      storedUser = null
    }
    
    if (storedToken) {
      token.value = storedToken
      
      if (storedUser) {
        user.value = storedUser
      } else if (storedToken) {
        // If we have token but no user, try to fetch user data
        // Don't await here to avoid blocking the router guard
        fetchCurrentUser().catch(() => {
          // If fetch fails, clear invalid state
          console.error('Failed to fetch user, clearing auth state')
          token.value = null
          localStorage.removeItem('authToken')
          localStorage.removeItem('user')
        })
      }
    } else {
      token.value = null
      user.value = null
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,
    // Getters
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    userRole,
    // Actions
    login,
    signup,
    logout,
    fetchCurrentUser,
    initializeAuth,
    syncAuthState,
    clearError,
  }
})

