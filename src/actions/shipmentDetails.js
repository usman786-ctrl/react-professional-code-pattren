import {
  API,
  API_CONSTANTS,
  API_ROOT,
  StringFormat,
  URI,
} from "../../src/config/config";
import { getUserDetails, httpProcessor } from "../actions/app";
import { ShipmentDetail } from "../constants/shipmentDetail";

export const confirmShipment = (shipmentKey) => {
  return async (dispatch, getState) => {
    const userDetails = await getUserDetails();

    const payload = {
      ShipmentKey: shipmentKey,
      TransactionId: API_CONSTANTS.TRANSACTION_ID.CONFIRM_SHIPMENT,
    };

    return httpProcessor(
      StringFormat(
        API_ROOT + URI.CHANGE_SHIPMENT_STATUS,
        userDetails.LoginID,
        userDetails.UserToken
      ),
      {
        method: "PATCH",
        body: JSON.stringify(payload),
        doNotHandleLoader: true,
      }
    ).then((data) => {
      let shipments = getState().ShipmentDetail.shipments;

      if (data && data.ShipmentKey) {
        // mark shipment as confirmed
        shipments = shipments.map((shipment) => {
          if (shipment.ShipmentKey == shipmentKey) {
            shipment.isConfirmed = true;
          }
          return shipment;
        });
      }

      dispatch(updateShipments(shipments, false));
    });
  };
};

export const updateShipmentCheckedStatusForTracking = (
  shipmentKey,
  isChecked
) => {
  return (dispatch, getState) => {
    let shipments = getState().ShipmentDetail.shipments;

    let isAllShipmentsUncheckForTracking = true;

    shipments = shipments.map((shipment) => {
      if (shipment.ShipmentKey == shipmentKey) {
        shipment.isCheckedForTracking = isChecked;
      }

      if (shipment.isCheckedForTracking) {
        isAllShipmentsUncheckForTracking = false;
      }

      return shipment;
    });

    dispatch(updateShipments(shipments, isAllShipmentsUncheckForTracking));
  };
};

const updateShipments = (shipments, isAllShipmentsUncheckForTracking) => {
  return (dispatch) => {
    dispatch({
      type: ShipmentDetail.UPDATE_SHIPMENTS,
      payload: {
        shipments,
        isAllShipmentsUncheckForTracking,
      },
    });
  };
};

export const getCarriersList = () => {
  return async (dispatch) => {
    const userDetails = await getUserDetails();

    return httpProcessor(
      StringFormat(
        API_ROOT + URI.CARRIERS_LIST,
        userDetails.LoginID,
        userDetails.UserToken,
        API_CONSTANTS.TEMPLATE_KEY.CARRIERS_LIST
      ),
      {
        method: "GET",
      }
    ).then((data) => {
      if (data && data.length > 0) {
        dispatch({
          type: ShipmentDetail.CARRIERS_LIST,
          payload: data,
        });
        return data;
      }
    });
  };
};

export const getShipmentsListForCarrier = (carrier) => {
  return async (dispatch) => {
    const userDetails = await getUserDetails();

    return httpProcessor(
      StringFormat(
        API_ROOT + URI.SHIPMENT_LIST_FOR_CARRIER,
        userDetails.LoginID,
        userDetails.UserToken,
        API_CONSTANTS.TEMPLATE_KEY.SHIPPING_LIST,
        userDetails.OrganizationCode,
        carrier,
        API_CONSTANTS.ALL_SHIPMENTS.SHIPMENTS_TO_SHIP.STATUS
      ),
      {
        method: "GET",
      }
    ).then((data) => {
      let shipments = data;
      if (shipments && shipments.length > 0) {
        shipments = shipments.map((shipment) => {
          return {
            ...shipment,
            isCheckedForTracking: false,
            isConfirmed: false,
          };
        });
        console.log("---my shipments---", shipments);
        // dispatch(updateShipments(shipments, true))
        dispatch({
          type: ShipmentDetail.START_SHIPMENT,
          payload: shipments,
        });

        return shipments;
      }
    });
  };
};

