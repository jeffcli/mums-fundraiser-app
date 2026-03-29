export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: "ADMIN" | "SELLER";
  name: string;
}

export interface CreateUserRequest {
  name: string;
  username: string;
  password: string;
  role: "ADMIN" | "SELLER";
}

export interface UserResponse {
  id: number;
  name: string;
  username: string;
  role: "ADMIN" | "SELLER";
  active: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
