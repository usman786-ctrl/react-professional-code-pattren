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
  TextField,
  Typography,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CloseRounded from "@material-ui/icons/CloseRounded";
import React, { Component } from "react";
import PickOrder from "../../components/PickOrder/PickOrder";
import { isReadyForCustomerPick, getName } from "../../config/util";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

const STEPS = {
  PICK_ITEMS: { name: "Pick Items", funcName: "pickItemStep" },
  ADD_LOCATION: { name: "Add Location", funcName: "addLocationStep" },
  CONFIRMATION: { name: "Confirmation", funcName: "finalStep" },
};

const CUSTIMER_VERIFICATION_STEP = {
  name: "Customer Verification",
  funcName: "customerVerification",
};

class Pick extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isModalVisible: false,
      selectedStep: 1,
      location: "",
      displayLocation: "",
      isLocationUpdated: false,
      stepTwoNextEnable: false,
      prevUrl: "",
      leftTabMenu: Object.values(STEPS),
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

    if (
      this.props.isStepCompleted === true &&
      prevProps.isStepCompleted !== this.props.isStepCompleted
    ) {
      this.setState({
        leftTabMenu: this.state.leftTabMenu.filter(
          (dt) => dt.name === STEPS.PICK_ITEMS.name
        ),
        selectedStep: 1,
      });
    }

    if (
      this.props.isStepCompleted === false &&
      prevProps.isStepCompleted !== this.props.isStepCompleted
    ) {
      if (isReadyForCustomerPick(this.props.statusDetails?.NAME)) {
        this.setState({
          leftTabMenu: [{ ...CUSTIMER_VERIFICATION_STEP }].concat(
            Object.values(STEPS).filter(
              (dt) => dt.name !== STEPS.ADD_LOCATION.name
            )
          ),
          selectedStep: 1,
        });
      }
    }

    if (
      this.props.shipmentData &&
      prevProps.ShipmentLine !== this.props.ShipmentLine
    ) {
      if (!this.props.ShipmentLine.length) {
        return;
      }

      let isShipmentPickDone = true;

      this.props.ShipmentLine.map((shipmentLine) => {
        if (
          shipmentLine.Quantity !==
          shipmentLine.BackroomPickedQuantity + shipmentLine.ShortageQty
        ) {
          isShipmentPickDone = false;
        }
      });

      if (isShipmentPickDone !== this.props.shipmentData.isShipmentPickDone) {
        this.props.updateShipmentData({ isShipmentPickDone });
      }
    }
  }

  componentDidMount() {
    if (isReadyForCustomerPick(this.props.statusDetails?.NAME)) {
      this.setState({
        leftTabMenu: [{ ...CUSTIMER_VERIFICATION_STEP }].concat(
          Object.values(STEPS).filter(
            (dt) => dt.name !== STEPS.ADD_LOCATION.name
          )
        ),
      });
    }
    if (this.props.HoldLocation) {
      this.setState({
        location: this.props.HoldLocation,
      });
    }

    if (this.props.isStepCompleted || this.props.link.viewOnly === true) {
      this.setState({
        leftTabMenu: this.state.leftTabMenu.filter(
          (dt) => dt.name === STEPS.PICK_ITEMS.name
        ),
        selectedStep: 1,
      });
    }
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

  handleCancelPick() {
    if (this.props.isShipmentChanged) {
      this.alertToSaveChanges();
    } else {
      this.props.history.push("/");
    }
  }

  alertToSaveChanges() {
    this.showModal();
  }

  handleSuspend() {
    this.hideModal();
    this.props.onSuspendPicking();
  }

  handleVerificationTypeChange = (e) => {
    this.props.updateShipmentData({
      selectedVerificationType: e.target.value,
      noteText: `Order was picked by ${getName(
        this.props.BillToAddress
      )} using ID type ${e.target.value}`,
    });
  };

  customerVerification = () => {
    return (
      <Box
        style={{ minHeight: 300 }}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box display="flex" justifyContent="center" style={{ marginTop: 50 }}>
          <FormControl style={{ minWidth: 250 }}>
            <InputLabel id="demo-simple-select-label">
              Select ID Type
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={this.props.selectedVerificationType}
              onChange={this.handleVerificationTypeChange}
            >
              {this.props.customerVerificationCodes.map((dt) => (
                <MenuItem
                  key={dt.CodeShortDescription}
                  value={dt.CodeShortDescription}
                >
                  {dt.CodeShortDescription}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box display="flex" justifyContent="center" style={{ marginTop: 50 }}>
          <TextField
            style={{ width: "90%" }}
            label="Order Note"
            // variant="outlined"
            value={this.props.noteText}
            onChange={(e) => {
              this.props.updateShipmentData({
                noteText: e.target.value,
              });
            }}
          />
        </Box>

        {!this.props.isStepCompleted && (
          <Box display="flex">
            <Box mr={2} flexGrow={1}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={this.handleCancelPick.bind(this)}
              >
                Cancel Pick
              </Button>
            </Box>

            <Box flexGrow={1}>
              <Button
                // disabled={!this.props.selectedVerificationType}
                disabled={!this.props.noteText}
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
        )}
      </Box>
    );
  };

  pickItemStep = () => {
    return (
      <>
        <Box>
          {this.props.ShipmentLines?.ShipmentLine?.map((shipmentLine, idx) => {
            return (
              <PickOrder
                key={shipmentLine.ShipmentLineKey}
                {...shipmentLine}
                shortageCodes={this.props.shortageCodes}
                isStepCompleted={this.props.isStepCompleted}
                updateShipmentLine={(data) =>
                  this.props.updateShipmentLine(idx, data)
                }
                validateBarcode={this.props.validateBarcode}
              />
            );
          })}
        </Box>

        {!this.props.isStepCompleted && (
          <Box display="flex">
            <Box mr={2} flexGrow={1}>
              <Button
                disabled={!this.props.isShipmentChanged}
                fullWidth
                variant="contained"
                color="primary"
                onClick={this.handleSuspend.bind(this)}
              >
                Save For Later
              </Button>
            </Box>

            <Box mr={2} flexGrow={1}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={this.handleCancelPick.bind(this)}
              >
                Cancel Pick
              </Button>
            </Box>

            <Box flexGrow={1}>
              <Button
                disabled={!this.props.isShipmentPickDone}
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => {
                  this.setState((prevState) => ({
                    ...prevState,
                    selectedStep: this.state.selectedStep + 1,
                  }));
                }}
              >
                Next
              </Button>
            </Box>
          </Box>
        )}
      </>
    );
  };

  async handleSaveLocation() {
    console.log("-location--", this.state.location, this.props.HoldLocation);
    if (
      this.state.location &&
      this.state.location !== this.props.HoldLocation
    ) {
      console.log("--update location-----");
      this.setState(
        {
          isLocationUpdated: false,
          displayLocation: this.state.location,
        },
        () => {
          this.props.updateShipmentData({ HoldLocation: this.state.location });
          this.setState({
            location: "",
          });
        }
      );
    }
  }

  removeLocation = () => {
    this.setState({
      displayLocation: "",
      isLocationUpdated: false,
      stepTwoNextEnable: false,
    });
    this.props.updateShipmentData({ HoldLocation: "" });
  };

  hanldeLeftPanelClick = (data) => {
    console.log("-data-", data);
    // props.history.push(url)
    if (data && data.state) {
      this.props.history.push({
        pathname: data.url,
        state: data.state,
      });
    } else if (data && data.url) {
      this.props.history.push(data.url);
    }
  };

  keyPressHandler = (e, from) => {
    if (e.key == "Enter" && from == "LOCATION" && this.state.location) {
      this.handleSaveLocation();
    }
  };

  addLocationStep = () => {
    return (
      <>
        <Box minWidth="50%" mb={2}>
          <TextField
            fullWidth
            value={this.state.location}
            variant="outlined"
            placeholder="Enter Location Code"
            margin="dense"
            onChange={(e) => this.setState({ location: e.target.value })}
            onKeyPress={(e) => this.keyPressHandler(e, "LOCATION")}
            inputProps={{
              style: { textAlign: "center" },
            }}
          />
        </Box>

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Button
            mr={2}
            variant="contained"
            color="primary"
            onClick={() =>
              this.setState({
                selectedStep: 1,
              })
            }
          >
            Back
          </Button>

          <Button
            mr={2}
            disabled={!this.state.location}
            variant="contained"
            color="primary"
            onClick={() => this.handleSaveLocation()}
          >
            Save Location
          </Button>

          <Button
            // disabled={!this.state.stepTwoNextEnable}
            variant="contained"
            color="primary"
            onClick={() => {
              this.setState((prevState) => ({
                ...prevState,
                selectedStep: 3,
              }));
            }}
          >
            Next
          </Button>
        </Box>

        {this.state.isLocationUpdated ? (
          <Box mt={3} color="success.main" textAlign="center">
            <Typography>Location Updated!</Typography>
          </Box>
        ) : null}
        {this.state.isLocationUpdated && (
          <Box style={{ textAlign: "center", marginTop: "15px" }}>
            <Button mr={4} variant="outlined" color="primary">
              {this.state.displayLocation}
              <IconButton
                color="inherit"
                style={{ padding: "2px" }}
                onClick={() => this.removeLocation()}
              >
                <CloseRounded color="inherit" />
              </IconButton>
            </Button>
          </Box>
        )}
      </>
    );
  };

  changeTabFromList = (name) => {
    const index = this.state.leftTabMenu.findIndex((res) => res.name == name);
    const changedStep = index + 1;
    if (changedStep < this.state.selectedStep) {
      this.setState((prevState) => ({
        ...prevState,
        selectedStep: changedStep,
      }));
    }
  };

  finalStep = () => {
    return (
      <Box textAlign="right" marginTop="20px">
        <Button
          variant="contained"
          color="primary"
          onClick={this.props.onFinishPicking}
        >
          Confirm
        </Button>
      </Box>
    );
  };

  render() {
    return this.props.ShipmentLines?.ShipmentLine?.length ? (
      <Container
        style={{
          height: "100%",
          paddingTop: "10px",
          paddingBottom: "30px",
        }}
      >
        <Box height="100%">
          <Box display="flex">
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              height="100%"
              width="20%"
            >
              <List>
                {this.props.link.viewOnly !== true &&
                  this.state.leftTabMenu.map((dt, index) => (
                    <ListItem
                      button
                      key={dt.name}
                      selected={this.state.selectedStep == index + 1}
                    >
                      {/* <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon> */}
                      <ListItemText
                        primary={dt.name}
                        onClick={() => this.changeTabFromList(dt.name)}
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
              <React.Fragment>
                {this.props.isStepCompleted ? (
                  <React.Fragment>{this.pickItemStep()}</React.Fragment>
                ) : (
                  <React.Fragment>
                    {this[
                      this.state.leftTabMenu[this.state.selectedStep - 1]
                        .funcName
                    ]()}
                  </React.Fragment>
                )}
              </React.Fragment>
            </Box>
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
              <Button
                onClick={() => this.props.history.goBack()}
                color="primary"
              >
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
    ) : null;
  }
}

export default Pick;
// PICK
// Containers: {}
// EnterpriseCode: "Matrix-R"
// ShipmentKey: "2020071311184687111"
// ShipmentLines: {,…}
// ShipmentNo: "100000202"

// PACK
// Containers: {
//   Container: []
// }
// EnterpriseCode: "Matrix-R"
// HoldLocation: "12321"
// ShipmentKey: "2020070808480573170"
// ShipmentLines: {,…}
// ShipmentNo: "100000065"
