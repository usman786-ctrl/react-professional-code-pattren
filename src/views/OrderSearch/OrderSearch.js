import React, { Component } from "react";
import {
  Container,
  Button,
  Box,
  Grid,
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails
} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ShipmentsList from "../../components/ShipmentsList/ShipmentsList";

class OrderSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderNo: "",
      customerPhone: "",
      customerEmail: "",
      firstName: "",
      lastName: "",
      isExpanded: true,
      isSearched: false
    };
  }

  async handleSearch() {
    this.setState({
      isSearched: false
    }, () => {
      this.setState({
        isSearched: true,
        isExpanded: false
      })
    });
  }

  handleExpandChange = () => {
    this.setState({
      isExpanded: !this.state.isExpanded
    });
  };

  render() {
    return (
      <Container>
        <ExpansionPanel
          expanded={this.state.isExpanded}
          onChange={this.handleExpandChange.bind(this)}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Box width="100%" align="center">
              <Typography align="center">Search</Typography>
            </Box>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Box display="flex" justifyContent="center">
              <Grid container spacing={3}>
                <Grid item sm={4} width="100%">
                  <TextField
                    margin="dense"
                    variant="outlined"
                    fullWidth
                    label="Order No."
                    name="orderno"
                    autoComplete="orderno"
                    autoFocus
                    value={this.state.orderNo}
                    onChange={e => this.setState({ orderNo: e.target.value })}
                  />
                </Grid>

                <Grid item sm={4} width="100%">
                  <TextField
                    margin="dense"
                    variant="outlined"
                    fullWidth
                    label="Customer Phone"
                    name="customerPhone"
                    autoComplete="customerPhone"
                    onChange={e =>
                      this.setState({ customerPhone: e.target.value })
                    }
                    value={this.state.customerPhone}
                  />
                </Grid>

                <Grid item sm={4} width="100%">
                  <TextField
                    margin="dense"
                    variant="outlined"
                    fullWidth
                    label="Customer Email"
                    name="customerEmail"
                    autoComplete="customerEmail"
                    onChange={e =>
                      this.setState({ customerEmail: e.target.value })
                    }
                    value={this.state.customerEmail}
                  />
                </Grid>

                <Grid item sm={4} width="100%">
                  <TextField
                    margin="dense"
                    variant="outlined"
                    fullWidth
                    label="First Name"
                    name="firstName"
                    autoComplete="firstName"
                    onChange={e => this.setState({ firstName: e.target.value })}
                    value={this.state.firstName}
                  />
                </Grid>

                <Grid item sm={4} width="100%">
                  <TextField
                    margin="dense"
                    variant="outlined"
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    autoComplete="lastName"
                    onChange={e => this.setState({ lastName: e.target.value })}
                    value={this.state.lastName}
                  />
                </Grid>

                <Grid item sm width="100%">
                  <Box fullWidth mt={1}>
                    <Button
                      disabled={
                        !(
                          this.state.orderNo ||
                          this.state.customerPhone ||
                          this.state.customerEmail ||
                          this.state.lastName ||
                          this.state.firstName
                        )
                      }
                      onClick={this.handleSearch.bind(this)}
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Search
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        {this.state.isSearched && (
          <Box mt={2}>
            <ShipmentsList shipmentListPayload={{
              orderNo: this.state.orderNo,
              customerPhone: this.state.customerPhone,
              customerEmail: this.state.customerEmail,
              firstName: this.state.firstName,
              lastName: this.state.lastName,
            }} 
            location={this.props.location}
            />
          </Box>
        )}
      </Container>
    );
  }
}

export default OrderSearch;
