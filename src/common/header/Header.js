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

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutUser=()=>{
    handleClose();
    localStorage.clear();
  }  

  const loggedInDetail = localStorage.getItem("user-information")
    ? JSON.parse(localStorage.getItem("user-information"))
    : null;

  
  return (
    <header>
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
          <div style={{height:5}}></div>
        )}
        <div className="header-action">
          {loggedInDetail &&
          loggedInDetail.message === "LOGGED IN SUCCESSFULLY" ? (
            <div className="user-avatar">
              <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
              >
                <AccountCircle /> {loggedInDetail.first_name}
              </Button>
              <Menu
                id="simple-menu"
                elevation={0}
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem>My Profile</MenuItem>
                <MenuItem onClick={logoutUser}>Logout</MenuItem>
              </Menu>
            </div>
          ) : (
            <Button
              className="header-login"
              onClick={() => setLoginModal(true)}
            >
              <AccountCircle /> Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
