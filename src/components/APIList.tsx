import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Button, Grid, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import moment from "moment";
import { localstoragetext } from "../constants/localstorage-text";
import buildpath from "../constants/route-path";
import { copyTextToClipboard } from "../functions/misc";

type APIType = {
  path: string;
  method: "post" | "get";
  body: any;
  description: string;
};

const apicreatedata = (): Array<APIType> => [
  {
    path: process.env.REACT_APP_API_URL + "/notification/send",
    method: "post",
    body: { message: "Test Public Message" },
    description: "To send real-time notification to all users whose login.",
  },
  {
    path: process.env.REACT_APP_API_URL + "/notification/private-send",
    method: "post",
    body: {
      message: "Test Private Message",
      userid: localStorage.getItem(localstoragetext.userid),
    },
    description: "To send real-time notification to specific user who login.",
  },
  {
    path:
      process.env.REACT_APP_API_URL + "/notification/station-trigger-record",
    method: "post",
    body: {
      datetime: moment().format("yyyy-MM-DDTHH:mm:ssZ"),
      event_tagname: "S01_Charged_Energry",
      value: 70,
    },
    description: "To send real-time update to dashboard trend.",
  },
];

function APIList() {
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
              href={buildpath.api}
              aria-current="page"
            >
              {"API list"}
            </Link>
          </Breadcrumbs>
        </div>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h4" component="h1" gutterBottom>
          {"API LIST"}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {apicreatedata().map((item, index) => {
          return (
            <Accordion key={"accordion-loc-" + index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <div className="flex-center flex-wrap">
                  <Typography>{item.path}</Typography>
                  <Button
                    variant="contained"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyTextToClipboard(item.path);
                    }}
                    className={"ms-3"}
                  >
                    {"Copy this path"}
                  </Button>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <div>
                    <div>{"Method : " + item.method}</div>

                    <div className="flex-center flex-wrap">
                      {"Sample Payload : " + JSON.stringify(item.body)}
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyTextToClipboard(JSON.stringify(item.body));
                        }}
                        className={"ms-3"}
                      >
                        {"Copy this body"}
                      </Button>
                    </div>
                    <div>{"Description : " + item.description}</div>
                  </div>
                </Typography>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Grid>
    </Grid>
  );
}

export default APIList;
