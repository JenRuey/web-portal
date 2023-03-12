import { Animation } from "@devexpress/dx-react-chart";
import {
  ArgumentAxis,
  Chart,
  Legend,
  LineSeries,
  LineSeriesProps,
  ValueAxis,
} from "@devexpress/dx-react-chart-material-ui";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import _ from "lodash";
import moment from "moment";
import * as React from "react";

const Root = (props: Legend.RootProps) => (
  <Legend.Root
    {...props}
    sx={{
      display: "flex",
      margin: "auto",
      flexDirection: "row",
      marginTop: 10,
    }}
  />
);
const Label = (props: Legend.LabelProps) => (
  <Legend.Label sx={{ pt: 1, whiteSpace: "nowrap" }} {...props} />
);
const Item = (props: Legend.ItemProps) => (
  <Legend.Item sx={{ flexDirection: "column" }} {...props} />
);

const ValueLabel = (props: ValueAxis.LabelProps) => {
  const { text } = props;
  return <ValueAxis.Label {...props} text={`${text}kWh`} />;
};
const ArgumentLabel = (
  props: ArgumentAxis.LabelProps & { style?: React.CSSProperties }
) => {
  return (
    <ArgumentAxis.Label
      {...props}
      style={{
        ...props.style,
        writingMode: "vertical-rl",
      }}
    />
  );
};
const StyledChart = styled(Chart)(() => ({}));

type StationLineChartType = {
  data: Array<any>;
  chartLine: Array<LineSeriesProps>;
};

function StationLineChart({ data, chartLine }: StationLineChartType) {
  const [feq, setFeq] = React.useState<string>("d");
  const [dayInclude, setDayInclude] = React.useState<number>(7);
  const [chartData, setChartData] = React.useState<Array<any>>([]);

  React.useEffect(() => {
    let mindate = moment(
      moment().subtract(dayInclude, "days").format("yyyy-MM-DD")
    );
    let maxdate = moment(moment().format("yyyy-MM-DD"));
    let needed = _.filter(data, (o) => moment(o.date) >= mindate);
    let counterunit: "day" | "month" | "year" = "day";
    let feqformat = "DD MMM yyyy";
    if (feq === "m") {
      counterunit = "month";
      feqformat = "MMM yyyy";
    } else if (feq === "y") {
      counterunit = "year";
      feqformat = "yyyy";
    }

    try {
      let countdate = mindate;
      let valueArray = [];
      while (
        moment(moment(countdate).format(feqformat)) <=
        moment(moment(maxdate).format(feqformat))
      ) {
        let val =
          _.filter(
            needed,
            (o) =>
              moment(o.date).format(feqformat) === countdate.format(feqformat)
          ) || {};
        let obj: any = {};
        obj.date = countdate.format(feqformat);
        for (let evt of chartLine) {
          obj[evt.valueField as string] = _.sumBy(
            val,
            (o) => o[evt.valueField as string] || 0
          );
        }
        valueArray.push(obj);
        countdate.add(1, counterunit);
      }

      setChartData(valueArray);
    } catch (err) {
      console.debug(err);
    }
  }, [data, feq, dayInclude, chartLine]);
  return (
    <div className={"position-relative mt-3"}>
      <div className="flex-center-end">
        <FormControl>
          <InputLabel>{"Past"}</InputLabel>
          <Select
            value={dayInclude}
            label={"Past"}
            onChange={(o) => setDayInclude(o.target.value as number)}
          >
            <MenuItem value={7}>{"7 days"}</MenuItem>
            <MenuItem value={30}>{"30 days"}</MenuItem>
            <MenuItem value={365}>{"365 days"}</MenuItem>
          </Select>
        </FormControl>
        <FormControl className="ms-3">
          <InputLabel>{"Frequency"}</InputLabel>
          <Select
            value={feq}
            label={"Frequency"}
            onChange={(o) => setFeq(o.target.value)}
          >
            <MenuItem value={"d"}>{"Daily"}</MenuItem>
            <MenuItem value={"m"}>{"Monthly"}</MenuItem>
            <MenuItem value={"y"}>{"Yearly"}</MenuItem>
          </Select>
        </FormControl>
      </div>
      <Paper>
        <StyledChart data={chartData}>
          <ArgumentAxis labelComponent={ArgumentLabel} />
          <ValueAxis labelComponent={ValueLabel} />

          {chartLine.map((item, index) => {
            return <LineSeries key={"ls-" + index} {...item} />;
          })}

          <Legend
            position="bottom"
            rootComponent={Root}
            itemComponent={Item}
            labelComponent={Label}
          />
          <Animation />
        </StyledChart>
      </Paper>
    </div>
  );
}

export default StationLineChart;
