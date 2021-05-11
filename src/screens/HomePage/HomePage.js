import React, { Component } from "react";
import { Snackbar } from "@material-ui/core";
import Header from "../../common/Header/Header";
import { getRestaurant } from "../../common/Api/restaurant";
import "./HomePage.css";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurantList: [],
      filteredRestaurantList: [],
      showErrorMessage: false,
      errorMessage: ""
    };
  }

  componentDidMount() {
    getRestaurant()
      .then(response => {
        console.log("get all restaurnat", response);
        this.setState({
          restaurantList: response.restaurants.length
            ? response.restaurants
            : [],
          filteredRestaurantList: response.restaurants.length
            ? response.restaurants
            : []
        });
      })
      .catch(error => {
        console.log("get restaurant", error);
        this.setState({
          showErrorMessage: true,
          errorMessage: "Error in loading restaurants"
        });
      });
  }

  handleCloseErrorMessage = () => {
    this.setState({
      showErrorMessage: false,
      errorMessage: ""
    });
  };

  render() {
    const { restaurantList, filteredRestaurantList,showErrorMessage, errorMessage } = this.state;
    return (
      <>
        <Header />
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          open={showErrorMessage}
          autoHideDuration={5000}
          message={errorMessage}
          onClose={() => this.handleCloseErrorMessage()}
        ></Snackbar>
        <div className="home-page-container">HomePage</div>
      </>
    );
  }
}

export default HomePage;
