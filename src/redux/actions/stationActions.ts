import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { LoadingEvent } from "../../components/Loading";

type EventType = {
  tagname: string;
  location_id: number;
  description: string;
  alert_upper: number;
  alert_lower: number;
  unit: string;
};
type LocationType = {
  id: number;
  description: string;
};
export type HistoryType = {
  id: string;
  datetime: string;
  event_tagname: string;
  value: number;
};

export interface StationInterface {
  events: Array<EventType>;
  historyRecords: Array<HistoryType>;
  locations: Array<LocationType>;
}

export const getStationData = createAsyncThunk<StationInterface>(
  "station/data",
  async () => {
    LoadingEvent.fire(true);
    let resp = await axios.get(
      process.env.REACT_APP_API_URL + "/auth-station/data"
    );
    LoadingEvent.fire(false);

    return resp.data as StationInterface;
  }
);
