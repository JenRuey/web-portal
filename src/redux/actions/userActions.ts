import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../AxiosConfig";
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
  try {
    LoadingEvent.fire(true);
    let resp = await axios.post(
      process.env.REACT_APP_API_URL + "/token/googlelogin",
      {
        email: user.email,
        access_token: user.access_token,
      }
    );
    let loginuser = resp.data as UserType;
    localStorage.setItem(localstoragetext.accesstoken, loginuser.access_token);
    localStorage.setItem(
      localstoragetext.refreshtoken,
      loginuser.refresh_token
    );
    localStorage.setItem(localstoragetext.useremail, loginuser.email);
    localStorage.setItem(localstoragetext.userid, loginuser.id.toString());

    return { email: loginuser.email, id: loginuser.id };
  } finally {
    LoadingEvent.fire(false);
  }
});

export const login = createAsyncThunk<
  // Return type of the payload creator
  Pick<UserType, "email" | "id">,
  // First argument to the payload creator
  Pick<UserType, "email" | "hash_key"> & { errCallback: () => void }
>("user/login", async (user) => {
  try {
    LoadingEvent.fire(true);
    let resp = await axios.post(
      process.env.REACT_APP_API_URL + "/token/login",
      {
        email: user.email,
        hash_key: user.hash_key,
      }
    );

    let loginuser = resp.data as UserType;

    localStorage.setItem(localstoragetext.accesstoken, loginuser.access_token);
    localStorage.setItem(
      localstoragetext.refreshtoken,
      loginuser.refresh_token
    );
    localStorage.setItem(localstoragetext.useremail, loginuser.email);
    localStorage.setItem(localstoragetext.userid, loginuser.id.toString());

    return { email: loginuser.email, id: loginuser.id };
  } catch (err) {
    user.errCallback();
    return Promise.reject(err);
  } finally {
    LoadingEvent.fire(false);
  }
});

export const userListing = createAsyncThunk<
  // Return type of the payload creator
  Array<UserType>
  // First argument to the payload creator
>("user/userListing", async () => {
  try {
    LoadingEvent.fire(true);
    let resp = await axios.get(
      process.env.REACT_APP_API_URL + "/auth-user/list"
    );

    let users = resp.data as Array<UserType>;

    return users;
  } finally {
    LoadingEvent.fire(false);
  }
});

export const userDelete = createAsyncThunk<
  // Return type of the payload creator
  number,
  // First argument to the payload creator
  number
>("user/delete", async (userid) => {
  try {
    LoadingEvent.fire(true);
    await axios.get(
      process.env.REACT_APP_API_URL + "/auth-user/delete?userid=" + userid
    );

    return userid;
  } finally {
    LoadingEvent.fire(false);
  }
});

export const userEdit = createAsyncThunk<
  // Return type of the payload creator
  UserType,
  // First argument to the payload creator
  UserType
>("user/edit", async (user) => {
  try {
    LoadingEvent.fire(true);
    let resp = await axios.post(
      process.env.REACT_APP_API_URL + "/auth-user/update",
      user
    );

    return resp.data as UserType;
  } finally {
    LoadingEvent.fire(false);
  }
});

export const userAdd = createAsyncThunk<
  // Return type of the payload creator
  UserType,
  // First argument to the payload creator
  UserType
>("user/add", async (user) => {
  try {
    LoadingEvent.fire(true);
    let resp = await axios.post(
      process.env.REACT_APP_API_URL + "/auth-user/add",
      user
    );

    return resp.data as UserType;
  } finally {
    LoadingEvent.fire(false);
  }
});
