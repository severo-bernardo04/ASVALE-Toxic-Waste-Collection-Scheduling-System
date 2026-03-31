import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@Asvale:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('@Asvale:token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface Schedule {
  id: number;
  userId: number;
  userName: string;
  date: string;
  type: 'COLLECTION' | 'DELIVERY';
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  description: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  company: string;
  documentNumber: string;
  phone: string;
  address: string;
  isAdmin: boolean;
}

export interface SignInData {
  documentNumber: string;
  password: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  documentNumber: string;
  phone: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  signIn: (data: SignInData) =>
    api.post<AuthResponse>('/api/auth/login', data),
  signUp: (data: SignUpData) =>
    api.post<AuthResponse>('/api/auth/register', data),
};

export const scheduleApi = {
  list: () => api.get<Schedule[]>('/schedules'),
  create: (data: Omit<Schedule, 'id' | 'userId' | 'userName'>) =>
    api.post<Schedule>('/schedules', data),
  update: (id: number, data: Partial<Schedule>) =>
    api.put<Schedule>(`/schedules/${id}`, data),
  delete: (id: number) =>
    api.delete(`/schedules/${id}`),
};

export const adminApi = {
  listSchedules: () =>
    api.get<Schedule[]>('/admin/schedules'),
  updateScheduleStatus: (id: number, status: Schedule['status']) =>
    api.put<Schedule>(`/admin/schedules/${id}/status`, { status }),
  listUsers: () =>
    api.get<User[]>('/admin/users'),
  updateUser: (id: number, data: Partial<User>) =>
    api.put<User>(`/admin/users/${id}`, data),
  deleteUser: (id: number) =>
    api.delete(`/admin/users/${id}`),
};

export const profileApi = {
  get: () => api.get<User>('/profile'),
  update: (data: Partial<User>) =>
    api.put<User>('/profile', data),
};

export default api; 