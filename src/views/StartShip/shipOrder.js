import { Box, Checkbox } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { updateShipmentCheckedStatusForTracking } from "../../actions/shipmentDetails";
import "./shipment.css";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

class ShipOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false,
    };
  }

  handleCheck() {
    this.props.updateShipmentCheckedStatusForTracking(
      this.props.ShipmentKey,
      !this.props.isCheckedForTracking
    );
  }

  toggleExpand() {
    console.log("---expand call-------");
    this.setState({
      isExpanded: !this.state.isExpanded,
    });
  }

  containerList = () => {
    if (
      this.props.Containers &&
      this.props.Containers.Container &&
      this.props.Containers.Container.length > 0
    ) {
      return this.props.Containers.Container.map((data) => {
        return (
          <Box display="flex" alignItems="center" flexGrow={1}>
            <Box style={{ fontWeight: 500, minWidth: "40%" }}>
              {data.ContainerNo}
            </Box>
            <Box style={{ fontWeight: 500, minWidth: "40%" }}>
              {data.ShipmentContainerKey}
            </Box>
          </Box>
        );
      });
    }
  };

  render() {
    console.log("---ship order----", this.props);
    console.log(
      "-this.props.Containers.Container-",
      this.props.Containers.Container
    );
    return (
      <Box
        className="orderContainer"
        style={{ display: "flex", marginBottom: 15 }}
      >
        <Box className="orderDetail">
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Box
                display="flex"
                alignItems="center"
                fontWeight="bold"
                flexGrow={1}
              >
                <Box
                  item
                  flexGrow={1}
                  mr={2}
                  style={{ fontSize: 18, minWidth: "60%" }}
                >
                  {this.props.ShipmentLines?.ShipmentLine?.[0]?.OrderNo}
                </Box>
                <Box
                  item
                  flexGrow={1}
                  style={{ fontSize: 18, minWidth: "50%" }}
                >
                  {this.props.Containers?.Container?.length}
                </Box>
              </Box>
            </ExpansionPanelSummary>

            <ExpansionPanelDetails>
              <Box
                p={2}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                flexGrow={1}
              >
                <Box display="flex" alignItems="center" flexGrow={1} mb={2}>
                  <Box style={{ fontWeight: 500, minWidth: "40%" }}>Box No</Box>
                  <Box style={{ fontWeight: 500, minWidth: "40%" }}>
                    Tracking No
                  </Box>
                </Box>
                {this.containerList()}
              </Box>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Box>

        <Checkbox
          checked={this.props.isCheckedForTracking}
          onClick={() => this.handleCheck()}
          className="orderCheckbox"
          style={{ alignSelf: "flex-start" }}
        />
      </Box>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

function mapDispatchToProps(dispatch) {
  return {
    updateShipmentCheckedStatusForTracking: (shipmentKey, isChecked) =>
      dispatch(updateShipmentCheckedStatusForTracking(shipmentKey, isChecked)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ShipOrder);
