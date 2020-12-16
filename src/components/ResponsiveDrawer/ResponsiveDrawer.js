import React, { Component, Suspense, useEffect, useState } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { fade, makeStyles, useTheme } from "@material-ui/core/styles";
import HomeIcon from "@material-ui/icons/Home";
import Search from "@material-ui/icons/Search";
import CloseRounded from "@material-ui/icons/CloseRounded";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { getUserDetails } from "../../actions/app";
import { Switch, Route, Link, BrowserRouter } from "react-router-dom";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { CSVLink } from "react-csv";
import routes from "../../routes";
import {
  Backdrop,
  CircularProgress,
  Box,
  Button,
  InputBase,
} from "@material-ui/core";
import { connect } from "react-redux";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  advanceSearchValue,
  removeFromLeftTab,
  addToLeftMenu,
} from "../../actions/app";
import { getPdfOwerData } from "../../actions/shipmentsList";
import {
  ADVANCE_SEARCH_MENU_KEY,
  RETURN_SEARCH_MENU_KEY,
} from "../../config/config";
import AdvancedSearch from "../../views/AdvancedSearch/AdvancedSearch";
import Picks from "../../views/Picks/Picks";
import Shipments from "../../views/Shipments/Shipments";
import ShipmentsListView from "../../views/shipmentsListView/shipmentsListView";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  activeMenuTab: {
    textDecoration: "none",
    backgroundColor: "rgba(2, 2, 2, 0.28)",
  },

  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
    [theme.breakpoints.down("sm")]: {
      width: 0 + "px !important",
      flexShrink: 0,
    },
    zIndex: 0,
  },
  appBar: {
    // [theme.breakpoints.up('sm')]: {
    //   width: `calc(100% - ${drawerWidth}px)`,
    //   marginLeft: drawerWidth,
    // },
    [theme.breakpoints.up("sm")]: {
      width: "100%",
    },
  },
  menuButtonMobile: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  menuButtonDesktop: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    paddingTop: theme.spacing(3),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginTop: "45px",
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    // width: theme.spacing(7),
    right: theme.spacing(2),
    height: "100%",
    position: "absolute",
    // pointerEvents: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 5, 1, 1),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: 250,
    },
  },
}));

const loading = () => (
  <div className="animated fadeIn pt-1 text-center">Loading...</div>
);

