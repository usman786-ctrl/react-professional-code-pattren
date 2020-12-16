import {
  API_CONSTANTS,
  API_ROOT,
  StringFormat,
  URI,
} from "../../src/config/config";
import { AllPicks } from "../constants/allPicks";
import { AllShipments } from "../constants/allShipments";
import { getUserDetails, httpProcessor } from "./app";

// shipment totals api
const getTotals = async (tab, type) => {
  const userDetails = getUserDetails();

  if (!userDetails) {
    return;
  }

  const payload = {
    Status: API_CONSTANTS[tab][type].STATUS,
    DeliveryMethod: API_CONSTANTS[tab][type].DELIVERY_METHOD,
    ShipNode: userDetails.OrganizationCode || "",
    Extn: {
      ExtnSearchType: "COUNT",
    },
  };

  return httpProcessor(
    StringFormat(
      API_ROOT + URI.SHIPMENT_TOTALS,
      userDetails.LoginID,
      userDetails.UserToken
    ),
    {
      method: "POST",
      body: JSON.stringify(payload),
      doNotHandleLoader: true,
    }
  ).then((data) => {
    if (data && data.TotalNumberOfRecords) {
      return data.TotalNumberOfRecords;
    }
  });
};

export const getAllPicksTotals = (type) => {
  return (dispatch) => {
    return getTotals(API_CONSTANTS.ALL_PICKS.NAME, type).then((data) => {
      if (data) {
        dispatch({
          type: AllPicks[`UPDATE_${type}_TOTALS`],
          payload: data,
        });
      }
    });
  };
};

export const getAllShipmentsTotals = (type) => {
  return (dispatch) => {
    return getTotals(API_CONSTANTS.ALL_SHIPMENTS.NAME, type).then((data) => {
      if (data) {
        dispatch({
          type: AllShipments[`UPDATE_${type}_TOTALS`],
          payload: data,
        });
      }
    });
  };
};
