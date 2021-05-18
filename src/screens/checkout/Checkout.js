import React, { Component } from "react";
import "./Checkout.css";
import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Divider
} from "@material-ui/core";
import { getAddressCustomer } from "../../common/api/Address";
import Header from "../../common/header/Header";

class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      addressList: [],
      checkoutSummary: JSON.parse(sessionStorage.getItem("checkoutSummary"))
    };
  }

  componentDidMount() {
    this.fetchAddressCustomer();
    console.log(this.state.checkoutSummary);
  }

  fetchAddressCustomer = () => {
    let accessToken = localStorage.getItem("access-token");
    console.log(accessToken);
    getAddressCustomer(accessToken)
      .then(response => {
        if (response && response.addresses.length) {
          this.setState({
            addressList: response.addresses
          });
        }
        console.log("response fetching restaurant", response);
      })
      .catch(error => {
        console.log("error in fetching restaurant");
      });
  };

  handleStepper = val => {
    this.setState({
      activeStep: this.state.activeStep + val
    });
  };

  render() {
    const { activeStep, addressList } = this.state;
    return (
      <div>
        {/** Header component included here */}
        <Header />

        {/** Checkout section starts here */}
        <div className="checkout-container">
          {/** Delivery and Payment section starts here */}
          <div className="address-payment-container">
            <Stepper activeStep={activeStep} orientation="vertical">
              <Step key="Delivery">
                <StepLabel>Delivery</StepLabel>
                <StepContent>
                  Address
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
                      onClick={() => this.handleStepper(1)}
                      className="next-button"
                    >
                      NEXT
                    </Button>
                  </div>
                </StepContent>
              </Step>
              <Step key="Payment">
                <StepLabel>Payment</StepLabel>
                <StepContent>
                  Payment
                  <div className="button-actions">
                    <Button
                      // disabled={true}
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
            {activeStep == 2 ? (
              <div className="view-summary">
                View the summary & place your order now!
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
              <CardContent style={{ padding: 25 }}>
                <Typography variant="body1">
                  Summary
                </Typography>
                <Typography variant="body1">
                  {this.state.checkoutSummary.restaurantName}
                </Typography>
                {this.state.checkoutSummary && this.state.checkoutSummary.itemsAddedForOrder.length > 0 ?
                  <List>
                    {this.state.checkoutSummary.itemsAddedForOrder.map(item => (
                      <ListItem key={'item_' + item.id}>
                        <div className="checkout-item-section1">
                          {item.type === "VEG" ?
                            <i className="far fa-stop-circle" aria-hidden="true" style={{ color: "#138313" }}></i>
                            :
                            <i className="far fa-stop-circle" aria-hidden="true" style={{ color: "#c30909" }}></i>}
                          <span className="checkout-item-name">{item.name.replace(/\b\w/g, l => l.toUpperCase())}</span>
                        </div>
                        <div className="checkout-item-section2">
                          <span className="checkout-item-name">{item.quantity}</span>
                        </div>
                        <div className="checkout-item-section3">
                          <span className="checkout-item-price">
                            <i className="fa fa-rupee-sign" aria-hidden="true" style={{color:"grey"}}></i> {item.price.toFixed(2)}</span>
                        </div>
                      </ListItem>
                    ))}
                  </List>
                  : ''}
                <Divider />
                <div className="checkout-net-amount">
                  <Typography variant="body1">
                    Net Amount
                  </Typography>
                  <Typography variant="body1">
                  <i className="fa fa-rupee-sign" aria-hidden="true"></i> {this.state.checkoutSummary.totalAmount}
                  </Typography>
                </div>
                <Button variant="contained" color="primary" className="order-button">
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
