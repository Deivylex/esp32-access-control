export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  role?: string;
  active?: boolean;
}