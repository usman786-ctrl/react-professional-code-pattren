import React, { Component } from "react";
import {
  API_CONSTANTS,
  SHIPMENT_TYPE_NAMES_BY_NAME,
} from "../../config/config";
import { connect } from "react-redux";
import {
  Box,
  CircularProgress,
  Paper,
  CardActionArea,
} from "@material-ui/core";
import { getAllPicksTotals } from "../../actions/shipmentsTotals";

class ShipmentPicksInProgress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShipmentPicksInProgressTotalsLoading: true,
    };
  }

  async componentDidMount() {
    // get totals
    this.setState({
      isShipmentPicksInProgressTotalsLoading: true,
    });

    await this.props.getAllPicksTotals(
      API_CONSTANTS.ALL_PICKS.SHIPMENT_PICKS_IN_PROGRESS.NAME
    );

    this.setState({
      isShipmentPicksInProgressTotalsLoading: false,
    });
  }

  handleGetList(tab, type) {
    this.props.history.push({
      pathname: "/shipmentsList",
      state: {
        shipmentListPayload: {
          tab: tab,
          type: type,
        },
        statusDetails: {
          ...SHIPMENT_TYPE_NAMES_BY_NAME.SHIPMENT_PICKS_IN_PROGRESS,
        },
      },
    });
  }

  render() {
    return (
      <Paper elevation={3}>
        <CardActionArea>
          <Box
            p={2}
            textAlign="center"
            style={{ fontSize: "1.5em" }}
            disabled={
              !parseInt(this.props.shipmentPicksInProgressTotals) ||
              this.state.isShipmentPicksInProgressTotalsLoading
            }
            onClick={() =>
              this.handleGetList(
                API_CONSTANTS.ALL_PICKS.NAME,
                API_CONSTANTS.ALL_PICKS.SHIPMENT_PICKS_IN_PROGRESS.NAME
              )
            }
          >
            <Box mb={1}>Shipment Picks in Progress</Box>
            <Box minHeight="30px">
              {this.state.isShipmentPicksInProgressTotalsLoading ? (
                <CircularProgress size={24} />
              ) : (
                this.props.shipmentPicksInProgressTotals
              )}
            </Box>
          </Box>
        </CardActionArea>
      </Paper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    shipmentPicksInProgressTotals:
      state.AllPicksDetail.shipmentPicksInProgressTotals,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    getAllPicksTotals: (type) => dispatch(getAllPicksTotals(type)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShipmentPicksInProgress);
