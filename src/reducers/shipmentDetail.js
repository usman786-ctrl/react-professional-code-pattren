import { ShipmentDetail } from "../constants/shipmentDetail";

export const initialShipmentData = {
  shortageCodes: [],
  customerVerificationCodes: [],
  selectedVerificationType: "",
  noteText: "",
  EnterpriseCode: "",
  HoldLocation: "",
  OrderNo: "",
  Containers: "",
  ShipmentKey: "",
  ShipmentLines: {
    ShipmentLine: [],
  },
  isBoxingDone: false,
  isShipmentPickDone: "",
  isShipmentPickDoneUpdatedOnServer: false,
  isBoxingDoneUpdatedOnServer: false,
};

const initialState = {
  carriersList: [],
  selectedCarrier: "",
  shipmentListToShip: [],
  carrierList: [],
  isAllShipmentsUncheckForTracking: true,
  shipments: [],
  shipmentsByKey: {
    // 123456789: {
    //   shortageCodes: [],
    //   enterpriseCode: "",
    //   holdLocation: "",
    //   shipments: [],
    //   orderNo: "",
    // },
  },
  activeShipment: "",
};

function ShipmentDetailReducer(state = initialState, action) {
  switch (action.type) {
    case ShipmentDetail.START_SHIPMENT:
      return {
        ...state,
        shipments: action.payload,
      };

    case ShipmentDetail.UPDATE_ACTIVE_SHIPMENT:
      return {
        ...state,
        activeShipment: action.payload,
        ...(action.payload
          ? {
              shipmentsByKey: {
                ...state.shipmentsByKey,
                [action.payload]: {
                  ...state.shipmentsByKey[action.payload],
                  statusDetails: {
                    ...state.shipmentsByKey?.[action.payload]?.statusDetails,
                    ...action.statusDetails,
                  },
                },
              },
            }
          : null),
      };

    case ShipmentDetail.UPDATE_SHIPMENT_DATA:
      return {
        ...state,
        shipmentsByKey: {
          ...state.shipmentsByKey,
          [action.shipmentKey]: {
            ...state.shipmentsByKey[action.shipmentKey],
            ...action.payload,
          },
        },
      };

    case ShipmentDetail.UPDATE_SHIPMENT_DETAILS:
      return {
        ...state,
        shipmentsByKey: {
          ...state.shipmentsByKey,
          [state.activeShipment]: {
            ...state.shipmentsByKey[state.activeShipment],
            ShipmentLines: action.payload.ShipmentLines,
            isShipmentChanged: action.payload.isShipmentChanged,
            isShipmentPickDone: action.payload.isShipmentPickDone,
          },
        },
      };

    case ShipmentDetail.UPDATE_SHORTAGE_CODES:
      return {
        ...state,
        shipmentsByKey: {
          ...state.shipmentsByKey,
          [action.payload.shipmentKey]: {
            ...state.shipmentsByKey[action.payload.shipmentKey],
            shortageCodes: action.payload.data,
          },
        },
      };

    case ShipmentDetail.UPDATE_CUSTOMER_VERIFICATION_CODES:
      return {
        ...state,
        shipmentsByKey: {
          ...state.shipmentsByKey,
          [action.payload.shipmentKey]: {
            ...state.shipmentsByKey[action.payload.shipmentKey],
            customerVerificationCodes: action.payload.data,
          },
        },
      };

    case ShipmentDetail.UPDATE_CONTAINERS:
      return {
        ...state,
        containers: action.payload.containers,
        isBoxingDone: action.payload.isBoxingDone,
      };

    case ShipmentDetail.UPDATE_CARRIERS_LIST:
      return {
        ...state,
        carriersList: action.payload,
      };

    case ShipmentDetail.UPDATE_SELECTED_CARRIER:
      return {
        ...state,
        selectedCarrier: action.payload,
      };

    case ShipmentDetail.UPDATE_SHIPMENT_LIST_TO_SHIP:
      return {
        ...state,
        shipmentListToShip: action.payload,
      };

    case ShipmentDetail.CARRIERS_LIST:
      return {
        ...state,
        carrierList: action.payload,
      };

    case ShipmentDetail.UPDATE_CARRIERS_LIST:
      return {
        ...state,
        carriersList: action.payload,
      };

    case ShipmentDetail.UPDATE_SELECTED_CARRIER:
      return {
        ...state,
        selectedCarrier: action.payload,
      };

    case ShipmentDetail.UPDATE_SHIPMENTS:
      return {
        ...state,
        shipments: action.payload.shipments,
        isAllShipmentsUncheckForTracking:
          action.payload.isAllShipmentsUncheckForTracking,
      };

    // case ShipmentDetail.RESET_SHIPMENT_DETAIL_STATE:
    //   return initialState;

    default:
      return state;
  }
}

export default ShipmentDetailReducer;
