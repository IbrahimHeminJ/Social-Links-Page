import api from '../api'

export interface SuperAdminUser {
  id: number
  username: string
  name: string
  email: string
  phone: string | null
  phone_no?: string
  profile_image?: string
  image?: string
  createdAt?: string
  created_at?: string
  updatedAt?: string
  updated_at?: string
  tags?: Array<{ id: number; tag_id?: number; tag?: string }>
}

export interface UpdateUserData {
  username: string
  name: string
  email: string
  phone_no: string
  profile_image?: File
  tags?: number[]
}

class SuperAdminUsersService {
  /**
   * Get all users (deduplicated from all tags)
   * @returns Array of unique users
   */
  async getAllUsers(): Promise<SuperAdminUser[]> {
    const response = await api.get<{ message?: string; data: any }>('/users')
    
    // The API returns users grouped by tags
    // Structure: { data: { "tag_name": [{ id, tag, users: [...] }], ... } }
    const data = response.data?.data || {}
    
    // Extract all users from all tags and deduplicate by ID
    const usersMap = new Map<number, any>()
    
    // Iterate through all tag groups
    Object.values(data).forEach((tagArray: any) => {
      if (Array.isArray(tagArray)) {
        // Iterate through each tag object in the array
        tagArray.forEach((tagObj: any) => {
          // Extract users from this tag
          if (tagObj.users && Array.isArray(tagObj.users)) {
            tagObj.users.forEach((user: any) => {
              // Only add if not already in map (deduplicate by ID)
              if (!usersMap.has(user.id)) {
                usersMap.set(user.id, user)
              }
            })
          }
        })
      }
    })
    
    // Convert map to array and map to our User interface
    return Array.from(usersMap.values()).map((user: any) => ({
      id: user.id,
      username: user.username || '',
      name: user.name || '',
      email: user.email || '',
      phone: user.phone_no || user.phone || null,
      phone_no: user.phone_no || user.phone,
      profile_image: user.profile_image || user.image,
      image: user.profile_image || user.image || '/src/assets/images/man.png',
      createdAt: user.created_at || user.createdAt || '',
      created_at: user.created_at || user.createdAt,
      updatedAt: user.updated_at || user.updatedAt || '',
      updated_at: user.updated_at || user.updatedAt,
      tags: user.tags || []
    }))
  }

  /**
   * Get user by ID
   * @param userId - User ID
   * @returns User data
   */
  async getUserById(userId: string | number): Promise<SuperAdminUser> {
    const response = await api.get<{ message?: string; data: SuperAdminUser }>(`/users/${userId}`)
    const userData = response.data?.data || response.data || {}
    
    return {
      id: userData.id,
      username: userData.username || '',
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone_no || userData.phone || null,
      phone_no: userData.phone_no || userData.phone,
      profile_image: userData.profile_image || userData.image,
      image: userData.profile_image || userData.image || '/src/assets/images/man.png',
      createdAt: userData.created_at || userData.createdAt || '',
      created_at: userData.created_at || userData.createdAt,
      updatedAt: userData.updated_at || userData.updatedAt || '',
      updated_at: userData.updated_at || userData.updatedAt,
      tags: userData.tags || []
    }
  }

  /**
   * Update user by ID
   * @param userId - User ID
   * @param userData - User data to update
   * @returns Updated user data
   */
  async updateUser(userId: string | number, userData: UpdateUserData): Promise<any> {
    // Create FormData for multipart/form-data
    const formData = new FormData()
    
    formData.append('username', userData.username.trim())
    formData.append('name', userData.name.trim())
    formData.append('email', userData.email.trim())
    formData.append('phone_no', userData.phone_no.trim())
    
    // Add tags if provided
    if (userData.tags && userData.tags.length > 0) {
      userData.tags.forEach((tagId, index) => {
        formData.append(`tags[${index + 1}]`, String(tagId))
      })
    }
    
    // Add profile image if provided
    if (userData.profile_image) {
      formData.append('profile_image', userData.profile_image)
    }
    
    const response = await api.post(`/users/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return response.data
  }

  /**
   * Delete user by ID
   * @param userId - User ID
   * @returns Response data
   */
  async deleteUser(userId: string | number): Promise<any> {
    const response = await api.delete(`/admin/users/${userId}`)
    return response.data
  }
}

export default new SuperAdminUsersService()

