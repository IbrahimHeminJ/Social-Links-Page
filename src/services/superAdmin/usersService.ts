import api from "../api";

export interface SuperAdminUser {
  id: number;
  username: string;
  name: string;
  email: string;
  phone: string | null;
  phone_no?: string;
  profile_image?: string;
  image?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  tags?: Array<{ id: number; tag_id?: number; tag?: string }>;
}

export interface CreateUserData {
  username: string;
  name: string;
  email: string;
  phone_no: string;
  profile_image?: File;
  tags?: number[];
}

export interface UpdateUserData {
  username: string;
  name: string;
  email: string;
  phone_no: string;
  profile_image?: File;
  tags?: number[];
  password?: string;
  password_confirmation?: string;
}

class SuperAdminUsersService {
  /**
   * Get all users
   * @returns Array of users
   */
  async getAllUsers(): Promise<SuperAdminUser[]> {
    const response = await api.get<{ message?: string; data: any }>(
      "/admin/users"
    );

    // Debug: Log the full response to understand the structure
    console.log("Full API response:", response);
    console.log("Response data:", response.data);
    console.log("Response data.data:", response.data?.data);

    // Try multiple possible response structures
    let usersArray: any[] = [];

    // Case 1: Direct array in data
    if (Array.isArray(response.data?.data)) {
      usersArray = response.data.data;
    }
    // Case 2: Direct array in response.data
    else if (Array.isArray(response.data)) {
      usersArray = response.data;
    }
    // Case 3: Paginated response (Laravel pagination)
    else if (
      response.data?.data?.data &&
      Array.isArray(response.data.data.data)
    ) {
      usersArray = response.data.data.data;
    }
    // Case 4: Nested in data.users
    else if (
      response.data?.data &&
      typeof response.data.data === "object" &&
      "users" in response.data.data &&
      Array.isArray((response.data.data as any).users)
    ) {
      usersArray = (response.data.data as any).users;
    }
    // Case 5: Nested in data.users (direct)
    else if (
      response.data &&
      typeof response.data === "object" &&
      "users" in response.data &&
      Array.isArray((response.data as any).users)
    ) {
      usersArray = (response.data as any).users;
    }
    // Case 6: Empty or unknown structure
    else {
      console.warn("Unknown response structure:", response.data);
      usersArray = [];
    }

    console.log("Extracted users array:", usersArray);
    console.log("Number of users:", usersArray.length);
    if (usersArray.length > 0) {
      console.log("First user sample:", usersArray[0]);
    }

    // Map users to our interface
    // Structure: [{ id, data: { email, name, phone_no, profile_image, role, tags, username }, theme }]
    return usersArray.map((user: any) => {
      // Extract user data from nested 'data' property, fallback to top level
      const userData = user.data || user;

      // Debug: Log profile_image from API
      const rawProfileImage = userData.profile_image || userData.image;
      if (rawProfileImage) {
        console.log(
          `Service - User ${user.id || userData.id} profile_image:`,
          rawProfileImage
        );
      }

      return {
        id: user.id || userData.id,
        username: userData.username || "",
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone_no || userData.phone || null,
        phone_no: userData.phone_no || userData.phone,
        profile_image: rawProfileImage,
        image: rawProfileImage || "/src/assets/images/man.png",
        createdAt: userData.created_at || userData.createdAt || "",
        created_at: userData.created_at || userData.createdAt,
        updatedAt: userData.updated_at || userData.updatedAt || "",
        updated_at: userData.updated_at || userData.updatedAt,
        tags: userData.tags || [],
      };
    });
  }

