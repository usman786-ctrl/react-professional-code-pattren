import React, { Component } from 'react';

// import OrderSearch from '../../components/OrderSearch/OrderSearch';
// import { getAllPicksTotals } from "../../actions/shipmentsTotals";
import { API_CONSTANTS } from '../../config/config';
import { connect } from "react-redux";
import { Container, Box, Button, Typography, CircularProgress } from '@material-ui/core';
// import { resetShipmentDetailsState } from '../../actions/shipmentDetails';
// import { resetState } from '../../actions/shipmentsList';
import styles from "./AllPicks.styles";
import { withStyles } from '@material-ui/styles';
import { getAllPicksTotals } from '../../actions/shipmentsTotals';

class AllPicks extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isCustomerPicksTotalsLoading: true,
      isShipmentPicksTotalsLoading: true,
      isCustomerPicksInProgressTotalsLoading: true,
      isShipmentPicksInProgressTotalsLoading: true,
      backClickCount: 0,
      loading: true,
      currentPage: "Home",
    }
  }

  async componentDidMount() {
    // this.props.resetShipmentDetailsState();
    // this.props.resetState();

    // get totals
    Object.keys(API_CONSTANTS.ALL_PICKS).forEach(pickName => {
      if (pickName !== "NAME") {
        const casedPickName = pickName.split("_").map(word => {
          return word[0] + word.substr(1).toLowerCase();
        }).join("");

        let newState = {};
        newState[`is${casedPickName}TotalsLoading`] = false

        this.props.getAllPicksTotals(pickName)
          .then(() => {
            this.setState(newState)
          })
          .catch(() => {
            this.setState(newState)
          })
      }
    })
  }

  handleGetList(type) {
    this.props.history.push({
      pathname: "/shipmentsList",
      state: { 
        shipmentListPayload: {
          tab: API_CONSTANTS.ALL_PICKS.NAME, type: type
        }
       }
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <Box>
        {this.state.currentPage === "Home" &&
          <Box className={classes.container}>
            <Box className={classes.flowRow}>
              <Typography variant="h5">
                Customer Picks: {this.props.customerPicksTotals}
              </Typography>
              <div className={classes.wrapper}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={
                    !parseInt(this.props.customerPicksTotals) ||
                    this.state.isCustomerPicksTotalsLoading
                  }
                  onClick={() =>
                    this.handleGetList(
                      API_CONSTANTS.ALL_PICKS.CUSTOMER_PICKS.NAME
                    )
                  }
                >
                  Get List
              {this.state.isCustomerPicksTotalsLoading && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </Button>
              </div>
            </Box>

            <Box className={classes.flowRow}>
              <Typography variant="h5">
                Shipments Picks: {this.props.shipmentPicksTotals}
              </Typography>
              <div className={classes.wrapper}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={
                    !parseInt(this.props.shipmentPicksTotals) ||
                    this.state.isShipmentPicksTotalsLoading
                  }
                  onClick={() =>
                    this.handleGetList(
                      API_CONSTANTS.ALL_PICKS.SHIPMENT_PICKS.NAME
                    )
                  }
                >
                  Get List
              {this.state.isShipmentPicksTotalsLoading && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </Button>
              </div>
            </Box>

            <Box className={classes.flowRow}>
              <Typography variant="h5">
                Customer Picks in Progress:{" "}
                {this.props.customerPicksInProgressTotals}
              </Typography>
              <div className={classes.wrapper}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={
                    !parseInt(this.props.customerPicksInProgressTotals) ||
                    this.state.isCustomerPicksTotalsLoading
                  }
                  onClick={() =>
                    this.handleGetList(
                      API_CONSTANTS.ALL_PICKS.CUSTOMER_PICKS_IN_PROGRESS.NAME
                    )
                  }
                >
                  Get List
              {this.state.isCustomerPicksTotalsLoading && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </Button>
              </div>
            </Box>

            <Box className={classes.flowRow}>
              <Typography variant="h5">
                Shipment Picks in Progress:{" "}
                {this.props.shipmentPicksInProgressTotals}
              </Typography>
              <div className={classes.wrapper}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={
                    !parseInt(this.props.shipmentPicksInProgressTotals) ||
                    this.state.isShipmentPicksInProgressTotalsLoading
                  }
                  onClick={() =>
                    this.handleGetList(
                      API_CONSTANTS.ALL_PICKS.SHIPMENT_PICKS_IN_PROGRESS.NAME
                    )
                  }
                >
                  Get List
              {this.state.isShipmentPicksInProgressTotalsLoading && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </Button>
              </div>
            </Box>
          </Box>
        }
      </Box>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.AllPicksDetail,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAllPicksTotals: (type) => dispatch(getAllPicksTotals(type)),
    // resetShipmentDetailsState: () => dispatch(resetShipmentDetailsState()),
    // resetState: () => dispatch(resetState()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AllPicks));