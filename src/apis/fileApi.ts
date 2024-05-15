import axiosInstance from '@utils/axios';

const prefix = '/v1/image';

export const uploadImage = async (file: FormData): Promise<string | undefined> => {
  const {
    data
  } = await axiosInstance.post(`${prefix}`, file, {headers: {'Content-Type': 'multipart/form-data'}});
  console.log(data);
  return data.url;
};
