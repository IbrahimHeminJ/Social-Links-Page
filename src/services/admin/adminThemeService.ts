import api from '../api'

class AdminThemeService {
  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    const response = await api.get('/user')
    return response.data?.data || response.data
  }

  /**
   * Get user by id (used to read theme)
   */
  async getUserById(userId: number | string) {
    const response = await api.get(`/users/${userId}`)
    return response.data?.data || response.data
  }

  /**
   * Update current user's theme
   */
  async updateTheme(themeId: number) {
    const response = await api.put('/user/themes', { theme_id: themeId })
    return response.data
  }
}

export default new AdminThemeService()


