import React, { Component } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import {
  Tab,
  Tabs,
  Typography,
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Input,
  Button,
  Snackbar,
  FormHelperText
} from "@material-ui/core";
import { loginCustomer } from "../api/Customer";
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

class LoginModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSnackbarComponent: false,
      snackBarMessage: "",
      selectedTab: 0,
      loginContactNo: "",
      loginPassword: "",
      loginError: false,
      loginErrorMsg: "",
      loginResponse: { code: "", message: "" }
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
      [field]: value,
      loginError: false,
      loginResponse: { code: "", message: "" },
      loginErrorMsg:""
    });
  };

  validateLoginForm = () => {
    const { loginContactNo, loginPassword } = this.state;
    let mobileNumber = /^\d{10}$/;
    if (!loginPassword || !loginContactNo) {
      this.setState({
        loginError: true,
        loginErrorMsg: "required"
      });
    } else if (!mobileNumber.test(loginContactNo)) {
      this.setState({
        loginError: true,
        loginErrorMsg: "Invalid Contact"
      });
    } else {
      let encodedCredential = window.btoa(`${loginContactNo}:${loginPassword}`);
      loginCustomer(encodedCredential)
        .then(response => {
          if (response && response.code) {
            this.setState({
              loginError: true,
              loginResponse: { code: response.code, message: response.message }
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
        loginResponse: { code: "", message: "" }
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
    const { visible, onClose } = this.props;
    const {
      selectedTab,
      loginContactNo,
      loginPassword,
      loginError,
      loginErrorMsg,
      loginResponse,
      showSnackbarComponent,
      snackBarMessage
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
                <InputLabel htmlFor="my-input" required>
                  Contact No
                </InputLabel>
                <Input
                  id="my-input"
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
                  {loginError && !loginContactNo && loginErrorMsg}
                  {loginError && loginErrorMsg == "Invalid Contact"
                    ? "Invalid Contact"
                    : ""}
                </span>
              </FormControl>

              <FormControl>
                <InputLabel htmlFor="my-input" required>
                  Password
                </InputLabel>
                <Input
                  id="my-input"
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
                  {loginError && !loginPassword && loginErrorMsg}
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
              Item Two
            </TabPanel>
          </div>
        </Modal>
      </>
    );
  }
}

export default LoginModal;
