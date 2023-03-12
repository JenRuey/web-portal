import { Grid, Typography } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { useCallback, useEffect } from "react";
import buildpath from "../constants/route-path";
import { userListing } from "../redux/actions/userActions";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import UserTable from "./UserTable";

function UserManagement() {
  const dispatch = useAppDispatch();
  const userapp = useAppSelector((x) => x.user);

  const retrieveData = useCallback(async () => {
    await dispatch(userListing());
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
              href={buildpath.usermanagement}
              aria-current="page"
            >
              {"User Management"}
            </Link>
          </Breadcrumbs>
        </div>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h4" component="h1" gutterBottom>
          {"USER MANAGEMENT"}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <UserTable data={userapp.userlist} />
      </Grid>
    </Grid>
  );
}

export default UserManagement;
