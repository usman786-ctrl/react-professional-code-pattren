import { Box, Button, Grid, IconButton } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CloseRounded from "@material-ui/icons/CloseRounded";
import Print from "@material-ui/icons/Print";
import { withStyles } from "@material-ui/styles";
import React, { Component } from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import { changePageLimit } from "../../actions/app";
import {
  getPdfOwerData,
  getShipmentsList,
  getShipmentsListForCSv,
  resetShipmentsListState,
} from "../../actions/shipmentsList";
import { downloadPdf, SHIPMENT_TYPE_NAMES_BY_NAME } from "../../config/config";
import { getShipmentListKey } from "../../config/util";
import styles from "./ShipmentsList.styles";
import ShipmentsListItem from "./ShipmentsListItem/ShipmentsListItem";

class ShipmentsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prevPage: 0,
      currentPage: 1,
      nextPage: 2,
      isLoading: true,
      printSelected: [],
    };
  }

  async componentDidMount() {
    this.loadData();
  }

  async componentDidUpdate(prevProps) {
    console.log(
      this.props.shipmentListPayload,
      "this.props.shipmentListPayload"
    );

    // if (this.props.shipments.length === 0) {
    //   await this.loadData();
    // }
  }

  async loadData() {
    this.setState({
      isLoading: true,
    });

    let pageData = { currentPage: 1, prevPage: 0 };

    //get shipment list for csv download
    this.props.getShipmentsListForCSv(this.props.shipmentListPayload);
    this.props.getPdfOwerData();
    this.props
      .getShipmentsList(this.props.shipmentListPayload, pageData)
      .then((data) => {
        console.log("--order list result0--", data);
        // get next page shipments list in advance
        this.setState({
          isLoading: false,
        });
        if (!this.props.lastPage > 0) {
          this.getShipmentsListForNextPage();
        }
      });
  }

  getShipmentsListForNextPage() {
    const shipmentListPayload = this.props.shipmentListPayload;

    this.props.getShipmentsList(shipmentListPayload, {
      currentPage: this.state.nextPage,
      prevPage: this.state.currentPage,
    });
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  handlePrevPage() {
    this.scrollToTop();

    this.setState({
      prevPage: this.state.prevPage - 1,
      currentPage: this.state.prevPage,
      nextPage: this.state.currentPage,
    });
  }

  handleNextPage() {
    this.scrollToTop();

    this.setState(
      {
        prevPage: this.state.currentPage,
        currentPage: this.state.nextPage,
        nextPage: this.state.nextPage + 1,
      },
      () => {
        // if we do not have data for next page then fetch data
        if (!this.props.lastPage > 0) {
          if (
            this.state.nextPage * this.props.SHIPMENTS_LIST_PAGE_SIZE >
            this.props.shipmentsList.length
          ) {
            // get data for next page in advance
            this.getShipmentsListForNextPage();
          }
        }
      }
    );
  }

  handleDowndload = () => {
    let printData = [];
    this.props.shipmentsListForCsv.map((data) => {
      if (this.state.printSelected.includes(data.ShipmentKey)) {
        printData.push(data);
      }
    });
    downloadPdf(
      printData,
      this.props.location.pathname,
      this.props.pdfOwenerDetail,
      this.props.shipmentListPayload
    );
  };

  handleCheck = (shipmentkey) => {
    const printSelected = this.state.printSelected;
    const index = printSelected.findIndex((res) => res == shipmentkey);
    if (index == -1) {
      this.setState((prevState) => ({
        ...prevState,
        printSelected: [...prevState.printSelected, shipmentkey],
      }));
    } else {
      const filterPrintSelected = printSelected.filter(
        (res) => res != shipmentkey
      );
      this.setState((prevState) => ({
        ...prevState,
        printSelected: filterPrintSelected,
      }));
    }
  };

  selectAllShipment = (e) => {
    let isAllChecked = e.target.checked;
    if (isAllChecked) {
      if (
        this.props.shipmentsListForCsv &&
        this.props.shipmentsListForCsv.length > 0
      ) {
        const shipments = this.props.shipmentsListForCsv
          // .slice(
          //   this.state.prevPage *
          //   API_CONSTANTS.SHIPMENTS_LIST_PAGE_SIZE,
          //   this.state.currentPage *
          //   API_CONSTANTS.SHIPMENTS_LIST_PAGE_SIZE
          // )
          .map((shipment) => {
            return shipment.ShipmentKey;
          });

        this.setState((prevState) => ({
          ...prevState,
          printSelected: shipments,
        }));
      }
    } else {
      this.setState((prevState) => ({
        ...prevState,
        printSelected: [],
      }));
    }
  };

  isAllChecked = () => {
    let isAllChecked = false;
    if (this.props.shipmentsList && this.props.shipmentsList.length > 0) {
      isAllChecked = true;
      this.props.shipmentsList
        .slice(
          this.state.prevPage * this.props.SHIPMENTS_LIST_PAGE_SIZE,
          this.state.currentPage * this.props.SHIPMENTS_LIST_PAGE_SIZE
        )
        .map((shipment) => {
          if (this.state.printSelected && this.state.printSelected.length > 0) {
            const index = this.state.printSelected.findIndex(
              (res) => res == shipment.ShipmentKey
            );
            if (index == -1) {
              isAllChecked = false;
            }
          } else {
            isAllChecked = false;
          }
        });
    }
    return isAllChecked;
  };

  changePageLimit = (e) => {
    this.props.changePageLimit(e);
    this.loadData();
    this.scrollToTop();
  };

  goToCloseTab = () => {
    this.props.onClose && this.props.onClose(this.props.shipmentListPayload);
    this.props.resetShipmentsListState();
    this.props.history.push("/");
  };

  render() {
    if (!this.props.pathMatches) {
      return null;
    }

    const { classes } = this.props;
    let isPrintSelected = false;
    if (this.state.printSelected && this.state.printSelected.length > 0) {
      isPrintSelected = true;
    }
    // console.log('-shipmentsList---', this.props.shipmentsList);
    console.log("-printSelected---", this.props.SHIPMENTS_LIST_PAGE_SIZE);

    const isCloseButtonShow =
      this.props.location.pathname.includes("advanceSearch") ||
      this.props.location.pathname.includes("returnSearch")
        ? true
        : false;

    return (
      <>
        <Box>
          {!isCloseButtonShow && (
            <Grid
              container
              spacing={2}
              style={{ justifyContent: "space-around" }}
            >
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
          )}

          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    {" "}
                    <Checkbox
                      checked={this.isAllChecked()}
                      onChange={(e) => this.selectAllShipment(e)}
                      name="checkedB"
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>Order No</TableCell>
                  <TableCell align="center">Shipment No</TableCell>
                  <TableCell align="center">Order Date</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">No of Items</TableCell>
                  {/* <TableCell align="right">Action</TableCell> */}
                  <TableCell align="right">
                    <Button
                      mr={4}
                      disabled={!isPrintSelected}
                      variant="outlined"
                      color="primary"
                      onClick={this.handleDowndload}
                    >
                      Print{" "}
                      <Print
                        style={{ marginLeft: "8px" }}
                        color={!isPrintSelected ? "#dedede" : "primary"}
                      />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.props.shipmentsList.length > 0 ? (
                  this.props.shipmentsList
                    .slice(
                      this.state.prevPage * this.props.SHIPMENTS_LIST_PAGE_SIZE,
                      this.state.currentPage *
                        this.props.SHIPMENTS_LIST_PAGE_SIZE
                    )
                    .map((shipment) => {
                      return (
                        <ShipmentsListItem
                          location={this.props.location.pathname}
                          shipmentListPayload={this.props.shipmentListPayload}
                          handleCheck={this.handleCheck}
                          key={shipment.ShipmentKey}
                          history={this.props.history}
                          printSelected={this.state.printSelected}
                          {...shipment}
                        />
                      );
                    })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                      component="th"
                      scope="row"
                    >
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {this.props.shipmentsList.length > 0 && this.props.lastPage !== 1 ? (
          <Box mt={3}>
            <Grid
              container
              style={{ justifyContent: "space-between" }}
              justify="center"
            >
              <Box mr={3}></Box>
              <Box mr={3} style={{ display: "flex" }}>
                <Box mr={3}>
                  <Button
                    disabled={this.state.prevPage <= 0}
                    onClick={() => this.handlePrevPage()}
                    variant="contained"
                    color="primary"
                  >
                    Prev
                  </Button>
                </Box>
                <Box>
                  <Button
                    disabled={this.props.lastPage === this.state.currentPage}
                    onClick={() => this.handleNextPage()}
                    variant="contained"
                    color="primary"
                  >
                    Next
                  </Button>
                </Box>
              </Box>
              <Box mr={3} style={{ display: "flex" }}>
                <Box style={{ fontSize: "medium", marginTop: "7px" }}>
                  <b>Page Size</b>
                </Box>
                <Box mr={3}>
                  <Select
                    style={{ marginLeft: "20px" }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={this.props.SHIPMENTS_LIST_PAGE_SIZE}
                    onChange={(e) => this.changePageLimit(e)}
                  >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                  </Select>
                </Box>
              </Box>
            </Grid>
          </Box>
        ) : null}
      </>
    );
  }
}

const getShipmentDetails = createSelector(
  [
    (state, props) =>
      state.ShipmentsListDetail.shipmentListDetailByKey[
        getShipmentListKey(
          props.location?.state?.statusDetails || {
            ...SHIPMENT_TYPE_NAMES_BY_NAME.ADVANCED_SEARCH,
          }
        )
      ],
  ],
  (shipmentListData) => ({
    ...shipmentListData,
  })
);

const mapStateToProps = (state, props) => {
  return {
    ...getShipmentDetails(state, props),
    pdfOwenerDetail: state.ShipmentsListDetail.pdfOwenerDetail,
    SHIPMENTS_LIST_PAGE_SIZE: state.AppDetail.SHIPMENTS_LIST_PAGE_SIZE,
  };
};

function mapDispatchToProps(dispatch, ownProps) {
  const statusDetails = ownProps.location?.state?.statusDetails || {
    ...SHIPMENT_TYPE_NAMES_BY_NAME.ADVANCED_SEARCH,
  };
  return {
    getShipmentsList: (shipmentListPayload, pageData) =>
      dispatch(getShipmentsList(shipmentListPayload, pageData, statusDetails)),
    getShipmentsListForCSv: (shipmentListPayload) =>
      dispatch(getShipmentsListForCSv(shipmentListPayload, statusDetails)),
    getPdfOwerData: () => dispatch(getPdfOwerData()),
    // resetShipmentDetailsState: () => dispatch(resetShipmentDetailsState()),
    resetShipmentsListState: () =>
      dispatch(resetShipmentsListState(statusDetails)),
    changePageLimit: (e) => dispatch(changePageLimit(e.target.value)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ShipmentsList));
