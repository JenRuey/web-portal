import { createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import {
  googlelogin,
  login,
  userAdd,
  userDelete,
  userEdit,
  userListing,
  UserType,
} from "../actions/userActions";

// Define a type for the slice state
interface UserState {
  email: string | null;
  id: number | null;
  userlist: Array<UserType>;
}

// Define the initial state using that type
const initialState: UserState = {
  email: null,
  id: null,
  userlist: [],
};

export const userSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(googlelogin.fulfilled, (state, { payload }) => {
      state.email = payload.email;
      state.id = payload.id;
    });
    builder.addCase(login.fulfilled, (state, { payload }) => {
      state.email = payload.email;
      state.id = payload.id;
    });
    builder.addCase(userListing.fulfilled, (state, { payload }) => {
      state.userlist = payload;
    });

    builder.addCase(userAdd.fulfilled, (state, { payload }) => {
      state.userlist = [...state.userlist, payload];
    });
    builder.addCase(userDelete.fulfilled, (state, { payload }) => {
      state.userlist = _.filter(
        [...state.userlist],
        (o: UserType) => o.id !== payload
      );
    });
    builder.addCase(userEdit.fulfilled, (state, { payload }) => {
      let copyset = _.filter(
        [...state.userlist],
        (o: UserType) => o.id !== payload.id
      );
      copyset.unshift(payload);
      state.userlist = copyset;
    });
  },
});

export default userSlice;
