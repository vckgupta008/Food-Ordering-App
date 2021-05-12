import React, { Component } from "react";
import { Snackbar, Card, CardContent } from "@material-ui/core";
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
    const {
      restaurantList,
      filteredRestaurantList,
      showErrorMessage,
      errorMessage
    } = this.state;
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
        <div className="home-page-container">
          <div className="home-page-restaurant-list">
            {restaurantList.length &&
              restaurantList.map(restaurant => {
                return (
                  <Card className="restaurant-card" key={restaurant.id}>
                    <div className="restaurant-img">
                      <img src={restaurant.photo_URL} />
                    </div>
                    <div className="restaurant-body">
                      <div className="restaurant-name">
                        {restaurant.restaurant_name}
                      </div>
                      <div className="restaurant-category">
                        {restaurant.categories}
                      </div>
                      <div className="restaurant-info">
                        <div className="restaurant-rating">
                          <i className="fa fa-star" aria-hidden="true"></i>
                          {restaurant.customer_rating} (
                          {restaurant.number_customers_rated})
                        </div>
                        <div className="restaurant-price">
                          <i
                            className="fa fa-rupee-sign"
                            aria-hidden="true"
                          ></i>
                          {restaurant.average_price} for two
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
          </div>
        </div>
      </>
    );
  }
}

export default HomePage;
