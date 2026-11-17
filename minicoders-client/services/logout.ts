export const logout = async () => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    console.log("API URL:", API_URL);

    if (!API_URL) {
      throw new Error("Backend URL is missing");
    }

    const response = await fetch(
      `${API_URL}/api/v1/auth/logout`,
      {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Logout failed: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};