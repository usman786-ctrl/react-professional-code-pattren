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
import { connect } from "react-redux";
import styles from "./PickOrder.styles";

class PickOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      barcode: "",
      isModalVisible: false,
      shortageQuantity: 0,
      selectedReason: "",
      pickError: "",
      isShortageQuantityChanged: false,
      isValidatingBarcode: false,
    };
  }

  componentDidMount() {
    if (
      this.props.shortageCodes &&
      this.props.shortageCodes.length > 0 &&
      this.props.shortageCodes[0].CodeShortDescription
    ) {
      this.setState({
        selectedReason: this.props.shortageCodes[0].CodeShortDescription,
      });
    }
    console.log(this.props, "this.props");
  }

  componentDidUpdate() {
    if (
      this.state.selectedReason === "" &&
      this.props.shortageCodes.length > 0 &&
      this.props.shortageCodes[0].CodeShortDescription
    ) {
      this.setState({
        selectedReason: this.props.shortageCodes[0].CodeShortDescription,
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
      isShortageQuantityChanged: false,
    });
  }

  showModal() {
    this.setState({
      shortageQuantity: this.props.ShortageQty,
      isModalVisible: true,
      isShortageQuantityChanged: false,
    });
  }

  handleBarcodeChange(barcode) {
    this.setState({
      barcode: barcode,
    });
  }

  keyPressHandler = (e, from) => {
    if (e.key == "Enter" && from == "PICK" && this.state.barcode) {
      this.handlePick();
    }
  };

  changeBarcode(barcode) {
    this.setState(
      {
        barcode: barcode,
      },
      () => {
        if (barcode) {
          this.handlePick();
        }
      }
    );
  }

  handlePick = () => {
    // if remaining is less than of equal to 0
    if (
      this.props.Quantity -
        (this.props.BackroomPickedQuantity + this.state.shortageQuantity) <=
      0
    ) {
      this.setState({
        pickError: "No item available to pick.",
      });
      return;
    }

    if (this.state.barcode !== "") {
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
              pickError: "Invalid Item !",
            });
          } else {
            this.props.updateShipmentLine({
              BackroomPickedQuantity: this.props.BackroomPickedQuantity + 1,
            });

            this.setState({
              pickError: "",
              barcode: "",
            });
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
        pickError: "Please enter or scan SKU.",
      });
    }
  };

  incrementShortageQuantity() {
    if (
      this.props.Quantity -
        (this.props.BackroomPickedQuantity + this.state.shortageQuantity) >
      0
    ) {
      this.setState({
        shortageQuantity: this.state.shortageQuantity + 1,
        isShortageQuantityChanged: true,
      });
    }
  }

  decrementShortageQuantity() {
    if (this.state.shortageQuantity > 0) {
      this.setState({
        shortageQuantity: this.state.shortageQuantity - 1,
        isShortageQuantityChanged: true,
      });
    }
  }

  onSelectedReasonChange(e) {
    this.setState({
      selectedReason: e.target.value,
    });
  }

  updateShortageQuantity() {
    this.props.updateShipmentLine({
      ShortageQty: this.state.shortageQuantity,
      ShortageResolutionReason: this.state.selectedReason,
    });

    this.hideModal();
  }

  updatePicked(val) {
    this.props.updateShipmentLine({
      BackroomPickedQuantity: val,
    });
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
                {this.props.OrderLine?.ItemDetails?.PrimaryInformation
                  ?.ImageLocation ? (
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
                        <TextField
                          value={this.state.barcode}
                          variant="outlined"
                          placeholder="Scan or Enter SKU"
                          margin="dense"
                          fullWidth
                          onChange={(e) =>
                            this.handleBarcodeChange(e.target.value)
                          }
                          onKeyPress={(e) => this.keyPressHandler(e, "PICK")}
                        />
                      </Box>
                      <Box>
                        <Button color="primary">
                          <CropFreeIcon />
                        </Button>
                      </Box>
                    </Box>

                    {this.state.pickError ? (
                      <Box color="error.main" align="center" mb={2}>
                        <Typography variant="body1">
                          {this.state.pickError}
                        </Typography>
                      </Box>
                    ) : null}

                    <Box display="flex" alignItems="center" mr={10} mb={2}>
                      <Box mr={2} flexGrow={1}>
                        <Button
                          disabled={
                            this.props.Quantity -
                              (this.props.BackroomPickedQuantity +
                                this.props.ShortageQty) <=
                              0 || this.state.isValidatingBarcode
                          }
                          fullWidth
                          variant="contained"
                          color="primary"
                          onClick={() => this.handlePick()}
                        >
                          Pick
                          {this.state.isValidatingBarcode && (
                            <CircularProgress
                              size={24}
                              className={classes.buttonProgress}
                            />
                          )}
                        </Button>
                      </Box>
                      <Box flexGrow={1}>
                        <Button
                          disabled={
                            this.props.Quantity -
                              (this.props.BackroomPickedQuantity +
                                this.props.ShortageQty) <=
                            0
                          }
                          fullWidth
                          variant="contained"
                          color="primary"
                          onClick={this.showModal.bind(this)}
                        >
                          Short/Cancel
                        </Button>
                      </Box>
                    </Box>
                  </React.Fragment>
                )}

                <Box>
                  <Box mb={1} display="flex" alignItems="center">
                    <Typography style={{ fontWeight: "bold" }}>
                      Picked: {this.props.BackroomPickedQuantity}
                    </Typography>

                    {!this.props.isStepCompleted && (
                      <React.Fragment>
                        <Box mr={2} ml={3}>
                          <IconButton
                            className="shortageButton"
                            color="primary"
                            size="small"
                            component="span"
                            disabled={this.props.BackroomPickedQuantity <= 0}
                            onClick={() =>
                              this.updatePicked(
                                this.props.BackroomPickedQuantity - 1
                              )
                            }
                            variant="contained"
                          >
                            <RemoveIcon fontSize="large" />
                          </IconButton>
                        </Box>

                        <Typography variant="h5">
                          {this.props.BackroomPickedQuantity}
                        </Typography>

                        <Box ml={2}>
                          <IconButton
                            variant="outlined"
                            color="primary"
                            className="shortageButton"
                            size="small"
                            component="span"
                            disabled={
                              this.props.Quantity -
                                (this.props.BackroomPickedQuantity +
                                  this.props.ShortageQty) <=
                                0 || this.state.isValidatingBarcode
                            }
                            onClick={() =>
                              this.updatePicked(
                                this.props.BackroomPickedQuantity + 1
                              )
                            }
                          >
                            <AddIcon fontSize="large" />
                          </IconButton>
                        </Box>
                      </React.Fragment>
                    )}
                  </Box>
                  <Box mb={1}>
                    <Typography style={{ fontWeight: "bold" }}>
                      Short: {this.props.ShortageQty} (
                      {this.props.ShortageResolutionReason})
                    </Typography>
                  </Box>
                  <Box>
                    <Typography style={{ fontWeight: "bold" }}>
                      Remaining:{" "}
                      {this.props.Quantity -
                        (this.props.BackroomPickedQuantity +
                          this.props.ShortageQty)}
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
              Shortage Resolution
            </DialogTitle>
            <DialogContent>
              <Typography align="center">Shortage Quantity</Typography>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                px={4}
                my={3}
              >
                <Box mr={2}>
                  <IconButton
                    className="shortageButton"
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                    disabled={this.state.shortageQuantity <= 0}
                    onClick={() => this.decrementShortageQuantity()}
                    variant="contained"
                  >
                    <RemoveIcon fontSize="large" />
                  </IconButton>
                </Box>

                <Typography variant="h5">
                  {this.state.shortageQuantity}
                </Typography>

                <Box ml={2}>
                  <IconButton
                    variant="outlined"
                    color="primary"
                    className="shortageButton"
                    aria-label="upload picture"
                    component="span"
                    disabled={
                      this.props.Quantity -
                        (this.props.BackroomPickedQuantity +
                          this.state.shortageQuantity) <=
                      0
                    }
                    onClick={() => this.incrementShortageQuantity()}
                  >
                    <AddIcon fontSize="large" />
                  </IconButton>
                </Box>
              </Box>

              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box mr={2}>
                  <Typography>Reason</Typography>
                </Box>
                <Box>
                  <FormControl className={classes.formControl}>
                    <Select
                      value={this.state.selectedReason}
                      onChange={this.onSelectedReasonChange.bind(this)}
                    >
                      {this.props.shortageCodes.map((shortageCode) => {
                        return (
                          <MenuItem
                            value={shortageCode.CodeShortDescription}
                            key={shortageCode.CodeShortDescription}
                          >
                            {shortageCode.CodeShortDescription}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.hideModal.bind(this)} color="primary">
                Cancel
              </Button>
              <Button
                disabled={!this.state.isShortageQuantityChanged}
                onClick={() => this.updateShortageQuantity()}
                variant="contained"
                color="primary"
              >
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        ) : null}
      </Box>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(PickOrder));
