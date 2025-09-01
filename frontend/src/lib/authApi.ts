import { apiRequest, setToken } from "../lib/api";

function setUserInfo(user: { email: string; name?: string; id?: string; isVerified?: boolean }) {
  localStorage.setItem('user', JSON.stringify(user));
}

export function getUserInfo() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function clearUserInfo() {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
}

// Sign up - request OTP for new user registration
export async function signup({ name, email, dob }: { name: string; email: string; dob?: string }) {
  const body = dob ? { name, email, dob } : { name, email };
  return apiRequest("/auth/signup", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// Verify signup OTP and complete registration
export async function verifySignupOTP({ email, otp }: { email: string; otp: string }) {
  const res = await apiRequest("/auth/verify-signup", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
  if (res.token) {
    setToken(res.token);
  }
  if (res.user) {
    setUserInfo(res.user);
  }
  return res;
}

// Login - request OTP for existing user
export async function login({ email }: { email: string }) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

// Verify login OTP
export async function verifyLoginOTP({ email, otp }: { email: string; otp: string }) {
  const res = await apiRequest("/auth/verify-login", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
  if (res.token) {
    setToken(res.token);
  }
  if (res.user) {
    setUserInfo(res.user);
  }
  return res;
}

// Resend OTP
export async function resendOTP({ email }: { email: string }) {
  return apiRequest("/auth/resend-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

// Get user profile
export async function getUserProfile() {
  return apiRequest("/auth/profile", {
    method: "GET",
  });
}

// Logout
export function logout() {
  clearUserInfo();
  setToken(null);
}
