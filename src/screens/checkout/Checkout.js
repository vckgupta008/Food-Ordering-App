import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import "./Checkout.css";
import Header from "../../common/header/Header";
import {
  Stepper, Step, StepLabel, StepContent,
  Button,
  Card, CardContent,
  Typography,
  List, ListItem,
  Divider,
  AppBar,
  Tabs, Tab,
  Box,
  Grid,
  IconButton,
  Snackbar,
  FormControl, InputLabel, Input, Select, MenuItem,
  FormLabel, RadioGroup, FormControlLabel, Radio
} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CloseIcon from "@material-ui/icons/Close";
import { getAddressCustomer, getStates, addAddress } from "../../common/api/Address";
import { placeOrder } from "../../common/api/Order";
import { getPaymentMethods } from "../../common/api/Payment";
import { green } from "@material-ui/core/colors";
import PropTypes from "prop-types";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

let pincodeRegex = /^\d{6}$/;

class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: localStorage.getItem("access-token"),
      activeStep: 0,
      addressList: [],
      stateList: [],
      paymentList: [],
      checkoutSummary: JSON.parse(sessionStorage.getItem("checkoutSummary")),
      tabValue: 0,
      selectedAddress: null,
      selectedPaymentId: '',
      showMessage: false,
      message: "",
      buildingNo: "",
      locality: "",
      city: "",
      state: "",
      pincode: "",
      errorBuildingNo: "",
      errorLocality: "",
      errorCity: "",
      errorState: "",
      errorPincode: "",
      addAddressMsg: ""
    };
  }

  componentDidMount() {
    this.fetchCustomerAddress();
    this.fetchPaymentMethods();
  }

  fetchCustomerAddress = () => {
    console.log(this.state.accessToken);
    getAddressCustomer(this.state.accessToken)
      .then(response => {
        if (response && response.addresses.length) {
          this.setState({
            addressList: response.addresses
          });
        }
        this.getAllStates();
        console.log("response fetching restaurant", response);
      })
      .catch(error => {
        console.log("error in fetching restaurant");
      });
  };

  getAllStates = () => {
    getStates()
      .then(response => {
        console.log("response fetching states", response);
        if (response && response.states && response.states.length) {
          this.setState({
            stateList: response.states
          });
        }
      })
      .catch(error => {
        console.log("error in fetching states");
      });
  };

  /** Method to retrieve the payment methods */
  fetchPaymentMethods = () => {
    getPaymentMethods()
      .then(response => {
        this.setState({
          paymentList: response.paymentMethods
        });
      })
      .catch(error => {
        console.log("error while fetching payments: " + error);
      });
  };

  handleStepper = val => {
    this.setState({
      activeStep: this.state.activeStep + val
    });
  };

  handleChange = (event, newValue) => {
    this.setState({
      tabValue: newValue
    });
  };

  selectAddress = address => {
    this.setState({
      selectedAddress: address
    });
  };

  /** Handler to set the state value when a particular payment method is selected */
  paymentSelectHandler = (event) => {
    this.setState({
      selectedPaymentId: event.target.value
    });
  }

  /** Handler to place customer's order */
  placeOrderClickHandler = () => {
    let itemAdded = this.state.checkoutSummary.itemsAddedForOrder;
    let order = [];

    itemAdded.forEach(item => {
      let orderItem = {
        item_id: item.id,
        price: item.price,
        quantity: item.quantity
      };
      order.push(orderItem);
    });

    let reqBody = {
      address_id: this.state.selectedAddress.id,
      bill: this.state.checkoutSummary.totalAmount,
      coupon_id: null,
      discount: 0,
      item_quantities: order,
      payment_id: this.state.selectedPaymentId,
      restaurant_id: this.state.checkoutSummary.restaurantId
    };

    placeOrder(reqBody, this.state.accessToken)
      .then(response => {
        if (response && response.id) {
          this.setState({
            showMessage: true,
            message: "Order placed successfully! Your order ID is " + response.id + "."
          });
        } else {
          this.setState({
            showMessage: true,
            message: "Unable to place your order! Please try again!"
          });
        }
      })
      .catch(error => {
        console.log("error while placing the order", error);
      });
  };

  /** Handler to close snackbar */
  closeSnackBarHandler = () => {
    this.setState({
      showMessage: false,
      message: ""
    });
  };

  /** Handler to set value into a particular state variable */
  addressFormValueChange = (value, field) => {
    this.setState({
      [field]: value
    });
  };

  validateAddressForm = () => {
    const {
      buildingNo,
      locality,
      city,
      state,
      pincode,
      errorBuildingNo,
      errorLocality,
      errorCity,
      errorState,
      errorPincode
    } = this.state;

    if (!buildingNo || !locality || !city || !state || !pincode) {
      this.setState({
        errorBuildingNo: !buildingNo,
        errorLocality: !locality,
        errorCity: !city,
        errorState: !state,
        errorPincode: !pincode,
        addAddressMsg: "required"
      });
    } else if (!pincodeRegex.test(pincode)) {
      this.setState({
        errorBuildingNo: "",
        errorLocality: "",
        errorCity: "",
        errorState: "",
        errorPincode: true,
        addAddressMsg:
          "Pincode must contain only numbers and must be 6 digits long"
      });
    } else {
      // this.setState({
      //   buildingNo: "",
      //   locality: "",
      //   city: "",
      //   state: "",
      //   pincode: "",
      //   errorBuildingNo: "",
      //   errorLocality: "",
      //   errorCity: "",
      //   errorState: "",
      //   errorPincode: "",
      //   addAddressMsg: "",
      //   tabValue: 0
      // });

      let addressBody = {
        city: city,
        flat_building_name: buildingNo,
        locality: locality,
        pincode: pincode,
        state_uuid: state
      };

      addAddress(addressBody, localStorage.getItem("access-token"))
        .then(response => {
          console.log("response on saving address", response);
          if (
            response &&
            response.status &&
            response.status === "ADDRESS SUCCESSFULLY REGISTERED"
          ) {
            this.setState(
              {
                buildingNo: "",
                locality: "",
                city: "",
                state: "",
                pincode: "",
                errorBuildingNo: "",
                errorLocality: "",
                errorCity: "",
                errorState: "",
                errorPincode: "",
                addAddressMsg: "",
                tabValue: 0
              },
              () => {
                this.fetchCustomerAddress();
              }
            );
          }
        })
        .catch(error => {
          console.log("error in saving address");
        });
    }
  };

  render() {
    if (!this.state.accessToken || !this.state.checkoutSummary) {
      return (
        <Redirect to="/" />
      )
    }

    const {
      activeStep,
      addressList,
      tabValue,
      stateList,
      selectedAddress,
      buildingNo,
      locality,
      city,
      state,
      pincode,
      errorBuildingNo,
      errorLocality,
      errorCity,
      errorState,
      errorPincode,
      addAddressMsg
    } = this.state;

    return (
      <div>
        {/** Header component included here */}
        <Header history={this.props.history} />

        {/** Snackbar added to show item is added/ removed from cart */}
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          open={this.state.showMessage}
          autoHideDuration={5000}
          onClose={this.closeSnackBarHandler}
          message={this.state.message}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.closeSnackBarHandler}
            >
              <CloseIcon />
            </IconButton>
          ]}
          className="details-snackbar"
        ></Snackbar>

        {/** Checkout section starts here */}
        <div className="checkout-container">
          {/** Delivery and Payment section starts here */}
          <div className="address-payment-container">
            <Stepper activeStep={activeStep} orientation="vertical">
              <Step key="Delivery">
                <StepLabel>Delivery</StepLabel>
                <StepContent>
                  <AppBar position="static">
                    <Tabs
                      value={tabValue}
                      onChange={this.handleChange}
                      aria-label="simple tabs example"
                      className="tabs"
                    >
                      <Tab label="EXISTING ADDRESS" {...a11yProps(0)} />
                      <Tab label="NEW ADDRESS" {...a11yProps(1)} />
                    </Tabs>
                  </AppBar>
                  <TabPanel value={tabValue} index={0}>
                    <div className="address-container">
                      {addressList.length ? (
                        <Grid container>
                          {addressList.map(address => {
                            return (
                              <Grid key={"address_"+address.id}
                                item
                                className={`address-card ${selectedAddress &&
                                  selectedAddress.id === address.id
                                  ? "active"
                                  : ""
                                  }`}
                                xs={6}
                                sm={6}
                                md={4}
                                lg={4}
                              >
                                <div>{address.flat_building_name}</div>
                                <div>{address.locality}</div>
                                <div>{address.city}</div>
                                <div>{address.state.state_name}</div>
                                <div>{address.pincode}</div>
                                <div className="check-icon">
                                  <IconButton
                                    aria-label="delete"
                                    // disabled
                                    onClick={() => this.selectAddress(address)}
                                  // color="greem"
                                  >
                                    {selectedAddress &&
                                      selectedAddress.id === address.id ? (
                                      <CheckCircleIcon
                                        style={{ color: "#098000" }}
                                      />
                                    ) : (
                                      <CheckCircleIcon />
                                    )}
                                  </IconButton>
                                </div>
                              </Grid>
                            );
                          })}
                        </Grid>
                      ) : (
                        <div className="no-address-msg">
                          There are no saved addresses! You can save an address
                          using the 'New Address' tab or using your ‘Profile’
                          menu option.
                        </div>
                      )}
                      {/* <div className="button-actions">
                        <Button
                          disabled={true}
                          // onClick={()=>this.handleBack()}
                          className="back-button"
                        >
                          BACK
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            if (selectedAddress && selectedAddress.id) {
                              this.handleStepper(1);
                            }
                          }}
                          className="next-button"
                        >
                          NEXT
                        </Button>
                      </div> */}
                    </div>
                  </TabPanel>
                  <TabPanel value={tabValue} index={1}>
                    <div className="address-form">
                      <FormControl>
                        <InputLabel htmlFor="address-building" required>
                          Flat / Building No
                        </InputLabel>
                        <Input
                          id="address-building"
                          aria-describedby="my-helper-text"
                          value={buildingNo}
                          onChange={e =>
                            this.addressFormValueChange(
                              e.target.value,
                              "buildingNo"
                            )
                          }
                          fullWidth
                        />
                        <span className="error-msg">
                          {errorBuildingNo && addAddressMsg}
                        </span>
                      </FormControl>
                      <FormControl>
                        <InputLabel htmlFor="address-locality" required>
                          Locality
                        </InputLabel>
                        <Input
                          id="address-locality"
                          aria-describedby="my-helper-text"
                          value={locality}
                          onChange={e =>
                            this.addressFormValueChange(
                              e.target.value,
                              "locality"
                            )
                          }
                          fullWidth
                        />
                        <span className="error-msg">
                          {errorLocality && addAddressMsg}
                        </span>
                      </FormControl>
                      <FormControl>
                        <InputLabel htmlFor="address-city" required>
                          City
                        </InputLabel>
                        <Input
                          id="address-city"
                          aria-describedby="my-helper-text"
                          value={city}
                          onChange={e =>
                            this.addressFormValueChange(e.target.value, "city")
                          }
                          fullWidth
                        />
                        <span className="error-msg">
                          {errorCity && addAddressMsg}
                        </span>
                      </FormControl>
                      <FormControl>
                        <InputLabel htmlFor="address-state" required>
                          State
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="address-state"
                          value={state}
                          onChange={e =>
                            this.addressFormValueChange(e.target.value, "state")
                          }
                        >
                          {stateList.map(state => {
                            return (
                              <MenuItem key={"state_"+state.id} value={state.id}>
                                {state.state_name}
                              </MenuItem>
                            );
                          })}
                        </Select>

                        <span className="error-msg">
                          {errorState && addAddressMsg}
                        </span>
                      </FormControl>
                      <FormControl>
                        <InputLabel htmlFor="address-pincode" required>
                          Pincode
                        </InputLabel>
                        <Input
                          id="address-pincode"
                          aria-describedby="my-helper-text"
                          value={pincode}
                          onChange={e =>
                            this.addressFormValueChange(
                              e.target.value,
                              "pincode"
                            )
                          }
                          fullWidth
                        />
                        <span className="error-msg">
                          {errorPincode && addAddressMsg}
                        </span>
                      </FormControl>
                      <Button
                        className="save-address-button"
                        onClick={() => this.validateAddressForm()}
                      >
                        SAVE ADDRESS
                      </Button>
                    </div>
                  </TabPanel>
                  <div className="button-actions">
                    <Button
                      disabled={true}
                      // onClick={()=>this.handleBack()}
                      className="back-button"
                    >
                      BACK
                        </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        if (selectedAddress && selectedAddress.id) {
                          this.handleStepper(1);
                        }
                      }}
                      className="next-button"
                    >
                      NEXT
                        </Button>
                  </div>
                </StepContent>
              </Step>
              <Step key="payment" className="payment-step">
                <StepLabel>Payment</StepLabel>
                <StepContent className="payment-step-content">
                  <FormControl component="fieldset">
                    <FormLabel component="legend">
                      Select Mode of Payment
                    </FormLabel>
                    <RadioGroup
                      aria-label="payment-type"
                      name="payment-type"
                      value={this.state.selectedPaymentId}
                      onChange={this.paymentSelectHandler}
                    >
                      {this.state.paymentList.map(payment => (
                        <FormControlLabel
                          key={"payment_" + payment.id}
                          value={payment.id}
                          control={<Radio />}
                          label={payment.payment_name}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <div className="button-actions">
                    <Button
                      onClick={() => this.handleStepper(-1)}
                      className="back-button"
                    >
                      BACK
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => this.handleStepper(1)}
                      className="next-button"
                    >
                      FINISH
                    </Button>
                  </div>
                </StepContent>
              </Step>
            </Stepper>
            {activeStep === 2 ? (
              <div className="view-summary">
                <Typography>
                  View the summary & place your order now!
                </Typography>
                <Button
                  // disabled={true}
                  onClick={() => this.handleStepper(-2)}
                // className="back-button"
                >
                  CHANGE
                </Button>
              </div>
            ) : (
              ""
            )}
          </div>
          {/** Delivery and Payment section ends here */}

          {/** Delivery and Order summary section starts here */}
          <div className="summary-container">
            <Card>
              <CardContent>
                <Typography variant="body1">Summary</Typography>
                <Typography variant="body1">
                  {this.state.checkoutSummary.restaurantName}
                </Typography>
                {this.state.checkoutSummary &&
                  this.state.checkoutSummary.itemsAddedForOrder.length > 0 ? 
                  <List>
                    {this.state.checkoutSummary.itemsAddedForOrder.map(item => (
                      <ListItem key={"item_" + item.id}>
                        <div className="checkout-item-section1">
                          {item.type === "VEG" ? (
                            <i className="far fa-stop-circle" aria-hidden="true" style={{ color: "#138313" }} />
                          ) : (
                            <i className="far fa-stop-circle" aria-hidden="true" style={{ color: "#c30909" }} />
                          )}
                          <span className="checkout-item-name">
                            {item.name.replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                        <div className="checkout-item-section2">
                          <span className="checkout-item-name">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="checkout-item-section3">
                          <span className="checkout-item-price">
                            <i className="fa fa-rupee-sign" aria-hidden="true" style={{ color: "grey" }} />{" "}
                            {item.price.toFixed(2)}
                          </span>
                        </div>
                      </ListItem>
                    ))}
                  </List>
                : "" }
                <Divider />
                <div className="checkout-net-amount">
                  <Typography variant="body1">Net Amount</Typography>
                  <Typography variant="body1">
                    <i className="fa fa-rupee-sign" aria-hidden="true"></i>{" "}
                    {this.state.checkoutSummary.totalAmount.toFixed(2)}
                  </Typography>
                </div>
                <Button variant="contained" color="primary" className="order-button"
                  onClick={this.placeOrderClickHandler} >
                  PLACE ORDER
                </Button>
              </CardContent>
            </Card>
          </div>
          {/** Delivery and Order summary section endss here */}
        </div>
        {/** Checkout section ends here */}
      </div>
    );
  }
}

export default Checkout;
