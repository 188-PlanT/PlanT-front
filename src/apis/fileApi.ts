import axiosInstance from '@utils/axios';

const prefix = '/v1/image';

export const uploadImage = async (file: FormData): Promise<string | undefined> => {
  const {
    data
  } = await axiosInstance.post(`${prefix}`, file);
  console.log(data);
  return data.url;
};
