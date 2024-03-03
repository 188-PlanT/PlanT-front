import axiosInstance from '@utils/axios';
// import { UserDto } from '@customTypes/UserDto';
// import { WorkspaceSimpleDto } from '@customTypes/WorkspaceSimpleDto';
// import { ScheduleSimpleDto } from '@customTypes/ScheduleSimpleDto';

const prefix = '/v1/workspaces';

export const WORKSPACE_QUERY_KEY = {
  GET_WORKSPACE_USERS_BY_WID: 'getWorkspaceUserByWId',
};

export async function createWorkspace(params: {users: number[]; name: string; profile?: string}) {
  try {
    const {data} = await axiosInstance.post(`${prefix}`, params);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function changeWorkspace({workspaceId, name, profile}: {workspaceId: number; name?: string; profile?: string}) {
  try {
    const {data} = await axiosInstance.put(`${prefix}/${workspaceId}`, {...(name && {name}), ...(profile && {profile})});
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteWorkspace({workspaceId}: {workspaceId: number}) {
  try {
    const {
      data,
    } = await axiosInstance.delete(`${prefix}/${workspaceId}`);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getWorkspaceUserByWId(
  {
    workspaceId
  }: {
    workspaceId: number
  }): Promise<{
    workspaceId: number;
    workspaceName: string;
    profile: string;
    users: {
      userId: string;
      email: string;
      nickName: string;
      authority: 'ADMIN' | 'USER' | 'PENDING';
    }[];
  } | undefined> {
  try {
    const {
      data,
    } = await axiosInstance.get(`${prefix}/${workspaceId}/users`);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addWorkspaceUser(
  {
    workspaceId,
    userId,
  }: {
    workspaceId: number;
    userId: number;
  }): Promise<{
    workspaceId: number;
    workspaceName: string;
    profile: string;
    users: {
      userId: string;
      email: string;
      nickName: string;
      authority: 'ADMIN' | 'USER' | 'PENDING';
    }[];
  } | undefined> {
  try {
    const {
      data,
    } = await axiosInstance.post(`${prefix}/${workspaceId}/users`, {userId});
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteWorkspaceUser(
  {
    workspaceId,
    userId,
  }: {
    workspaceId: number;
    userId: number;
  }) {
  try {
    const {
      data,
    } = await axiosInstance.delete(`${prefix}/${workspaceId}/users`, {userId});
    return data;
  } catch (error) {
    throw error;
  }
}
