import axios from "axios";
import { toast } from "react-toastify";
import { localstoragetext } from "./constants/localstorage-text";
import buildpath from "./constants/route-path";
import { logout } from "./functions/misc";

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    const token =
      "Bearer " + localStorage.getItem(localstoragetext.accesstoken);
    config.headers.Authorization = token;
    // Do something before request is sent
    console.debug(config);
    return config;
  },
  function (error) {
    console.debug(error);

    let errormesssage =
      (error.data ? error.data.message : null) ||
      (error.response && error.response.data
        ? error.response.data.message || error.response.data.error
        : null) ||
      error.message;
    console.debug(errormesssage);
    // Do something with request error
    //return Promise.reject(error);
    toast(errormesssage, { type: "error" });
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    console.debug(response);
    return response;
  },
  async function (error) {
    console.debug(error);
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    //return Promise.reject(error);x
    let errormesssage =
      (error.data ? error.data.message : null) ||
      (error.response && error.response.data
        ? error.response.data.message || error.response.data.error
        : null) ||
      error.message;
    console.debug(errormesssage);
    if (errormesssage.includes("Invalid JWT Token")) {
      const originalRequest = error.config;
      originalRequest._retry = true;
      const access_token = await refreshAccessToken();
      if (access_token) {
        axios.defaults.headers.common["Authorization"] =
          "Bearer " + access_token;
        return axios(originalRequest);
      } else {
        logout();
        window.location.href = buildpath.login;
      }
    }

    toast(errormesssage, { type: "error" });
  }
);

async function refreshAccessToken(): Promise<string | null> {
  let refreshtoken = localStorage.getItem(localstoragetext.refreshtoken);
  if (refreshtoken) {
    try {
      let resp = await axios.get(
        process.env.REACT_APP_API_URL + "/token/renew?token=" + refreshtoken
      );
      localStorage.setItem(
        localstoragetext.accesstoken,
        resp.data.access_token
      );
      localStorage.setItem(
        localstoragetext.refreshtoken,
        resp.data.refresh_token
      );
      return resp.data.access_token;
    } catch (err) {
      return null;
    }
  } else {
    return null;
  }
}
