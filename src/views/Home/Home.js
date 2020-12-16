import React from "react";
import Box from "@material-ui/core/Box";
import Store from '@material-ui/icons/Store';
import LocalShipping from '@material-ui/icons/LocalShipping';
import Cached from '@material-ui/icons/Cached';
import Typography from "@material-ui/core/Typography";
import { Grid, Paper } from "@material-ui/core";
import CustomerPicks from "../../components/CustomerPicks/CustomerPicks";
import ShipmentPicks from "../../components/ShipmentPicks/ShipmentPicks";
import CustomerPicksInProgress from "../../components/CustomerPicksInProgress/CustomerPicksInProgress";
import ShipmentPicksInProgress from "../../components/ShipmentPicksInProgress/ShipmentPicksInProgress";
import ShipmentsToPack from "../../components/ShipmentsToPack/ShipmentsToPack";
import ShipmentsToShip from "../../components/ShipmentsToShip/ShipmentsToShip";
import PackingInProgress from "../../components/PackingInProgress/PackingInProgress";
import { connect } from "react-redux";
import { API_CONSTANTS } from "../../config/config";

class Home extends React.Component {
  componentDidMount() {
    const userDetails = localStorage.getItem("userDetails");

    if (!userDetails) {
      this.props.history.push("/login");
    }

    // setInterval(
    //   function() {
    //     // if diff between authentication time and current time is
    //     // more than AUTH_TIMEOUT then redirect user to login page
    //     if (
    //       new Date().getTime() - this.props.authTime >
    //       API_CONSTANTS.AUTH_TIMEOUT
    //     ) {
    //       // redirect user to login page
    //       localStorage.clear();
    //       this.props.history.push("/login");
    //     }
    //   }.bind(this),
    //   API_CONSTANTS.AUTH_TIMEOUT
    // );
  }

  render() {
    return (
      <>
        <Grid container spacing={2} style={{ height: "100%" }}>
          <Grid
            item
            md={8}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <Box mb={2}>
              <Paper
                elevation={0}
                variant="outlined"
              >
                <Box
                  p={2}
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                >
                  <Box align="center" mb={4}>
                    <Typography variant="h6">All Picks <Store style={{fontSize: "28px",marginBottom: "-7px"}} /></Typography>
                  </Box>
                  <Box
                    container
                    spacing={2}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Box item flexGrow={1} mr={2}>
                      <CustomerPicks history={this.props.history} />
                    </Box>
                    <Box item flexGrow={1}>
                      <ShipmentPicks history={this.props.history} />
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Box>

            <Box>
              <Paper
                elevation={0}
                variant="outlined"
              >
                <Box
                  p={2}
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                >
                  <Box align="center" mb={4}>
                    <Typography variant="h6">All Shipments <LocalShipping style={{fontSize: "28px",marginBottom: "-7px"}} /></Typography>
                  </Box>
                  <Box
                    spacing={2}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Box flexGrow={1} mr={2}>
                      <ShipmentsToPack history={this.props.history} />
                    </Box>
                    <Box flexGrow={1}>
                      <ShipmentsToShip history={this.props.history} />
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Grid>

          <Grid item md={4}>
            <Paper elevation={0} variant="outlined" style={{ height: "100%" }}>
            <Box align="center">
                    <Typography variant="h6">Orders in Progress <Cached style={{fontSize: "28px",marginBottom: "-7px"}} /></Typography>
                  </Box>
              <Box p={2}>
                <Box mb={2}>
                  <CustomerPicksInProgress history={this.props.history} />
                </Box>
                <Box mb={2}>
                  <ShipmentPicksInProgress history={this.props.history} />
                </Box>
                <Box mb={2}>
                  <PackingInProgress history={this.props.history} />
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    authTime: state.AppDetail.authTime
  };
};

export default connect(mapStateToProps, null)(Home);
