import api from '../api'

export interface ButtonLink {
  id: number
  title: string
  description: string
  link: string
  icon: string
  platform: string
  is_visible: number
  order: number
}

export interface UserButtonLink {
  id: number
  order: number
  relationship: {
    user: {
      data: {
        id: number
        name: string
        username: string
        email: string
        description?: string
        subtitle?: string
        usertag?: string
        tag?: string
        role?: string
      }
    }
    button_link: ButtonLink
  }
}

class UserLinksService {
  /**
   * Get user's button links by user ID
   * @param userId - User ID
   * @returns Array of user button links
   */
  async getUserButtonLinks(userId: string | number): Promise<UserButtonLink[]> {
    const response = await api.get<{ message: string; data: UserButtonLink[] }>(
      `/user/${userId}/button-links`
    )
    return response.data.data || []
  }

  /**
   * Get visible button links sorted by order
   * @param userId - User ID
   * @returns Array of visible button links sorted by order
   */
  async getVisibleButtonLinks(userId: string | number): Promise<ButtonLink[]> {
    const userButtonLinks = await this.getUserButtonLinks(userId)
    
    // Sort by order field
    const sortedLinks = [...userButtonLinks].sort((a, b) => (a.order || 0) - (b.order || 0))
    
    // Filter visible buttons and map to ButtonLink format
    return sortedLinks
      .filter((item) => item.relationship?.button_link?.is_visible === 1)
      .map((item) => ({
        id: item.relationship.button_link.id,
        title: item.relationship.button_link.title || '',
        description: item.relationship.button_link.description || '',
        link: item.relationship.button_link.link || '#',
        platform: item.relationship.button_link.icon || 'default',
        icon: item.relationship.button_link.icon || 'default',
        is_visible: item.relationship.button_link.is_visible,
        order: item.order || 0
      }))
  }

  /**
   * Extract user data from button links response
   * @param userButtonLinks - Array of user button links
   * @returns User data or null
   */
  extractUserData(userButtonLinks: UserButtonLink[]): {
    name: string
    description: string
    usertag?: string
    tag?: string
    role?: string
  } | null {
    if (userButtonLinks.length === 0) {
      return null
    }

    const firstItem = userButtonLinks[0]
    const userData = firstItem.relationship?.user?.data || {}

    return {
      name: userData.name || '',
      description: userData.description || userData.subtitle || '',
      usertag: userData.usertag,
      tag: userData.tag,
      role: userData.role
    }
  }
}

export default new UserLinksService()

