import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './chatSlice';
import { chatApi } from './chatApi';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    [chatApi.reducerPath]: chatApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(chatApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;