import React, { Component } from "react";
// import OrderSearch from '../../components/OrderSearch/OrderSearch';
import { getAllShipmentsTotals } from "../../actions/shipmentsTotals";
import { API_CONSTANTS } from "../../config/config";
import { connect } from "react-redux";
// import { getCarriersList, updateSelectedCarrier } from '../../actions/shipmentShip';
import {
  Container,
  Box,
  Button,
  Typography,
  CircularProgress
} from "@material-ui/core";
import styles from "./AllShipments.styles";
import { withStyles } from "@material-ui/styles";

class AllShipments extends Component {
  state = {
    isModalVisible: false,
    selectedCarrier: "",
    isShipmentsToPackTotalsLoading: true,
    isPackingInProgressTotalsLoading: true,
    isShipmentsToShipTotalsLoading: true
  };

  componentDidMount() {
    Object.keys(API_CONSTANTS.ALL_SHIPMENTS).forEach(pickName => {
      if (pickName !== "NAME") {
        const casedPickName = pickName
          .split("_")
          .map(word => {
            return word[0] + word.substr(1).toLowerCase();
          })
          .join("");

        let newState = {};
        newState[`is${casedPickName}TotalsLoading`] = false;

        this.props
          .getAllShipmentsTotals(pickName)
          .then(() => {
            this.setState(newState);
          })
          .catch(() => {
            this.setState(newState);
          });
      }
    });

    // this.props.getCarriersList()
    //   .then((data) => {
    //     if (data) {
    //       this.setState({
    //         selectedCarrier: data[0].Scac
    //       })
    //     }
    //   })
  }

  hideModal() {
    this.setState({
      isModalVisible: false
    });
  }

  handleGetList(type) {
    this.props.history.push({
      pathname: "/shipmentsList",
      state: {
        shipmentListPayload: {
          tab: API_CONSTANTS.ALL_SHIPMENTS.NAME,
          type: type
        }
      }
    });
  }

  handleShipmentsToShipGetList() {
    this.setState({
      isModalVisible: true
    });
  }

  onSelectedCarrierChange(value) {
    this.setState({
      selectedCarrier: value
    });
  }

  handleSelectCarrierConfirm() {
    this.hideModal();
    this.props.updateSelectedCarrier(this.state.selectedCarrier);
    this.props.navigation.navigate("Ship");
  }

  render() {
    const { classes } = this.props;

    return (
      <Box>
        <div className={classes.container}>
          <Box className={classes.flowRow}>
            <Typography variant="h5">
              Shipments to Pack: {this.props.shipmentsToPackTotals}
            </Typography>
            <div className={classes.wrapper}>
              <Button
                variant="contained"
                color="primary"
                disabled={
                  !parseInt(this.props.shipmentsToPackTotals) ||
                  this.state.isShipmentsToPackTotalsLoading
                }
                onClick={() =>
                  this.handleGetList(
                    API_CONSTANTS.ALL_SHIPMENTS.SHIPMENTS_TO_PACK.NAME
                  )
                }
              >
                Get List
                {this.state.isShipmentsToPackTotalsLoading && (
                  <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                  />
                )}
              </Button>
            </div>
          </Box>

          <Box className={classes.flowRow}>
            <Typography variant="h5">
              Packing in Progress: {this.props.packingInProgressTotals}
            </Typography>
            <div className={classes.wrapper}>
              <Button
                variant="contained"
                color="primary"
                disabled={
                  !parseInt(this.props.packingInProgressTotals) ||
                  this.state.isPackingInProgressTotalsLoading
                }
                onClick={() =>
                  this.handleGetList(
                    API_CONSTANTS.ALL_SHIPMENTS.PACKING_IN_PROGRESS.NAME
                  )
                }
              >
                Get List
                {this.state.isPackingInProgressTotalsLoading && (
                  <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                  />
                )}
              </Button>
            </div>
          </Box>

          <Box className={classes.flowRow}>
            <Typography variant="h5">
              Shipments to Ship: {this.props.shipmentsToShipTotals}
            </Typography>
            <div className={classes.wrapper}>
              <Button
                variant="contained"
                color="primary"
                disabled={
                  !parseInt(this.props.shipmentsToShipTotals) ||
                  this.state.isShipmentsToShipTotalsLoading
                }
                onClick={() =>
                  this.handleGetList(
                    API_CONSTANTS.ALL_SHIPMENTS.SHIPMENTS_TO_SHIP.NAME
                  )
                }
              >
                Get List
                {this.state.isShipmentsToShipTotalsLoading && (
                  <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                  />
                )}
              </Button>
            </div>
          </Box>
        </div>
      </Box>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.AllShipmentsDetail
    // carriersList: state.ShipmentShipDetail.carriersList
  };
};

function mapDispatchToProps(dispatch) {
  return {
    getAllShipmentsTotals: type => dispatch(getAllShipmentsTotals(type))
    // getCarriersList: () => dispatch(getCarriersList()),
    // updateSelectedCarrier: (carrier) => dispatch(updateSelectedCarrier(carrier)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AllShipments));
