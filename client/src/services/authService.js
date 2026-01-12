import api from "./apiClient.js";

export async function login(payload) {
  try {
    const res = await api.post("/auth/login", payload);
    localStorage.setItem("pp_token", res.data.token);
    return res.data;
  } catch (err) {
    const message = err?.response?.data?.message || "Login failed";
    const code = err?.response?.status || 500;
    const e = new Error(message);
    e.code = code;
    throw e;
  }
}

export async function register(payload) {
  try {
    const res = await api.post("/auth/register", payload);
    localStorage.setItem("pp_token", res.data.token);
    return res.data;
  } catch (err) {
    const message = err?.response?.data?.message || "Registration failed";
    const code = err?.response?.status || 500;
    const e = new Error(message);
    e.code = code;
    throw e;
  }
}

export async function getProfile() {
  const res = await api.get("/auth/me");
  return res.data.user;
}

export async function updateProfile(payload) {
  try {
    const res = await api.put("/auth/profile", payload);
    return res.data.user;
  } catch (err) {
    const message = err?.response?.data?.message || "Failed to update profile";
    const code = err?.response?.status || 500;
    const e = new Error(message);
    e.code = code;
    throw e;
  }
}

export async function deleteProfile() {
  try {
    const res = await api.delete("/auth/profile");
    localStorage.removeItem("pp_token");
    return res.data;
  } catch (err) {
    const message = err?.response?.data?.message || "Failed to delete profile";
    const code = err?.response?.status || 500;
    const e = new Error(message);
    e.code = code;
    throw e;
  }
}

export async function refreshToken() {
  const res = await api.post("/auth/refresh");
  if (res.data?.token) {
    localStorage.setItem("pp_token", res.data.token);
  }
  return res.data?.token;
}

export async function logout() {
  try {
    await api.post("/auth/logout");
  } finally {
    localStorage.removeItem("pp_token");
  }
}

export async function requestPasswordReset(email) {
  try {
    const res = await api.post("/auth/password/forgot", { email });
    return res.data;
  } catch (err) {
    const message = err?.response?.data?.message || "Failed to send OTP";
    const code = err?.response?.status || 500;
    const e = new Error(message);
    e.code = code;
    throw e;
  }
}

export async function verifyPasswordOTP({ email, otp }) {
  try {
    const res = await api.post("/auth/password/verify", { email, otp });
    return res.data;
  } catch (err) {
    const message = err?.response?.data?.message || "Invalid or expired OTP";
    const code = err?.response?.status || 500;
    const e = new Error(message);
    e.code = code;
    throw e;
  }
}

export async function resetPassword({ email, otp, password }) {
  try {
    const res = await api.post("/auth/password/reset", { email, otp, password });
    return res.data;
  } catch (err) {
    const message = err?.response?.data?.message || "Password reset failed";
    const code = err?.response?.status || 500;
    const e = new Error(message);
    e.code = code;
    throw e;
  }
}
// Admin management endpoints
export async function createAdmin(payload) {
  try {
    const res = await api.post("/auth/admin", payload);
    return res.data;
  } catch (err) {
    const message = err?.response?.data?.message || "Failed to create admin";
    const code = err?.response?.status || 500;
    const e = new Error(message);
    e.code = code;
    throw e;
  }
}

export async function listAdmins() {
  try {
    const res = await api.get("/auth/admin");
    return res.data.admins;
  } catch (err) {
    const message = err?.response?.data?.message || "Failed to fetch admins";
    const code = err?.response?.status || 500;
    const e = new Error(message);
    e.code = code;
    throw e;
  }
}

export async function updateAdminPrivileges(adminId, privileges) {
  try {
    const res = await api.put(`/auth/admin/${adminId}`, { privileges });
    return res.data;
  } catch (err) {
    const message = err?.response?.data?.message || "Failed to update admin privileges";
    const code = err?.response?.status || 500;
    const e = new Error(message);
    e.code = code;
    throw e;
  }
}

export async function deleteAdmin(adminId) {
  try {
    const res = await api.delete(`/auth/admin/${adminId}`);
    return res.data;
  } catch (err) {
    const message = err?.response?.data?.message || "Failed to delete admin";
    const code = err?.response?.status || 500;
    const e = new Error(message);
    e.code = code;
    throw e;
  }
}