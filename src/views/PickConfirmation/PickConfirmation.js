import React, { Component } from "react";
// import styles from './PickConfirmation.styles';
import { connect } from "react-redux";
import {
  updateShipmentDetails,
  updateHoldLocation,
  resetShipmentDetailsState,
} from "../../actions/shipmentDetails";
// import ProcessUpdate from "../../components/ProcessUpdate/ProcessUpdate";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";
import ProcessUpdate from "../../components/ProcessUpdate/ProcessUpdate";

class PickConfirmation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: "",
      isLocationUpdated: false,
      isUpdatingShipmentDone: false,
      isUpdatingShipmentSucceed: false,
    };
  }

  componentDidMount() {
    const userDetails = localStorage.getItem("userDetails");
    if (!userDetails) {
      this.props.history.push("/login");
    }

    if (this.props.holdLocation) {
      this.setState({
        location: this.props.holdLocation,
      });
    }

    const shipmentKey = this.props.match.params.shipmentKey;

    if (!this.props.ShipmentLines?.ShipmentLine?.length > 0) {
      this.props.history.push(`/pickShipment/${shipmentKey}`);
    }
  }

  handleConfirm() {
    this.props
      .updateShipmentDetails()
      .then(() => {
        // shipment update succeed
        this.setState(
          {
            isUpdatingShipmentDone: true,
            isUpdatingShipmentSucceed: true,
          },
          async () => {
            this.props.resetShipmentDetailsState();
            await new Promise((res) => setTimeout(res, 500));
            this.props.history.push("/");
          }
        );
      })
      .catch(() => {
        // shipment update succeed
        this.setState(
          {
            isUpdatingShipmentDone: true,
            isUpdatingShipmentSucceed: false,
          },
          async () => {
            this.props.resetShipmentDetailsState();
            await new Promise((res) => setTimeout(res, 500));
            this.props.history.push("/");
          }
        );
      });
  }

  async handleSaveLocation() {
    if (
      this.state.location &&
      this.state.location !== this.props.holdLocation
    ) {
      this.setState({
        isLocationUpdated: false,
      });
      await new Promise((res) => setTimeout(res, 500));
      this.props.updateHoldLocation(this.state.location);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.holdLocation !== this.props.holdLocation) {
      this.setState({
        isLocationUpdated: true,
      });
    }
  }

  render() {
    return (
      <Container
        style={{ height: "100%", paddingTop: "10px", paddingBottom: "30px" }}
      >
        {this.state.isUpdatingShipmentDone ? (
          <ProcessUpdate
            isUpdateProcessDone={this.state.isUpdatingShipmentDone}
            isUpdateSucceed={this.state.isUpdatingShipmentSucceed}
          />
        ) : (
          <Box
            height="100%"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Box>
              <Box borderBottom={1} mb={1}>
                <Typography variant="h5" align="center">
                  Order Picking Confirmation
                </Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="center"
                flexDirection="column"
                alignItems="center"
              >
                <Box minWidth="50%" mb={2}>
                  <TextField
                    fullWidth
                    value={this.state.location}
                    variant="outlined"
                    placeholder="Enter Location Code"
                    margin="dense"
                    onChange={(e) =>
                      this.setState({ location: e.target.value })
                    }
                    inputProps={{
                      style: { textAlign: "center" },
                    }}
                  />
                </Box>

                <Box>
                  <Button
                    disabled={!this.state.location}
                    variant="contained"
                    color="primary"
                    onClick={() => this.handleSaveLocation()}
                  >
                    Save Location
                  </Button>
                </Box>

                {this.state.isLocationUpdated ? (
                  <Box mt={3} color="success.main">
                    <Typography>Location Updated!</Typography>
                  </Box>
                ) : null}
              </Box>
            </Box>

            {/* footer buttons */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box mr={2}>
                <Button variant="contained" color="primary" onClick={() => {}}>
                  Back
                </Button>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => this.handleConfirm()}
                >
                  Confirm
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

function mapDispatchToProps(dispatch) {
  return {
    updateHoldLocation: (location) => dispatch(updateHoldLocation(location)),
    updateShipmentDetails: () => dispatch(updateShipmentDetails()),
    resetShipmentDetailsState: () => dispatch(resetShipmentDetailsState()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PickConfirmation);
