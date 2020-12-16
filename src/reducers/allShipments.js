import { AllShipments } from '../constants/allShipments';

const initialState = {
  shipmentsToPackTotals: '',
  packingInProgressTotals: '',
  shipmentsToShipTotals: '',
}

function AllShipmentsReducer(state = initialState, action) {

    switch (action.type) {
        case AllShipments.UPDATE_SHIPMENTS_TO_PACK_TOTALS:
            return {
                ...state,
                shipmentsToPackTotals: action.payload
            }

        case AllShipments.UPDATE_PACKING_IN_PROGRESS_TOTALS:
            return {
                ...state,
                packingInProgressTotals: action.payload
            }

        case AllShipments.UPDATE_SHIPMENTS_TO_SHIP_TOTALS:
            return {
                ...state,
                shipmentsToShipTotals: action.payload
            }

        default:
            return state;
    }
}

export default AllShipmentsReducer;