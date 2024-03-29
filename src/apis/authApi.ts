import axiosInstance from '@utils/axios';
import { UserDto } from '@customTypes/UserDto';

const prefix = '/v1';

export async function signup(params: { email: string; password: string; }) {
  try {
    await axiosInstance.post(`${prefix}/sign-up`, params);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function login(params: { email: string; password: string }): Promise<{ accessToken: string; refreshToken: string; } | undefined> {
  try {
    const {
      data: {accessToken, refreshToken}
    } = await axiosInstance.post(`${prefix}/login`, params);
    localStorage.setItem('accessToken', accessToken);
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    return { accessToken, refreshToken };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function logout() {
  localStorage.removeItem('accessToken');
  axiosInstance.defaults.headers.common.Authorization = undefined;
}

export async function checkNickname(params: { nickName: string }): Promise<boolean | undefined> {
  try {
    const {
      data: { available },
    } = await axiosInstance.post(`${prefix}/users/nickname`, params);
    return available;
  } catch (error) {
    console.error(error);
  }
}

export async function checkEmail(params: { email: string }): Promise<boolean | undefined> {
  try {
    const {
      data: { available },
    } = await axiosInstance.post(`${prefix}/users/email`, params);
    return available;
  } catch (error) {
    console.error(error);
  }
}

export async function setNickname(params: { nickname: string }): Promise<UserDto | undefined> {
  try {
    const {
      data,
    } = await axiosInstance.put(`${prefix}/users/nickname`, params);
    return data;
  } catch (error) {
    console.error(error);
  }
}