export const getShipmentDetails = (shipmentKey) => {
  return async (dispatch) => {
    const userDetails = getUserDetails();

    if (!userDetails) {
      return;
    }

    const payload = {
      ShipmentKey: shipmentKey,
      Extn: { ExtnSearchType: "DETAIL" },
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
      }
    ).then((shipment) => {
      if (!shipment) {
        return;
      }

      let OrderNo = "";

      if (shipment.ShipmentLines?.ShipmentLine?.length) {
        shipment.ShipmentLines.ShipmentLine.forEach((shipmentLine) => {
          shipmentLine.BackroomPickedQuantity = Math.round(
            shipmentLine.BackroomPickedQuantity
          );
          shipmentLine.ShortageQty = Math.round(shipmentLine.ShortageQty);
          shipmentLine.Quantity = Math.round(shipmentLine.Quantity);
          OrderNo = shipmentLine.OrderNo;
        });
      }

      dispatch(
        updateShipmentDataInReducer(shipmentKey, {
          OrderNo,
          ...shipment,
        })
      );

      return {
        OrderNo,
        ...shipment,
      };
    });
  };
};

export const updateShipmentDataInReducer = (shipmentKey, dataToUpdate) => {
  return (dispatch) => {
    dispatch({
      type: ShipmentDetail.UPDATE_SHIPMENT_DATA,
      payload: dataToUpdate,
      shipmentKey,
    });
  };
};

export const updateShipmentDetails = (
  shipmentKey,
  shipmentData = {},
  status
) => {
  return async (dispatch) => {
    const userDetails = getUserDetails();
    if (!userDetails) {
      return;
    }
    const payload = {
      ShipmentKey: shipmentKey,
      HoldLocation: shipmentData.HoldLocation,
      ShipmentLines: {
        ShipmentLine: shipmentData.ShipmentLines?.ShipmentLine.map((dt) => ({
          ShipmentLineKey: dt.ShipmentLineKey,
          Quantity: dt.Quantity,
          dtKey: dt.dtKey,
          BackroomPickedQuantity: dt.BackroomPickedQuantity,
          ShortageQty: dt.ShortageQty,
          ShortageResolutionReason: dt.ShortageResolutionReason || "",
          BackroomPickComplete: shipmentData.isShipmentPickDone ? "Y" : "N",
        })),
      },
    };

    console.log(shipmentData, "shipmentData api");

    let isPickInProgress = false;

    if (
      shipmentData.statusDetails?.NAME &&
      [
        API_CONSTANTS.ALL_PICKS.CUSTOMER_PICKS_IN_PROGRESS.NAME,
        API_CONSTANTS.ALL_PICKS.SHIPMENT_PICKS_IN_PROGRESS.NAME,
      ].includes(shipmentData.statusDetails.NAME)
    ) {
      isPickInProgress = true;
    }

    return new Promise((resolve, reject) => {
      httpProcessor(
        StringFormat(
          API_ROOT + URI.UPDATE_SHIPMENT,
          userDetails.LoginID,
          userDetails.UserToken,
          API_CONSTANTS.TEMPLATE_KEY.CHANGE_SHIPMENT
        ),
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        }
      )
        .then(async (data) => {
          // do not call change shipment status api if pick in progress and shipment in not done
          if (!status) {
            resolve(data);
          } else {
            await changeShipmnetStatus(shipmentKey, status);
            resolve(data);
          }
        })
        .catch((err) => {
          reject();
        });
    });
  };
};

export const updateCustomerVerification = (orderHeaderKey, noteText) => {
  return (dispatch) => {
    const userDetails = getUserDetails();
    if (!userDetails) {
      return;
    }
    const payload = {
      OrderHeaderKey: orderHeaderKey,
      Notes: {
        Note: [
          {
            NoteText: noteText,
            Priority: "1", // TODO: priority hardcoded
          },
        ],
      },
    };
    return new Promise((resolve, reject) => {
      httpProcessor(
        `${API.ORDER}?_token=${userDetails.UserToken}&_loginid=${userDetails.LoginID}`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        }
      )
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject();
        });
    });
  };
};

