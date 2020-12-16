import {
  API_CONSTANTS,
  API_ROOT,
  StringFormat,
  URI,
} from "../../src/config/config";
import { getUserDetails, httpProcessor } from "../actions/app";
import { ShipmentsList } from "../constants/shipmentsList";

export const getShipmentsList = (
  shipmentListPayload,
  pageData,
  statusDetails
) => {
  return async (dispatch, getState) => {
    const userDetails = getUserDetails();

    if (!userDetails) {
      return;
    }
    const CUSTOM_PAGE_LIMIT = getState().AppDetail.SHIPMENTS_LIST_PAGE_SIZE;
    console.log("--order list call-", CUSTOM_PAGE_LIMIT);
    const payload = {
      ShipNode: userDetails.OrganizationCode,
      // ShipmentNo: shipmentListPayload.shipmentNo || '',
      ShipmentLines: {
        ShipmentLine: {
          OrderNo: shipmentListPayload.orderNo || "",
        },
      },
      BillToAddress: {
        DayPhone: shipmentListPayload.customerPhone,
        EMailID: shipmentListPayload.customerEmail,
      },
      Extn: { ExtnSearchType: "LIST" },
      Paginate: {
        PageNumber: pageData.currentPage,
        PageSize: CUSTOM_PAGE_LIMIT * pageData.currentPage,
        PaginationStrategy: "NEXTPAGE",
        PreviousPage: { PageNumber: pageData.prevPage },
      },
    };

    if (shipmentListPayload.tab && shipmentListPayload.type) {
      payload.Status =
        API_CONSTANTS[shipmentListPayload.tab][shipmentListPayload.type].STATUS;
      payload.DeliveryMethod =
        API_CONSTANTS[shipmentListPayload.tab][
          shipmentListPayload.type
        ].DELIVERY_METHOD;
    }

    return httpProcessor(
      StringFormat(
        API_ROOT + URI.SHIPMENT_LIST,
        userDetails.LoginID,
        userDetails.UserToken,
        userDetails.OrganizationCode,
        API_CONSTANTS.TEMPLATE_KEY.SHIPMENT_LIST
      ),
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    ).then((data) => {
      console.log("getShipmentsList api data", data);

      if (data && data.Shipment && data.PageData) {
        let shipmentsList = data.Shipment;
        let pageData = data.PageData;
        let lastPage = 0;

        if (shipmentsList && shipmentsList.length > 0) {
          const deliveryMethod = shipmentsList[0].DeliveryMethod;
          const status = shipmentsList[0].Status;
        }

        if (
          pageData.IsLastPage &&
          pageData.PageNumber &&
          pageData.IsLastPage === "Y"
        ) {
          lastPage = parseInt(pageData.PageNumber);
        }

        dispatch({
          type: ShipmentsList.UPDATE_SHIPMENTS_LIST,
          payload: {
            shipmentsList,
            pageData,
            lastPage,
            statusDetails,
          },
        });
      } else {
        dispatch(
          getShipmentsListShipment(shipmentListPayload, pageData, statusDetails)
        );
        dispatch(
          getShipmentsListForCSvShipment(shipmentListPayload, statusDetails)
        );
      }
    });
  };
};

export const getShipmentsListShipment = (
  shipmentListPayload,
  pageData,
  statusDetails
) => {
  return async (dispatch, getState) => {
    const userDetails = getUserDetails();

    if (!userDetails) {
      return;
    }
    const CUSTOM_PAGE_LIMIT = getState().AppDetail.SHIPMENTS_LIST_PAGE_SIZE;
    console.log("--getShipmentsListShipment list call-");
    const payload = {
      ShipNode: userDetails.OrganizationCode,
      ShipmentNo: shipmentListPayload.orderNo || "",
      // ShipmentLines: {
      //     ShipmentLine: {
      //         OrderNo: shipmentListPayload.orderNo || ''
      //     }
      // },
      BillToAddress: {
        DayPhone: shipmentListPayload.customerPhone,
        EMailID: shipmentListPayload.customerEmail,
      },
      Extn: { ExtnSearchType: "LIST" },
      Paginate: {
        PageNumber: pageData.currentPage,
        PageSize: CUSTOM_PAGE_LIMIT * pageData.currentPage,
        PaginationStrategy: "NEXTPAGE",
        PreviousPage: { PageNumber: pageData.prevPage },
      },
    };

    if (shipmentListPayload.tab && shipmentListPayload.type) {
      payload.Status =
        API_CONSTANTS[shipmentListPayload.tab][shipmentListPayload.type].STATUS;
      payload.DeliveryMethod =
        API_CONSTANTS[shipmentListPayload.tab][
          shipmentListPayload.type
        ].DELIVERY_METHOD;
    }

    return httpProcessor(
      StringFormat(
        API_ROOT + URI.SHIPMENT_LIST,
        userDetails.LoginID,
        userDetails.UserToken,
        userDetails.OrganizationCode,
        API_CONSTANTS.TEMPLATE_KEY.SHIPMENT_LIST
      ),
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    ).then((data) => {
      console.log("getShipmentsList api data--getShipmentsListShipment-", data);

      if (data && data.Shipment && data.PageData) {
        let shipmentsList = data.Shipment;
        let pageData = data.PageData;
        let lastPage = 0;

        if (shipmentsList && shipmentsList.length > 0) {
          const deliveryMethod = shipmentsList[0].DeliveryMethod;
          const status = shipmentsList[0].Status;
        }

        if (
          pageData.IsLastPage &&
          pageData.PageNumber &&
          pageData.IsLastPage === "Y"
        ) {
          lastPage = parseInt(pageData.PageNumber);
        }

        dispatch({
          type: ShipmentsList.UPDATE_SHIPMENTS_LIST,
          payload: {
            shipmentsList,
            pageData,
            lastPage,
            statusDetails,
          },
        });
      }
    });
  };
};

