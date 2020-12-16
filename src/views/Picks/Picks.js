import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { updateActiveShipment } from "../../actions/shipmentDetails";
import Pick from "../Pick/Pick";

const leftTabMenu = ["Pick Items", "Add Location", "Confirmation"];

const Picks = (props) => {
  const { shipmentKey } = useParams();
  const [shipmentKeys, setShipmentKeys] = useState([]);

  useEffect(() => {
    if (shipmentKey && !shipmentKeys.includes(shipmentKey)) {
      setShipmentKeys([...shipmentKeys, shipmentKey]);
    }
    props.updateActiveShipment(shipmentKey);
  }, [shipmentKey]);

  return shipmentKeys.map((shpKey) => (
    <Pick key={shpKey} shipmentKey={shpKey} {...props} />
  ));
};

const mapStateToProps = (state) => {
  return {
    // openShipmentsKeys: state.ShipmentDetail.openShipmentsKeys,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    updateActiveShipment: (dt) => dispatch(updateActiveShipment(dt)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Picks);
