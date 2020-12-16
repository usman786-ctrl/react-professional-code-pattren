import {
  Box,
  CircularProgress,
  ExpansionPanel,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import AddIcon from "@material-ui/icons/Add";
import CropFreeIcon from "@material-ui/icons/CropFree";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import RemoveIcon from "@material-ui/icons/Remove";
import { withStyles } from "@material-ui/styles";
import React, { Component } from "react";
import styles from "./PackOrder.styles";

class PackOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      barcode: "",
      isModalVisible: false,
      boxQuantity: 0,
      selectedBoxShipmentContainerKey: "",
      addToBoxError: "",
      isValidatingBarcode: false,
      isCreatingBox: false,
      validBarcodes: [],
    };
  }

  componentDidMount() {
    if (this.props.Container?.length > 0) {
      this.setState({
        selectedBoxShipmentContainerKey: this.props.Container[0]
          .ShipmentContainerKey,
      });
    }
  }

  toggleExpand() {
    this.setState({
      expanded: !this.state.expanded,
    });
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

  handleBarcodeChange(barcode) {
    this.setState({
      barcode: barcode,
    });
  }

  keyPressHandler = (e, from) => {
    if (e.key == "Enter" && from == "PACK" && this.state.barcode) {
      this.handleAddToBox();
    }
  };

  incrementQuantity() {
    this.setState({
      boxQuantity: this.state.boxQuantity + 1,
    });
  }

  decrementQuantity() {
    if (this.state.boxQuantity > 0) {
      this.setState({
        boxQuantity: this.state.boxQuantity - 1,
      });
    }
  }

  onSelectedBoxChange(value) {
    this.setState({
      selectedBoxShipmentContainerKey: value,
    });
  }

  handleAddToBox() {
    this.showModal();
    return;

    if (this.state.barcode !== "") {
      if (this.state.validBarcodes.includes(this.state.barcode)) {
        this.setState({
          barcode: "",
          addToBoxError: "",
        });

        this.showModal();
        return;
      }

      this.setState({
        isValidatingBarcode: true,
      });

      this.props
        .validateBarcode(this.state.barcode)
        .then((data) => {
          let isBarcodeValid = false;
          if (data.Translations && data.Translations.Translation) {
            data.Translations.Translation.forEach((item) => {
              if (item.ItemContextualInfo.ItemID === this.props.ItemID) {
                isBarcodeValid = true;
              }
            });
          }

          if (!isBarcodeValid) {
            this.setState({
              addToBoxError: "Invalid Item !",
            });
          } else {
            let validBarcodes = this.state.validBarcodes;
            validBarcodes.push(this.state.barcode);

            this.setState({
              barcode: "",
              addToBoxError: "",
              validBarcodes: validBarcodes,
            });

            this.showModal();
          }

          this.setState({
            isValidatingBarcode: false,
          });
        })
        .catch(() => {
          this.setState({
            isValidatingBarcode: false,
          });
        });
    } else {
      this.setState({
        addToBoxError: "Please enter or scan SKU.",
      });
    }
  }

  handleAddItemToBoxConfirm() {
    this.props.addItemToContainer(
      this.state.selectedBoxShipmentContainerKey,
      this.props.ShipmentLineKey,
      this.state.boxQuantity
    );
    this.setState({
      boxQuantity: 0,
    });
    this.hideModal();
  }

  async createNewBox() {
    this.setState({
      isCreatingBox: true,
    });

    try {
      await this.props.createNewContainer();

      if (this.props.Container?.length > 0) {
        const lastContainer = this.props.Container[
          this.props.Container.length - 1
        ];
        if (lastContainer.ShipmentContainerKey) {
          this.onSelectedBoxChange(lastContainer.ShipmentContainerKey);
        }
      }
    } catch (error) {
    } finally {
      this.setState({
        isCreatingBox: false,
      });
    }
  }

  getContainersDetail() {
    let containers = [];
    let totalQuantity = 0;

    if (this.props.Container?.length) {
      this.props.Container.forEach((container, containerIndex) => {
        if (container.ContainerDetails.ContainerDetail) {
          container.ContainerDetails.ContainerDetail.forEach((item) => {
            if (item.ShipmentLineKey === this.props.ShipmentLineKey) {
              containers.push({
                containerNo: container.ContainerNo,
                quantity: Math.round(item.Quantity),
              });
              totalQuantity += Math.round(item.Quantity);
            }
          });
        }
      });
    }

    return {
      containers,
      totalQuantity,
    };
  }

  updateQuantity(val) {
    this.props.updateShipmentLine({
      Quantity: val,
    });
  }

  getRemainingQuantity() {
    return (
      this.props.Quantity -
      this.props.ShortageQty -
      this.getContainersDetail().totalQuantity
    );
  }

  getQuantity() {
    return this.props.Quantity - this.props.ShortageQty;
  }

  render() {
    const { classes } = this.props;

    return (
      <Box mb={2}>
        <ExpansionPanel
          expanded={this.state.expanded}
          onChange={this.toggleExpand.bind(this)}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            className={classes.heading}
          >
            <Grid container justify="space-between">
              <Grid item>
                <Grid container>
                  <Box mr={2}>
                    <Typography>{this.props.ShipmentLineNo}.</Typography>
                  </Box>

                  <Box mr={2}>
                    <Typography>
                      {this.props.ItemDesc.length > 100
                        ? this.props.ItemDesc.substr(0, 100) + "..."
                        : this.props.ItemDesc}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Grid item>
                <Typography>Quantity: {this.props.Quantity}</Typography>
              </Grid>
            </Grid>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container>
              <Grid item xs={3}>
                {this.props.OrderLine.ItemDetails.PrimaryInformation
                  .ImageLocation ? (
                  <img
                    src={
                      this.props.OrderLine.ItemDetails.PrimaryInformation
                        .ImageLocation
                    }
                    style={{ width: "70%" }}
                  />
                ) : (
                  <img
                    src={require("../../assets/no-image.jpg")}
                    style={{ width: "70%" }}
                  />
                )}
              </Grid>

              <Grid item xs={9}>
                <Box mb={1}>
                  <Typography>{this.props.ItemDesc}</Typography>
                </Box>
                <Box mb={1}>
                  <Typography>Item ID: {this.props.ItemID}</Typography>
                </Box>
                <Box mb={1}>
                  <Typography>Quantity: {this.props.Quantity}</Typography>
                </Box>

                {!this.props.isStepCompleted && (
                  <React.Fragment>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Box flexGrow={1} mr={2}>
                        {/* <TextField
                          value={this.state.barcode}
                          variant="outlined"
                          placeholder="Scan or Enter SKU"
                          margin="dense"
                          fullWidth
                          onChange={(e) =>
                            this.handleBarcodeChange(e.target.value)
                          }
                          onKeyPress={(e) => this.keyPressHandler(e, "PACK")}
                        /> */}
                        <Button
                          disabled={
                            this.props.Quantity -
                              this.getContainersDetail().totalQuantity <=
                              0 || this.state.isValidatingBarcode
                          }
                          fullWidth
                          variant="contained"
                          color="primary"
                          onClick={() => this.handleAddToBox()}
                        >
                          Add to Box
                          {this.state.isValidatingBarcode && (
                            <CircularProgress
                              size={24}
                              className={classes.buttonProgress}
                            />
                          )}
                        </Button>
                      </Box>
                      <Box>
                        <Button color="primary">
                          <CropFreeIcon />
                        </Button>
                      </Box>
                    </Box>

                    {this.state.addToBoxError ? (
                      <Box color="error.main" align="center" mb={2}>
                        <Typography variant="body1">
                          {this.state.addToBoxError}
                        </Typography>
                      </Box>
                    ) : null}

                    {/* <Box display="flex" alignItems="center" mr={10} mb={2}>
                      <Button
                        disabled={
                          this.props.Quantity -
                            this.getContainersDetail().totalQuantity <=
                            0 || this.state.isValidatingBarcode
                        }
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={() => this.handleAddToBox()}
                      >
                        Add to Box
                        {this.state.isValidatingBarcode && (
                          <CircularProgress
                            size={24}
                            className={classes.buttonProgress}
                          />
                        )}
                      </Button>
                    </Box> */}
                  </React.Fragment>
                )}

                <Box>
                  {this.getContainersDetail().containers.map((container) => {
                    return (
                      <Box key={container.containerNo}>
                        <Typography style={{ fontWeight: "bold" }}>
                          Quantity Added to box {container.containerNo}:{" "}
                          {container.quantity}
                        </Typography>
                      </Box>
                    );
                  })}
                  <Box>
                    <Typography style={{ fontWeight: "bold" }}>
                      Remaining Quantity: {this.getRemainingQuantity()}
                    </Typography>
                    <Typography style={{ fontWeight: "bold" }}>
                      Shortage Quantity: {this.props.ShortageQty}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        {this.state.isModalVisible ? (
          <Dialog
            open={this.state.isModalVisible}
            onClose={this.hideModal.bind(this)}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title" align="center">
              Add Item to Box
            </DialogTitle>
            <DialogContent>
              <Typography>{this.props.ItemDesc}</Typography>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={4}
                pb={0}
              >
                <Box mr={2}>
                  <IconButton
                    className="shortageButton"
                    color="primary"
                    component="span"
                    disabled={this.state.boxQuantity <= 0}
                    onClick={() => this.decrementQuantity()}
                    variant="contained"
                  >
                    <RemoveIcon fontSize="large" />
                  </IconButton>
                </Box>

                <Typography variant="h5">{this.state.boxQuantity}</Typography>

                <Box ml={2}>
                  <IconButton
                    color="primary"
                    className="shortageButton"
                    component="span"
                    disabled={
                      this.state.boxQuantity >= this.getRemainingQuantity()
                    }
                    onClick={() => this.incrementQuantity()}
                  >
                    <AddIcon fontSize="large" />
                  </IconButton>
                </Box>
              </Box>

              <Box
                display="flex"
                alignItems="flex-end"
                justifyContent="center"
                my={5}
              >
                <Box mr={3}>
                  {this.props.Container?.length > 0 ? (
                    <Box mr={3}>
                      <Box mr={3} style={{ marginTop: "20px" }}>
                        <Typography
                          style={{ fontWeight: "bold", fontSize: 20 }}
                        >
                          Choose Box
                        </Typography>
                      </Box>
                      <FormControl className={classes.formControl}>
                        <Select
                          value={this.state.selectedBoxShipmentContainerKey}
                          onChange={(e) =>
                            this.onSelectedBoxChange(e.target.value)
                          }
                        >
                          {this.props.Container?.map((container, index) => {
                            return (
                              <MenuItem
                                value={container.ShipmentContainerKey}
                                key={container.ShipmentContainerKey}
                              >
                                {"Box " + container.ContainerNo}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Box>
                  ) : (
                    <Box>
                      <Typography>No box available. Please add one.</Typography>
                    </Box>
                  )}
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => this.createNewBox()}
                  disabled={this.state.isCreatingBox}
                >
                  Create New
                </Button>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.hideModal.bind(this)} color="primary">
                Cancel
              </Button>
              <Button
                disabled={
                  !this.state.selectedBoxShipmentContainerKey ||
                  this.state.boxQuantity === 0
                }
                onClick={() => this.handleAddItemToBoxConfirm()}
                variant="contained"
                color="primary"
              >
                Confirm Boxing
              </Button>
            </DialogActions>
          </Dialog>
        ) : null}
      </Box>
    );
  }
}

export default withStyles(styles)(PackOrder);
