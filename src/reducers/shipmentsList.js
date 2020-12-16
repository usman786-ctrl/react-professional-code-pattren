import { ShipmentsList } from "../constants/shipmentsList";
import { SHIPMENT_TYPE_NAMES_BY_NAME } from "../config/config";
import { getShipmentListKey } from "../config/util";
import { cloneDeep } from "lodash";

const initialState = {
  pdfOwenerDetail: {},
  returnOrderList: [],
  shipments: [],

  shipmentListDetailByKey: {
    // "SHP-1300": {
    // }
  },
};

const initialListState = {
  pageData: {},
  shipmentsList: [],
  shipmentsListForCsv: [],
  lastPage: 0,
};

Object.values(SHIPMENT_TYPE_NAMES_BY_NAME).map((dt) => {
  initialState.shipmentListDetailByKey[getShipmentListKey(dt)] = cloneDeep(
    initialListState
  );
});

function ShipmentsListReducer(state = initialState, action) {
  switch (action.type) {
    case ShipmentsList.UPDATE_SHIPMENTS_LIST:
      state.shipmentListDetailByKey[
        getShipmentListKey(action.payload.statusDetails)
      ] = {
        ...state.shipmentListDetailByKey[
          getShipmentListKey(action.payload.statusDetails)
        ],
        shipmentsList: action.payload.shipmentsList,
        pageData: action.payload.pageData,
        lastPage: action.payload.lastPage,
      };

      return {
        ...state,
      };

    case ShipmentsList.UPDATE_SHIPMENTS_LIST_FOR_CSV:
      state.shipmentListDetailByKey[
        getShipmentListKey(action.payload.statusDetails)
      ] = {
        ...state.shipmentListDetailByKey[
          getShipmentListKey(action.payload.statusDetails)
        ],
        shipmentsListForCsv: action.payload.shipmentsList,
      };

      return {
        ...state,
      };

    case ShipmentsList.PDF_OWNER_DETAIL:
      return {
        ...state,
        pdfOwenerDetail: action.payload,
      };

    case ShipmentsList.REUTRN_ORDER_LIST:
      return {
        ...state,
        returnOrderList: action.payload,
      };

    case ShipmentsList.RESET_SHIPMENT_LIST_STATE:
      state.shipmentListDetailByKey[
        getShipmentListKey(action.payload.statusDetails)
      ] = cloneDeep(initialListState);
      return {
        ...state,
      };

    default:
      return state;
  }
}

export default ShipmentsListReducer;
