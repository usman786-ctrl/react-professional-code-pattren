import { AllPicks } from '../constants/allPicks';

const initialState = {
    customerPicksTotals: '',
    shipmentPicksTotals: '',
    customerPicksInProgressTotals: '',
    shipmentPicksInProgressTotals: '',
}

function AllPicksReducer(state = initialState, action) {

    switch (action.type) {
        case AllPicks.UPDATE_CUSTOMER_PICKS_TOTALS:
            return {
                ...state,
                customerPicksTotals: action.payload
            }

        case AllPicks.UPDATE_SHIPMENT_PICKS_TOTALS:
            return {
                ...state,
                shipmentPicksTotals: action.payload
            }

        case AllPicks.UPDATE_CUSTOMER_PICKS_IN_PROGRESS_TOTALS:
            return {
                ...state,
                customerPicksInProgressTotals: action.payload
            }

        case AllPicks.UPDATE_SHIPMENT_PICKS_IN_PROGRESS_TOTALS:
            return {
                ...state,
                shipmentPicksInProgressTotals: action.payload
            }

        default:
            return state;
    }
}

export default AllPicksReducer;