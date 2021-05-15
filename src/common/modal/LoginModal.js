import React, { Component } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import { Tab, Tabs, Typography, Box, Grid, TextField } from "@material-ui/core";
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
      selectedTab: 0,
      loginContactNo: "",
      loginPassword: "",
      loginError: false
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
    });
  };

  render() {
    const { visible, onClose } = this.props;
    const {
      selectedTab,
      loginContactNo,
      loginPassword,
      loginError
    } = this.state;
    console.log("visible", visible);
    return (
      <Modal
        isOpen={visible}
        ariaHideApp={false}
        onRequestClose={onClose}
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
            <Grid container direction="column">
              <Grid item>
                <TextField
                  className="form-field"
                  required
                  label="Contact No"
                  value={loginContactNo}
                  onChange={e =>
                    this.loginFormValueChangeHandler(e.target.value, "loginContactNo")
                  }
                  fullWidth
                />
                <span className="error-msg">
                  {loginError && !loginContactNo && "required"}
                </span>
              </Grid>
              <Grid item>
                <TextField
                  className="form-field"
                  required
                  label="Password"
                  value={loginPassword}
                  onChange={e =>
                    this.loginFormValueChangeHandler(e.target.value, "loginPassword")
                  }
                  fullWidth
                />
                <span className="error-msg">
                  {loginError && !loginPassword && "required"}
                </span>
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={selectedTab} index={1}>
            Item Two
          </TabPanel>
        </div>
      </Modal>
    );
  }
}

export default LoginModal;