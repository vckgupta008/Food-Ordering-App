import React, { Component } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import {
  Tab,
  Tabs,
  Box,
  FormControl,
  InputLabel,
  Input,
  Button,
  Snackbar
} from "@material-ui/core";
import { loginCustomer, signUpCustomer } from "../api/Customer";
import "./LoginModal.css";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "320px"
  }
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

let mobileNumber = /^\d{10}$/;
let emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

class LoginModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSnackbarComponent: false,
      snackBarMessage: "",
      selectedTab: 0,
      loginContactNo: "",
      loginPassword: "",
      errorContactNo: "",
      errorPassword: "",
      loginError: false,
      loginErrorMsg: "",
      loginResponse: { code: "", message: "" },
      signUpFirstName: "",
      signUpLastName: "",
      signUpEmail: "",
      signUpPassword: "",
      signUpContactNo: "",

      errorFirstName: "",
      errorEmail: "",
      errorPasswordSignup: "",
      errorContactNoSignup: "",

      signUpError: false,
      signUpErrorMessage: "",
      signUpResponse: { code: "", message: "" }
    };
  }

  /** Handler to switch between different tabs in login modal */
  tabChangeHandler = (event, newValue) => {
    this.setState({
      selectedTab: newValue
    });
  };

  /** Handler to set value into a particular state variable */
  loginFormValueChangeHandler = (value, field) => {
    this.setState({
      [field]: value
      // loginError: false,
      // loginResponse: { code: "", message: "" },
      // loginErrorMsg: ""
    });
  };
  signUpFormValueChangeHandler = (value, field) => {
    this.setState({
      [field]: value
      // signUpError: false,
      // signUpErrorMessage: "",
      // signUpResponse: { code: "", message: "" }
    });
  };

  validateSignUp = () => {
    const {
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword,
      signUpContactNo
    } = this.state;

    if (
      !signUpFirstName ||
      !signUpPassword ||
      !signUpEmail ||
      !signUpContactNo
    ) {
      console.log("some empty");
      this.setState({
        signUpError: true,
        signUpErrorMessage: "required",
        errorFirstName: !signUpFirstName,
        errorEmail: !signUpEmail,
        errorPasswordSignup: !signUpPassword,
        errorContactNoSignup: !signUpContactNo
      });
    } else if (!mobileNumber.test(signUpContactNo)) {
      console.log("mobile no issue");
      this.setState({
        signUpError: true,
        signUpErrorMessage:
          "Contact No. must contain only numbers and must be 10 digits long",
          errorContactNoSignup:
          "Contact No. must contain only numbers and must be 10 digits long",
        errorFirstName: "",
        errorEmail: "",
        errorPasswordSignup: ""
      });
    } else {
      let reqBody = {
        contact_number: signUpContactNo,
        email_address: signUpEmail,
        first_name: signUpFirstName,
        last_name: signUpLastName,
        password: signUpPassword
      };
      signUpCustomer(reqBody)
        .then(response => {
          console.log("response after signup", response);
          if (response && response.code) {
            this.setState({
              signUpError: true,
              signUpResponse: {
                code: response.code,
                message: response.message
              },
              errorFirstName: "",
              errorEmail: "",
              errorPasswordSignup: "",
              errorContactNoSignup: ""
            });
          } else {
            this.setState(
              {
                showSnackbarComponent: true,
                errorFirstName: "",
                errorEmail: "",
                errorPasswordSignup: "",
                errorContactNoSignup: "",
                snackBarMessage: "Registered successfully! Please login now!",
                signUpFirstName: "",
                signUpLastName: "",
                signUpEmail: "",
                signUpPassword: "",
                signUpContactNo: "",
                signUpError: false,
                signUpErrorMessage: "",
                signUpResponse: { code: "", message: "" }
              },
              () => {
                this.tabChangeHandler("", 0);
              }
            );
          }
        })
        .catch(error => {
          console.log("error after signup", error);
        });
    }
  };

  validateLoginForm = () => {
    const { loginContactNo, loginPassword } = this.state;
    let mobileNumber = /^\d{10}$/;
    if (!loginPassword || !loginContactNo) {
      this.setState({
        loginError: true,
        loginErrorMsg: "required",
        errorContactNo: !loginContactNo,
        errorPassword: !loginPassword
      });
    } else if (!mobileNumber.test(loginContactNo)) {
      this.setState({
        loginError: true,
        errorContactNo: "Invalid Contact",
        errorPassword: "",
        loginErrorMsg: "Invalid Contact"
      });
    } else {
      let encodedCredential = window.btoa(`${loginContactNo}:${loginPassword}`);
      loginCustomer(encodedCredential)
        .then(response => {
          if (response && response.code) {
            this.setState({
              loginError: true,
              loginResponse: { code: response.code, message: response.message },
              errorContactNo: "",
              errorPassword: ""
            });
          } else {
            this.setState(
              {
                showSnackbarComponent: true,
                snackBarMessage: "Logged in successfully!"
              },
              () => {
                localStorage.setItem(
                  "user-information",
                  JSON.stringify(response)
                );

                this.resetModal();
              }
            );
          }
          console.log("response after login", response);
        })
        .catch(error => {
          console.log("error after login", error);
        });
    }
  };

  resetModal = () => {
    this.setState(
      {
        selectedTab: 0,
        loginContactNo: "",
        loginPassword: "",
        loginError: false,
        loginErrorMsg: "",
        loginResponse: { code: "", message: "" },
        loginResponse: { code: "", message: "" },
        signUpFirstName: "",
        signUpLastName: "",
        signUpEmail: "",
        signUpPassword: "",
        signUpContactNo: "",
        signUpError: false,
        signUpErrorMessage: "",
        signUpResponse: { code: "", message: "" }
      },
      () => {
        this.props.onClose();
      }
    );
  };

  closeSnackBarHandler = () => {
    this.setState({
      showSnackbarComponent: false,
      snackBarMessage: ""
    });
  };

  render() {
    const { visible } = this.props;
    const {
      selectedTab,
      loginContactNo,
      loginPassword,
      loginError,
      loginErrorMsg,
      loginResponse,
      showSnackbarComponent,
      snackBarMessage,
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword,
      signUpContactNo,
      signUpError,
      signUpErrorMessage,
      signUpResponse,
      errorContactNo,
      errorPassword,
      errorFirstName,
      errorEmail,
      errorPasswordSignup,
      errorContactNoSignup
    } = this.state;
    console.log("visible", visible);
    return (
      <>
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          open={showSnackbarComponent}
          autoHideDuration={5000}
          message={snackBarMessage}
          onClose={() => this.closeSnackBarHandler()}
        ></Snackbar>
        <Modal
          isOpen={visible}
          ariaHideApp={false}
          onRequestClose={() => this.resetModal()}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className="modal-container">
            <Tabs
              value={selectedTab}
              onChange={this.tabChangeHandler}
              indicatorColor="secondary"
              centered
            >
              <Tab label="LOGIN" />
              <Tab label="SIGNUP" />
            </Tabs>
            <TabPanel value={selectedTab} index={0}>
              <FormControl>
                <InputLabel htmlFor="login-contact" required>
                  Contact No
                </InputLabel>
                <Input
                  id="login-contact"
                  aria-describedby="my-helper-text"
                  value={loginContactNo}
                  onChange={e =>
                    this.loginFormValueChangeHandler(
                      e.target.value,
                      "loginContactNo"
                    )
                  }
                  fullWidth
                />
                <span className="error-msg">
                  {" "}
                  {loginError && errorContactNo && loginErrorMsg
                    ? loginErrorMsg
                    : ""}
                  {/* {loginError && loginErrorMsg
                    ? "Invalid Contact"
                    : ""} */}
                </span>
              </FormControl>

              <FormControl>
                <InputLabel htmlFor="login-password" required>
                  Password
                </InputLabel>
                <Input
                  type="password"
                  id="login-password"
                  aria-describedby="my-helper-text"
                  value={loginPassword}
                  onChange={e =>
                    this.loginFormValueChangeHandler(
                      e.target.value,
                      "loginPassword"
                    )
                  }
                  fullWidth
                />
                <span className="error-msg">
                  {" "}
                  {loginError && errorPassword && loginErrorMsg}
                  {loginError && loginResponse.code
                    ? loginResponse.message
                    : ""}
                </span>
              </FormControl>
              <div className="login-footer">
                <Button
                  className="login-button"
                  onClick={() => this.validateLoginForm()}
                >
                  LOGIN
                </Button>
              </div>
            </TabPanel>
            <TabPanel value={selectedTab} index={1}>
              <FormControl>
                <InputLabel htmlFor="signup-firstName" required>
                  First Name
                </InputLabel>
                <Input
                  id="signup-firstName"
                  aria-describedby="my-helper-text"
                  value={signUpFirstName}
                  onChange={e =>
                    this.signUpFormValueChangeHandler(
                      e.target.value,
                      "signUpFirstName"
                    )
                  }
                  fullWidth
                />
                <span className="error-msg">
                  {" "}
                  {signUpError && errorFirstName && signUpErrorMessage}
                </span>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="signup-lastName">Last Name</InputLabel>
                <Input
                  id="signup-lastName"
                  aria-describedby="my-helper-text"
                  value={signUpLastName}
                  onChange={e =>
                    this.signUpFormValueChangeHandler(
                      e.target.value,
                      "signUpLastName"
                    )
                  }
                  fullWidth
                />
                {/* <span className="error-msg">
                  {" "}
                  {signUpError && !signUpLastName && signUpErrorMessage}
                </span> */}
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="signup-email" required>
                  Email
                </InputLabel>
                <Input
                  id="signup-email"
                  aria-describedby="my-helper-text"
                  value={signUpEmail}
                  onChange={e =>
                    this.signUpFormValueChangeHandler(
                      e.target.value,
                      "signUpEmail"
                    )
                  }
                  fullWidth
                />
                <span className="error-msg">
                  {" "}
                  {signUpError && errorEmail && signUpErrorMessage}
                  {signUpError &&
                  signUpResponse &&
                  signUpResponse.code === "SGR-002"
                    ? "Invalid Email"
                    : ""}
                </span>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="signup-password" required>
                  Password
                </InputLabel>
                <Input
                  type="password"
                  id="signup-password"
                  aria-describedby="my-helper-text"
                  value={signUpPassword}
                  onChange={e =>
                    this.signUpFormValueChangeHandler(
                      e.target.value,
                      "signUpPassword"
                    )
                  }
                  fullWidth
                />
                <span className="error-msg">
                  {" "}
                  {signUpError && errorPasswordSignup && signUpErrorMessage}
                  {signUpError &&
                  signUpResponse &&
                  signUpResponse.code === "SGR-004"
                    ? "Password must contain at least one capital letter, one small letter, one number, and one special character"
                    : ""}
                </span>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="signup-contact" required>
                  Contact No
                </InputLabel>
                <Input
                  id="signup-contact"
                  aria-describedby="my-helper-text"
                  value={signUpContactNo}
                  onChange={e =>
                    this.signUpFormValueChangeHandler(
                      e.target.value,
                      "signUpContactNo"
                    )
                  }
                  fullWidth
                />
                <span className="error-msg">
                  {" "}
                  {signUpError && errorContactNoSignup && signUpErrorMessage}
                  {signUpError &&
                  signUpResponse &&
                  signUpResponse.code !== "SGR-004" &&
                  signUpResponse.code !== "SGR-002"
                    ? signUpResponse.message
                    : ""}
                </span>
              </FormControl>
              <div className="signup-footer">
                <Button
                  className="signup-button"
                  onClick={() => this.validateSignUp()}
                >
                  SIGNUP
                </Button>
              </div>
            </TabPanel>
          </div>
        </Modal>
      </>
    );
  }
}

export default LoginModal;
