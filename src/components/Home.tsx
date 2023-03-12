import ApiIcon from "@mui/icons-material/Api";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import Tooltip from "@mui/material/Tooltip";
import { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { localstoragetext } from "../constants/localstorage-text";
import buildpath from "../constants/route-path";
import { subscribeNotification } from "../functions/WebSocket";
import logo from "../images/liteon-logo.png";
import { getNotifications } from "../redux/actions/notificationActions";
import { useAppDispatch } from "../redux/hook";
import NotificationPopper from "./NotificationPopper";
import UserPopper from "./UserPopper";

const AppNavBar = styled.div`
  position: relative;
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
    0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
  height: 80px;
  padding: 20px 40px;
  z-index: 900;
  background: white;
  transition: all 0.75s ease-in-out;
  .animated {
    transform: translateY(-50px);
    opacity: 0;
    animation: transitdown 0.4s ease-in-out;
    animation-fill-mode: forwards;
  }

  &.sticky-top {
    position: fixed;
    top: -60px;
    left: 0;
    right: 0;
    height: 50px;
    padding: 5px 40px;
    animation: navbardown 0.7s ease-in-out;
    animation-fill-mode: forwards;
    @keyframes navbardown {
      0% {
        top: -60px;
      }
      100% {
        top: 0px;
      }
    }
  }
`;

const SideNavBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 45px;
  background: #236bb3;
  display: flex;
  transition: width 0.7s cubic-bezier(0, 1.01, 0.47, 0.89);
  overflow: hidden;
  z-index: 800;

  .animated {
    transform: translateX(-50px);
    opacity: 0;
    animation: transitright 0.4s ease-in-out;
    animation-fill-mode: forwards;
    padding: 0 5px;
  }
  .panel {
    border: 1px solid #236bb3;
    background: white;
    width: 230px;
    min-width: 230px;
    .icon-desc {
      height: 67px;
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: flex-start;
      text-align: left;
      padding: 16px 10px;
      border-bottom: 1px solid #236bb3;
      opacity: 0;
      transition: opacity 0.4s ease-in-out;
      cursor: pointer;
      :hover {
        background: #236bb3;
        color: white;
      }
    }
  }
  :hover {
    width: 275px;
    .panel {
      .icon-desc {
        opacity: 1;
      }
    }
  }
  .adjust-top {
    margin-top: 100px;
    transition: margin-top 0.7s ease-in-out;
  }
  &.sticky-side {
    .adjust-top {
      margin-top: 80px;
    }
  }
`;

const Content = styled.div`
  margin-top: 0px;
  margin-left: 45px;
  padding: 16px;
  transition: margin-top 0.7s ease-in-out;
  z-index: 1;
  &.sticky-top {
    margin-top: 60px;
    padding-bottom: 60px;
  }
`;

function Home() {
  const _navigate = useNavigate();
  const dispatch = useAppDispatch();

  const popperState = useState<"notification" | "user" | null>(null);

  const navigate = (path: string) => {
    popperState[1](null);
    _navigate(path);
  };

  const retrieveData = useCallback(async () => {
    await dispatch(getNotifications());
  }, [dispatch]);

  useEffect(() => {
    let stompClient = subscribeNotification({
      accessToken: localStorage.getItem(localstoragetext.accesstoken),
      userid: localStorage.getItem(localstoragetext.userid),
      onReceive: (payload, type) => {
        console.debug("Received " + type + " notification. " + payload.message);
        toast(payload.message, { type: "success" });
        retrieveData();
      },
    });

    window.onscroll = function () {
      var header = document.getElementById("top-bar");
      var side = document.getElementById("side-bar");
      var content = document.getElementById("content");
      if (header && side && content) {
        var stickyTop = 60;
        if (window.pageYOffset + 1 > stickyTop) {
          header.classList.add("sticky-top");
          side.classList.add("sticky-side");
          content.classList.add("sticky-top");
        } else {
          header.classList.remove("sticky-top");
          side.classList.remove("sticky-side");
          content.classList.remove("sticky-top");
        }
      }
    };

    return function () {
      if (stompClient)
        stompClient.disconnect(() => {
          console.debug("Web Socket Disconnected.");
        });
    };
  }, [retrieveData]);

  return (
    <div>
      <AppNavBar className="flex-center-between" id={"top-bar"}>
        <div className={"flex-center animated"} style={{ flex: 1 }}>
          <Tooltip title="Home">
            <div
              className={"flex-center"}
              style={{ cursor: "pointer", height: 35, overflow: "hidden" }}
              onClick={() => navigate(buildpath.home)}
            >
              <img src={logo} width={120} alt={"liteonlogo"} />
            </div>
          </Tooltip>
        </div>
        <div className="flex-center-between animated" style={{ width: 150 }}>
          <Tooltip title="View real-time notification">
            <ReportProblemRoundedIcon
              htmlColor={"#236BB3"}
              fontSize={"large"}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(buildpath.notification)}
            />
          </Tooltip>
          <NotificationPopper state={popperState} />
          <UserPopper state={popperState} />
        </div>
      </AppNavBar>
      <SideNavBar id={"side-bar"}>
        <div className="flex-center flex-column animated adjust-top">
          <div className="py-3">
            <Tooltip title="Dashboard" placement="right" disableInteractive>
              <DashboardIcon
                htmlColor="#fff"
                fontSize={"large"}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(buildpath.dashboard)}
              />
            </Tooltip>
          </div>
          <div className="py-3">
            <Tooltip title="Manage users" placement="right" disableInteractive>
              <ManageAccountsIcon
                htmlColor="#fff"
                fontSize={"large"}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(buildpath.usermanagement)}
              />
            </Tooltip>
          </div>
          <div className="py-3">
            <Tooltip
              title="Real-time notification"
              placement="right"
              disableInteractive
            >
              <NotificationImportantIcon
                htmlColor="#fff"
                fontSize={"large"}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(buildpath.notification)}
              />
            </Tooltip>
          </div>
          <div className="py-3">
            <Tooltip title="API list" placement="right" disableInteractive>
              <ApiIcon
                htmlColor="#fff"
                fontSize={"large"}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(buildpath.api)}
              />
            </Tooltip>
          </div>
        </div>
        <div className="panel">
          <div className="flex-center flex-column adjust-top">
            <div
              className="icon-desc"
              onClick={() => navigate(buildpath.dashboard)}
            >
              {"Dashboard"}
            </div>
            <div
              className="icon-desc"
              onClick={() => navigate(buildpath.usermanagement)}
            >
              {"User Management"}
            </div>
            <div
              className="icon-desc"
              onClick={() => navigate(buildpath.notification)}
            >
              {"Real Time Notification"}
            </div>
            <div className="icon-desc" onClick={() => navigate(buildpath.api)}>
              {"API List"}
            </div>
          </div>
        </div>
      </SideNavBar>
      <Content id={"content"}>
        <Outlet />
      </Content>
    </div>
  );
}

export default Home;