  /**
   * Get user by ID
   * @param userId - User ID
   * @returns User data
   */
  async getUserById(userId: string | number): Promise<SuperAdminUser> {
    const response = await api.get<{ message?: string; data: any }>(
      `/admin/users/${userId}`
    );

    // Debug: Log the full response to understand the structure
    console.log("Full getUserById API response:", response);
    console.log("Response data:", response.data);
    console.log("Response data.data:", response.data?.data);

    // Handle nested structure: { id, data: { email, name, ... }, theme }
    const userResponse = response.data?.data || response.data || {};

    console.log("User response object:", userResponse);

    // Extract user data from nested 'data' property, fallback to top level
    const userData = userResponse.data || userResponse;

    console.log("Extracted userData:", userData);
    console.log("UserData fields:", {
      id: userResponse.id || userData.id,
      username: userData.username,
      name: userData.name,
      email: userData.email,
      phone_no: userData.phone_no,
      phone: userData.phone,
      profile_image: userData.profile_image,
      image: userData.image,
      tags: userData.tags,
    });

    // Extract tags - check multiple possible locations
    // Tags might be in: userData.tags, userResponse.tags, or in a relationship
    let tags = [];

    // Check in userData first (most common location)
    if (userData.tags && Array.isArray(userData.tags)) {
      tags = userData.tags;
    }
    // Check in userResponse (top level)
    else if (userResponse.tags && Array.isArray(userResponse.tags)) {
      tags = userResponse.tags;
    }
    // Check for tag (singular)
    else if (userData.tag && Array.isArray(userData.tag)) {
      tags = userData.tag;
    }
    // Check for user_tags
    else if (userData.user_tags && Array.isArray(userData.user_tags)) {
      tags = userData.user_tags;
    }
    // Check in relationships (Laravel relationships)
    else if (
      userResponse.relationships?.tags &&
      Array.isArray(userResponse.relationships.tags)
    ) {
      tags = userResponse.relationships.tags;
    } else if (
      userData.relationships?.tags &&
      Array.isArray(userData.relationships.tags)
    ) {
      tags = userData.relationships.tags;
    }
    // Check if tags is nested in data.data
    else if (userResponse.data?.tags && Array.isArray(userResponse.data.tags)) {
      tags = userResponse.data.tags;
    }

    console.log("Extracted tags:", tags);
    console.log("Tags location check:", {
      "userData.tags": userData.tags,
      "userResponse.tags": userResponse.tags,
      "userData.tag": userData.tag,
      "userData.user_tags": userData.user_tags,
      "userResponse.relationships?.tags": userResponse.relationships?.tags,
      "userData.relationships?.tags": userData.relationships?.tags,
    });

    // Log the structure of tags if they exist
    if (tags.length > 0) {
      console.log("First tag structure:", tags[0]);
      console.log("All tags structure:", tags);
    }

    return {
      id: userResponse.id || userData.id,
      username: userData.username || "",
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.phone_no || userData.phone || null,
      phone_no: userData.phone_no || userData.phone || undefined,
      profile_image: userData.profile_image || userData.image,
      image:
        userData.profile_image ||
        userData.image ||
        "/src/assets/images/man.png",
      createdAt: userData.created_at || userData.createdAt || "",
      created_at: userData.created_at || userData.createdAt,
      updatedAt: userData.updated_at || userData.updatedAt || "",
      updated_at: userData.updated_at || userData.updatedAt,
      tags: tags,
    };
  }

