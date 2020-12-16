import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Modal,
  Radio,
  Typography,
} from "@material-ui/core";
import CloseRounded from "@material-ui/icons/CloseRounded";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  confirmShipment,
  getCarriersList,
  getShipmentsListForCarrier,
} from "../../actions/shipmentDetails";
import "./shipment.css";
import ShipOrder from "./shipOrder";
const leftTabMenu = ["Select Carrier", "Select Boxes"];

class Ship extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isWarningModalVisible: false,
      isConfirmationModalVisible: false,
      isConfirmingShipments: false,
      selectedStep: 1,
      selectedCarrier: "",
    };
  }

  componentDidMount() {
    const userDetails = localStorage.getItem("userDetails");
    if (!userDetails) {
      this.props.history.push("/login");
    }
    this.refreshData();

    // this.props.navigation.dangerouslyGetParent().handleRefresh = {
    //   ...this.props.navigation.dangerouslyGetParent().handleRefresh,
    //   "Ship": this.refreshData.bind(this)
    // }
  }

  refreshData() {
    console.log("-my api call-------");
    this.props.getCarriersList();
  }

  hideConfirmationModal() {
    this.setState({
      isConfirmationModalVisible: false,
    });
  }

  showConfirmationModal() {
    this.setState({
      isConfirmationModalVisible: true,
    });
  }

  hideWarningModal() {
    this.setState({
      isWarningModalVisible: false,
    });
  }

  showWarningModal() {
    this.setState({
      isWarningModalVisible: true,
    });
  }

  handleConfirm() {
    // check if all shipments are checked
    let isAllShipmentsChecked = true;

    this.props.shipments.forEach((shipment) => {
      if (!shipment.isCheckedForTracking) {
        isAllShipmentsChecked = false;
      }
    });

    console.log("-isAllShipmentsChecked--", isAllShipmentsChecked);
    if (isAllShipmentsChecked) {
      this.confirmShipments();
    } else {
      this.showWarningModal();
    }
  }

  handleWarningModalConfirm() {
    this.hideWarningModal();
    this.confirmShipments();
  }

  handleConfirmationModalClose() {
    this.hideConfirmationModal();
    const unconfirmedShipments = this.props.shipments.filter(
      (dt) => !dt.isConfirmed
    );
    if (unconfirmedShipments.length) {
      this.props.getShipmentsListForCarrier(this.state.selectedCarrier);
    } else {
      this.props.history.push("/");
    }
  }

  handleConfirmationModalRetry() {
    this.hideConfirmationModal();
    this.confirmShipments();
  }

  async confirmShipments() {
    this.setState({
      isConfirmingShipments: true,
    });

    const shipmentsToConfirm = this.getTrackedAndUnconfirmedShipments();

    for (let i = 0; i < shipmentsToConfirm.length; i++) {
      const shipment = shipmentsToConfirm[i];
      await this.props
        .confirmShipment(shipment.ShipmentKey)
        .catch((err) => null);
    }

    this.setState({
      isConfirmingShipments: false,
    });

    this.showConfirmationModal();
  }

  getTrackedShipments() {
    return this.props.shipments.filter((shipment) => {
      return shipment.isCheckedForTracking;
    });
  }

  getTrackedAndConfirmedShipments() {
    return this.props.shipments.filter((shipment) => {
      return shipment.isCheckedForTracking && shipment.isConfirmed;
    });
  }

  getTrackedAndUnconfirmedShipments() {
    return this.props.shipments.filter((shipment) => {
      return shipment.isCheckedForTracking && !shipment.isConfirmed;
    });
  }

  changeTabFromList = (text) => {
    const index = leftTabMenu.findIndex((res) => res == text);
    const changedStep = index + 1;
    if (changedStep < this.state.selectedStep) {
      this.setState((prevState) => ({
        ...prevState,
        selectedStep: changedStep,
      }));
    }
  };

  carrierStep = () => {
    return (
      <Box p={2} display="flex" flexDirection="column" justifyContent="center">
        {/* data list */}
        {this.props.carrierList &&
          this.props.carrierList.length > 0 &&
          this.props.carrierList.map((data) => {
            return this.carrierList(data);
          })}

        <Box>
          <Button
            disabled={!this.state.selectedCarrier}
            variant="contained"
            color="primary"
            style={{
              float: "right",
            }}
            onClick={() => {
              this.props.getShipmentsListForCarrier(this.state.selectedCarrier);
              this.setState((prevState) => ({
                ...prevState,
                selectedStep: 2,
              }));
            }}
          >
            Next
          </Button>
        </Box>
      </Box>
    );
  };

  carrierList = (data) => {
    return (
      <Box
        container
        spacing={2}
        display="flex"
        // justifyContent="center"
        alignItems="center"
        textAlign="left"
      >
        <Box width="50%" item flexGrow={1} mr={2} spacing={1}>
          {data.Scac}
        </Box>
        <Box item flexGrow={1} spacing={1} width="50%">
          <Radio
            checked={this.state.selectedCarrier == data.Scac}
            onClick={() => this.handleCheck(data.Scac)}
            className="orderCheckbox"
          />
        </Box>
      </Box>
    );
  };

  handleCheck = (key) => {
    this.setState((prevState) => ({
      ...prevState,
      selectedCarrier: key,
    }));
  };

  boxesStep = () => {
    return (
      <Box p={2} display="flex" flexDirection="column" justifyContent="center">
        <Box display="flex" alignItems="center" fontWeight="bold" px={3}>
          <Box mr={2} minWidth="50%">
            Order No
          </Box>
          <Box minWidth="50%">No Of Boxes</Box>
        </Box>

        {/* data list */}
        {this.props.shipments
          .filter((dt) => !dt.isConfirmed)
          .map((shipment) => {
            return <ShipOrder {...shipment} key={shipment.ShipmentKey} />;
          })}

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Button
            mr={2}
            variant="contained"
            color="primary"
            onClick={() => {
              this.props.history.push("/");
            }}
          >
            Cancel
          </Button>

          <Button
            // disabled={!this.state.stepTwoNextEnable}
            variant="contained"
            color="primary"
            onClick={() => {
              this.handleConfirm();
            }}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    );
  };

  goToCloseTab = () => {
    this.props.history.push("/");
  };

  render() {
    const confirmedShipmentsLength = this.getTrackedAndConfirmedShipments()
      .length;
    const trackedShipmentsLength = this.getTrackedShipments().length;

    console.log("--this.props.shipment--", this.props.shipments);
    console.log("--this.props.carrier--", this.props.carrierList);

    return (
      <Container
        style={{ height: "100%", paddingTop: "10px", paddingBottom: "30px" }}
      >
        <Grid container spacing={2} style={{ justifyContent: "space-around" }}>
          <IconButton
            aria-label="delete"
            style={{
              fontSize: "large",
              float: "right",
              marginTop: "-10px",
              marginLeft: "auto",
            }}
            onClick={this.goToCloseTab}
          >
            <CloseRounded fontSize="inherit" />
          </IconButton>
        </Grid>
        {!this.props.isLoading ? (
          this.state.isConfirmingShipments ? (
            <label>
              {confirmedShipmentsLength !== trackedShipmentsLength ? (
                <Box style={{ fontSize: 18 }}>Confirming Shipments...</Box>
              ) : null}
            </label>
          ) : (
            <Box height="100%">
              <Box borderBottom={1} mb={1}>
                <Typography variant="h5" align="center">
                  {/* Order No. {this.props.orderNo} */}
                  Shipping Box Tracking
                </Typography>
              </Box>
              <Box display="flex">
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  height="100%"
                  width="20%"
                >
                  <List>
                    {leftTabMenu.map((text, index) => (
                      <ListItem
                        button
                        key={text}
                        selected={this.state.selectedStep == index + 1}
                      >
                        {/* <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon> */}
                        <ListItemText
                          primary={text}
                          onClick={() => this.changeTabFromList(text)}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  height="100%"
                  // fullWidth="90%"
                  width="80%"
                >
                  {this.state.selectedStep == 1 && this.carrierStep()}
                  {this.state.selectedStep == 2 && this.boxesStep()}
                  {/* {this.state.selectedStep == 2 && this.addLocationStep()}
                        {this.state.selectedStep == 3 && this.finalStep()} */}
                </Box>
              </Box>
            </Box>
          )
        ) : null}

        {this.state.isModalVisible ? (
          <Dialog
            open={this.state.isModalVisible}
            onClose={this.hideModal.bind(this)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Do you want to save the changes ?"}
            </DialogTitle>
            <DialogActions>
              <Button onClick={this.handleBack.bind(this)} color="primary">
                No
              </Button>
              <Button
                onClick={this.handleSuspend.bind(this)}
                color="primary"
                autoFocus
              >
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        ) : null}

        {this.state.isConfirmationModalVisible ? (
          <Modal
            open={this.state.isConfirmationModalVisible}
            onClose={() => this.handleConfirmationModalClose()}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            <div
              style={{
                top: "50%",
                left: "48%",
                transform: "translate(-45%, -41%",
              }}
              className="modelPaper"
            >
              <h2 id="simple-modal-title">Confirmation</h2>
              <Box mb={3}>
                <Box style={{ fontSize: 18, marginBottom: 10 }}>
                  Confirmed: {confirmedShipmentsLength}
                </Box>
                <Box style={{ fontSize: 18 }}>
                  Failed: {trackedShipmentsLength - confirmedShipmentsLength}
                </Box>
              </Box>

              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                {confirmedShipmentsLength === trackedShipmentsLength ? (
                  <React.Fragment>
                    <div />
                    <Button
                      mr={2}
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        this.handleConfirmationModalClose();
                      }}
                    >
                      OK
                    </Button>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Button
                      mr={2}
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        this.handleConfirmationModalClose();
                      }}
                    >
                      Cancel
                    </Button>

                    <Button
                      disabled={
                        confirmedShipmentsLength === trackedShipmentsLength
                      }
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        this.handleConfirmationModalRetry();
                      }}
                    >
                      Re-Try
                    </Button>
                  </React.Fragment>
                )}
              </Box>
            </div>
          </Modal>
        ) : null}

        {this.state.isWarningModalVisible ? (
          <Modal
            open={this.state.isWarningModalVisible}
            onClose={() => this.hideWarningModal()}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            <div
              style={{
                top: "50%",
                left: "48%",
                transform: "translate(-45%, -41%",
              }}
              className="modelPaper"
            >
              <h2 id="simple-modal-title">Confirmation</h2>
              <p id="simple-modal-description">
                Not all shipments are selected. Press confirm to ship selected.
              </p>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Button
                  mr={2}
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    this.hideWarningModal();
                  }}
                >
                  Cancel
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    this.handleWarningModalConfirm();
                  }}
                >
                  Confirm
                </Button>
              </Box>
            </div>
          </Modal>
        ) : null}
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    // isLoading: state.AppDetail.isLoading,
    // selectedCarrier: state.ShipmentShipDetail.selectedCarrier,
    shipments: state.ShipmentDetail.shipments,
    carrierList: state.ShipmentDetail.carrierList,
    // isAllShipmentsUncheckForTracking: state.ShipmentShipDetail.isAllShipmentsUncheckForTracking,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    getShipmentsListForCarrier: (carrier) =>
      dispatch(getShipmentsListForCarrier(carrier)),
    confirmShipment: (shipmentKey) => dispatch(confirmShipment(shipmentKey)),
    getCarriersList: () => dispatch(getCarriersList()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Ship);
