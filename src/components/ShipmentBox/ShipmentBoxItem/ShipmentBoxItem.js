import {
  Box,
  Card,
  CircularProgress,
  IconButton,
  Typography,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { withStyles } from "@material-ui/styles";
import React, { Component } from "react";
import styles from "./ShipmentBoxItem.styles";

class ShipmentBoxItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getShipmentLine(shipmentLineKey) {
    let shipmentLine = this.props.ShipmentLine?.find(
      (shipmentLine) => shipmentLine.ShipmentLineKey == shipmentLineKey
    );

    return shipmentLine || {};
  }

  async handleDeleteContainerItem(shipmentContainerKey, shipmentLineKey) {
    this.setState({
      isDeletingContainerItem: true,
      deletingItemKey: shipmentLineKey,
    });
    const container = this.props.Container?.find(
      (container) => container.ShipmentContainerKey === shipmentContainerKey
    );
    if (
      container &&
      container.ContainerDetails &&
      container.ContainerDetails.ContainerDetail.length === 1
    ) {
      this.props.deleteContainer(shipmentContainerKey);
    } else {
      await this.props.deleteContainerItem(
        shipmentContainerKey,
        shipmentLineKey
      );
    }

    this.setState({
      isDeletingContainerItem: false,
      deletingItemKey: "",
    });
  }

  render() {
    let itemDesc = this.getShipmentLine(this.props.ShipmentLineKey).ItemDesc;
    itemDesc = itemDesc ? itemDesc : "Description not found";
    const { classes } = this.props;

    return (
      <Box mb={2}>
        <Card variant="outlined">
          <Box
            px={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box className={classes.description} mr={2}>
              {itemDesc}
            </Box>
            <Box mr={2}>{Math.round(this.props.Quantity)}</Box>

            <Box>
              <IconButton
                component="span"
                disabled={this.state.isDeletingContainerItem}
                onClick={() =>
                  this.handleDeleteContainerItem(
                    this.props.ShipmentContainerKey,
                    this.props.ShipmentLineKey
                  )
                }
                variant="contained"
              >
                <Typography color="error">
                  {this.state.isDeletingContainerItem &&
                  this.state.deletingItemKey === this.props.ShipmentLineKey ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    <DeleteIcon color="inherit" fontSize="small" />
                  )}
                </Typography>
              </IconButton>
            </Box>
          </Box>
        </Card>
      </Box>
    );
  }
}

export default withStyles(styles)(ShipmentBoxItem);
