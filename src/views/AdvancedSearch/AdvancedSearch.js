import DateFnsUtils from "@date-io/date-fns";
import {
  Box,
  Button,
  Card,
  Checkbox,
  Fab,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Typography,
  withStyles,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";
import CloseRounded from "@material-ui/icons/CloseRounded";
import SearchIcon from "@material-ui/icons/Search";
import Tune from "@material-ui/icons/Tune";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import React, { Component } from "react";
import { connect } from "react-redux";
import { removeFromLeftTab, updateAdvanceLeftMenuUrl } from "../../actions/app";
import { resetShipmentsListState } from "../../actions/shipmentsList";
import ShipmentsList from "../../components/ShipmentsList/ShipmentsList";
import {
  ADVANCE_SEARCH_MENU_KEY,
  SHIPMENT_TYPE_NAMES_BY_NAME,
} from "../../config/config";
import styles from "./AdvancedSearch.styles";

const searchHandlerKey = [
  "firstName",
  "lastName",
  "customerEmail",
  "customerPhone",
  "isSearchReturn",
  "isCustomerPick",
  "isShipFromStore",
  "dateTo",
  "dateFrom",
];
const searchHandlerKeyStatus = [
  "readyForBackroomPick",
  "pickInProgress",
  "readyForPacking",
  "packingInProgress",
  "readyForShipping",
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

class AdvancedSearch extends Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.state = {
      filterModel: false,
      orderNo: "",

      // shipmentNo: "",
      customerPhone: "",
      firstName: "",
      lastName: "",
      customerEmail: "",
      dateFrom: null,
      dateTo: null,
      isSearchReturn: false,
      statuses: {
        readyForBackroomPick: false,
        pickInProgress: false,
        readyForPacking: false,
        packingInProgress: false,
        readyForShipping: false,
      },
      isCustomerPick: false,
      isShipFromStore: false,
      isSearched: false,
      isSearchBarExpanded: false,
      AdvancedSearchLeftTab: 4,
      AdvancedSearchRightTab: 8,
    };
  }

  componentDidMount = () => {
    const userDetails = localStorage.getItem("userDetails");
    console.log("-this.props.location---", this.props.location.search);
    const queryParams = new URLSearchParams(this.props.location.search);

    for (const queryParam of queryParams) {
      const key = queryParam[0];
      const value = queryParam[1];

      if (searchHandlerKeyStatus.includes(key)) {
        console.log("---kye---", key, "--value----", value, "---from status");
        this.setState((prevState) => ({
          ...prevState,
          statuses: {
            ...prevState.statuses,
            [key]: value,
          },
        }));
      } else {
        console.log("---kye---", key, "--value----", value);
        this.setState((prevState) => ({
          ...prevState,
          [key]: value,
        }));
      }
    }
    // this.handleSearch();
    if (!userDetails) {
      this.props.history.push("/login");
    }
  };

  componentDidUpdate = () => {
    if (
      this.props.advanceSearchFromHeader &&
      this.props.advanceSearchFromHeader !== this.state.orderNo
    ) {
      const value = this.props.advanceSearchFromHeader;
      this.setState({
        orderNo: value,
      });
      this.handleSearch();
    }
  };

  handleSearch = async () => {
    this.setState(
      {
        isSearched: false,
      },
      () => {
        this.setState({
          isSearched: true,
        });
      }
    );
  };

  handleExpandChange = () => {
    this.setState({
      isExpanded: !this.state.isExpanded,
    });
  };

  handleStatusChange = (type, e) => {
    let statuses = this.state.statuses;
    statuses[type] = e.target.checked;
    this.encodeQueryData(type, e.target.checked);
    this.setState({
      statuses,
    });
  };

  handleSearchPanelExpansion() {
    this.setState({
      isSearchBarExpanded: !this.state.isSearchBarExpanded,
    });
  }

  goToCloseTab = () => {
    const orderKey = ADVANCE_SEARCH_MENU_KEY;
    this.props.resetShipmentsListState();
    this.setState({
      isSearched: false,
    });
    this.props.removeFromLeftTab(orderKey);
    const index = this.props.leftMenuList.findIndex(
      (res) => res.OrderNo == orderKey
    );
    const newRoute = this.props.leftMenuList[index + 1];
    if (newRoute && newRoute.url) {
      this.hanldeLeftPanelClick(newRoute);
    } else {
      const firstRoute = this.props.leftMenuList[0];
      if (firstRoute && firstRoute.url && orderKey != firstRoute.OrderNo) {
        this.hanldeLeftPanelClick(firstRoute);
      } else {
        this.props.history.push("/");
      }
    }
  };

  removeAllFilter = () => {
    this.setState((prevState) => ({
      ...prevState,
      isSearchReturn: false,
      isCustomerPick: false,
      isShipFromStore: false,
      firstName: "",
      lastName: "",
      customerPhone: "",
      customerEmail: "",
      statuses: {
        readyForBackroomPick: false,
        pickInProgress: false,
        readyForPacking: false,
        packingInProgress: false,
        readyForShipping: false,
      },
      dateFrom: null,
      dateTo: null,
    }));
  };

  applyFilterChanges = () => {
    this.handleSearch();
    this.handleClickOpen();
    // this.handleSearchPanelExpansion();
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

  handleExpandChangeClick = () => {
    this.setState((prevState) => ({
      ...prevState,
      AdvancedSearchLeftTab: prevState.AdvancedSearchLeftTab == 4 ? 12 : 4,
      AdvancedSearchRightTab: prevState.AdvancedSearchLeftTab == 4 ? 0 : 8,
    }));
  };

  encodeQueryData(key, value) {
    if (this.props.leftMenuList && this.props.leftMenuList.length > 0) {
      const muLocalhostKey = "http:localhost:3000";
      const index = this.props.leftMenuList.findIndex(
        (res) => res.OrderNo == ADVANCE_SEARCH_MENU_KEY
      );
      const oldUrl = muLocalhostKey + this.props.leftMenuList[index].url;

      let urlParams = new URL(oldUrl);
      let data = {};
      searchHandlerKey.map((key) => {
        if (urlParams.searchParams.get(key)) {
          data[key] = urlParams.searchParams.get(key);
        }
      });

      searchHandlerKeyStatus.map((key) => {
        if (urlParams.searchParams.get(key)) {
          data[key] = urlParams.searchParams.get(key);
        }
      });

      // set current key value
      data[key] = value;
      let ret = "";
      Object.keys(data).map((key, index) => {
        ret = ret + key + "=" + data[key];
        if (index != Object.keys(data).length - 1) {
          ret = ret + "&";
        }
      });

      const newUrl = "/advanceSearch?" + ret;
      this.props.updateAdvanceLeftMenuUrl(newUrl);
    }
  }

  handleClickOpen = () => {
    this.setState((prevState) => ({
      ...prevState,
      filterModel: !prevState.filterModel,
    }));
  };

  searchFilterAppliedCount = () => {
    let searchFilterAppliedCount = 0;
    if (this.state.isSearchReturn) {
      searchFilterAppliedCount = searchFilterAppliedCount + 1;
    }
    if (this.state.isCustomerPick) {
      searchFilterAppliedCount = searchFilterAppliedCount + 1;
    }
    if (this.state.isShipFromStore) {
      searchFilterAppliedCount = searchFilterAppliedCount + 1;
    }
    if (this.state.firstName) {
      searchFilterAppliedCount = searchFilterAppliedCount + 1;
    }
    if (this.state.lastName) {
      searchFilterAppliedCount = searchFilterAppliedCount + 1;
    }
    if (this.state.customerPhone) {
      searchFilterAppliedCount = searchFilterAppliedCount + 1;
    }
    if (this.state.customerEmail) {
      searchFilterAppliedCount = searchFilterAppliedCount + 1;
    }
    if (this.state.statuses && this.state.statuses.readyForBackroomPick) {
      searchFilterAppliedCount = searchFilterAppliedCount + 1;
    }
    if (this.state.statuses && this.state.statuses.pickInProgress) {
      searchFilterAppliedCount = searchFilterAppliedCount + 1;
    }
    if (this.state.statuses && this.state.statuses.readyForPacking) {
      searchFilterAppliedCount = searchFilterAppliedCount + 1;
    }
    if (this.state.statuses && this.state.statuses.packingInProgress) {
      searchFilterAppliedCount = searchFilterAppliedCount + 1;
    }
    if (this.state.statuses && this.state.statuses.readyForShipping) {
      searchFilterAppliedCount = searchFilterAppliedCount + 1;
    }

    if (this.state.dateFrom) {
      searchFilterAppliedCount = searchFilterAppliedCount + 1;
    }
    if (this.state.dateTo) {
      searchFilterAppliedCount = searchFilterAppliedCount + 1;
    }
    return searchFilterAppliedCount;
  };

  render() {
    const { classes } = this.props;

    console.log(
      "-advanceSearchFromHeader---",
      this.props.advanceSearchFromHeader
    );

    return (
      <Box
        style={{
          position: "relative",
          display: this.props.match ? "block" : "none",
        }}
      >
        <Box>
          <Grid
            container
            spacing={2}
            style={{ justifyContent: "space-around" }}
          >
            <IconButton
              aria-label="delete"
              style={{
                fontSize: "large",
                cssFloat: "right",
                marginTop: "-10px",
                marginLeft: "auto",
              }}
              onClick={this.goToCloseTab}
            >
              <CloseRounded fontSize="inherit" />
            </IconButton>
          </Grid>

          <Grid container spacing={2}>
            <Grid
              item
              sm={this.state.AdvancedSearchLeftTab}
              style={{ zIndex: 100 }}
            >
              <Card
                style={{
                  height: "100%",
                  width: "100%",
                  cursor: "pointer",
                  padding: "4%",
                  display: "inline-flex",
                }}
              >
                <Tune
                  onClick={() => this.handleClickOpen()}
                  fontSize=""
                  style={{ padding: "0px" }}
                />
                <Typography
                  onClick={() => this.handleClickOpen()}
                  align="center"
                  variant="h6"
                  style={{
                    fontSize: "larger",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  Search Filters Applied: {this.searchFilterAppliedCount()}
                </Typography>
                <IconButton
                  aria-label="delete"
                  style={{
                    top: "-2px",
                    fontSize: "large",
                    cssFloat: "right",
                    marginLeft: "auto",
                    padding: "0px",
                  }}
                  onClick={this.removeAllFilter}
                >
                  <CloseRounded fontSize="inherit" />
                </IconButton>
              </Card>

              <Dialog
                open={this.state.filterModel}
                TransitionComponent={Transition}
                keepMounted
                onClose={this.handleClickOpen}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
              >
                <DialogTitle id="alert-dialog-slide-title">
                  {"Advance search filter"}
                  <IconButton
                    aria-label="delete"
                    style={{ cssFloat: "right", marginLeft: "auto" }}
                    onClick={() => this.handleClickOpen()}
                  >
                    <CloseRounded fontSize="inherit" />
                  </IconButton>
                </DialogTitle>
                <DialogContent>
                  <Box>
                    <Box width="100%" display="flex">
                      <Box width="48%">
                        <Box>
                          <FormControlLabel
                            control={
                              <Checkbox
                                className={classes.checkbox}
                                checked={this.state.isSearchReturn}
                                onChange={() => {
                                  const value = !this.state.isSearchReturn;
                                  this.setState({
                                    isSearchReturn: value,
                                  });
                                  this.encodeQueryData("isSearchReturn", value);
                                }}
                                color="primary"
                                inputProps={{
                                  "aria-label": "secondary checkbox",
                                }}
                              />
                            }
                            label="Search Return"
                          />
                        </Box>

                        <Box>
                          <FormControlLabel
                            control={
                              <Checkbox
                                className={classes.checkbox}
                                checked={this.state.isCustomerPick}
                                onChange={(e) => {
                                  const value = e.target.checked;
                                  this.setState({
                                    isCustomerPick: value,
                                  });
                                  this.encodeQueryData("isCustomerPick", value);
                                }}
                                color="primary"
                                inputProps={{
                                  "aria-label": "secondary checkbox",
                                }}
                              />
                            }
                            label="Customer Pick"
                          />
                        </Box>

                        <Box mb={2}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                className={classes.checkbox}
                                checked={this.state.isShipFromStore}
                                onChange={(e) => {
                                  const value = e.target.checked;
                                  this.setState({
                                    isShipFromStore: value,
                                  });
                                  this.encodeQueryData(
                                    "isShipFromStore",
                                    value
                                  );
                                }}
                                color="primary"
                                inputProps={{
                                  "aria-label": "secondary checkbox",
                                }}
                              />
                            }
                            label="Ship From Store"
                          />
                        </Box>

                        <Box mb={2}>
                          <Box fontWeight="fontWeightBold">Customer:</Box>
                          <TextField
                            margin="dense"
                            variant="outlined"
                            fullWidth
                            label="First Name"
                            name="firstName"
                            autoComplete="firstName"
                            onChange={(e) => {
                              let value = e.target.value;
                              this.setState({ firstName: value });
                              this.encodeQueryData("firstName", value);
                              return;
                            }}
                            value={this.state.firstName}
                          />

                          <TextField
                            margin="dense"
                            variant="outlined"
                            fullWidth
                            label="Last Name"
                            name="lastName"
                            autoComplete="lastName"
                            onChange={(e) => {
                              const value = e.target.value;
                              this.setState({ lastName: value });
                              this.encodeQueryData("lastName", value);
                            }}
                            value={this.state.lastName}
                          />

                          <TextField
                            margin="dense"
                            variant="outlined"
                            fullWidth
                            label="Customer Phone"
                            name="customerPhone"
                            autoComplete="customerPhone"
                            onChange={(e) => {
                              const value = e.target.value;
                              this.setState({ customerPhone: value });
                              this.encodeQueryData("customerPhone", value);
                            }}
                            value={this.state.customerPhone}
                          />

                          <TextField
                            margin="dense"
                            variant="outlined"
                            fullWidth
                            label="Customer Email"
                            name="customerEmail"
                            autoComplete="customerEmail"
                            onChange={(e) => {
                              const value = e.target.value;
                              this.setState({ customerEmail: value });
                              this.encodeQueryData("customerEmail", value);
                            }}
                            value={this.state.customerEmail}
                          />
                        </Box>
                      </Box>
                      <Box width="4%"></Box>
                      <Box width="48%" marginTop="auto" marginBottom="15px">
                        <Box mb={2}>
                          <Box fontWeight="fontWeightBold">Statuses:</Box>

                          <Box>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  className={classes.checkbox}
                                  checked={
                                    this.state.statuses.readyForBackroomPick
                                  }
                                  onChange={this.handleStatusChange.bind(
                                    this,
                                    "readyForBackroomPick"
                                  )}
                                  color="primary"
                                  inputProps={{
                                    "aria-label": "secondary checkbox",
                                  }}
                                />
                              }
                              label="Ready For Bkrm Pick"
                            />
                          </Box>

                          <Box>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  className={classes.checkbox}
                                  checked={this.state.statuses.pickInProgress}
                                  onChange={this.handleStatusChange.bind(
                                    this,
                                    "pickInProgress"
                                  )}
                                  color="primary"
                                  inputProps={{
                                    "aria-label": "secondary checkbox",
                                  }}
                                />
                              }
                              label="Pick in Progress"
                            />
                          </Box>

                          <Box>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  className={classes.checkbox}
                                  checked={this.state.statuses.readyForPacking}
                                  onChange={this.handleStatusChange.bind(
                                    this,
                                    "readyForPacking"
                                  )}
                                  color="primary"
                                  inputProps={{
                                    "aria-label": "secondary checkbox",
                                  }}
                                />
                              }
                              label="Ready For Packing"
                            />
                          </Box>

                          <Box>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  className={classes.checkbox}
                                  checked={
                                    this.state.statuses.packingInProgress
                                  }
                                  onChange={this.handleStatusChange.bind(
                                    this,
                                    "packingInProgress"
                                  )}
                                  color="primary"
                                  inputProps={{
                                    "aria-label": "secondary checkbox",
                                  }}
                                />
                              }
                              label="Packing in Progress"
                            />
                          </Box>

                          <Box>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  className={classes.checkbox}
                                  checked={this.state.statuses.readyForShipping}
                                  onChange={this.handleStatusChange.bind(
                                    this,
                                    "readyForShipping"
                                  )}
                                  color="primary"
                                  inputProps={{
                                    "aria-label": "secondary checkbox",
                                  }}
                                />
                              }
                              label="Ready For Shipping"
                            />
                          </Box>
                        </Box>

                        <Box>
                          <Box fontWeight="fontWeightBold">Dates:</Box>

                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Box>
                              <KeyboardDatePicker
                                fullWidth
                                disableToolbar
                                variant="inline"
                                format="MM/dd/yyyy"
                                margin="dense"
                                placeholder="Date From"
                                value={this.state.dateFrom}
                                onChange={(date) => {
                                  this.setState({ dateFrom: date });
                                  this.encodeQueryData("dateFrom", date);
                                }}
                                KeyboardButtonProps={{
                                  "aria-label": "change date",
                                }}
                              />
                            </Box>

                            <Box>
                              <KeyboardDatePicker
                                fullWidth
                                disableToolbar
                                variant="inline"
                                format="MM/dd/yyyy"
                                margin="dense"
                                placeholder="Date To"
                                value={this.state.dateTo}
                                onChange={(date) => {
                                  this.setState({ dateTo: date });
                                  this.encodeQueryData("dateTo", date);
                                }}
                                KeyboardButtonProps={{
                                  "aria-label": "change date",
                                }}
                              />
                            </Box>
                          </MuiPickersUtilsProvider>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginRight: "auto" }}
                    onClick={this.removeAllFilter}
                  >
                    Clear all
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.applyFilterChanges}
                  >
                    Apply
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>

            <Grid
              item
              sm={this.state.AdvancedSearchRightTab}
              style={{
                display: this.state.AdvancedSearchRightTab == 0 ? "none" : "",
              }}
            >
              <Box>
                <Card variant="outlined">
                  <Box p={1} display="flex" alignItems="center">
                    <FormControl fullWidth variant="outlined">
                      <OutlinedInput
                        margin="dense"
                        id="outlined-adornment-weight"
                        onChange={(e) =>
                          this.setState({ orderNo: e.target.value })
                        }
                        placeholder="Enter Order or Shipment Number"
                        value={this.state.orderNo}
                        endAdornment={
                          <InputAdornment position="end">
                            <Fab
                              className={classes.searchIconFab}
                              size="small"
                              color="primary"
                              onClick={this.handleSearch}
                              edge="end"
                            >
                              <SearchIcon />
                            </Fab>
                          </InputAdornment>
                        }
                        aria-describedby="outlined-weight-helper-text"
                        labelWidth={0}
                      />
                    </FormControl>
                  </Box>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Grid
          container
          className={classes.searchResults}
          style={{
            top: "100px",
            display: this.state.AdvancedSearchRightTab == 0 ? "none" : "",
          }}
        >
          <Grid
            item
            sm={8}
            style={
              !this.state.isSearchBarExpanded
                ? { flexBasis: "100%", maxWidth: "100%", transition: "all .2s" }
                : { transition: "all .2s" }
            }
          >
            <Box>
              <Card variant="outlined">
                <Box p={1}>
                  {this.state.isSearched ? (
                    <Box mt={2}>
                      <ShipmentsList
                        history={this.props.history}
                        shipmentListPayload={this.state}
                        pathMatches={this.props.location.pathname.includes(
                          "advanceSearch"
                        )}
                        location={this.props.location}
                      />
                    </Box>
                  ) : (
                    <Typography align="center">Please Start Search</Typography>
                  )}
                </Box>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    advanceSearchFromHeader: state.AppDetail.advanceSearchFromHeader,
    leftMenuList: state.AppDetail.leftMenuList,
    shipmentsListForCsv: state.ShipmentsListDetail.shipmentsListForCsv,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    resetShipmentsListState: () =>
      dispatch(
        resetShipmentsListState({
          ...SHIPMENT_TYPE_NAMES_BY_NAME.ADVANCED_SEARCH,
        })
      ),
    removeFromLeftTab: (id) => dispatch(removeFromLeftTab(id)),
    updateAdvanceLeftMenuUrl: (url) => dispatch(updateAdvanceLeftMenuUrl(url)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AdvancedSearch));

// export default withStyles(styles)(AdvancedSearch);