// export const getShipmentsList = (shipmentListPayload, pageData) => {
//   return async (dispatch) => {
//     let promises =[];
//     promises.push(dispatch(getShipmentsListOrder(shipmentListPayload, pageData)));
//   }
// }

export const getPdfOwerData = () => {
  return async (dispatch) => {
    const userDetails = getUserDetails();

    if (!userDetails) {
      return;
    }

    return httpProcessor(
      StringFormat(
        API_ROOT + URI.PDF_OWNER,
        userDetails.UserToken,
        userDetails.OrganizationCode,
        userDetails.LoginID
      ),
      {
        method: "GET",
      }
    ).then((data) => {
      if (data && data.length > 0) {
        dispatch({
          type: ShipmentsList.PDF_OWNER_DETAIL,
          payload: data[0],
        });
      }
    });
  };
};

export const getShipmentsListForCSv = (shipmentListPayload, statusDetails) => {
  return async (dispatch) => {
    const userDetails = getUserDetails();

    if (!userDetails) {
      return;
    }

    const payload = {
      ShipNode: userDetails.OrganizationCode,
      // ShipmentNo: shipmentListPayload.orderNo || '',
      ShipmentLines: {
        ShipmentLine: {
          OrderNo: shipmentListPayload.orderNo || "",
        },
      },
      BillToAddress: {
        DayPhone: shipmentListPayload.customerPhone,
        EMailID: shipmentListPayload.customerEmail,
      },
      Extn: { ExtnSearchType: "LIST" },
      // Paginate: {
      //   PageNumber: pageData.currentPage,
      //   PageSize: API_CONSTANTS.SHIPMENTS_LIST_PAGE_SIZE * pageData.currentPage,
      //   PaginationStrategy: "NEXTPAGE",
      //   PreviousPage: { PageNumber: pageData.prevPage }
      // }
    };

    if (shipmentListPayload.tab && shipmentListPayload.type) {
      payload.Status =
        API_CONSTANTS[shipmentListPayload.tab][shipmentListPayload.type].STATUS;
      payload.DeliveryMethod =
        API_CONSTANTS[shipmentListPayload.tab][
          shipmentListPayload.type
        ].DELIVERY_METHOD;
    }

    return httpProcessor(
      StringFormat(
        API_ROOT + URI.SHIPMENT_LIST,
        userDetails.LoginID,
        userDetails.UserToken,
        userDetails.OrganizationCode,
        API_CONSTANTS.TEMPLATE_KEY.SHIPMENT_LIST
      ),
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    ).then((data) => {
      console.log("getShipmentsList api data --csv", data);

      if (data && data.Shipment) {
        let shipmentsList = data.Shipment;
        // let pageData = data.PageData;
        let lastPage = 0;

        if (shipmentsList && shipmentsList.length > 0) {
          const deliveryMethod = shipmentsList[0].DeliveryMethod;
          const status = shipmentsList[0].Status;
        }

        // if (pageData.IsLastPage && pageData.PageNumber && pageData.IsLastPage === "Y") {
        //   lastPage = parseInt(pageData.PageNumber)
        // }

        dispatch({
          type: ShipmentsList.UPDATE_SHIPMENTS_LIST_FOR_CSV,
          payload: { shipmentsList, statusDetails },
        });
      }
    });
  };
};

