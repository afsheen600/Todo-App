// apiClient.ts
export const apiClient = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const baseUrl = "https://todo-app-backend-bay.vercel.app"; // no trailing slash

  const defaultHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
  };

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: "include", // 🔑 important for cookies/sessions
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
