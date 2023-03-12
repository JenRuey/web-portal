import { Box, Grid, Typography } from "@mui/material";

function APIList() {
  return (
    <Grid container spacing={2} columns={12}>
      <Grid item xs={6}>
        <Box sx={{ my: 4 }}>
          {Array(100)
            .fill(undefined)
            .map(() => {
              return (
                <Typography variant="h4" component="h1" gutterBottom>
                  Material UI Create React App example in APIList
                </Typography>
              );
            })}
        </Box>
      </Grid>
      <Grid item xs={4}></Grid>
    </Grid>
  );
}

export default APIList;
