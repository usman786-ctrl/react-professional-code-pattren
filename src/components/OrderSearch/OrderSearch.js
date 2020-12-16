import React, { Component } from 'react';
import styles from './OrderSearch.styles'
import { withStyles } from '@material-ui/styles';
import { Container, Button, Box } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

class OrderSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderNo: "",
      shipmentNo: "",
      customerPhone: '',
      customerEmail: '',
      isModalVisible: false
    }
  }

  showModal() {
    this.setState({
      isModalVisible: true
    })
  }

  hideModal() {
    this.setState({
      isModalVisible: false
    })
  }

  async handleSearch() {
    // this.hideModal();
    // let shipmentListPayload = this.state;
    // shipmentListPayload.tab = this.props.tab;

    // this.props.history.push({
    //   pathname: "/shipmentsList",
    //   state: { 
    //     shipmentListPayload: shipmentListPayload
    //    }
    // });
  }

  render() {
    return (
      <Container>
        <Box display="flex" justifyContent="center" mt={22}>
          <Button
            startIcon={<SearchIcon />}
            variant="contained"
            color="primary"
            onClick={this.showModal.bind(this)}
          >
            Order Search
          </Button>
          <Dialog
            open={this.state.isModalVisible}
            onClose={this.hideModal.bind(this)}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Order Search</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Order No."
                type="text"
                fullWidth
                value={this.state.orderNo}
                onChange={e => this.setState({orderNo: e.target.value})}
              />

              <TextField
                margin="dense"
                label="Shipment No."
                type="text"
                fullWidth
                value={this.state.shipmentNo}
                onChange={e => this.setState({shipmentNo: e.target.value})}
              />

              <TextField
                margin="dense"
                label="Customer Phone"
                type="text"
                fullWidth
                value={this.state.customerPhone}
                onChange={e => this.setState({customerPhone: e.target.value})}
              />

              <TextField
                margin="dense"
                label="Customer Email"
                type="text"
                fullWidth
                value={this.state.customerEmail}
                onChange={e => this.setState({customerEmail: e.target.value})}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.hideModal.bind(this)} color="primary">
                Cancel
              </Button>
              <Button
                disabled={
                  !(
                    this.state.orderNo ||
                    this.state.shipmentNo ||
                    this.state.customerPhone ||
                    this.state.customerEmail
                  )
                }
                onClick={this.handleSearch.bind(this)}
                variant="contained"
                color="primary"
              >
                Search
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
    );
  }
}

export default withStyles(styles)(OrderSearch);