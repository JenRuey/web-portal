import EmailIcon from "@mui/icons-material/Email";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import LockIcon from "@mui/icons-material/Lock";
import {
  Button,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
} from "@mui/material";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import { sha256 } from "js-sha256";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import buildpath from "../constants/route-path";
import logo from "../images/liteon-logo.png";
import img from "../images/loginbackground.jpg";
import { googlelogin, login } from "../redux/actions/userActions";
import { useAppDispatch } from "../redux/hook";

const Backdrop = styled.div`
  height: 100vh;
  width: 100vw;
  background-image: url(${img});
  background-size: cover;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  position: relative;
  .bottom-right {
    position: absolute;
    bottom: 0;
    right: 0;
    text-align: center;
    font-size: 12px;
    color: white;
  }
  .top-left {
    position: absolute;
    top: 0;
    left: 0;
  }
  @media only screen and (max-width: 500px) {
    align-items: flex-start;
  }
`;

const LoginBox = styled.div`
  background-color: white;
  padding: 20px;
  width: 500px;
  max-width: 100%;
  border-radius: 2px;

  transform: translateY(-50px);
  opacity: 0;
  animation: transitdown 0.4s ease-in-out;
  animation-fill-mode: forwards;

  .letter-space {
    letter-spacing: 1.5px;
  }
`;

const GoogleLoginButton = styled.div`
  transition: background-color 0.3s, box-shadow 0.3s;
  cursor: pointer;
  text-align: center;
  padding: 12px 42px;
  border: none;
  border-radius: 3px;
  border: 1px solid #dadce0;

  color: #757575;
  font-size: 14px;
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;

  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=);
  background-color: white;
  background-repeat: no-repeat;
  background-position: 12px 11px;

  &:hover {
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
      0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
  }

  &:active {
    background-color: #eeeeee;
  }

  &:focus {
    outline: none;
    box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.25),
      0 0 0 3px #c8dafc;
  }

  &:disabled {
    filter: grayscale(100%);
    background-color: #ebebeb;
    box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 1px 1px rgba(0, 0, 0, 0.25);
    cursor: not-allowed;
  }
`;

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{ height: "1px", width: "100%", background: "#d1d5db" }}
      ></div>
      <p style={{ margin: "10px", fontWeight: 100, color: "#94979c" }}>OR</p>
      <div
        style={{ height: "1px", width: "100%", background: "#d1d5db" }}
      ></div>
    </div>
  );
}

interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
}

interface Form extends HTMLFormElement {
  readonly elements: FormElements;
}

function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [showPass, setShowPass] = useState<boolean>(false);

  const handleAfterLogin = () => {
    navigate(buildpath.dashboard);
  };

  const formSubmit = async (event: React.FormEvent<Form>) => {
    event.preventDefault();

    let { email, password } = event.currentTarget.elements;
    if (!email.value || !/[^\s@]+@[^\s@]+\.[^\s@]+/.test(email.value)) {
      toast("Please enter a valid email.", { type: "error" });
      return;
    }
    if (!password.value) {
      toast("Please enter your password.", { type: "error" });
      return;
    }
    if (password.value.length < 8) {
      toast("Password must be at least 8 charaters.", { type: "error" });
      return;
    }

    let { type } = await dispatch(
      login({
        email: email.value,
        hash_key: sha256(password.value),
        errCallback: () => setShowPass(true),
      })
    );
    if (!type.includes("rejected")) handleAfterLogin();
  };

  const googleloginfunc = useGoogleLogin({
    onSuccess: (resp: TokenResponse) => {
      if (resp.access_token) {
        fetch(
          "https://oauth2.googleapis.com/tokeninfo?access_token=" +
            resp.access_token
        )
          .then((response) => {
            return response.json();
          })
          .then(async (data) => {
            let { type } = await dispatch(
              googlelogin({
                email: data.email,
                access_token: resp.access_token,
              })
            );
            if (!type.includes("rejected")) handleAfterLogin();
          });
      } else {
        toast("Failed to decode google credentials.", { type: "error" });
      }
    },
    onError: () => {
      toast("Failed to login via google.", { type: "error" });
    },
  });

  return (
    <Backdrop>
      <div className="top-left">
        <img
          src={logo}
          width={120}
          alt={"liteonlogo"}
          style={{ marginTop: -40 }}
        />
      </div>
      <LoginBox>
        <div className="flex-center">
          <EnergySavingsLeafIcon htmlColor="green" />
          <span className="letter-space ms-3">
            Welcome to <b>LITEON</b>
          </span>
        </div>
        <h1 className="my-3">Log in</h1>
        <form onSubmit={formSubmit}>
          <FormControl variant="standard" className="w-100 mb-3">
            <InputLabel htmlFor="input-with-icon-adornment">
              Your email
            </InputLabel>
            <Input
              required
              id="email"
              autoComplete="liteon-email"
              startAdornment={
                <InputAdornment position="start">
                  <EmailIcon htmlColor="lightblue" fontSize="small" />
                </InputAdornment>
              }
            />
          </FormControl>
          <FormControl variant="standard" className="w-100 mb-3">
            <InputLabel htmlFor="input-with-icon-adornment">
              Your password
            </InputLabel>
            <Input
              required
              autoComplete="current-password"
              id="password"
              type={showPass ? "text" : "password"}
              startAdornment={
                <InputAdornment position="start">
                  <LockIcon htmlColor="lightblue" fontSize="small" />
                </InputAdornment>
              }
            />
          </FormControl>
          <Button variant="contained" type="submit" className="w-100">
            {"Log in"}
          </Button>
          <Divider />

          <GoogleLoginButton
            role={"button"}
            onClick={() => googleloginfunc()}
            tabIndex={0}
            className={"tab-enter"}
          >
            {"Sign in with Google"}
          </GoogleLoginButton>
        </form>
      </LoginBox>
      <p className={"bottom-right"}>
        {"@LITE-ON Technology Corporation. All Rights Reserved."}
      </p>
    </Backdrop>
  );
}

export default Login;
