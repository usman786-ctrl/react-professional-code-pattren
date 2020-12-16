import React, { Component } from "react";
import styles from "../AdvancedSearch/AdvancedSearch.styles";
import { connect } from "react-redux";
import {
  Button,
  Box,
  Grid,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Card,
  Checkbox,
  FormControlLabel,
  withStyles,
  InputBase,
  OutlinedInput,
  FormControl,
  InputAdornment,
  FormHelperText,
  IconButton,
  Fab
} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ShipmentsList from "../../components/ShipmentsList/ShipmentsList";
import SearchIcon from "@material-ui/icons/Search";
import { resetShipmentsListState, getReturnOrderList } from '../../actions/shipmentsList';
import CloseRounded from '@material-ui/icons/CloseRounded';
import Tune from '@material-ui/icons/Tune';
import { removeFromLeftTab, updateReturnSearchLeftMenuUrl } from '../../actions/app';
import { RETURN_SEARCH_MENU_KEY } from '../../config/config';
import ReturnOrderList from './ReturnOrderList';

const searchHandlerKey = ["firstName", "lastName", "email", "phoneNo", "returnNo"];
// const searchHandlerKeyStatus = ["readyForBackroomPick", "pickInProgress", "readyForPacking", "packingInProgress", "readyForShipping"];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

class ReturnSearch extends Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.state = {
      filterModel: false,
      orderNo: "",

      returnNo:"",
      phoneNo: "",
      firstName: "",
      lastName: "",
      email: "",

