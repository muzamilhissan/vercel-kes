/** Envelope every endpoint on this API responds with. */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Permission {
  id?: number | string;
  name: string;
  guard_name?: string;
}

export interface Role {
  id?: number | string;
  name: string;
  description?: string | null;
  guard_name?: string;
  permissions?: Permission[];
}

export interface User {
  id: number | string;
  name?: string;
  fullName?: string;
  email: string;
  designation?: string;
  phoneNumber?: string;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
  /** Some endpoints return a bare role name instead of the roles array. */
  role?: string;
  roles?: Role[];
  permissions?: Permission[];
}
