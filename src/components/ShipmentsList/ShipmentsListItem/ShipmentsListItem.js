import { Button, TableCell, TableRow } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import { withStyles } from "@material-ui/styles";
import React, { Component } from "react";
import { connect } from "react-redux";
import { addToLeftMenu } from "../../../actions/app";
import {
  API_CONSTANTS,
  SHIPMENT_TYPE,
  SHIPMENT_TYPE_NAMES_BY_NAME,
} from "../../../config/config";
import * as storeUtils from "../../../config/util";
import styles from "./ShipmentsListItem.styles";

class ShipmentsListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prevPage: 0,
      currentPage: 1,
      nextPage: 2,
      isLoading: true,
      tab: "",
      type: "",
    };
  }

  componentDidMount() {}

  handleAction(shipmentKey) {
    const deliveryMethod = this.props.DeliveryMethod;
    const status = this.props.Status;
    let url = "";
    const statusDetails = SHIPMENT_TYPE[deliveryMethod][status];
    console.log("deliveryMethod---", deliveryMethod, status);
    console.log("statusDetails---", statusDetails);

    if (statusDetails) {
      switch (statusDetails.NAME) {
        case SHIPMENT_TYPE_NAMES_BY_NAME.CUSTOMER_PICKS.NAME:
        case SHIPMENT_TYPE_NAMES_BY_NAME.CUSTOMER_PICKS_IN_PROGRESS.NAME:
        case SHIPMENT_TYPE_NAMES_BY_NAME.SHIPMENTS_TO_PACK.NAME:
        case SHIPMENT_TYPE_NAMES_BY_NAME.PACKING_IN_PROGRESS.NAME:
        case SHIPMENT_TYPE_NAMES_BY_NAME.SHIPMENT_PICKS.NAME:
        case SHIPMENT_TYPE_NAMES_BY_NAME.SHIPMENT_PICKS_IN_PROGRESS.NAME:
        case SHIPMENT_TYPE_NAMES_BY_NAME.READY_FOR_CUSTOMER_PICK.NAME:
          // visit shipment detail page
          this.props.history.push({
            pathname: `/shipments/${shipmentKey}`,
            state: {
              statusDetails,
              OrderNo: this.props.ShipmentLines?.ShipmentLine?.[0]?.OrderNo,
            },
          });
          break;

        case SHIPMENT_TYPE_NAMES_BY_NAME.SHIPMENTS_TO_SHIP.NAME:
          url = `/startShip`;

          const payload = {
            OrderNo: this.props.ShipmentLines.ShipmentLine[0].OrderNo,
            shipmentKey: shipmentKey,
            url: url,
          };
          const lastActiveList = {
            shipmentListPayload: this.props.shipmentListPayload,
            url: this.props.location,
          };
          this.props.addToLeftMenu(payload, lastActiveList);
          this.props.history.push(`/startShip`);
          break;

        default:
          this.props.history.push({
            pathname: `/shipments/${shipmentKey}`,
            state: {
              statusDetails: { STATUS: status },
              viewOnly: true,
              OrderNo: this.props.ShipmentLines?.ShipmentLine?.[0]?.OrderNo,
            },
          });
          break;
      }
    } else {
      this.props.history.push({
        pathname: `/shipments/${shipmentKey}`,
        state: {
          statusDetails: { STATUS: status },
          OrderNo: this.props.ShipmentLines?.ShipmentLine?.[0]?.OrderNo,
          viewOnly: true,
        },
      });
    }
  }

  getActionText = (deliveryMethod, status) => {
    let actionText = "";

    if (deliveryMethod && status) {
      Object.keys(API_CONSTANTS.ALL_PICKS).forEach((pickType) => {
        if (
          deliveryMethod ===
            API_CONSTANTS.ALL_PICKS[pickType].DELIVERY_METHOD &&
          API_CONSTANTS.ALL_PICKS[pickType].STATUS === status
        ) {
          actionText = API_CONSTANTS.ALL_PICKS[pickType].ACTION_TEXT;
        }
      });

      if (!actionText) {
        Object.keys(API_CONSTANTS.ALL_SHIPMENTS).forEach((pickType) => {
          if (
            deliveryMethod ===
              API_CONSTANTS.ALL_SHIPMENTS[pickType].DELIVERY_METHOD &&
            API_CONSTANTS.ALL_SHIPMENTS[pickType].STATUS === status
          ) {
            actionText = API_CONSTANTS.ALL_SHIPMENTS[pickType].ACTION_TEXT;
          }
        });
      }
    }

    return actionText;
  };

  handleChange = () => {
    if (this.props && this.props.ShipmentKey) {
      this.props.handleCheck(this.props.ShipmentKey);
    }
  };

  isChecked = () => {
    let isChecked = false;
    if (this.props.ShipmentKey) {
      const index = this.props.printSelected.findIndex(
        (res) => res == this.props.ShipmentKey
      );
      if (index == -1) {
        isChecked = false;
      } else {
        isChecked = true;
      }
    }
    return isChecked;
  };

  render() {
    const { classes } = this.props;
    const actionText = this.getActionText(
      this.props.DeliveryMethod,
      this.props.Status
    );

    return (
      <TableRow>
        <TableCell>
          <Checkbox
            checked={this.isChecked()}
            onChange={this.handleChange}
            name="checkedB"
            color="primary"
          />
        </TableCell>
        <TableCell component="th" scope="row">
          {this.props.ShipmentLines.ShipmentLine[0].OrderNo}
        </TableCell>
        <TableCell align="center">{this.props.ShipmentNo}</TableCell>
        <TableCell align="center">
          {this.props.ShipmentLines.ShipmentLine[0].OrderLine.AllocationDate}
        </TableCell>
        <TableCell align="center">
          {storeUtils.getStatusDescription(
            this.props.Status,
            this.props.DeliveryMethod
          )}
        </TableCell>
        <TableCell align="center">
          {Math.round(this.props.TotalNumOfPickableSKUs)}
        </TableCell>
        <TableCell align="right">
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.handleAction(this.props.ShipmentKey)}
          >
            {actionText || "View"}
          </Button>
        </TableCell>
      </TableRow>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.ShipmentsListDetail,
    ...state.ShipmentDetail,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    addToLeftMenu: (payload, lastActiveList) =>
      dispatch(addToLeftMenu(payload, lastActiveList)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ShipmentsListItem));
