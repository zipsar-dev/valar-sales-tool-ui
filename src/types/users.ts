export interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string | null;
  department?: string | null;
  hireDate?: string;
  avatarUrl?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  roles: string[];
  permissions: string[];
}

export interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}