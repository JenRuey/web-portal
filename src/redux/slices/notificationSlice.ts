import { createSlice } from "@reduxjs/toolkit";
import {
  getNotifications,
  NotificationType,
} from "../actions/notificationActions";

// Define a type for the slice state
interface NotificationState {
  data: Array<NotificationType>;
}

// Define the initial state using that type
const initialState: NotificationState = {
  data: [],
};

export const notificationSlice = createSlice({
  name: "notification",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getNotifications.fulfilled, (state, { payload }) => {
      state.data = payload;
    });
  },
});

export default notificationSlice;
