import axios from 'axios';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
  baseURL: '',
  withCredentials: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    // 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    'Content-Type': 'application/json',
    // 'Access-Control-Allow-Credentials': true,
    // 'Access-Control-Max-Age': 3600,
    'Access-Control-Allow-Headers': 'Origin,Accept,X-Requested-With,Content-Type,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization'
  },
});

if (process.env.NEXT_PUBLIC_BASE_URL) {
  axiosInstance.defaults.baseURL = process.env.NEXT_PUBLIC_BASE_URL;
}

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // if (error.response.data?.error && error.response.data.error.message) {
    //   if (error.response.data.error.message.includes('jwt 토큰이 없습니다')) {
    //     return;
    //   }
    //   //5초 동안 오는 응답에 대해서 동일한 응답이면 하나만 표시한다.
    //   toast.error(`${error.response.data.error.message}`, {
    //     toastId: `${error.response.data.error.message}${Math.ceil(new Date().getTime() / 2000)}`,
    //   });
    // } else {
    //   toast.error(`Error Code : ${error.code} Error Message : ${error.message}`, {
    //     toastId: `${error.code}${Math.ceil(new Date().getTime() / 2000)}`,
    //   });
    // }
    return Promise.reject((error.response && error.response.data) || 'Something went wrong');
  },
);

export default axiosInstance;

if (typeof localStorage !== 'undefined') {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  }
}
