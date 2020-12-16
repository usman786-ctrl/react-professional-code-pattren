import React, { useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { updateActiveShipment } from "../../actions/shipmentDetails";
import Shipment from "./Shipment/Shipment";
import { LINK_TYPES } from "../../config/config";
import { toaster } from "../../config/util";

const Shipments = ({ visitedLinks, ...props }) => {
  const { shipmentKey } = useParams();
  const { state = {}, pathname } = useLocation();

  console.log(props, "shp props");
  console.log(state, "shp state");

  const shipments = useMemo(
    () => visitedLinks.filter((dt) => dt.linkType === LINK_TYPES.SHIPMENT),
    [visitedLinks]
  );

  useEffect(() => {
    const userDetails = localStorage.getItem("userDetails");
    if (!userDetails) {
      props.history.push("/login");
    }

    if (
      window.performance.navigation.type ==
      window.performance.navigation.TYPE_RELOAD
    ) {
      props.setVisitedLinks([]);
      props.history.push("/");
    }
  }, []);

  useEffect(() => {
    if (
      shipmentKey &&
      !shipments.map((dt) => dt.shipmentKey).includes(shipmentKey)
    ) {
      props.setVisitedLinks((prevLinks) => [
        ...prevLinks,
        {
          ...state,
          id: Date.now(),
          path: pathname,
          linkType: LINK_TYPES.SHIPMENT,
          shipmentKey,
          OrderNo: state.OrderNo || "",
        },
      ]);
    }
    props.updateActiveShipment(shipmentKey, state.statusDetails);
  }, [shipmentKey]);

  return shipments.map((dt) => (
    <Shipment key={dt.id} shipmentKey={dt.shipmentKey} {...props} link={dt} />
  ));
};

const mapStateToProps = (state) => {
  return {
    // openShipmentsKeys: state.ShipmentDetail.openShipmentsKeys,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    updateActiveShipment: (dt, statusDetails) =>
      dispatch(updateActiveShipment(dt, statusDetails)),
  };
}

export default connect(null, mapDispatchToProps)(Shipments);
