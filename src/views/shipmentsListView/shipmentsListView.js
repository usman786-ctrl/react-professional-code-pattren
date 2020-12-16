import React, { useState, useEffect } from "react";
import Box from "@material-ui/core/Box";
import ShipmentsList from "../../components/ShipmentsList/ShipmentsList";
import { useLocation } from "react-router-dom";

const ShipmentsListView = (props) => {
  const { state = {}, pathname } = useLocation();
  const [shipmentListPayloads, setShipmentListPayloads] = useState([]);
  const shipmentListPayload = state.shipmentListPayload;

  useEffect(() => {
    if (
      shipmentListPayload &&
      !shipmentListPayloads.find(
        (dt) =>
          dt.tab === shipmentListPayload.tab &&
          dt.type === shipmentListPayload.type
      )
    ) {
      setShipmentListPayloads((prev) => prev.concat([shipmentListPayload]));
    }
  }, [shipmentListPayload]);

  const onClose = ({ tab, type }) => {
    setShipmentListPayloads((prev) =>
      prev.filter((dt) => dt.tab !== tab && dt.type !== type)
    );
  };

  return (
    <Box>
      {shipmentListPayloads.map((dt) => (
        <ShipmentsList
          onClose={onClose}
          pathMatches={
            props.match &&
            dt.tab === shipmentListPayload.tab &&
            dt.type === shipmentListPayload.type &&
            !pathname.includes("advanceSearch") &&
            !pathname.includes("returnSearch")
          }
          shipmentListPayload={dt}
          history={props.history}
          location={props.location}
        />
      ))}
    </Box>
  );
};

export default ShipmentsListView;
