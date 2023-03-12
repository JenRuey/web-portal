import { createSlice } from "@reduxjs/toolkit";
import { getStationData, StationInterface } from "../actions/stationActions";

// Define a type for the slice state
interface StationState {
  data: StationInterface | null;
}

// Define the initial state using that type
const initialState: StationState = {
  data: null,
};

export const stationSlice = createSlice({
  name: "station",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStationData.fulfilled, (state, { payload }) => {
      state.data = payload;
    });
  },
});

export default stationSlice;
