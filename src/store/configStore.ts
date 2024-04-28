import { CombinedState, configureStore, Reducer } from '@reduxjs/toolkit';
import { useSelector, useDispatch, TypedUseSelectorHook  } from 'react-redux';
import { Context, createWrapper } from 'next-redux-wrapper';
import rootReducer, { RootStates } from './reducer';

const store = configureStore({
  reducer: rootReducer as Reducer<CombinedState<RootStates>>,
  devTools: true,
});

const makeStore = (context: Context) => {
  return store;
};

const wrapper = createWrapper(makeStore);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default wrapper;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;