export const getShipmentsListForCSvShipment = (
  shipmentListPayload,
  statusDetails
) => {
  return async (dispatch) => {
    const userDetails = getUserDetails();

    if (!userDetails) {
      return;
    }

    const payload = {
      ShipNode: userDetails.OrganizationCode,
      ShipmentNo: shipmentListPayload.orderNo || "",
      // ShipmentLines: {
      //     ShipmentLine: {
      //         OrderNo: shipmentListPayload.orderNo || ''
      //     }
      // },
      BillToAddress: {
        DayPhone: shipmentListPayload.customerPhone,
        EMailID: shipmentListPayload.customerEmail,
      },
      Extn: { ExtnSearchType: "LIST" },
      // Paginate: {
      //   PageNumber: pageData.currentPage,
      //   PageSize: API_CONSTANTS.SHIPMENTS_LIST_PAGE_SIZE * pageData.currentPage,
      //   PaginationStrategy: "NEXTPAGE",
      //   PreviousPage: { PageNumber: pageData.prevPage }
      // }
    };

    if (shipmentListPayload.tab && shipmentListPayload.type) {
      payload.Status =
        API_CONSTANTS[shipmentListPayload.tab][shipmentListPayload.type].STATUS;
      payload.DeliveryMethod =
        API_CONSTANTS[shipmentListPayload.tab][
          shipmentListPayload.type
        ].DELIVERY_METHOD;
    }

    return httpProcessor(
      StringFormat(
        API_ROOT + URI.SHIPMENT_LIST,
        userDetails.LoginID,
        userDetails.UserToken,
        userDetails.OrganizationCode,
        API_CONSTANTS.TEMPLATE_KEY.SHIPMENT_LIST
      ),
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    ).then((data) => {
      console.log("getShipmentsList api data --csv", data);

      if (data && data.Shipment) {
        let shipmentsList = data.Shipment;
        // let pageData = data.PageData;
        let lastPage = 0;

        if (shipmentsList && shipmentsList.length > 0) {
          const deliveryMethod = shipmentsList[0].DeliveryMethod;
          const status = shipmentsList[0].Status;
        }

        // if (pageData.IsLastPage && pageData.PageNumber && pageData.IsLastPage === "Y") {
        //   lastPage = parseInt(pageData.PageNumber)
        // }

        dispatch({
          type: ShipmentsList.UPDATE_SHIPMENTS_LIST_FOR_CSV,
          payload: { shipmentsList, statusDetails },
        });
      }
    });
  };
};

export const resetShipmentsListState = (statusDetails) => {
  return (dispatch) => {
    dispatch({
      type: ShipmentsList.RESET_SHIPMENT_LIST_STATE,
      payload: { statusDetails },
    });
  };
};

export const getReturnOrderList = (payload) => {
  return async (dispatch, getState) => {
    const userDetails = getUserDetails();

    if (!userDetails) {
      return;
    }
    // const CUSTOM_PAGE_LIMIT = getState().AppDetail.SHIPMENTS_LIST_PAGE_SIZE;
    // console.log('--order list call-', CUSTOM_PAGE_LIMIT);
    // const payload = {
    //   ShipNode: userDetails.OrganizationCode,
    //   ShipmentLines: {
    //       ShipmentLine: {
    //           OrderNo: shipmentListPayload.orderNo || ''
    //       }
    //   },
    //   BillToAddress: {
    //       DayPhone: shipmentListPayload.customerPhone,
    //       EMailID: shipmentListPayload.customerEmail
    //   },
    //   Extn: { ExtnSearchType: "LIST" },
    //   Paginate: {
    //     PageNumber: pageData.currentPage,
    //     PageSize: CUSTOM_PAGE_LIMIT * pageData.currentPage,
    //     PaginationStrategy: "NEXTPAGE",
    //     PreviousPage: { PageNumber: pageData.prevPage }
    //   }
    // }

    // if(shipmentListPayload.tab && shipmentListPayload.type) {
    //   payload.Status = API_CONSTANTS[shipmentListPayload.tab][shipmentListPayload.type].STATUS;
    //   payload.DeliveryMethod = API_CONSTANTS[shipmentListPayload.tab][shipmentListPayload.type].DELIVERY_METHOD;
    // }

    return httpProcessor(
      StringFormat(
        API_ROOT + URI.RETURN_ORDER_SEARCH,
        userDetails.UserToken,
        API_CONSTANTS.RETURN_ORDER_SEARCH_KEY.STATUS,
        API_CONSTANTS.RETURN_ORDER_SEARCH_KEY.DOCUMENT_TYPE,
        payload.phoneNo,
        userDetails.LoginID,
        API_CONSTANTS.RETURN_ORDER_SEARCH_KEY.TEMPLATE_KEY,
        payload.email,
        payload.firstName,
        payload.lastName
      ),
      {
        method: "GET",
        // body: JSON.stringify(payload),
      }
    ).then((data) => {
      console.log("retur order data---", data);
      if (data && data.length > 0) {
        data = data.filter((dt) => {
          if (
            dt.OrderLines &&
            dt.OrderLines.OrderLine &&
            dt.OrderLines.OrderLine.length > 0
          ) {
            if (
              dt.OrderLines.OrderLine[0].OrderStatuses &&
              dt.OrderLines.OrderLine[0].OrderStatuses.OrderStatus &&
              dt.OrderLines.OrderLine[0].OrderStatuses.OrderStatus.length > 0
            ) {
              if (
                dt.OrderLines.OrderLine[0].OrderStatuses.OrderStatus[0]
                  .Status == API_CONSTANTS.RETURN_ORDER_SEARCH_KEY.STATUS &&
                Number(
                  dt.OrderLines.OrderLine[0].OrderStatuses.OrderStatus[0]
                    .StatusQty
                ) > 0
              ) {
                return true;
              }
            }
          }
        });
      }
      dispatch({
        type: ShipmentsList.REUTRN_ORDER_LIST,
        payload: data,
      });
    });
  };
};
