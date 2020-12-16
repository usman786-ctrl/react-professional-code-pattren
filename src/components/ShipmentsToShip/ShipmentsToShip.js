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
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { withTheme } from "@material-ui/core/styles";

class ShipmentsToShip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShipmentsToShipTotalsLoading: true,
      graphData: [
        {
          uv: 500,
          pv: 2400,
          amt: 2400,
        },
        {
          uv: 2000,
          pv: 1398,
          amt: 2210,
        },
        {
          uv: 1500,
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
          uv: 2500,
          pv: 4300,
          amt: 2100,
        },
      ],
    };
  }

  async componentDidMount() {
    // get totals
    this.setState({
      isShipmentsToShipTotalsLoading: true,
    });

    await this.props.getAllShipmentsTotals(
      API_CONSTANTS.ALL_SHIPMENTS.SHIPMENTS_TO_SHIP.NAME
    );

    this.setState({
      isShipmentsToShipTotalsLoading: false,
    });
  }

  handleGetList(tab, type) {
    this.props.history.push({
      // pathname: "/shipmentsList",
      pathname: "/startShip",
      state: {
        shipmentListPayload: {
          tab: tab,
          type: type,
        },
        statusDetails: {
          ...SHIPMENT_TYPE_NAMES_BY_NAME.SHIPMENTS_TO_SHIP,
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
              !parseInt(this.props.shipmentsToShipTotals) ||
              this.state.isShipmentsToShipTotalsLoading
            }
            onClick={() =>
              this.handleGetList(
                API_CONSTANTS.ALL_SHIPMENTS.NAME,
                API_CONSTANTS.ALL_SHIPMENTS.SHIPMENTS_TO_SHIP.NAME
              )
            }
          >
            <Box mb={1}>Shipments To Ship</Box>
            <Box>
              {this.state.isShipmentsToShipTotalsLoading && (
                <CircularProgress size={24} />
              )}

              <Box>
                <Box>{this.props.shipmentsToShipTotals}</Box>
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
    shipmentsToShipTotals: state.AllShipmentsDetail.shipmentsToShipTotals,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    getAllShipmentsTotals: (type) => dispatch(getAllShipmentsTotals(type)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(ShipmentsToShip));
