import axiosInstance from '@utils/axios';
import { SchedulePostDto } from '@customTypes/SchedulePostDto';
import { ScheduleStatusType } from '@customTypes/types';

const prefix = '/v1/schedules';

export const SCHEDULE_QUERY_KEY = {
  GET_SCHEDULE_DETAIL_BY_SID: 'getScheduleDetailByScheduleId',
};

export async function getScheduleDetailByScheduleId({scheduleId}: {scheduleId: number}) {
  try {
    const {data} = await axiosInstance.get(`${prefix}/${scheduleId}`);
    return data;
  } catch(error) {
    throw error;
  }
}

export async function createSchedule({workspaceId, ...params}: {workspaceId: number} & SchedulePostDto) {
  try {
    const {data} = await axiosInstance.post(`${prefix}`, params);
    return data;
  } catch(error) {
    throw error;
  }
}

export async function updateSchedule({scheduleId, ...params}: {scheduleId: number} & SchedulePostDto) {
  try {
    const {data} = await axiosInstance.put(`${prefix}/${scheduleId}`, params);
    return data;
  } catch(error) {
    throw error;
  }
}

export async function updateScheduleState({scheduleId, state}: {scheduleId: number, state: ScheduleStatusType} & SchedulePostDto) {
  try {
    const {data} = await axiosInstance.put(`${prefix}/${scheduleId}/state`, {state});
    return data;
  } catch(error) {
    throw error;
  }
}

export async function deleteSchedule({scheduleId}: {scheduleId: number}) {
  try {
    const {data} = await axiosInstance.delete(`${prefix}/${scheduleId}`);
    return data;
  } catch(error) {
    throw error;
  }
}