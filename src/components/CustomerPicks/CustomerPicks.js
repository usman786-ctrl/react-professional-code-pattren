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
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { withTheme } from "@material-ui/core/styles";

class CustomerPicks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCustomerPicksTotalsLoading: true,
      graphData: [
        {
          uv: 4000,
          pv: 2400,
          amt: 2400,
        },
        {
          uv: 3000,
          pv: 1398,
          amt: 2210,
        },
        {
          uv: 2000,
          pv: 9800,
          amt: 2290,
        },
        {
          uv: 2780,
          pv: 3908,
          amt: 2000,
        },
        {
          uv: 1890,
          pv: 4800,
          amt: 2181,
        },
        {
          uv: 2390,
          pv: 3800,
          amt: 2500,
        },
        {
          uv: 3490,
          pv: 4300,
          amt: 2100,
        },
      ],
    };
  }

  async componentDidMount() {
    // get totals
    this.setState({
      isCustomerPicksTotalsLoading: true,
    });

    await this.props.getAllPicksTotals(
      API_CONSTANTS.ALL_PICKS.CUSTOMER_PICKS.NAME
    );

    this.setState({
      isCustomerPicksTotalsLoading: false,
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
          ...SHIPMENT_TYPE_NAMES_BY_NAME.CUSTOMER_PICKS,
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
              !parseInt(this.props.customerPicksTotals) ||
              this.state.isCustomerPicksTotalsLoading
            }
            onClick={() =>
              this.handleGetList(
                API_CONSTANTS.ALL_PICKS.NAME,
                API_CONSTANTS.ALL_PICKS.CUSTOMER_PICKS.NAME
              )
            }
          >
            <Box mb={1}>Customer Picks</Box>
            <Box>
              {this.state.isCustomerPicksTotalsLoading && (
                <CircularProgress size={24} />
              )}

              <Box>
                <Box>{this.props.customerPicksTotals}</Box>
                <ResponsiveContainer height={50}>
                  <AreaChart data={this.state.graphData}>
                    <Area
                      type="monotone"
                      dataKey="uv"
                      stroke={this.props.theme.palette.primary.dark}
                      strokeWidth={2}
                      fill={this.props.theme.palette.primary.main}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </Box>
        </CardActionArea>
      </Paper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    customerPicksTotals: state.AllPicksDetail.customerPicksTotals,
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
)(withTheme(CustomerPicks));
