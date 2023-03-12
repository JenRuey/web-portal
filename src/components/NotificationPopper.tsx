import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import { Badge, Box, Fade, Popper } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import moment from "moment";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import styled from "styled-components";
import { getNotifications } from "../redux/actions/notificationActions";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import buildpath from "../constants/route-path";
import { useNavigate } from "react-router-dom";
import PublicIcon from "@mui/icons-material/Public";
import SecurityIcon from "@mui/icons-material/Security";

type NotificationPropperType = {
  state: [
    "notification" | "user" | null,
    Dispatch<SetStateAction<"notification" | "user" | null>>
  ];
};

const TruncNotification = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 10px;
  p {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 0;
    flex: 1;
    padding-left: 10px;
  }
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
`;

function NotificationPopper({
  state: [focus, setfocus],
}: NotificationPropperType) {
  const navigate = useNavigate();
  const notifapp = useAppSelector((x) => x.notification);
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [counter, setCounter] = useState<number>(0);
  const [previosread, setpreviosread] = useState<number | null>(
    notifapp.data.length
  );

  const retrieveData = useCallback(async () => {
    await dispatch(getNotifications());
  }, [dispatch]);

  useEffect(() => {
    retrieveData();
  }, [retrieveData]);

  const popupnotification = async (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousopen) => !previousopen);
    setfocus("notification");
    setCounter(0);
  };

  const canBeOpen = open && Boolean(anchorEl);
  const id = canBeOpen ? "transition-popper" : undefined;

  useEffect(() => {
    if (focus !== "notification") {
      setAnchorEl(null);
      setOpen(false);
    }
  }, [focus]);

  useEffect(() => {
    if (previosread === null || previosread === 0) {
      setCounter(0);
      setpreviosread(notifapp.data.length);
    } else {
      let increasecounter =
        notifapp.data.length - previosread > 0
          ? counter + (notifapp.data.length - previosread)
          : 0;
      setCounter(increasecounter);
      setpreviosread(notifapp.data.length);
    }
  }, [notifapp.data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <Tooltip title="View notification" disableInteractive={open}>
        <div aria-describedby={id} role={"button"} onClick={popupnotification}>
          <Badge badgeContent={open ? 0 : counter} color="primary">
            <CircleNotificationsIcon
              htmlColor={"#236BB3"}
              fontSize={"large"}
              style={{ cursor: "pointer" }}
            />
          </Badge>
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
                {notifapp.data.slice(0, 10).map((item, index) => {
                  return (
                    <TruncNotification key={"notif-" + index}>
                      <div>
                        {moment(item.datetime).format("DD MMM yyyy HH:mm")}
                      </div>
                      <p>
                        {item.user_id ? (
                          <SecurityIcon fontSize={"small"} />
                        ) : (
                          <PublicIcon fontSize={"small"} />
                        )}
                        {item.message}
                      </p>
                    </TruncNotification>
                  );
                })}
              </div>
              <div
                className="w-100 text-center"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(buildpath.notification)}
              >
                <ExpandMoreIcon />
              </div>
            </Box>
          </Fade>
        )}
      </Popper>
    </div>
  );
}

export default NotificationPopper;
