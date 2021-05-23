import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import "./Checkout.css";
import Header from "../../common/header/Header";
import ListCheckoutItems from "../../common/ListCheckoutItems";
import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
  AppBar,
  Tabs,
  Tab,
  Box,
  IconButton,
  Snackbar,
  FormControl,
  InputLabel,
  Input,
  Select,
  MenuItem,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  GridListTile,
  GridList
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CloseIcon from "@material-ui/icons/Close";
import {
  getAddressCustomer,
  getStates,
  addAddress
} from "../../common/api/Address";
import { placeOrder } from "../../common/api/Order";
import { getPaymentMethods } from "../../common/api/Payment";
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

const useStyles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: "nowrap",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)"
  },
  active: {
    border: "1.7px solid #f23c71",
    borderRightWidth: "3px",
    borderBottomWidth: "3px",
    borderRadius: 7
  }
});

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
      selectedPaymentId: "",
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
    getAddressCustomer(this.state.accessToken)
      .then(response => {
        if (response === "authorization exception") {
          this.redirectToHome();
        }
        // if (response && response.code && (response.code === ))
        if (response && response.addresses.length) {
          this.setState({
            addressList: response.addresses
          });
        }
        this.getAllStates();
      })
      .catch(error => {
        console.log("error in fetching restaurant");
      });
  };

  getAllStates = () => {
    getStates()
      .then(response => {
        if (response && response.states && response.states.length) {
          this.setState({
            stateList: response.states
          });
        }
      })
      .catch(error => {
        console.log("error in fetching states", error);
      });
  };

  redirectToHome = () => {
    localStorage.clear();
    sessionStorage.clear();
    this.props.history.push('/');
  }

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
  paymentSelectHandler = event => {
    this.setState({
      selectedPaymentId: event.target.value
    });
  };

  /** Handler to place customer's order */
  placeOrderClickHandler = () => {
    if (this.state.selectedAddress && this.state.selectedPaymentId) {
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
              message:
                "Order placed successfully! Your order ID is " + response.id + "."
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
    }


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
      pincode
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
    } else {
      let addressBody = {
        city: city,
        flat_building_name: buildingNo,
        locality: locality,
        pincode: pincode,
        state_uuid: state
      };

      addAddress(addressBody, localStorage.getItem("access-token"))
        .then(response => {
          if (response === "authorization exception") {
            this.redirectToHome();
          }
          if (response && response.code && response.code === "SAR-002") {
            this.setState({
              errorBuildingNo: "",
              errorLocality: "",
              errorCity: "",
              errorState: "",
              errorPincode: true,
              addAddressMsg:
                "Pincode must contain only numbers and must be 6 digits long"
            });
          } else if (
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
          console.log("error in saving address", error);
        });
    }
  };

  render() {
    if (!this.state.accessToken || !this.state.checkoutSummary) {
      return <Redirect to="/" />;
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

    const { classes } = this.props;

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
                        <GridList className={classes.gridList} cols={3}>
                          {addressList.map(address => {
                            return (
                              <GridListTile
                                key={"address_" + address.id}
                                className={`address-card ${selectedAddress &&
                                  selectedAddress.id === address.id
                                  ? classes.active
                                  : ""
                                  }`}
                              >
                                <Typography variant="body1" component="p">
                                  {address.flat_building_name}
                                </Typography>
                                <Typography variant="body1" component="p">
                                  {address.locality}
                                </Typography>
                                <Typography variant="body1" component="p">
                                  {address.city}
                                </Typography>
                                <Typography variant="body1" component="p">
                                  {address.state.state_name}
                                </Typography>
                                <Typography variant="body1" component="p">
                                  {address.pincode}
                                </Typography>
                                <div className="check-icon" component="p">
                                  <IconButton
                                    aria-label="delete"
                                    onClick={() => this.selectAddress(address)}
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
                              </GridListTile>
                            );
                          })}
                        </GridList>
                      ) : (
                        <div className="no-address-msg">
                          There are no saved addresses! You can save an address
                          using the 'New Address' tab or using your ‘Profile’
                          menu option.
                        </div>
                      )}
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
                          MenuProps={{
                            transformOrigin: {
                              vertical: "top",
                              horizontal: "center"
                            },
                            anchorOrigin: {
                              vertical: "bottom",
                              horizontal: "center"
                            },
                            elevation: 0,
                            getContentAnchorEl: null,
                            style: {
                              marginTop: 10
                            }
                          }}
                        >
                          {stateList.map(state => (
                            <MenuItem
                              key={"state_" + state.id}
                              value={state.id}
                            >
                              {state.state_name}
                            </MenuItem>
                          ))}
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
                  this.state.checkoutSummary.itemsAddedForOrder.length > 0 ? (
                  <ListCheckoutItems
                    itemsAdded={this.state.checkoutSummary.itemsAddedForOrder}
                    page="checkout"
                  />
                ) : (
                  ""
                )}
                <Divider />
                <div className="checkout-net-amount">
                  <Typography variant="body1">Net Amount</Typography>
                  <Typography variant="body1">
                    <i className="fa fa-rupee-sign" aria-hidden="true"></i>{" "}
                    {this.state.checkoutSummary.totalAmount.toFixed(2)}
                  </Typography>
                </div>
                <Button
                  variant="contained"
                  color="primary"
                  className="order-button"
                  onClick={this.placeOrderClickHandler}
                >
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

export default withStyles(useStyles)(Checkout);
