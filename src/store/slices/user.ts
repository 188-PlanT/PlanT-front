import { createSlice } from '@reduxjs/toolkit';
import { UserDto } from '@customTypes/UserDto';
import { RootState } from '../configStore';

const initialState: {me?: UserDto} = {};

const user = createSlice({
  name: 'user',
  initialState,
  extraReducers: (builder) => {},
  reducers: {
    setMyInfo: (state, action) => {
      state.me = action.payload;
    },
    logout: (state) => {
      state.me = undefined;
      localStorage.removeItem('accessToken');
      delete axiosInstance.defaults.headers.common.Authorization;
    },
  },
});

export const selectMe = (state: RootState) => state.user?.me;
export const selectNickName = (state: RootState) => state.user?.me ? state.user.me.nickName : '';

const { actions, reducer } = user;

export const { setMyInfo, logout } = actions;

export default reducer;
