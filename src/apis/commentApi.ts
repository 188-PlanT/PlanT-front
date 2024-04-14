import axiosInstance from '@utils/axios';

const prefix = '/v1/schedules';

export async function createComment({scheduleId, content}: { scheduleId: number; content: string }) {
  try {
    await axiosInstance.post(`${prefix}/${scheduleId}/chat`, {content});
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateComment({scheduleId, chatId, content}: { scheduleId: number; chatId: number; content: string }) {
  try {
    await axiosInstance.put(`${prefix}/${scheduleId}/chat/${chatId}`, {content});
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteComment({scheduleId, chatId}: { scheduleId: number; chatId: number }) {
  try {
    await axiosInstance.delete(`${prefix}/${scheduleId}/chat/${chatId}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
}