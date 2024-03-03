import axiosInstance from '@utils/axios';
import { UserDto } from '@customTypes/UserDto';
import { WorkspaceSimpleDto } from '@customTypes/WorkspaceSimpleDto';
import { ScheduleSimpleDto } from '@customTypes/ScheduleSimpleDto';

const prefix = '/v1/users';

export const USER_QUERY_KEY = {
  GET_MY_INFO: 'getMyInfo',
  GET_MY_WORKSPACE_LIST: 'getMyWorkspaceList',
  GET_MY_SCHEDULE_LIST: 'getMyScheduleList',
  SEARCH_USER:'searchUser',
};

export async function getMyInfo(): Promise<UserDto> {
  try {
    const {
      data,
    } = await axiosInstance.get(`${prefix}`);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function changeMyInfo(params: { nickName?: string; password?: string; profile?: string}): Promise<UserDto | undefined> {
  try {
    const {
      data,
    } = await axiosInstance.put(`${prefix}`, params);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getMyWorkspaceList(): Promise<{userId: number; workspaces: WorkspaceSimpleDto[]} | undefined> {
  try {
    const {
      data,
    } = await axiosInstance.get(`${prefix}/workspaces`);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getMyScheduleList({month}: {month: string}): Promise<{userId: number; schedules: {toDo: ScheduleSimpleDto[], InProgress: ScheduleSimpleDto[], done: ScheduleSimpleDto[]}} | undefined> {
  try {
    const {
      data,
    } = await axiosInstance.get(`${prefix}/schedules?date=${month}`);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function searchUser({keyword}: {keyword: string}): Promise<{users: {userId: number; email: string; nickName: string}[]} | undefined> {
  try {
    const {
      data,
    } = await axiosInstance.get(`${prefix}/search?keyword=${keyword}`);
    return data;
  } catch (error) {
    throw error;
  }
}
