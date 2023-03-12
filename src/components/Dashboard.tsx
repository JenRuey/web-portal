import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import _ from "lodash";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { localstoragetext } from "../constants/localstorage-text";
import buildpath from "../constants/route-path";
import { subscribeTrend } from "../functions/WebSocket";
import {
  getStationData,
  StationInterface,
} from "../redux/actions/stationActions";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import StationLineChart from "./StationLineChart";
import { a11yProps, TabPanel } from "./TabComponents";

type TitleBoxType = {
  title: string;
  value: string;
};

const StyledTitleBox = styled.div`
  border: 1px solid #236bb3;
  padding: 8px;
  margin-right: 8px;
  height: 120px;
  width: 280px;
  position: relative;
  .title {
  }
  .value {
    margin-top: 20px;
    font-size: 30px;
    color: #236bb3;
    font-weight: bold;
  }
`;

function TitleBox({ title, value }: TitleBoxType) {
  return (
    <StyledTitleBox>
      <div className="title">{title}</div>
      <div className="value">{value}</div>
    </StyledTitleBox>
  );
}

function Dashboard() {
  const dispatch = useAppDispatch();
  const stationapp = useAppSelector((x) => x.station);

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const retrieveData = useCallback(async () => {
    await dispatch(getStationData());
  }, [dispatch]);

  useEffect(() => {
    let stompClient = subscribeTrend({
      accessToken: localStorage.getItem(localstoragetext.accesstoken),
      onReceive: (payload) => {
        console.debug(
          "Trend: " + payload.event_tagname + " : " + payload.value
        );
        retrieveData();
      },
    });

    retrieveData();

    return function () {
      if (stompClient)
        stompClient.disconnect(() => {
          console.debug("Web Socket Disconnected.");
        });
    };
  }, [retrieveData]);

  const reformatData = (data: StationInterface) => {
    console.debug(data);

    let chartLine = _.map(data.events, (o) => ({
      name: o.tagname,
      valueField: o.tagname,
      argumentField: "date",
    }));

    let chartData: Array<any> = [];
    for (let hr of _.filter(data.historyRecords, (o) =>
      _.some(chartLine, (o1) => o1.name === o.event_tagname)
    )) {
      let datetime = moment(hr.datetime).format("yyyy-MM-DD");
      let insertidx = _.findIndex(chartData, (o) => o.date === datetime);
      if (insertidx === -1) {
        chartData.push({ date: datetime, [hr.event_tagname]: hr.value });
      } else {
        let obj = { ...chartData[insertidx] };
        let currval = obj[hr.event_tagname] || 0;
        obj[hr.event_tagname] = currval + hr.value;
        chartData[insertidx] = obj;
      }
    }

    return {
      totalChargedEnergy: _.sumBy(data.historyRecords, (o) => o.value),
      totalRevenue: _.sumBy(data.historyRecords, (o) => o.value) * 0.007,
      totalChargedSessions: data.historyRecords.length,
      chartLine,
      chartData,
    };
  };

  let trendinfo = stationapp.data ? reformatData(stationapp.data) : null;
  console.debug(trendinfo);
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
              href={buildpath.dashboard}
              aria-current="page"
            >
              {"Dashboard"}
            </Link>
          </Breadcrumbs>
        </div>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Overview" {...a11yProps(0)} />
              <Tab label="Location Overview" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <div>
              {trendinfo && (
                <div>
                  <div className={"flex-center flex-wrap"}>
                    <TitleBox
                      title={"Total Charged Energy"}
                      value={trendinfo.totalChargedEnergy + "kWh"}
                    />
                    <TitleBox
                      title={"Total Revenue"}
                      value={"SGD " + trendinfo.totalRevenue}
                    />
                    <TitleBox
                      title={"Total Charged Sessions"}
                      value={trendinfo.totalChargedSessions.toString()}
                    />
                  </div>
                  <StationLineChart
                    chartLine={trendinfo.chartLine}
                    data={trendinfo.chartData}
                  />
                </div>
              )}
            </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            {stationapp.data && (
              <div>
                {stationapp.data.locations.map((item, index) => {
                  return (
                    <Accordion key={"accordion-loc-" + index}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{item.description}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>
                          {_.filter(
                            stationapp.data?.events,
                            (o) => o.location_id === item.id
                          ).map((evt, kevt) => {
                            let lastevt = _.sortBy(
                              _.filter(
                                stationapp.data?.historyRecords,
                                (o) => o.event_tagname === evt.tagname
                              ),
                              (o) => moment(o.datetime)
                            )[-1];
                            return (
                              <div
                                key={"accordion-loc-" + index + "-evt-" + kevt}
                                style={{ color: "#236bb3" }}
                              >
                                {evt.description +
                                  " - > last recorded (" +
                                  (lastevt ? lastevt.value : "_______") +
                                  evt.unit +
                                  ")"}
                              </div>
                            );
                          })}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </div>
            )}
          </TabPanel>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Dashboard;
