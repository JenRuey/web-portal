import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../AxiosConfig";
import { LoadingEvent } from "../../components/Loading";

export type NotificationType = {
  message: string;
  datetime: string;
  user_id: number | null;
};

export const getNotifications = createAsyncThunk<
  // Return type of the payload creator
  Array<NotificationType>
  // First argument to the payload creator
>("notification/list", async () => {
  try {
    LoadingEvent.fire(true);
    let resp = await axios.get(
      process.env.REACT_APP_API_URL + "/auth-notification/list"
    );

    return resp.data as Array<NotificationType>;
  } finally {
    LoadingEvent.fire(false);
  }
});
