import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { LoadingEvent } from "../../components/Loading";
import { localstoragetext } from "../../constants/localstorage-text";

export type UserType = {
  id: number;
  access_token: string;
  email: string;
  hash_key: string;
  refresh_token: string;
  modified_datetime: string;
};

export const googlelogin = createAsyncThunk<
  // Return type of the payload creator
  Pick<UserType, "email" | "id">,
  // First argument to the payload creator
  Pick<UserType, "email" | "access_token">
>("user/googlelogin", async (user) => {
  LoadingEvent.fire(true);
  let resp = await axios.post(
    process.env.REACT_APP_API_URL + "/token/googlelogin",
    {
      email: user.email,
      access_token: user.access_token,
    }
  );
  LoadingEvent.fire(false);
  let loginuser = resp.data as UserType;

  localStorage.setItem(localstoragetext.accesstoken, loginuser.access_token);
  localStorage.setItem(localstoragetext.refreshtoken, loginuser.refresh_token);
  localStorage.setItem(localstoragetext.useremail, loginuser.email);
  localStorage.setItem(localstoragetext.userid, loginuser.id.toString());

  return { email: loginuser.email, id: loginuser.id };
});

export const login = createAsyncThunk<
  // Return type of the payload creator
  Pick<UserType, "email" | "id">,
  // First argument to the payload creator
  Pick<UserType, "email" | "hash_key">
>("user/login", async (user) => {
  LoadingEvent.fire(true);
  let resp = await axios.post(process.env.REACT_APP_API_URL + "/token/login", {
    email: user.email,
    hash_key: user.hash_key,
  });
  LoadingEvent.fire(false);

  let loginuser = resp.data as UserType;

  localStorage.setItem(localstoragetext.accesstoken, loginuser.access_token);
  localStorage.setItem(localstoragetext.refreshtoken, loginuser.refresh_token);
  localStorage.setItem(localstoragetext.useremail, loginuser.email);
  localStorage.setItem(localstoragetext.userid, loginuser.id.toString());

  return { email: loginuser.email, id: loginuser.id };
});

export const userListing = createAsyncThunk<
  // Return type of the payload creator
  Array<UserType>
  // First argument to the payload creator
>("user/userListing", async () => {
  LoadingEvent.fire(true);
  let resp = await axios.get(process.env.REACT_APP_API_URL + "/auth-user/list");
  LoadingEvent.fire(false);

  let users = resp.data as Array<UserType>;

  return users;
});

export const userDelete = createAsyncThunk<
  // Return type of the payload creator
  number,
  // First argument to the payload creator
  number
>("user/delete", async (userid) => {
  LoadingEvent.fire(true);
  await axios.get(
    process.env.REACT_APP_API_URL + "/auth-user/delete?userid=" + userid
  );
  LoadingEvent.fire(false);

  return userid;
});

export const userEdit = createAsyncThunk<
  // Return type of the payload creator
  UserType,
  // First argument to the payload creator
  UserType
>("user/edit", async (user) => {
  LoadingEvent.fire(true);
  let resp = await axios.post(
    process.env.REACT_APP_API_URL + "/auth-user/update",
    user
  );
  LoadingEvent.fire(false);

  return resp.data as UserType;
});

export const userAdd = createAsyncThunk<
  // Return type of the payload creator
  UserType,
  // First argument to the payload creator
  UserType
>("user/add", async (user) => {
  LoadingEvent.fire(true);
  let resp = await axios.post(
    process.env.REACT_APP_API_URL + "/auth-user/add",
    user
  );
  LoadingEvent.fire(false);

  return resp.data as UserType;
});
