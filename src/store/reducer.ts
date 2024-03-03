import { AnyAction, CombinedState, combineReducers } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import user from './slices/user';

interface IRootStates {
  user;
}

const rootReducer = (
	state: IRootStates,
  action: AnyAction,
): CombinedState<IRootStates> => {
  switch(action.type) {
    case HYDRATE:
      return action.payload;
    default: {
      const combinedReducer = combineReducers({
        user,
      });
      return combinedReducer(state, action);
    }
  }
}

export type RootStates = ReturnType<typeof rootReducer>;

export default rootReducer;
