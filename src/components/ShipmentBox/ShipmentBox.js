import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import React, { Component } from "react";
import ShipmentBoxItem from "./ShipmentBoxItem/ShipmentBoxItem";

class ShipmentBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      isDeletingContainerItem: false,
      deletingItemKey: "",
    };
  }

  hideModal() {
    this.setState({
      isModalVisible: false,
    });
  }

  showModal() {
    this.setState({
      isModalVisible: true,
    });
  }

  handleDeleteBox(shipmentContainerKey) {
    this.props.deleteContainer(shipmentContainerKey);
    this.hideModal();
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
    return (
      <Box mr={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.showModal()}
        >
          <Box>
            <Box>Box {this.props.ContainerNo}</Box>
            {this.props.ContainerDetails.ContainerDetail &&
            this.props.ContainerDetails.ContainerDetail.length > 0 ? (
              <Box>
                Items: {this.props.ContainerDetails.ContainerDetail.length}
              </Box>
            ) : (
              <Box>Items: 0</Box>
            )}
          </Box>
        </Button>

        {this.state.isModalVisible ? (
          <Dialog
            open={this.state.isModalVisible}
            onClose={this.hideModal.bind(this)}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title" align="center">
              Box No. {this.props.ContainerNo}
            </DialogTitle>
            <DialogContent>
              {this.props.ContainerDetails.ContainerDetail &&
                this.props.ContainerDetails.ContainerDetail.map(
                  (containerItem, index) => {
                    return (
                      <ShipmentBoxItem
                        key={index}
                        {...this.props}
                        {...containerItem}
                        deleteContainer={this.props.deleteContainer}
                        deleteContainerItem={this.props.deleteContainerItem}
                        ShipmentContainerKey={this.props.ShipmentContainerKey}
                      />
                    );
                  }
                )}
            </DialogContent>
            <DialogActions>
              <Button onClick={this.hideModal.bind(this)} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() =>
                  this.handleDeleteBox(this.props.ShipmentContainerKey)
                }
                variant="contained"
                color="primary"
              >
                Delete Box
              </Button>
            </DialogActions>
          </Dialog>
        ) : null}
      </Box>
    );
  }
}

export default ShipmentBox;
