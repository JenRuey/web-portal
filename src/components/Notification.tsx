import PublicIcon from "@mui/icons-material/Public";
import SecurityIcon from "@mui/icons-material/Security";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";
import { Breadcrumbs, Grid, Link, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Tooltip from "@mui/material/Tooltip";
import moment from "moment";
import { useCallback, useEffect } from "react";
import buildpath from "../constants/route-path";
import { getNotifications } from "../redux/actions/notificationActions";
import { useAppDispatch, useAppSelector } from "../redux/hook";

function Notification() {
  const dispatch = useAppDispatch();
  const notifapp = useAppSelector((x) => x.notification);

  const retrieveData = useCallback(async () => {
    await dispatch(getNotifications());
  }, [dispatch]);

  useEffect(() => {
    retrieveData();
  }, [retrieveData]);

  return (
    <Grid container spacing={2} columns={12}>
      <Grid item xs={12}>
        <div role="presentation">
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href={buildpath.home}>
              {"Home"}
            </Link>
            <Link
              underline="hover"
              color="text.primary"
              href={buildpath.notification}
              aria-current="page"
            >
              {"Real-time notification"}
            </Link>
          </Breadcrumbs>
        </div>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h4" component="h1" gutterBottom>
          {"REAL TIME NOTIFICATION"}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Timeline>
          {notifapp.data.length > 0 ? (
            notifapp.data.map((item, index) => {
              return (
                <TimelineItem key={"msg-" + index}>
                  <TimelineOppositeContent color="text.secondary">
                    <div>{moment(item.datetime).format("D MMM YYYY")}</div>
                    <div>{moment(item.datetime).format("hh:mm A")}</div>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <Tooltip title={item.user_id ? "private" : "public"}>
                      <TimelineDot
                        color={item.user_id ? "secondary" : "primary"}
                        variant="outlined"
                      >
                        {item.user_id ? (
                          <SecurityIcon color={"secondary"} />
                        ) : (
                          <PublicIcon htmlColor="#236bb3" />
                        )}
                      </TimelineDot>
                    </Tooltip>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <div>{item.message}</div>
                  </TimelineContent>
                </TimelineItem>
              );
            })
          ) : (
            <Card variant="outlined" className={"p-3"}>
              {"No notification received yet."}
            </Card>
          )}
        </Timeline>
      </Grid>
    </Grid>
  );
}

export default Notification;
