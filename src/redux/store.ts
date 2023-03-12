import { configureStore } from "@reduxjs/toolkit";
import notificationSlice from "./slices/notificationSlice";
import stationSlice from "./slices/stationSlice";
import userSlice from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    notification: notificationSlice.reducer,
    station: stationSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
