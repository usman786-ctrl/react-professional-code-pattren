import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import ReactPDF from "@react-pdf/renderer";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  addItemToContainer,
  createNewContainer,
  deleteContainer,
  deleteContainerItem,
} from "../../actions/shipmentDetails";
import BoxTrackingInput from "../../components/BoxTrackingInput/BoxTrackingInput";
import ItemsSlip from "../../components/ItemsSlip/ItemsSlip";
import PackOrder from "../../components/PackOrder/PackOrder";
import ShipmentBox from "../../components/ShipmentBox/ShipmentBox";
import { savePdf } from "../../config/util";

const leftTabMenu = ["Box Items", "Add Tracking"];

class Packing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStep: 1,
      containersTrackingNo: {},
    };
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.HoldLocation != "" &&
      prevProps.HoldLocation !== this.props.HoldLocation
    ) {
      this.setState({
        isLocationUpdated: true,
        stepTwoNextEnable: true,
      });
    }
  }

  pickItemStep = () => {
    return (
      <>
        {" "}
        <Box>
          {this.props.ShipmentLines?.ShipmentLine?.map((shipmentLine, idx) => {
            return (
              <PackOrder
                key={shipmentLine.ShipmentLineKey}
                {...shipmentLine}
                Container={this.props.Container}
                updateShipmentLine={(data) =>
                  this.props.updateShipmentLine(idx, data)
                }
                isStepCompleted={this.props.isStepCompleted}
                validateBarcode={this.props.validateBarcode}
                createNewContainer={() =>
                  this.props.createNewContainer(this.props.ShipmentKey)
                }
                addItemToContainer={(...rest) =>
                  this.props.addItemToContainer(
                    this.props.Container,
                    this.props.ShipmentKey,
                    ...rest
                  )
                }
              />
            );
          })}
        </Box>
        <Box>
          <Box display="flex" mb={3}>
            {!this.props.isStepCompleted &&
              this.props.Containers?.Container?.map((container, index) => {
                return (
                  <ShipmentBox
                    {...container}
                    key={index}
                    ShipmentLine={this.props.ShipmentLine}
                    deleteContainerItem={(...rest) =>
                      this.props.deleteContainerItem(
                        this.props.ShipmentKey,
                        ...rest
                      )
                    }
                    deleteContainer={(...rest) =>
                      this.props.deleteContainer(
                        this.props.ShipmentKey,
                        ...rest
                      )
                    }
                    Container={this.props.Containers.Container}
                  />
                );
              })}
          </Box>

          {!this.props.isStepCompleted ? (
            <Box display="flex">
              <Box mr={2} flexGrow={1}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    this.props.onSuspendPacking(this.state.containersTrackingNo)
                  }
                >
                  Save For Later
                </Button>
              </Box>

              <Box mr={2} flexGrow={1}>
                <Button
                  // size="large"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => this.props.history.goBack()}
                >
                  Cancel Packing
                </Button>
              </Box>

              <Box flexGrow={1}>
                <Button
                  disabled={!this.props.isBoxingDone}
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => {
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
          ) : (
            <Box display="flex" justifyContent="flex-end">
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.onDownloadPackingSlip}
                >
                  PRINT SLIP
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </>
    );
  };

  changeTabFromList = (text) => {
    const index = leftTabMenu.findIndex((res) => res == text);
    const changedStep = index + 1;
    if (changedStep < this.state.selectedStep) {
      this.setState({
        selectedStep: changedStep,
      });
    }
  };

  handleChangeTrackingNumber(shipmentContainerKey, trackingNo) {
    let containersTrackingNo = this.state.containersTrackingNo;
    containersTrackingNo[shipmentContainerKey] = trackingNo;
    this.setState({
      containersTrackingNo: containersTrackingNo,
    });
  }

  scanItemStep = () => {
    return (
      <>
        <Box>
          <Box
            display="flex"
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
            mt={3}
          >
            {this.props.Containers?.Container?.map((container) => {
              return (
                <BoxTrackingInput
                  {...container}
                  key={container.ShipmentContainerKey}
                  handleChangeTrackingNumber={this.handleChangeTrackingNumber.bind(
                    this
                  )}
                />
              );
            })}
          </Box>
        </Box>

        {/* footer buttons */}
        <Box display="flex">
          <Box mr={2} flexGrow={1}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              // onClick={this.handleSuspendPacking.bind(this)}
              onClick={() => {
                this.setState((prevState) => ({
                  ...prevState,
                  selectedStep: 1,
                }));
              }}
            >
              Back
            </Button>
          </Box>

          <Box mr={2} flexGrow={1}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() =>
                this.props.onSuspendPacking(this.state.containersTrackingNo)
              }
            >
              Save For Later
            </Button>
          </Box>

          <Box flexGrow={1}>
            <Button
              disabled={!this.props.isBoxingDone}
              fullWidth
              variant="contained"
              color="primary"
              onClick={() =>
                this.props.onFinishPacking(this.state.containersTrackingNo)
              }
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </>
    );
  };

  onDownloadPackingSlip = () => {
    savePdf(
      <ItemsSlip {...this.props} name="Shipping Slip" />,
      `${this.props.OrderNo}.pdf`
    );
  };

  render() {
    return (
      <Container
        style={{ height: "100%", paddingTop: "10px", paddingBottom: "30px" }}
      >
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
            width="80%"
          >
            <React.Fragment>
              {this.props.isStepCompleted ? (
                <React.Fragment>{this.pickItemStep()}</React.Fragment>
              ) : (
                <React.Fragment>
                  {this.state.selectedStep == 1 && this.pickItemStep()}
                  {this.state.selectedStep == 2 && this.scanItemStep()}
                </React.Fragment>
              )}
            </React.Fragment>
          </Box>
        </Box>

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
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    containers: state.ShipmentDetail.containers,
    pdfOwenerDetail: state.ShipmentsListDetail.pdfOwenerDetail,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    createNewContainer: (shpKey) => dispatch(createNewContainer(shpKey)),
    addItemToContainer: (
      Container,
      shpKey,
      shipmentContainerKey,
      shipmentLineKey,
      quantity
    ) =>
      dispatch(
        addItemToContainer(
          Container,
          shpKey,
          shipmentContainerKey,
          shipmentLineKey,
          quantity
        )
      ),
    deleteContainerItem: (shipmentKey, shipmentContainerKey, shipmentLineKey) =>
      dispatch(
        deleteContainerItem(shipmentKey, shipmentContainerKey, shipmentLineKey)
      ),
    deleteContainer: (shipmentKey, shipmentContainerKey) =>
      dispatch(deleteContainer(shipmentKey, shipmentContainerKey)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Packing);