      isCustomerPick: false,
      isShipFromStore: false,
      isSearched: false,
      isSearchBarExpanded: false,
      AdvancedSearchLeftTab: 4,
      AdvancedSearchRightTab: 8
    };
  }

  componentDidMount = () => {
    const userDetails = localStorage.getItem("userDetails");
    const queryParams = new URLSearchParams(this.props.location.search);
    for (const queryParam of queryParams) {
      const key = queryParam[0];
      const value = queryParam[1];

      // if (searchHandlerKeyStatus.includes(key)) {
      //   this.setState(prevState => ({
      //     ...prevState,
      //     statuses: {
      //       ...prevState.statuses,
      //       [key]: value
      //     }
      //   }))
      // } else {
        this.setState(prevState => ({
          ...prevState,
          [key]: value
        }))
      // }
    }
    this.handleSearch();
    if (!userDetails) {
      this.props.history.push("/login");
    }
    // this.props.resetShipmentsListState();
  }

  componentDidUpdate = () => {
    if (this.props.advanceSearchFromHeader && this.props.advanceSearchFromHeader != this.state.orderNo) {
      const value = this.props.advanceSearchFromHeader;
      this.setState({
        orderNo: value
      });
      this.handleSearch();
    }
  }


  handleSearch = async () => {
    this.setState({
      isLoading: true
    });
    const payload = {
      phoneNo: this.state.phoneNo,
      email: this.state.email,
      firstName: this.state.firstName,
      lastName: this.state.lastName
    }
    this.props.getReturnOrderList(payload);
  };

  handleExpandChange = () => {
    this.setState({
      isExpanded: !this.state.isExpanded
    });
  };

  handleStatusChange = (type, e) => {
    let statuses = this.state.statuses;
    statuses[type] = e.target.checked;
    this.encodeQueryData(type, e.target.checked);
    this.setState({
      statuses
    });
  };

  handleSearchPanelExpansion() {
    this.setState({
      isSearchBarExpanded: !this.state.isSearchBarExpanded
    });
  }

  goToCloseTab = () => {
    const orderKey = RETURN_SEARCH_MENU_KEY;
    this.props.removeFromLeftTab(orderKey);
    const index = this.props.leftMenuList.findIndex(res => res.OrderNo == orderKey);
    const newRoute = this.props.leftMenuList[index + 1];
    if (newRoute && newRoute.url) {
      this.hanldeLeftPanelClick(newRoute)
    } else {
      const firstRoute = this.props.leftMenuList[0];
      if (firstRoute && firstRoute.url && orderKey != firstRoute.OrderNo) {
        this.hanldeLeftPanelClick(firstRoute)
      } else {
        this.props.history.push("/");
      }
    }
  }

  removeAllFilter = () => {
    this.setState(prevState => ({
      ...prevState,
      isSearchReturn: false,
      isCustomerPick: false,
      isShipFromStore: false,
      firstName: "",
      lastName: "",
      customerPhone: "",
      customerEmail: "",
      statuses: {
        readyForBackroomPick: false,
        pickInProgress: false,
        readyForPacking: false,
        packingInProgress: false,
        readyForShipping: false
      },
      dateFrom: null,
      dateTo: null
    }))
  }

  applyFilterChanges = () => {
    this.handleSearch();
    this.handleClickOpen();
    // this.handleSearchPanelExpansion();
  }

  hanldeLeftPanelClick = (data) => {
    console.log('-data-', data);
    // props.history.push(url)
    if (data && data.state) {
      this.props.history.push({
        pathname: data.url,
        state: data.state
      });
    } else if (data && data.url) {
      this.props.history.push(data.url)
    }
  }

  handleExpandChangeClick = () => {
    this.setState(prevState => ({
      ...prevState,
      AdvancedSearchLeftTab: prevState.AdvancedSearchLeftTab == 4 ? 12 : 4,
      AdvancedSearchRightTab: prevState.AdvancedSearchLeftTab == 4 ? 0 : 8,
    }))
  }

  encodeQueryData(key, value) {

    if (this.props.leftMenuList && this.props.leftMenuList.length > 0) {
      const muLocalhostKey = "http:localhost:3000";
      const index = this.props.leftMenuList.findIndex(res => res.OrderNo == RETURN_SEARCH_MENU_KEY);
      const oldUrl = muLocalhostKey + this.props.leftMenuList[index].url;

      let urlParams = new URL(oldUrl);
      let data = {};
      searchHandlerKey.map(key => {
        if (urlParams.searchParams.get(key)) {
          data[key] = urlParams.searchParams.get(key);
        }
      });

      // searchHandlerKeyStatus.map(key => {
      //   if (urlParams.searchParams.get(key)) {
      //     data[key] = urlParams.searchParams.get(key);
      //   }
      // });


      // set current key value 
      data[key] = value;
      let ret = "";
      Object.keys(data).map((key, index) => {
        ret = ret + key + "=" + data[key];
        if (index != Object.keys(data).length - 1) {
          ret = ret + "&";
        }
      })

      const newUrl = "/returnSearch?" + ret;
      this.props.updateReturnSearchLeftMenuUrl(newUrl);
    }

  }

  handleClickOpen = () => {
    this.setState(prevState => ({
      ...prevState,
      filterModel: !prevState.filterModel
    }))
  };

  searchHandle=()=>{
      this.handleSearch();
  }

  // searchFilterAppliedCount = () => {
  //   let searchFilterAppliedCount = 0;
  //   if (this.state.firstName) {
  //     searchFilterAppliedCount = searchFilterAppliedCount + 1;
  //   }
  //   if (this.state.lastName) {
  //     searchFilterAppliedCount = searchFilterAppliedCount + 1;
  //   }
  //   if (this.state.customerPhone) {
  //     searchFilterAppliedCount = searchFilterAppliedCount + 1;
  //   }
  //   if (this.state.customerEmail) {
  //     searchFilterAppliedCount = searchFilterAppliedCount + 1;
  //   }
  //   return searchFilterAppliedCount;
  // }

  render() {
    const { classes } = this.props;
    console.log('--this.props.leftMenuList---', this.props.leftMenuList);
    return (
      <Box style={{ position: "relative" }}>
        <Box>
          <Grid container spacing={2} style={{ justifyContent: "space-around" }} >
            <IconButton aria-label="delete" style={{ fontSize: "large", float: "right", marginTop: "-10px", marginLeft: "auto" }} onClick={this.goToCloseTab} >
              <CloseRounded fontSize="inherit" />
            </IconButton>
          </Grid>
          <Grid container >
            <Card style={{ height: "100%", width: "100%", cursor: "pointer", padding: "4%" }}   >
              <Box width="100%" display="flex" style={{ alignItems: "center" }} >
                <Box width="10%" fontWeight="bold" >
                  Return No
                </Box>
                <Box width="40%" >
                  <TextField
                    style={{ width: "90%" }}
                    margin="dense"
                    variant="outlined"
                    fullWidth
                    label="Return No"
                    name="returnNo"
                    autoComplete="returnNo"
                    onChange={e => {
                      let value = e.target.value;
                      this.setState({ returnNo: value });
                      this.encodeQueryData("returnNo", value)
                      return
                    }}
                    value={this.state.returnNo}
                  />
                </Box>
                <Box width="10%" fontWeight="bold" >
                  First Name
                </Box>
                <Box width="40%" >
                  <TextField
                    margin="dense"
                    variant="outlined"
                    fullWidth
                    style={{ width: "90%" }}
                    label="First Name"
                    name="firstName"
                    autoComplete="firstName"
                    onChange={e => {
                      let value = e.target.value;
                      this.setState({ firstName: value });
                      this.encodeQueryData("firstName", value)
                      return
                    }}
                    value={this.state.firstName}
                  />
                </Box>
              </Box>

              <Box width="100%" display="flex" style={{ alignItems: "center" }} >
                <Box width="10%" fontWeight="bold" >
                  Phone No
                </Box>
                <Box width="40%" >
                  <TextField
                    style={{ width: "90%" }}
                    margin="dense"
                    variant="outlined"
                    fullWidth
                    label="Phone No"
                    name="phoneNo"
                    autoComplete="phoneNo"
                    onChange={e => {
                      let value = e.target.value;
                      this.setState({ phoneNo: value });
                      this.encodeQueryData("phoneNo", value)
                      return
                    }}
                    value={this.state.phoneNo}
                  />
                </Box>
                <Box width="10%" fontWeight="bold" >
                  Last Name
                </Box>
                <Box width="40%" >
                  <TextField
                    margin="dense"
                    variant="outlined"
                    fullWidth
                    style={{ width: "90%" }}
                    label="Last Name"
                    name="lastName"
                    autoComplete="lastName"
                    onChange={e => {
                      let value = e.target.value;
                      this.setState({ lastName: value });
                      this.encodeQueryData("lastName", value)
                      return
                    }}
                    value={this.state.lastName}
                  />
                </Box>
              </Box>


              <Box width="100%" display="flex" style={{ alignItems: "center" }} >
                <Box width="10%" fontWeight="bold" >
                  Email
                </Box>
                <Box width="40%" >
                  <TextField
                    style={{ width: "90%" }}
                    margin="dense"
                    variant="outlined"
                    fullWidth
                    label="Email"
                    name="email"
                    autoComplete="email"
                    onChange={e => {
                      let value = e.target.value;
                      this.setState({ email: value });
                      this.encodeQueryData("email", value)
                      return
                    }}
                    value={this.state.email}
                  />
                </Box>
                <Box width="50%" style={{textAlign: "right",paddingRight: "39px"}} >
                  <Button
                    variant="contained"
                    color="primary"
                  onClick={() => this.searchHandle()}
                  >
                    Search
                     </Button>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Box>

        <Grid container className={classes.searchResults} style={{ top: "250px", display: (this.state.AdvancedSearchRightTab == 0) ? "none" : "" }}>
          <Grid
            item
            sm={8}
            style={
              !this.state.isSearchBarExpanded
                ? { flexBasis: "100%", maxWidth: "100%", transition: "all .2s" }
                : { transition: "all .2s" }
            }
          >
            <Box>
              <Card variant="outlined">
                <Box p={1}>
                  {(this.props.returnOrderList && this.props.returnOrderList.length > 0) ? (
                    <Box mt={2}>
                      <ReturnOrderList
                        returnOrderList={this.props.returnOrderList}
                      />
                    </Box>
                  ) : (
                      <Typography align="center">Please Start Search</Typography>
                    )}
                </Box>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }
}


const mapStateToProps = state => {
  return {
    ...state.ShipmentsListDetail,
    advanceSearchFromHeader: state.AppDetail.advanceSearchFromHeader,
    leftMenuList: state.AppDetail.leftMenuList,
    shipmentsListForCsv: state.ShipmentsListDetail.shipmentsListForCsv,
    returnOrderList: state.ShipmentsListDetail.returnOrderList
  };
}

function mapDispatchToProps(dispatch) {
  return {
    resetShipmentsListState: () => dispatch(resetShipmentsListState()),
    getReturnOrderList: (data) => dispatch(getReturnOrderList(data)),
    removeFromLeftTab: (id) => dispatch(removeFromLeftTab(id)),
    updateReturnSearchLeftMenuUrl: (url) => dispatch(updateReturnSearchLeftMenuUrl(url))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ReturnSearch));