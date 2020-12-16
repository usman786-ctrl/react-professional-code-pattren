import React, { Component } from "react";
import {
  API_CONSTANTS,
  SHIPMENT_TYPE_NAMES_BY_NAME,
} from "../../config/config";
import { connect } from "react-redux";
import {
  Box,
  CircularProgress,
  CardActionArea,
  Paper,
} from "@material-ui/core";
import { getAllShipmentsTotals } from "../../actions/shipmentsTotals";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { withTheme } from "@material-ui/core/styles";

class ShipmentsToPack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShipmentsToPackTotalsLoading: true,
      graphData: [
        {
          uv: 2000,
          pv: 2400,
          amt: 1200,
        },
        {
          uv: 3000,
          pv: 1398,
          amt: 2210,
        },
        {
          uv: 1200,
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
          uv: 2700,
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
      isShipmentsToPackTotalsLoading: true,
    });

    await this.props.getAllShipmentsTotals(
      API_CONSTANTS.ALL_SHIPMENTS.SHIPMENTS_TO_PACK.NAME
    );

    this.setState({
      isShipmentsToPackTotalsLoading: false,
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
          ...SHIPMENT_TYPE_NAMES_BY_NAME.SHIPMENTS_TO_PACK,
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
              !parseInt(this.props.shipmentsToPackTotals) ||
              this.state.isShipmentsToPackTotalsLoading
            }
            onClick={() =>
              this.handleGetList(
                API_CONSTANTS.ALL_SHIPMENTS.NAME,
                API_CONSTANTS.ALL_SHIPMENTS.SHIPMENTS_TO_PACK.NAME
              )
            }
          >
            <Box mb={1}>Shipments To Pack</Box>
            <Box>
              {this.state.isShipmentsToPackTotalsLoading && (
                <CircularProgress size={24} />
              )}

              <Box>
                <Box>{this.props.shipmentsToPackTotals}</Box>
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
    shipmentsToPackTotals: state.AllShipmentsDetail.shipmentsToPackTotals,
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
)(withTheme(ShipmentsToPack));
