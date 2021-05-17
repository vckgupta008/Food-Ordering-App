import React, { Component } from "react";
import "./Checkout.css";
import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button
} from "@material-ui/core";
import Header from "../../common/header/Header";

class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0
    };
  }
  handleStepper = val => {
    this.setState({
      activeStep: this.state.activeStep + val
    });
  };

  render() {
    const { activeStep } = this.state;
    return (
      <>
        {/** Header component included here */}
        <Header />
        <div className="checkout-container">
          <div className="address-container">
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
          <div className="summary-container">Summary</div>
        </div>
      </>
    );
  }
}

export default Checkout;
