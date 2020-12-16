import React, { Component } from "react";
import { Box, Typography } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";

class ProcessUpdate extends Component {
  render() {
    return (
      <Box
        height="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {this.props.isUpdateProcessDone ? (
          this.props.isUpdateSucceed ? (
            // if update succeed
            <Box align="center">
              <CheckCircleIcon
                style={{ fill: "green", height: "70px", width: "70px" }}
                fontSize="large"
              />
              <Typography variant="h5">Succeed!</Typography>
            </Box>
          ) : (
            // if update failed
            <Box align="center">
              <CancelIcon
                style={{ fill: "red", height: "70px", width: "70px" }}
                fontSize="large"
              />
              <Typography variant="h5">Failed!</Typography>
            </Box>
          )
        ) : null}
      </Box>
    );
  }
}

export default ProcessUpdate;
