import api from '../api'

export interface ReportPayload {
  user_id: string | number
  title: string
  description: string
  report_type: string
}

export interface ReportResponse {
  message: string
  data?: any
}

class UserReportService {
  /**
   * Submit a report for a user
   * @param payload - Report data
   * @returns Report response
   */
  async submitReport(payload: ReportPayload): Promise<ReportResponse> {
    const response = await api.post<ReportResponse>('/user/report', payload)
    return response.data
  }

  /**
   * Validate report payload
   * @param payload - Report data to validate
   * @returns Error message or null if valid
   */
  validateReport(payload: Partial<ReportPayload>): string | null {
    if (!payload.user_id) {
      return 'User ID is required'
    }

    if (!payload.title || !payload.title.trim()) {
      return 'Title is required'
    }

    if (!payload.description || !payload.description.trim()) {
      return 'Description is required'
    }

    if (!payload.report_type || !payload.report_type.trim()) {
      return 'Report type is required'
    }

    return null
  }
}

export default new UserReportService()

