import React, { Component } from 'react';
import { Box, TextField, Card, Button } from '@material-ui/core';
import CropFreeIcon from "@material-ui/icons/CropFree";

class BoxTrackingInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trackingNo: ''
    }
  }

  componentDidMount() {
    this.setState({
      trackingNo: this.props.TrackingNo
    })
  }

  handleBarcodeChange(barcode) {
    this.setState({
      trackingNo: barcode
    })
  }

  handleBarcodeScanButton() {
    this.props.navigation.navigate("Barcode Reader", {
      handleBarcodeChange: this.handleBarcodeChange.bind(this)
    });
  }

  onSelectedBoxChange(value) {
    this.setState({
      selectedBoxShipmentContainerKey: value
    });
  }

  handleTrackingNoChange(trackingNo) {
    this.setState({
      trackingNo: trackingNo
    });
    this.props.handleChangeTrackingNumber(this.props.ShipmentContainerKey, trackingNo)
  }

  render() {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        mb={2}
      >
        <Box mr={2}>
          <Card>
            <Box px={2} py={1} align="center">
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
          </Card>
        </Box>

        <Box minWidth="50%">
          <TextField
            fullWidth
            value={this.state.trackingNo}
            variant="outlined"
            placeholder="Enter/Scan Tracking No"
            margin="dense"
            onChange={e => this.handleTrackingNoChange(e.target.value)}
          />
        </Box>

        <Box>
          <Button color="primary">
            <CropFreeIcon />
          </Button>
        </Box>
      </Box>
    );
  }
}

export default BoxTrackingInput;