import React, { useState } from "react";
import {
  TextField,
  InputAdornment,
  Button,
  Menu,
  MenuItem
} from "@material-ui/core";
import { Fastfood, Search, AccountCircle } from "@material-ui/icons";
import LoginModal from "../modal/LoginModal";
import "./Header.css";

const Header = props => {
  const [openLoginModal, setLoginModal] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const customerNameClickHandler = event => {
    setAnchorEl(event.currentTarget);
  };

  /** Handler to close Menu */
  const menuCloseHandler = () => {
    setAnchorEl(null);
  };

  /** Handler to logout customer */
  const logoutCustomerHandler = () => {
    menuCloseHandler();
    localStorage.clear();
  }

  const loggedInDetail = localStorage.getItem("user-information")
    ? JSON.parse(localStorage.getItem("user-information"))
    : null;

  /** Handler to redirect customer to Profile page on clicking the Profile menu */
  const profileClickHandler = () => {
    props.props.history.push('/profile');
  }

  return (
    <header id="header">
      {/** Login Modal  component included here */}
      <LoginModal
        visible={openLoginModal}
        onClose={() => setLoginModal(false)}
      />

      <div className="header-container">
        <div className="header-logo">
          <Fastfood />
        </div>
        {/** Search bar to be shown only on the Home page */}
        {props.isHomePage ? (
          <div className="header-search">
            <TextField
              id="input-with-icon-textfield"
              placeholder="Search by Restaurant Name"
              variant="filled"
              value={props.searchVal}
              onChange={e => props.onSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                )
              }}
            />
          </div>
        ) : (
          <div style={{ height: 5 }}></div>
        )}
        <div className="header-action">
          {loggedInDetail &&
            loggedInDetail.message === "LOGGED IN SUCCESSFULLY" ? (
            <div className="user-avatar">
              <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={customerNameClickHandler}
                style={{ textTransform: "none" }}
              >
                <AccountCircle /> {loggedInDetail.first_name}
              </Button>
              <Menu
                id="simple-menu"
                elevation={0}
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={menuCloseHandler}
              >
                <MenuItem onClick={profileClickHandler}>My Profile</MenuItem>
                <MenuItem onClick={logoutCustomerHandler}>Logout</MenuItem>
              </Menu>
            </div>
          ) : (
            <Button className="header-login" onClick={() => setLoginModal(true)} >
              <AccountCircle /> Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
