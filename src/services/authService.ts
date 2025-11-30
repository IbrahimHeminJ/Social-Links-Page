import api from "./api";

export interface LoginCredentials {
  userCredential: string; // Can be email or username
  password: string;
}

export interface SignupData {
  username: string;
  name: string;
  email: string;
  password: string;
  phone_no: string;
  profile_image?: File | null;
  tags?: number[] | string[]; // Array of tag IDs or tag names
}

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  phone?: string;
  tag?: string;
  role: "user" | "admin" | "superadmin";
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token?: string;
  access_token?: string;
  accessToken?: string;
  user?: User;
  data?: {
    token?: string;
    access_token?: string;
    user?: User;
  };
  [key: string]: any; // Allow other fields
}

class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/login", credentials);
    return response.data;
  }

  /**
   * Register new user (multipart/form-data for file upload)
   */
  async signup(data: SignupData): Promise<AuthResponse> {
    // Create FormData for multipart/form-data
    const formData = new FormData();

    formData.append("username", data.username);
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("phone_no", data.phone_no);

    // Add profile image if provided
    if (data.profile_image) {
      formData.append("profile_image", data.profile_image);
    }

    // Add tags as array of integers (tag IDs)
    // Laravel expects array indices to start from 1, not 0
    if (data.tags && data.tags.length > 0) {
      // Convert all tags to integers (they should already be numbers, but ensure they are)
      const tagIds = data.tags
        .map((tag) => {
          const tagId =
            typeof tag === "number" ? tag : parseInt(String(tag), 10);
          return isNaN(tagId) ? null : tagId;
        })
        .filter((id): id is number => id !== null);

      // Start index from 1 as Laravel expects
      tagIds.forEach((tagId, index) => {
        formData.append(`tags[${index + 1}]`, String(tagId));
      });
    }

    // Use multipart/form-data content type
    const response = await api.post<AuthResponse>("/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<any> {
    // Backend endpoint is /user (not /auth/me)
    console.log("=== AuthService: Fetching current user ===");
    const response = await api.get("/user");
    console.log("=== AuthService: API Response ===");
    console.log("Full response:", response);
    console.log("Response data:", response.data);
    console.log("Response data.data:", response.data?.data);

    // Backend returns: { message: "...", data: { ...user data with role... } }
    const userData = response.data?.data || response.data;
    console.log("=== AuthService: Extracted user data ===");
    console.log("User data:", userData);
    console.log("User data type:", typeof userData);
    console.log(
      "User data keys:",
      userData ? Object.keys(userData) : "No data"
    );

    return userData;
  }

  /**
   * Refresh auth token
   */
  async refreshToken(): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/refresh");
    return response.data;
  }

  /**
   * Check if user is authenticated (has valid token)
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem("authToken");
  }

  /**
   * Get stored user data
   */
  getStoredUser(): User | null {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem("authToken");
  }
}

export default new AuthService();
