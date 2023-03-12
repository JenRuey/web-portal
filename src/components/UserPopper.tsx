import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Box, Fade, Popper } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { localstoragetext } from "../constants/localstorage-text";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import buildpath from "../constants/route-path";
import { useNavigate } from "react-router-dom";
import { logout } from "../functions/misc";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

type UserPopperType = {
  state: [
    "notification" | "user" | null,
    Dispatch<SetStateAction<"notification" | "user" | null>>
  ];
};
function UserPopper({ state: [focus, setfocus] }: UserPopperType) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const popupuser = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
    setfocus("user");
  };

  const canBeOpen = open && Boolean(anchorEl);
  const id = canBeOpen ? "transition-popper" : undefined;

  useEffect(() => {
    if (focus !== "user") {
      setAnchorEl(null);
      setOpen(false);
    }
  }, [focus]);

  return (
    <div>
      <Tooltip title="View user account" disableInteractive={open}>
        <div aria-describedby={id} role={"button"} onClick={popupuser}>
          <AccountCircleIcon
            htmlColor={"#236BB3"}
            fontSize={"large"}
            style={{ cursor: "pointer" }}
          />
        </div>
      </Tooltip>
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        transition
        style={{ zIndex: 999 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Box
              sx={{
                border: 1,
                p: 1,
                bgcolor: "background.paper",
                maxWidth: 300,
                borderRadius: 2,
                borderColor: "#236BB3",
              }}
            >
              <div style={{ maxHeight: 300, overflow: "auto" }}>
                <div className="flex-center my-3">
                  <AccountBoxIcon fontSize={"small"} />
                  <div className={"ms-3"}>
                    {localStorage.getItem(localstoragetext.useremail)}
                  </div>
                </div>
                <hr />
                <div className="flex-center">
                  <Tooltip title={"Logout"}>
                    <LogoutIcon
                      fontSize={"small"}
                      className={"mx-3"}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setLogoutOpen(true);
                        setOpen(false);
                        setfocus(null);
                      }}
                    />
                  </Tooltip>
                  <Tooltip title={"User Management"}>
                    <SettingsIcon
                      fontSize={"small"}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        navigate(buildpath.usermanagement);
                        setfocus(null);
                      }}
                    />
                  </Tooltip>
                </div>
              </div>
            </Box>
          </Fade>
        )}
      </Popper>

      <Dialog
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm logout?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {
              "Logout action will erase all your login data and require you to login again."
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutOpen(false)}>No</Button>
          <Button
            onClick={() => {
              logout();
              window.location.href = buildpath.login;
            }}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default UserPopper;
