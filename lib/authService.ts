// lib/authService.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL; // e.g. "http://localhost:5000/api"

export async function registerUser(payload:any) {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Registration failed");

  const data = await res.json();

  console.log(data.token.access_token);

  // Store token in localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", data.token.access_token);
  }

  return data;
}

export async function loginUser(payload:any) {
  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Login failed");
  const data = await res.json();

  // Store token in localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", data.access_token);
  }

  return data;
}

export function getToken() {
    return localStorage.getItem("access_token");
}

export function clearToken() {
  localStorage.removeItem("access_token");
}

export function logoutUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
  }
}

/**
 * Fetch current user info using /auth/me endpoint
 */
export async function fetchMe() {
  const token = getToken();
  if (!token) {
    return null; // no token → no user
  }

  const res = await fetch(`${API_URL}/users/me`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    clearToken(); // remove invalid/expired token
    return null; // return null instead of throwing
  }

  return res.json(); // should return user data
}