export const changeShipmnetStatus = async (
  shipmentKey,
  transactinId,
  baseDropStatus
) => {
  const userDetails = getUserDetails();

  if (!userDetails) {
    return;
  }

  let payload = {
    ShipmentKey: shipmentKey,
    TransactionId: transactinId,
  };

  if (baseDropStatus) {
    payload.BaseDropStatus = baseDropStatus;
  }

  return new Promise((resolve, reject) => {
    httpProcessor(
      StringFormat(
        API_ROOT + URI.CHANGE_SHIPMENT_STATUS,
        userDetails.LoginID,
        userDetails.UserToken
      ),
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      }
    )
      .then((data) => {
        if (data) {
          resolve(data);
        }
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const updateHoldLocation = (location) => {
  return (dispatch) => {
    dispatch({
      type: ShipmentDetail.UPDATE_HOLD_LOCATION,
      payload: location,
    });
  };
};

export const updateActiveShipment = (shipmentKey, statusDetails) => {
  return (dispatch) => {
    dispatch({
      type: ShipmentDetail.UPDATE_ACTIVE_SHIPMENT,
      payload: shipmentKey,
      statusDetails,
    });
  };
};

export const validateBarcode = (barcode, enterpriseCode) => {
  console.log(barcode, enterpriseCode);
  return async (dispatch) => {
    const userDetails = getUserDetails();

    if (!userDetails || !enterpriseCode) {
      return Promise.reject();
    }

    const payload = {
      BarCodeData: barcode,
      BarCodeType: API_CONSTANTS.BARCODE_TYPE,
      ContextualInfo: {
        OrganizationCode: enterpriseCode,
      },
    };

    return httpProcessor(
      StringFormat(
        API_ROOT + URI.VALIDATE_BARCODE,
        userDetails.LoginID,
        userDetails.UserToken
      ),
      {
        method: "POST",
        body: JSON.stringify(payload),
        doNotHandleLoader: true,
      }
    ).then((data) => {
      if (data) {
        return data;
      }
    });
  };
};

export const getReasonCodes = (enterpriseCode, shpKey) => {
  return async (dispatch) => {
    const userDetails = getUserDetails();

    if (!userDetails || !enterpriseCode) {
      return;
    }

    return httpProcessor(
      StringFormat(
        API_ROOT + URI.SHORTAGE_CODES,
        userDetails.LoginID,
        userDetails.UserToken,
        API_CONSTANTS.SHORTAGE_CODES.CODE_TYPE,
        API_CONSTANTS.TEMPLATE_KEY.SHORTAGE_CODES,
        enterpriseCode
      ),
      {
        method: "GET",
        doNotHandleLoader: true,
      }
    ).then((data) => {
      if (data && data.length > 0) {
        console.log(data, "reason codes");
        dispatch({
          type: ShipmentDetail.UPDATE_SHORTAGE_CODES,
          payload: { data, shipmentKey: shpKey },
        });
      }
    });
  };
};

export const getCustomerVerificationCodes = (enterpriseCode, shpKey) => {
  return async (dispatch) => {
    const userDetails = getUserDetails();

    if (!userDetails || !enterpriseCode) {
      return;
    }

    return httpProcessor(
      StringFormat(
        API_ROOT + URI.SHORTAGE_CODES,
        userDetails.LoginID,
        userDetails.UserToken,
        API_CONSTANTS.SHORTAGE_CODES.YCD_CUST_VERFN_TYP,
        API_CONSTANTS.TEMPLATE_KEY.SHORTAGE_CODES,
        enterpriseCode
      ),
      {
        method: "GET",
      }
    ).then((data) => {
      if (data && data.length > 0) {
        dispatch({
          type: ShipmentDetail.UPDATE_CUSTOMER_VERIFICATION_CODES,
          payload: { data, shipmentKey: shpKey },
        });
      }
    });
  };
};

export const resetShipmentDetailsState = () => {
  return (dispatch) => {
    dispatch({
      type: ShipmentDetail.RESET_SHIPMENT_DETAIL_STATE,
    });
  };
};

// Containers
export const createNewContainer = (shipmentKey) => {
  return async (dispatch) => {
    const userDetails = getUserDetails();

    if (!userDetails) {
      return;
    }

    const payload = {
      ShipmentKey: shipmentKey,
      Containers: {
        Container: {
          ShipmentKey: shipmentKey,
        },
      },
    };

    return httpProcessor(
      StringFormat(
        API_ROOT + URI.UPDATE_SHIPMENT_CONTAINER,
        userDetails.LoginID,
        userDetails.UserToken,
        API_CONSTANTS.TEMPLATE_KEY.SHIP_CONTAINER
      ),
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      }
    ).then((data) => {
      dispatch(updateShipmentDataInReducer(shipmentKey, data));
    });
  };
};

export const addItemToContainer = (
  Container = [], // array of all containers/boxex
  shipmentKey,
  shipmentContainerKey,
  shipmentLineKey,
  quantity
) => {
  return async (dispatch, getState) => {
    const userDetails = getUserDetails();

    if (!userDetails && !shipmentKey) {
      return;
    }

    let quantityAlreadyAdded = 0;
    // check if any quantity of the shipment line already exist in the target container
    const targetContainer = Container.find(
      (c) => c.ShipmentContainerKey === shipmentContainerKey
    );
    if (
      targetContainer &&
      targetContainer.ContainerDetails?.ContainerDetail?.length
    ) {
      targetContainer.ContainerDetails.ContainerDetail.map((cItem) => {
        if (cItem.ShipmentLineKey === shipmentLineKey) {
          quantityAlreadyAdded = Math.round(cItem.Quantity);
        }
      });
    }

    const payload = {
      ShipmentKey: shipmentKey,
      Containers: {
        Container: {
          ShipmentKey: shipmentKey,
          ShipmentContainerKey: shipmentContainerKey,
          ContainerDetails: {
            ContainerDetail: {
              ShipmentKey: shipmentKey,
              ShipmentLineKey: shipmentLineKey,
              Quantity: quantity + quantityAlreadyAdded,
            },
          },
        },
      },
    };

    return httpProcessor(
      StringFormat(
        API_ROOT + URI.UPDATE_SHIPMENT_CONTAINER,
        userDetails.LoginID,
        userDetails.UserToken,
        API_CONSTANTS.TEMPLATE_KEY.SHIP_CONTAINER
      ),
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      }
    ).then((data) => {
      dispatch(updateShipmentDataInReducer(shipmentKey, data));
    });
  };
};

export const deleteContainerItem = (
  shipmentKey,
  shipmentContainerKey,
  shipmentLineKey
) => {
  return async (dispatch) => {
    const userDetails = getUserDetails();

    if (!userDetails) {
      return;
    }

    const payload = {
      ShipmentKey: shipmentKey,
      Containers: {
        Container: {
          ShipmentContainerKey: shipmentContainerKey,
          ContainerDetails: {
            ContainerDetail: {
              Action: "Delete",
              ShipmentLineKey: shipmentLineKey,
            },
          },
        },
      },
    };

    return httpProcessor(
      StringFormat(
        API_ROOT + URI.UPDATE_SHIPMENT_CONTAINER,
        userDetails.LoginID,
        userDetails.UserToken,
        API_CONSTANTS.TEMPLATE_KEY.SHIP_CONTAINER
      ),
      {
        method: "PATCH",
        body: JSON.stringify(payload),
        doNotHandleLoader: true,
      }
    ).then((data) => {
      dispatch(updateShipmentDataInReducer(shipmentKey, data));
    });
  };
};

export const deleteContainer = (shipmentKey, shipmentContainerKey) => {
  return async (dispatch) => {
    const userDetails = getUserDetails();

    if (!userDetails) {
      return;
    }
    const payload = {
      ShipmentKey: shipmentKey,
      Containers: {
        Container: {
          Action: "Delete",
          ShipmentContainerKey: shipmentContainerKey,
        },
      },
    };

    return httpProcessor(
      StringFormat(
        API_ROOT + URI.UPDATE_SHIPMENT_CONTAINER,
        userDetails.LoginID,
        userDetails.UserToken,
        API_CONSTANTS.TEMPLATE_KEY.SHIP_CONTAINER
      ),
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      }
    ).then((data) => {
      dispatch(updateShipmentDataInReducer(shipmentKey, data));
    });
  };
};

export const updateContainerTrackingNumber = (
  shipmentKey,
  containersTrackingNo,
  isPackingCompleted
) => {
  return async (dispatch) => {
    const userDetails = getUserDetails();

    if (!userDetails) {
      return;
    }

    let payload = {
      ShipmentKey: shipmentKey,
      Containers: {
        Container: [],
      },
    };

    payload.Containers.Container = Object.keys(containersTrackingNo).map(
      (shipmentContainerKey) => {
        return {
          ShipmentContainerKey: shipmentContainerKey,
          TrackingNo: containersTrackingNo[shipmentContainerKey],
        };
      }
    );

    return httpProcessor(
      StringFormat(
        API_ROOT + URI.UPDATE_SHIPMENT,
        userDetails.LoginID,
        userDetails.UserToken,
        API_CONSTANTS.TEMPLATE_KEY.SHIP_CONTAINER
      ),
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      }
    ).then((data) => {
      return changeShipmnetStatus(
        shipmentKey,
        API_CONSTANTS.TRANSACTION_ID.PACK_SHIPMENT_COMPLETE,
        isPackingCompleted
          ? API_CONSTANTS.ALL_SHIPMENTS.SHIPMENTS_TO_SHIP.STATUS
          : API_CONSTANTS.ALL_SHIPMENTS.PACKING_IN_PROGRESS.STATUS
      );
    });
  };
};
