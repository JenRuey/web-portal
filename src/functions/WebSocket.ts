import { toast } from "react-toastify";
import SockJS from "sockjs-client";
import { Client, over } from "stompjs";
import { HistoryType } from "../redux/actions/stationActions";

type NotificationType = {
  message: String;
  userid: String;
};

type SubscribeNotificationType = {
  accessToken: string | null;
  userid: string | null;
  onReceive: (payload: NotificationType, type: "private" | "public") => void;
};

export function subscribeNotification({
  accessToken,
  userid,
  onReceive,
}: SubscribeNotificationType): Client | null {
  if (accessToken && userid) {
    try {
      var stompClient: Client = over(
        new SockJS(process.env.REACT_APP_WEB_SOCKET as string)
      );
      stompClient.debug = () => {};
      stompClient.connect({ Authorization: "Bearer " + accessToken }, () => {
        stompClient.subscribe("/public/notification", (payload) =>
          onReceive(JSON.parse(payload.body) as NotificationType, "public")
        );
        stompClient.subscribe(
          "/private/" + userid + "/notification",
          (payload) =>
            onReceive(JSON.parse(payload.body) as NotificationType, "private")
        );
      });
      return stompClient;
    } catch (err) {
      toast("Server Subscription failed.", { type: "error" });
      return null;
    }
  } else {
    toast("Server Subscription failed.", { type: "error" });
    return null;
  }
}

type SubscribeTrendType = {
  accessToken: string | null;
  onReceive: (payload: HistoryType) => void;
};
export function subscribeTrend({
  accessToken,
  onReceive,
}: SubscribeTrendType): Client | null {
  if (accessToken) {
    try {
      var stompClient: Client = over(
        new SockJS(process.env.REACT_APP_WEB_SOCKET as string)
      );
      stompClient.debug = () => {};
      stompClient.connect({ Authorization: "Bearer " + accessToken }, () => {
        stompClient.subscribe("/public/trend", (payload) =>
          onReceive(JSON.parse(payload.body) as HistoryType)
        );
      });
      return stompClient;
    } catch (err) {
      toast("Server Subscription failed.", { type: "error" });
      return null;
    }
  } else {
    toast("Server Subscription failed.", { type: "error" });
    return null;
  }
}
