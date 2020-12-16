import React from "react";
import ReturnSearch from "./views/ReturnSearch/index";
import ShipmentsListView from "./views/shipmentsListView/shipmentsListView.js";
import StartShip from "./views/StartShip/StartShip";
const Home = React.lazy(() => import("./views/Home/Home.js"));

const routes = [
  { path: "/", name: "Home", component: Home, exact: true },
  {
    path: "/startShip",
    exact: true,
    name: "Start Shipment",
    component: StartShip,
  },
  {
    path: "/returnSearch",
    exact: true,
    name: "Return Search",
    component: ReturnSearch,
  },
];

export default routes;
