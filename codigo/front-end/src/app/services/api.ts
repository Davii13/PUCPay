export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  const token = localStorage.getItem("authToken");
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
      throw new Error("Sessão expirada. Por favor, faça login novamente.");
    }

    const errorText = await response.text();
    let errorMessage = "Erro na requisição";
    try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorJson.message || errorMessage;
    } catch {
        errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
      return response.json();
  }
  return null;
}
