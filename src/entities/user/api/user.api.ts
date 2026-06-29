import axiosInstance from '@/shared/api/axios';
import type { AuthPayload, AuthUser, ChangePasswordPayload } from '../model/types';

export const authUserApi = (body: AuthPayload) => {
  return axiosInstance.post(`/api/admin/users/token/?is_admin_user=true`, body);
};

export const getUserMeApi = () => {
  return axiosInstance.get<AuthUser>(`/api/admin/users/me/`);
};

export const updateUserProfileApi = (userId: number, data: any) => {
  return axiosInstance.patch<AuthUser>(`/api/users/${userId}/`, data);
};

export const changePasswordApi = (body: ChangePasswordPayload) => {
  return axiosInstance.post(`/api/admin/users/change-password/`, body);
};

export const resetPasswordApi = (phone: string) => {
  return axiosInstance.post(`/api/admin/users/reset-password/`, { phone });
};

export const forgotPasswordApi = (phone: string) => {
  return axiosInstance.post(`/api/users/reset-password/`, { phone });
};
