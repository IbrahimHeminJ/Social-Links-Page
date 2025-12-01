import api from '../api'

export interface AdminLinkPayload {
  title: string
  description?: string
  icon: string
  link: string
}

class AdminLinksService {
  /**
   * Get current user
   */
  async getCurrentUser() {
    const response = await api.get('/user')
    return response.data?.data || response.data
  }

  /**
   * Get button links for a user (same endpoint as userLinksService)
   */
  async getUserButtonLinks(userId: number | string) {
    const response = await api.get(`/user/${userId}/button-links`)
    return response.data?.data || response.data
  }

  /**
   * Create link for current user
   */
  async createLink(payload: AdminLinkPayload) {
    const response = await api.post('/user/links', payload)
    return response.data
  }

  /**
   * Update existing link
   */
  async updateLink(linkId: number | string, payload: AdminLinkPayload) {
    const response = await api.put(`/user/links/${linkId}`, payload)
    return response.data
  }

  /**
   * Delete existing link
   */
  async deleteLink(linkId: number | string) {
    const response = await api.delete(`/user/links/${linkId}`)
    return response.data
  }
}

export default new AdminLinksService()


