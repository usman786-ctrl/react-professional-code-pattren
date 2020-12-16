import { Box, Button, TableCell, TableRow } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
// import ShipmentsListItem from './ShipmentsListItem/ShipmentsListItem';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import React, { Component } from "react";

class ReturnOrderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      printSelected: [],
    };
  }

  isAllChecked = () => {
    let isAllChecked = false;
    if (this.props.returnOrderList && this.props.returnOrderList.length > 0) {
      isAllChecked = true;
      this.props.returnOrderList.map((shipment) => {
        if (this.state.printSelected && this.state.printSelected.length > 0) {
          const index = this.state.printSelected.findIndex(
            (res) => res == shipment.id
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

  isChecked = (id) => {
    let isChecked = false;
    const index = this.state.printSelected.findIndex((res) => res == id);
    if (index == -1) {
      isChecked = false;
    } else {
      isChecked = true;
    }
    return isChecked;
  };

  getAvailableQty = (orderLines) => {
    if (orderLines && orderLines.OrderLine && orderLines.OrderLine.length > 0) {
      return orderLines.OrderLine[0].OrderedQty;
    }
    return "";
  };

  render() {
    let isPrintSelected = false;
    if (this.state.printSelected && this.state.printSelected.length > 0) {
      isPrintSelected = true;
    }

    // const actionText = this.getActionText(
    //     this.props.DeliveryMethod,
    //     this.props.Status
    // );

    console.log(
      "-this.props.returnOrderList------",
      this.props.returnOrderList
    );
    return (
      <>
        <Box>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  {/* <TableCell> <Checkbox
                                        checked={this.isAllChecked()}
                                        onChange={(e) => this.selectAllShipment(e)}
                                        name="checkedB"
                                        color="primary"
                                    /></TableCell> */}
                  <TableCell>Order No</TableCell>
                  <TableCell align="center">Return Date</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Available Qty</TableCell>
                  <TableCell align="center"></TableCell>
                  {/* <TableCell align="right">
                                        <Button mr={4} disabled={!isPrintSelected} variant="outlined" color="primary" onClick={this.handleDowndload} >
                                            Print <Print style={{ marginLeft: "8px" }} color={!isPrintSelected ? "#dedede" : "primary"} />
                                        </Button></TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {this.props.returnOrderList.length > 0 ? (
                  this.props.returnOrderList.map((shipment) => {
                    return (
                      <TableRow>
                        {/* <TableCell><Checkbox
                                                    checked={this.isChecked(shipment.id)}
                                                    onChange={this.handleChange}
                                                    name="checkedB"
                                                    color="primary"
                                                /></TableCell> */}
                        <TableCell component="th" scope="row">
                          {shipment.OrderHeaderKey}
                        </TableCell>
                        <TableCell align="center">
                          {new Date(shipment.OrderDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="center">Authorized</TableCell>
                        <TableCell align="center">
                          {this.getAvailableQty(shipment.OrderLines)}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="contained"
                            color="primary"
                            // onClick={() => this.handleAction(shipment.id)}
                          >
                            {"Start Receipt"}
                          </Button>
                        </TableCell>
                      </TableRow>
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

        {/* {this.props.returnOrderList.length > 0 && this.props.lastPage !== 1 ? (
                    <Box mt={3}>
                        <Grid container style={{ justifyContent: "space-between" }} justify="center">
                            <Box mr={3}></Box>
                            <Box mr={3} style={{ display: 'flex' }} >
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
                            <Box mr={3} style={{ display: 'flex' }} >
                                <Box style={{ fontSize: "medium", marginTop: "7px" }} >
                                    <b>Page Size</b>
                                </Box>
                                <Box mr={3} >
                                    <Select
                                        style={{ marginLeft: '20px' }}
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
                ) : null} */}
      </>
    );
  }
}

export default ReturnOrderList;