function ResponsiveDrawer(props) {
  const { container } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [desktopOpen, setDesktopOpen] = React.useState(true);
  const [advanceSearchValue, setAdvanceSearch] = React.useState("");
  const userDetails = getUserDetails();
  const [visitedLinks, setVisitedLinks] = useState([
    // {
    //    id: Date.now(),
    //   path: '/shipment/1234',
    //   linkType: LINK_TYPES.SHIPMENT,
    //    ...otherData
    // }
  ]);

  useEffect(() => {
    console.log("use effect call----");
    props.getPdfOwerData();
  }, []);

  const handleMobileDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDesktopDrawerToggle = () => {
    setDesktopOpen(!desktopOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    props.history.push("/login");
  };

  const handleHome = () => {
    props.history.push("/");
  };

  const handleSearch = () => {
    props.history.push("/orderSearch");
  };

  const handleAdvanceSearch = () => {
    props.history.push("/advanceSearch");
    const payload = {
      OrderNo: ADVANCE_SEARCH_MENU_KEY,
      shipmentKey: "",
      url: "/advanceSearch",
    };
    props.addToLeftMenu(payload, "");
  };

  const gotoReturnSearch = () => {
    props.history.push("/returnSearch");
    const payload = {
      OrderNo: RETURN_SEARCH_MENU_KEY,
      shipmentKey: "",
      url: "/returnSearch",
    };
    props.addToLeftMenu(payload, "");
  };

  //
  // leftMenuList

  function hanldeLeftPanelClick(data) {
    console.log("-data-", data);
    // props.history.push(url)
    if (data && data.state) {
      props.history.push({
        pathname: data.url,
        state: data.state,
      });
    } else {
      props.history.push(data.url);
    }
  }

  function removeLeftTab(data) {
    console.log("[-revomve cll-------", data);
    props.removeFromLeftTab(data.OrderNo);

    if (data && data.url && data.url == props.location.pathname) {
      const index = props.leftMenuList.findIndex(
        (res) => res.OrderNo == data.OrderNo
      );
      const newRoute = props.leftMenuList[index + 1];
      if (newRoute && newRoute.url) {
        hanldeLeftPanelClick(newRoute);
      } else {
        const firstRoute = props.leftMenuList[0];
        if (
          firstRoute &&
          firstRoute.url &&
          data.OrderNo != firstRoute.OrderNo
        ) {
          hanldeLeftPanelClick(firstRoute);
        } else {
          handleHome();
        }
      }
    }
  }

  function extraViewList() {
    console.log("-leftMenuList---", props.leftMenuList);
    return props.leftMenuList
      .map((data) => {
        return (
          <ListItem
            className={
              data.url == props.location.pathname ||
              (props.location.pathname.includes("/advanceSearch") &&
                data.url.includes(props.location.pathname))
                ? classes.activeMenuTab
                : ""
            }
            button
          >
            <ListItemIcon style={{ minWidth: "40px" }}>
              {data.url?.includes("/advanceSearch") ? (
                <Search color="primary" />
              ) : (
                <ShoppingCartIcon color="primary" />
              )}
            </ListItemIcon>
            <ListItemText
              onClick={() => hanldeLeftPanelClick(data)}
              style={{ minWidth: "40px" }}
            >
              {data.OrderNo}
            </ListItemText>
            <ListItemIcon
              onClick={() => removeLeftTab(data)}
              style={{ minWidth: "40px" }}
            >
              <CloseRounded
                color="danger"
                style={{ fontSize: "large", marginLeft: "auto" }}
              />
            </ListItemIcon>
          </ListItem>
        );
      })
      .concat(
        visitedLinks.map((dt) => {
          return (
            <ListItem
              className={
                props.location?.pathname?.includes(dt.shipmentKey)
                  ? classes.activeMenuTab
                  : ""
              }
              button
            >
              <ListItemIcon style={{ minWidth: "40px" }}>
                <ShoppingCartIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                onClick={() => props.history.push(dt.path)}
                style={{ minWidth: "40px" }}
              >
                {dt.OrderNo}
              </ListItemText>
              <ListItemIcon
                onClick={() =>
                  setVisitedLinks((prevLinks) =>
                    prevLinks.filter((u) => u.id !== dt.id)
                  )
                }
                style={{ minWidth: "40px" }}
              >
                <CloseRounded
                  color="danger"
                  style={{ fontSize: "large", marginLeft: "auto" }}
                />
              </ListItemIcon>
            </ListItem>
          );
        })
      );
  }

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        <ListItem button onClick={handleHome}>
          <ListItemIcon style={{ minWidth: "40px" }}>
            <HomeIcon color="primary" />
          </ListItemIcon>
          <ListItemText style={{ minWidth: "40px" }}>Home</ListItemText>
        </ListItem>

        {extraViewList()}
        {/* <ListItem button onClick={handleHome}>
          <ListItemIcon>
            <HomeIcon color="primary" />
          </ListItemIcon>
          <ListItemText>Home</ListItemText>
        </ListItem> */}
      </List>
    </div>
  );

  function downloadPdf() {
    if (
      props &&
      props.shipmentsListForCsv &&
      props.shipmentsListForCsv.length > 0 &&
      (props.location.pathname == "/shipmentsList" ||
        props.location.pathname == "/advanceSearch")
    ) {
      let csvData = [];
      const doc = new jsPDF("p", "pt");
      doc.autoTable({ html: "#my-table" });

      props.shipmentsListForCsv.map((data) => {
        const orderNo = data.ShipmentLines.ShipmentLine[0].OrderNo;
        const shipmentNo = data.ShipmentNo;
        const items = Math.round(data.TotalNumOfPickableSKUs);

        csvData.push([
          orderNo,
          shipmentNo,
          "Not available",
          "Not available",
          items,
        ]);
      });

      let organizationName = "";
      let address = "";
      if (props.pdfOwenerDetail && props.pdfOwenerDetail.OrganizationName) {
        organizationName = props.pdfOwenerDetail.OrganizationName;
      }

      if (
        props.pdfOwenerDetail &&
        props.pdfOwenerDetail.CorporatePersonInfo &&
        props.pdfOwenerDetail.CorporatePersonInfo
      ) {
        if (props.pdfOwenerDetail.CorporatePersonInfo.AddressLine1) {
          address =
            address +
            props.pdfOwenerDetail.CorporatePersonInfo.AddressLine1 +
            ",";
        }

        if (props.pdfOwenerDetail.CorporatePersonInfo.AddressLine2) {
          address =
            address +
            props.pdfOwenerDetail.CorporatePersonInfo.AddressLine2 +
            ",";
        }

        if (props.pdfOwenerDetail.CorporatePersonInfo.City) {
          address =
            address + props.pdfOwenerDetail.CorporatePersonInfo.City + " ";
        }

        if (props.pdfOwenerDetail.CorporatePersonInfo.State) {
          address =
            address + props.pdfOwenerDetail.CorporatePersonInfo.State + " ";
        }

        if (props.pdfOwenerDetail.CorporatePersonInfo.Country) {
          address = address + props.pdfOwenerDetail.CorporatePersonInfo.Country;
        }
      }

      let headerText = "";
      if (
        props.location.state &&
        props.location.state.shipmentListPayload &&
        props.location.state.shipmentListPayload.type
      ) {
        if (
          props.location.state.shipmentListPayload.type ==
          "CUSTOMER_PICKS_IN_PROGRESS"
        ) {
          headerText = "Customer picks in progress";
        } else if (
          props.location.state.shipmentListPayload.type ==
          "SHIPMENT_PICKS_IN_PROGRESS"
        ) {
          headerText = "Shipment picks in progress";
        } else {
          headerText = "Advance picks in progress";
        }
      }

      const headerDivider =
        "-------------------------------------------------------------------------------------";
      var header = function (data) {
        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.setFontStyle("normal");
        doc.text(headerText, data.settings.margin.left, 120);
        doc.text(organizationName, data.settings.margin.left, 40);
        doc.text(address, data.settings.margin.left, 70);
        doc.text(new Date().toDateString(), data.settings.margin.left, 90);
        // console.log(st.toDateString());
        doc.text(headerDivider, data.settings.margin.left, 100);
      };

      var options = {
        beforePageContent: header,
        margin: {
          top: 100,
        },
        startY: doc.autoTableEndPosY() + 90,
      };

      doc.autoTable(
        ["Order No", "Shipment No", "Order Date", "Status", "No of Items"],
        csvData,
        options
      );

      const pdfName = Date.now();

      doc.save(`table_${pdfName}.pdf`);
    }
  }

  function handlerAdvanceSearch(e) {
    if (e.key == "Enter") {
      props.advanceSearchValue(advanceSearchValue);
      props.history.push("/advanceSearch");
      const payload = {
        OrderNo: ADVANCE_SEARCH_MENU_KEY,
        shipmentKey: "",
        url: "/advanceSearch",
      };
      props.addToLeftMenu(payload, "");
    }
  }

  function handlerAdvanceSearchFromIcon(e) {
    props.advanceSearchValue(advanceSearchValue);
    props.history.push("/advanceSearch");
    const payload = {
      OrderNo: ADVANCE_SEARCH_MENU_KEY,
      shipmentKey: "",
      url: "/advanceSearch",
    };
    props.addToLeftMenu(payload, "");
  }

  function handleAdvanceChange(e) {
    let value = e.target.value;
    setAdvanceSearch(value);
  }

  console.log("-userDetails----", userDetails);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Box
            display="flex"
            // justifyContent="space-between"
            // alignItems="center"
            width="100%"
            style={{ justifyContent: "space-between" }}
          >
            <Box
              style={{ justifyContent: "space-between", display: "flex" }}
              justify="center"
            >
              <Box display="flex" alignItems="center">
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleMobileDrawerToggle}
                  className={classes.menuButtonMobile}
                >
                  <MenuIcon />
                </IconButton>

                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDesktopDrawerToggle}
                  className={classes.menuButtonDesktop}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap style={{ display: "grid" }}>
                  {props.pdfOwenerDetail &&
                  props.pdfOwenerDetail.OrganizationName
                    ? // ? `${userDetails.OrganizationCode} - ${userDetails.UserName}`
                      // ? `${userDetails.UserGroup_Name}`
                      `${props.pdfOwenerDetail.OrganizationName}`
                    : null}

                  <lablel style={{ fontSize: "small" }}>
                    {userDetails ? (
                      <>
                        <AccountCircle
                          fontSize="small"
                          style={{ marginBottom: "-6px" }}
                        />{" "}
                        {userDetails.UserName}
                      </>
                    ) : null}
                    <IconButton
                      style={{ padding: "2px" }}
                      color="inherit"
                      onClick={handleLogout}
                    >
                      <ExitToAppIcon color="inherit" />
                    </IconButton>{" "}
                  </lablel>
                </Typography>
              </Box>

              <Box
                mx={1}
                style={{
                  borderLeft: "3px solid #ffff",
                  height: "45px",
                  marginLeft: "30px",
                  marginTop: "6px",
                }}
              ></Box>
              <Box mx={1}>
                <List
                  component="nav"
                  aria-label="main mailbox folders"
                  style={{ display: "flex" }}
                >
                  <ListItem
                    selected={props.location.pathname === "/"}
                    style={{ whiteSpace: "nowrap" }}
                    button
                    color="inherit"
                    onClick={handleHome}
                  >
                    Home
                  </ListItem>
                  {/* <ListItem
                  style={{ whiteSpace: "nowrap" }}
                  button
                  color="inherit"
                  onClick={downloadPdf}
                >
                  Print Tickets
                </ListItem> */}
                  <ListItem
                    style={{ whiteSpace: "nowrap" }}
                    button
                    color="inherit"
                    onClick={gotoReturnSearch}
                  >
                    Returns
                  </ListItem>
                  <ListItem
                    // selected={props.location.pathname === "/advanceSearch"}
                    selected={props.location.pathname.includes(
                      "/advanceSearch"
                    )}
                    style={{ whiteSpace: "nowrap" }}
                    button
                    color="inherit"
                    onClick={handleAdvanceSearch}
                  >
                    Advanced Search
                  </ListItem>
                </List>
              </Box>
            </Box>
            <Box display="flex" alignItems="center">
              <Box display="flex" alignItems="center">
                <div className={classes.search}>
                  <InputBase
                    placeholder="Enter Order or Shipment Number"
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    onChange={handleAdvanceChange}
                    inputProps={{ "aria-label": "search" }}
                    onKeyPress={(e) => handlerAdvanceSearch(e)}
                  />
                  {/* onClick={handlerAdvanceSearch} */}
                  <div
                    className={classes.searchIcon}
                    id="seachIconFind"
                    onClick={(e) => handlerAdvanceSearchFromIcon(e)}
                  >
                    <SearchIcon />
                  </div>
                </div>

                {/* <IconButton color="inherit" onClick={handleLogout}>
                <ExitToAppIcon color="inherit" />
              </IconButton> */}
              </Box>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <nav
        className={classes.drawer}
        aria-label="mailbox folders"
        style={{ width: desktopOpen ? `${drawerWidth}px` : 0 }}
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleMobileDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            style={{ display: desktopOpen ? "block" : "none" }}
            variant="permanent"
            open={desktopOpen}
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>

      <main className={classes.content}>
        <Box py={3} height="100%">
          <Suspense fallback={loading()}>
            <Route
              {...{
                path: "/advanceSearch",
                name: "Advance Search",
              }}
              children={(props) => <AdvancedSearch {...props} />} // children will prevent from remounting
            />

            <Route
              {...{
                path: "/shipmentsList",
                name: "Shipments List",
              }}
              exact={true}
              children={(props) => <ShipmentsListView {...props} />} // children will prevent from remounting
            />

            <Route
              {...{
                path: "/shipments/:shipmentKey",
                name: "Shipment",
              }}
              children={(props) => (
                <Shipments
                  {...props}
                  visitedLinks={visitedLinks}
                  setVisitedLinks={setVisitedLinks}
                />
              )} // children will prevent from remounting
            />

            <Switch>
              {routes.map((route, idx) => {
                return route.component ? (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    render={(props) => <route.component {...props} />}
                  />
                ) : null;
              })}
            </Switch>
          </Suspense>
        </Box>
      </main>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          zIndex: 99999,
        }}
      >
        <Backdrop open={props.isLoading}>
          <CircularProgress color="primary" />
        </Backdrop>
      </div>
    </div>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  container: PropTypes.any,
};

const mapStateToProps = (state) => {
  return {
    shipmentsByKey: state.ShipmentDetail.shipmentsByKey,
    isLoading: state.AppDetail.isLoading,
    shipmentsList: state.ShipmentsListDetail.shipmentsList,
    shipmentsListForCsv: state.ShipmentsListDetail.shipmentsListForCsv,
    pdfOwenerDetail: state.ShipmentsListDetail.pdfOwenerDetail,
    leftMenuList: state.AppDetail.leftMenuList,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    advanceSearchValue: (value) => dispatch(advanceSearchValue(value)),
    removeFromLeftTab: (id) => dispatch(removeFromLeftTab(id)),
    addToLeftMenu: (payload, lastActiveList) =>
      dispatch(addToLeftMenu(payload, lastActiveList)),
    getPdfOwerData: () => dispatch(getPdfOwerData()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ResponsiveDrawer);
