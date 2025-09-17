import { configureStore, combineSlices } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { ingredientsSlice } from './slices/ingredientsSlice';
import { feedsSlice } from './slices/feedsSlice';
import { editorSlice } from './slices/editorSlice';
import { ordersSlice } from './slices/ordersSlice';
import { userSlice } from './slices/userSlice';

export const rootReducer = combineSlices(
  ingredientsSlice,
  feedsSlice,
  ordersSlice,
  userSlice,
  editorSlice
);

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
