export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface ApiUser {
  _id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export function normalizeUser(user: ApiUser): User {
  return {
    id: user._id,
    email: user.email,
    name: user.name || user.email,
    role: user.role,
  };
}
