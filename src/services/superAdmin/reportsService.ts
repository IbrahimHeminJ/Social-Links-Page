import api from "../api";

export interface Report {
  id: number;
  title: string;
  description: string;
  reporterEmail?: string;
  email_of_reporter?: string;
  emailOfReporter?: string;
  reporter_email?: string;
  createdAt?: string;
  created_at?: string;
  reportType?: string;
  report_type?: string;
  reportStatus?: string;
  report_status?: string;
  handledBy?: string;
  handled_by?: string;
  reasonOfAction?: string;
  reason_of_action?: string;
  reportedUser?: string | number;
  reported_user?: string | number;
  user_id?: string | number;
  userId?: string | number;
  [key: string]: any; // Allow additional fields from API
}

export interface ReportDetail extends Report {
  action?: string;
  reason?: string;
  updatedAt?: string;
  updated_at?: string;
}

export interface ResolveReportPayload {
  delete_user: number; // 1 for delete-user, 0 for others
  reason_of_action: string;
}

class SuperAdminReportsService {
  /**
   * Get all pending reports
   * @returns Array of reports
   */
  async getReports(): Promise<Report[]> {
    const response = await api.get<{ message?: string; data: any }>(
      "/admin/reports/show"
    );
    const rawReports = response.data?.data || response.data || [];

    // Map API response to expected format, filter out null/undefined
    return rawReports
      .filter((report: any) => report != null && report.data != null)
      .map((report: any) => {
        const reportData = report.data || report;

        // Extract title from nested data structure
        const title =
          reportData.title ||
          reportData.report_type ||
          reportData.reportType ||
          reportData.type ||
          "Untitled Report";

        // Extract description
        const description =
          reportData.description ||
          reportData.reason_of_action ||
          reportData.reasonOfAction ||
          reportData.message ||
          reportData.content ||
          reportData.body ||
          reportData.text ||
          reportData.details ||
          reportData.note ||
          "No description available";

        return {
          id: report.id,
          title: String(title),
          description: String(description),
          reporterEmail:
            reportData.email_of_reporter ||
            reportData.emailOfReporter ||
            reportData.reporter_email,
          email_of_reporter:
            reportData.email_of_reporter ||
            reportData.emailOfReporter ||
            reportData.reporter_email,
          emailOfReporter:
            reportData.email_of_reporter ||
            reportData.emailOfReporter ||
            reportData.reporter_email,
          reporter_email:
            reportData.email_of_reporter ||
            reportData.emailOfReporter ||
            reportData.reporter_email,
          createdAt: reportData.created_at || reportData.createdAt,
          created_at: reportData.created_at || reportData.createdAt,
          reportType: reportData.report_type || reportData.reportType,
          report_type: reportData.report_type || reportData.reportType,
          reportStatus: reportData.report_status || reportData.reportStatus,
          report_status: reportData.report_status || reportData.reportStatus,
          handledBy: reportData.handled_by || reportData.handledBy,
          handled_by: reportData.handled_by || reportData.handledBy,
          reasonOfAction:
            reportData.reason_of_action || reportData.reasonOfAction,
          reason_of_action:
            reportData.reason_of_action || reportData.reasonOfAction,
          reportedUser:
            reportData.reported_user ||
            reportData.reportedUser ||
            reportData.user_id ||
            reportData.userId,
          reported_user:
            reportData.reported_user ||
            reportData.reportedUser ||
            reportData.user_id ||
            reportData.userId,
          user_id:
            reportData.reported_user ||
            reportData.reportedUser ||
            reportData.user_id ||
            reportData.userId,
          userId:
            reportData.reported_user ||
            reportData.reportedUser ||
            reportData.user_id ||
            reportData.userId,
          ...reportData, // Include all other fields from data
        };
      });
  }

  /**
   * Resolve/update report
   * @param reportId - Report ID
   * @param payload - Resolution data
   * @returns Response data
   */
  async resolveReport(
    reportId: string | number,
    payload: ResolveReportPayload
  ): Promise<any> {
    const response = await api.post(`/admin/reports/${reportId}`, payload);
    return response.data;
  }

  /**
   * Get resolved reports history
   * @returns Array of resolved reports
   */
  async getResolvedReports(): Promise<Report[]> {
    const response = await api.get<{ message?: string; data: any }>(
      "/admin/reports/resolved"
    );
    const rawReports = response.data?.data || response.data || [];

    // Map API response to expected format, filter out null/undefined
    return rawReports
      .filter((report: any) => report != null && report.data != null)
      .map((report: any) => {
        const reportData = report.data || report;

        // Extract title from nested data structure
        const title =
          reportData.title ||
          reportData.report_type ||
          reportData.reportType ||
          reportData.type ||
          "Untitled Report";

        // Extract description
        const description =
          reportData.description ||
          reportData.reason_of_action ||
          reportData.reasonOfAction ||
          reportData.message ||
          reportData.content ||
          reportData.body ||
          reportData.text ||
          reportData.details ||
          reportData.note ||
          "No description available";

        return {
          id: report.id,
          title: String(title),
          description: String(description),
          reporterEmail:
            reportData.email_of_reporter ||
            reportData.emailOfReporter ||
            reportData.reporter_email,
          email_of_reporter:
            reportData.email_of_reporter ||
            reportData.emailOfReporter ||
            reportData.reporter_email,
          emailOfReporter:
            reportData.email_of_reporter ||
            reportData.emailOfReporter ||
            reportData.reporter_email,
          reporter_email:
            reportData.email_of_reporter ||
            reportData.emailOfReporter ||
            reportData.reporter_email,
          createdAt: reportData.created_at || reportData.createdAt,
          created_at: reportData.created_at || reportData.createdAt,
          reportType: reportData.report_type || reportData.reportType,
          report_type: reportData.report_type || reportData.reportType,
          reportStatus: reportData.report_status || reportData.reportStatus,
          report_status: reportData.report_status || reportData.reportStatus,
          handledBy: reportData.handled_by || reportData.handledBy,
          handled_by: reportData.handled_by || reportData.handledBy,
          reasonOfAction:
            reportData.reason_of_action || reportData.reasonOfAction,
          reason_of_action:
            reportData.reason_of_action || reportData.reasonOfAction,
          ...reportData, // Include all other fields from data
        };
      });
  }
}

export default new SuperAdminReportsService();
