import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import AppReducer from "../reducers/app";
import ShipmentDetailReducer from "../reducers/shipmentDetail";
import AllPicksReducer from "../reducers/allPicks";
import AllShipmentsReducer from "../reducers/allShipments";
import ShipmentsListReducer from "../reducers/shipmentsList";
// import ShipmentShipReducer from '../reducers/shipmentShip';
import { createBrowserHistory } from "history";
import { routerMiddleware, connectRouter } from "connected-react-router";

import thunk from "redux-thunk";

export const history = createBrowserHistory();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  router: connectRouter(history),
  AppDetail: AppReducer,
  ShipmentDetail: ShipmentDetailReducer,
  AllPicksDetail: AllPicksReducer,
  ShipmentsListDetail: ShipmentsListReducer,
  AllShipmentsDetail: AllShipmentsReducer,
  // ShipmentShipDetail: ShipmentShipReducer
});

const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(
      routerMiddleware(history), // for dispatching history actions
      thunk
    )
  )
);

export default store;
