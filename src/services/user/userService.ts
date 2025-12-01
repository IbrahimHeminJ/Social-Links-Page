import api from '../api'

export interface User {
  id: number
  name: string
  username: string
  email: string
  profile_image: string
  phone_no: string
  role: string
  description?: string
  subtitle?: string
  usertag?: string
  tag?: string
  theme?: {
    id: number
    theme_id: number
    theme_type: string
  }
}

export interface TagData {
  id: number
  tag: string
  users: User[]
}

export interface UsersByTagResponse {
  [tagKey: string]: TagData[]
}

export interface Tag {
  id: number
  tag: string
  tag_name?: string
  [key: string]: any
}

export interface TagsResponse {
  message?: string
  data: Tag[] | { [key: string]: any }
}

class UserService {
  /**
   * Get all users grouped by tags/categories
   * @returns Users grouped by tags
   */
  async getAllUsers(): Promise<UsersByTagResponse> {
    const response = await api.get<{ message: string; data: UsersByTagResponse }>('/users')
    return response.data.data || {}
  }

  /**
   * Search users by query string
   * @param searchQuery - Search query string
   * @returns Users grouped by tags matching the search
   */
  async searchUsers(searchQuery: string): Promise<UsersByTagResponse> {
    const response = await api.get<{ message: string; data: UsersByTagResponse }>('/users', {
      params: { search: searchQuery.trim() }
    })
    return response.data.data || {}
  }

  /**
   * Get user by ID
   * @param userId - User ID
   * @returns User data
   */
  async getUserById(userId: string | number): Promise<User> {
    const response = await api.get<{ message: string; data: User }>(`/users/${userId}`)
    return response.data.data || response.data
  }

  /**
   * Get all tags from the dedicated tags endpoint
   * @returns Array of tag objects
   */
  async getTags(): Promise<Tag[]> {
    const response = await api.get<TagsResponse>('/tags')
    const data = response.data.data || response.data
    
    // Handle different response structures
    if (Array.isArray(data)) {
      return data
    } else if (typeof data === 'object') {
      // If it's an object, convert to array
      return Object.values(data) as Tag[]
    }
    
    return []
  }

  /**
   * Get tags with users from the tags endpoint
   * This endpoint should return tags with their associated users
   * @returns Tags with users data (same structure as getAllUsers)
   */
  async getTagsWithUsers(): Promise<UsersByTagResponse> {
    const response = await api.get<{ message: string; data: UsersByTagResponse }>('/tags')
    return response.data.data || {}
  }

  /**
   * Get available tags (formatted tag names) from the dedicated tags endpoint
   * @returns Array of formatted tag names
   */
  async getAvailableTags(): Promise<string[]> {
    try {
      const tags = await this.getTags()
      
      return tags.map((tag) => {
        // Use tag_name if available, otherwise use tag field
        const tagName = tag.tag_name || tag.tag || String(tag.id)
        return this.formatTagName(tagName)
      })
    } catch (error) {
      console.error('Error fetching tags from /tags endpoint, falling back to users data:', error)
      // Fallback to old method if tag endpoint fails
      const usersData = await this.getAllUsers()
      const tags: string[] = []
      
      Object.keys(usersData).forEach((tagKey) => {
        const tagArray = usersData[tagKey]
        if (tagArray && tagArray.length > 0 && tagArray[0].users && tagArray[0].users.length > 0) {
          const formattedTagName = this.formatTagName(tagKey)
          tags.push(formattedTagName)
        }
      })
      
      return tags
    }
  }

  /**
   * Format tag name (remove numbers and underscores, capitalize)
   * @param tagName - Raw tag name from API (e.g., "filmmaker_1485")
   * @returns Formatted tag name (e.g., "Filmmaker")
   */
  formatTagName(tagName: string): string {
    return tagName
      .split('_')
      .map(word => word.replace(/\d+/g, '')) // Remove numbers
      .filter(word => word.length > 0) // Remove empty strings
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  /**
   * Find tag key from formatted tag name
   * Supports exact match and partial/fuzzy matching
   * @param formattedTag - Formatted tag name (e.g., "Photography" or "Photographer")
   * @param tagsData - Users by tag data
   * @returns Original tag key or null
   */
  findTagKey(formattedTag: string, tagsData: UsersByTagResponse): string | null {
    const searchTag = formattedTag.toLowerCase().trim()
    
    // First, try exact match (case-insensitive)
    for (const tagKey in tagsData) {
      const formatted = this.formatTagName(tagKey).toLowerCase()
      if (formatted === searchTag) {
        return tagKey
      }
    }
    
    // Second, try partial match (one contains the other)
    for (const tagKey in tagsData) {
      const formatted = this.formatTagName(tagKey).toLowerCase()
      
      // Check if search tag contains formatted tag or vice versa
      if (formatted.includes(searchTag) || searchTag.includes(formatted)) {
        // Make sure it's a meaningful match (at least 4 characters overlap)
        const minLength = Math.min(formatted.length, searchTag.length)
        if (minLength >= 4) {
          return tagKey
        }
      }
    }
    
    // Third, try matching by root word (remove common suffixes)
    const removeSuffixes = (word: string): string => {
      const suffixes = ['er', 'y', 'ist', 'ian', 'or', 'ar', 'ist']
      for (const suffix of suffixes) {
        if (word.endsWith(suffix) && word.length > suffix.length + 2) {
          return word.slice(0, -suffix.length)
        }
      }
      return word
    }
    
    const searchRoot = removeSuffixes(searchTag)
    for (const tagKey in tagsData) {
      const formatted = this.formatTagName(tagKey).toLowerCase()
      const formattedRoot = removeSuffixes(formatted)
      
      if (formattedRoot === searchRoot && formattedRoot.length >= 4) {
        return tagKey
      }
    }
    
    return null
  }
}

export default new UserService()