  /**
   * Create a new user
   * @param userData - User data to create
   * @returns Created user data
   */
  async createUser(userData: CreateUserData): Promise<any> {
    // Create FormData for multipart/form-data
    const formData = new FormData();

    // Validate required fields before sending
    if (!userData.username || !userData.username.trim()) {
      throw new Error("Username is required");
    }
    if (!userData.name || !userData.name.trim()) {
      throw new Error("Name is required");
    }
    if (!userData.email || !userData.email.trim()) {
      throw new Error("Email is required");
    }
    if (!userData.phone_no || !userData.phone_no.trim()) {
      throw new Error("Phone number is required");
    }

    formData.append("username", userData.username.trim());
    formData.append("name", userData.name.trim());
    formData.append("email", userData.email.trim());
    formData.append("phone_no", userData.phone_no.trim());

    // Add tags - backend requires tags field
    if (userData.tags && userData.tags.length > 0) {
      userData.tags.forEach((tagId, index) => {
        formData.append(`tags[${index + 1}]`, String(tagId));
      });
    } else {
      // Send empty tags array if no tags (backend requires tags field)
      formData.append("tags[]", "");
    }

    // Add profile image if provided
    if (userData.profile_image) {
      formData.append("profile_image", userData.profile_image);
    }

    const response = await api.post("/admin/users", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }

  /**
   * Update user by ID
   * @param userId - User ID
   * @param userData - User data to update
   * @returns Updated user data
   */
  async updateUser(
    userId: string | number,
    userData: UpdateUserData
  ): Promise<any> {
    // Validate and prepare required fields
    const username = (userData.username || "").trim();
    const name = (userData.name || "").trim();
    const email = (userData.email || "").trim();
    const phone_no = (userData.phone_no || "").trim();

    // Validate required fields are not empty
    if (!username) {
      throw new Error("Username is required and cannot be empty");
    }
    if (!name) {
      throw new Error("Name is required and cannot be empty");
    }
    if (!email) {
      throw new Error("Email is required and cannot be empty");
    }
    if (!phone_no) {
      throw new Error("Phone number is required and cannot be empty");
    }

    // Prepare tags array - ensure they are numbers
    let tags: number[] = [];
    if (
      userData.tags &&
      Array.isArray(userData.tags) &&
      userData.tags.length > 0
    ) {
      tags = userData.tags
        .map((tagId) => {
          const numTagId =
            typeof tagId === "number" ? tagId : parseInt(String(tagId), 10);
          return !isNaN(numTagId) && numTagId > 0 ? numTagId : null;
        })
        .filter((id): id is number => id !== null);
    }

    // Debug: Log what we're sending
    console.log("=== Sending update request ===");
    console.log("Raw userData object:", userData);
    console.log("Username:", username);
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Phone_no:", phone_no);
    console.log("Tags:", tags);
    console.log(
      "Profile image:",
      userData.profile_image ? "File provided" : "No file"
    );
    if (userData.profile_image) {
      console.log("Image file details:", {
        name: userData.profile_image.name,
        size: userData.profile_image.size,
        type: userData.profile_image.type,
        lastModified: userData.profile_image.lastModified,
      });
    }
    console.log("Password:", userData.password ? "Provided" : "Not provided");
    console.log("Full URL:", `/admin/users/${userId}`);
    console.log("User ID:", userId);

    // If no file upload, send as JSON (like Postman)
    if (!userData.profile_image) {
      const jsonData: any = {
        name,
        username,
        email,
        phone_no,
        tags,
      };

      // Add password fields only if provided
      if (userData.password) {
        jsonData.password = userData.password;
      }
      if (userData.password_confirmation) {
        jsonData.password_confirmation = userData.password_confirmation;
      }

      console.log("=== Sending as JSON (no file upload) ===");
      console.log("JSON data:", JSON.stringify(jsonData, null, 2));

      try {
        const response = await api.put(`/admin/users/${userId}`, jsonData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("=== PUT request successful (JSON) ===");
        console.log("Response:", response);
        console.log("Response data:", response.data);
        return response.data;
      } catch (error: any) {
        console.error("=== PUT request failed (JSON) ===");
        console.error("Error response status:", error.response?.status);
        console.error("Error response data:", error.response?.data);
        throw error;
      }
    }

    // If file upload exists, use FormData
    const formData = new FormData();
    formData.append("username", username);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone_no", phone_no);

    // Add tags - use tags[] format for Laravel FormData array handling
    // This matches how Laravel expects array data in FormData
    tags.forEach((tagId) => {
      formData.append("tags[]", String(tagId));
    });

    // Add password fields only if provided
    if (userData.password) {
      formData.append("password", userData.password);
    }
    if (userData.password_confirmation) {
      formData.append("password_confirmation", userData.password_confirmation);
    }

    // Add profile image
    formData.append("profile_image", userData.profile_image);

    console.log("=== Sending as FormData (with file upload) ===");
    console.log("FormData fields:");
    console.log("  username:", username);
    console.log("  name:", name);
    console.log("  email:", email);
    console.log("  phone_no:", phone_no);
    console.log("  tags[]:", tags);
    if (userData.password) {
      console.log("  password: (provided)");
    }
    if (userData.password_confirmation) {
      console.log("  password_confirmation: (provided)");
    }
    console.log("  profile_image: (file)", {
      name: userData.profile_image.name,
      size: userData.profile_image.size,
      type: userData.profile_image.type,
    });

    // When sending FormData, Laravel often requires POST with _method=PUT for file uploads
    // Some Laravel configurations don't handle PUT with multipart/form-data well
    formData.append("_method", "PUT");

    console.log(
      "=== Sending FormData with POST _method=PUT (Laravel file upload best practice) ==="
    );

    try {
      const response = await api.post(`/admin/users/${userId}`, formData);
      console.log("=== POST with _method=PUT successful (FormData) ===");
      console.log("Response:", response);
      console.log("Response data:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("=== POST with _method=PUT failed (FormData) ===");
      console.error("Error response status:", error.response?.status);
      console.error("Error response data:", error.response?.data);

      // Try direct PUT as fallback (some Laravel setups might support it)
      if (error.response?.status === 405 || error.response?.status === 404) {
        console.log("=== Trying direct PUT request as fallback ===");
        // Remove _method from FormData and try PUT
        const putFormData = new FormData();
        putFormData.append("username", username);
        putFormData.append("name", name);
        putFormData.append("email", email);
        putFormData.append("phone_no", phone_no);
        tags.forEach((tagId) => {
          putFormData.append("tags[]", String(tagId));
        });
        if (userData.password) {
          putFormData.append("password", userData.password);
        }
        if (userData.password_confirmation) {
          putFormData.append(
            "password_confirmation",
            userData.password_confirmation
          );
        }
        putFormData.append("profile_image", userData.profile_image);

        const response = await api.put(`/admin/users/${userId}`, putFormData);
        console.log("=== PUT request successful (FormData fallback) ===");
        return response.data;
      }

      // Re-throw the original error if it's not a method issue
      throw error;
    }
  }

  /**
   * Delete user by ID
   * @param userId - User ID
   * @returns Response data
   */
  async deleteUser(userId: string | number): Promise<any> {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  }
}

export default new SuperAdminUsersService();
