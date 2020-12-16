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
import { getAllShipmentsTotals } from "../../actions/shipmentsTotals";

class PackingInProgress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPackingInProgressTotalsLoading: true,
    };
  }

  async componentDidMount() {
    // get totals
    this.setState({
      isPackingInProgressTotalsLoading: true,
    });

    await this.props.getAllShipmentsTotals(
      API_CONSTANTS.ALL_SHIPMENTS.PACKING_IN_PROGRESS.NAME
    );

    this.setState({
      isPackingInProgressTotalsLoading: false,
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
          ...SHIPMENT_TYPE_NAMES_BY_NAME.PACKING_IN_PROGRESS,
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
              !parseInt(this.props.packingInProgressTotals) ||
              this.state.isPackingInProgressTotalsLoading
            }
            onClick={() =>
              this.handleGetList(
                API_CONSTANTS.ALL_SHIPMENTS.NAME,
                API_CONSTANTS.ALL_SHIPMENTS.PACKING_IN_PROGRESS.NAME
              )
            }
          >
            <Box mb={1}>Packing in Progress</Box>
            <Box minHeight="30px">
              {this.state.isPackingInProgressTotalsLoading ? (
                <CircularProgress size={24} />
              ) : (
                this.props.packingInProgressTotals
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
    packingInProgressTotals: state.AllShipmentsDetail.packingInProgressTotals,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    getAllShipmentsTotals: (type) => dispatch(getAllShipmentsTotals(type)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PackingInProgress);
