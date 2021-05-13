import React from "react";
import { TextField, InputAdornment, Button } from "@material-ui/core";
import { Fastfood, Search, AccountCircle } from "@material-ui/icons";
import "./Header.css";

const Header = props => {
  return (
    <header>
      <div className="header-container">
        <div className="header-logo">
          <Fastfood />
        </div>
        {/** Search bar to be shown only on the Home page */}
        {props.isHomePage ?
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
          : ""}
        <div className="header-action">
          <Button className="header-login" onClick={props.handleLoginModal}>
            <AccountCircle /> Login
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;