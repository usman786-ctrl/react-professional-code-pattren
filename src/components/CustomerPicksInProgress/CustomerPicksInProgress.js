import React, { Component } from "react";
import { API_CONSTANTS } from "../../config/config";
import { connect } from "react-redux";
import {
  Box,
  CircularProgress,
  Paper,
  CardActionArea
} from "@material-ui/core";
import { getAllPicksTotals } from "../../actions/shipmentsTotals";

class CustomerPicksInProgress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCustomerPicksInProgressTotalsLoading: true
    };
  }

  async componentDidMount() {
    // get totals
    this.setState({
      isCustomerPicksInProgressTotalsLoading: true
    });

    await this.props.getAllPicksTotals(
      API_CONSTANTS.ALL_PICKS.CUSTOMER_PICKS_IN_PROGRESS.NAME
    );

    this.setState({
      isCustomerPicksInProgressTotalsLoading: false
    });
  }

  handleGetList(tab, type) {
    this.props.history.push({
      pathname: "/shipmentsList",
      state: {
        shipmentListPayload: {
          tab: tab,
          type: type
        }
      }
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
              !parseInt(this.props.customerPicksInProgressTotals) ||
              this.state.isCustomerPicksInProgressTotalsLoading
            }
            onClick={() =>
              this.handleGetList(
                API_CONSTANTS.ALL_PICKS.NAME,
                API_CONSTANTS.ALL_PICKS.CUSTOMER_PICKS_IN_PROGRESS.NAME
              )
            }
          >
            <Box mb={1}>Customer Picks in Progress</Box>
            <Box minHeight="30px">
              {this.state.isCustomerPicksInProgressTotalsLoading ? (
                <CircularProgress size={24} />
              ) : (
                this.props.customerPicksInProgressTotals
              )}
            </Box>
          </Box>
        </CardActionArea>
      </Paper>
    );
  }
}

const mapStateToProps = state => {
  return {
    customerPicksInProgressTotals:
      state.AllPicksDetail.customerPicksInProgressTotals
  };
};

function mapDispatchToProps(dispatch) {
  return {
    getAllPicksTotals: type => dispatch(getAllPicksTotals(type))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerPicksInProgress);
