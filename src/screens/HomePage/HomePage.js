import React, { Component } from "react";
import Header from "../../common/Header/Header";
import "./HomePage.css";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <Header />
        <div className="home-page-container">HomePage</div>
      </>
    );
  }
}

export default HomePage;
