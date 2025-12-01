import api from '../api'

export interface UpdateProfilePayload {
  name: string
  username: string
  email: string
  phone_no: string
  tags?: number[]
  profile_image?: File
}

class AdminProfileService {
  /**
   * Update current user's profile
   */
  async updateProfile(formData: FormData) {
    const { data } = await api.post('/user/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data
  }
}

export default new AdminProfileService()


