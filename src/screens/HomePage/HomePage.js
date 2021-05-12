import React, { Component } from "react";
import { Snackbar, Card } from "@material-ui/core";
import Header from "../../common/Header/Header";
import {
  getRestaurant,
  getRestaurantByName
} from "../../common/Api/restaurant";
import LoginModal from "../../common/Modals/LoginModal";
import "./HomePage.css";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurantList: [],
      showErrorMessage: false,
      errorMessage: "",
      searchVal: "",
      openLoginModal: false
    };
  }

  componentDidMount() {
    this.loadAllRestaurants();
  }

  loadAllRestaurants() {
    getRestaurant()
      .then(response => {
        console.log("get all restaurnat", response);
        this.setState({
          restaurantList:
            response.restaurants && response.restaurants.length
              ? response.restaurants
              : [],
          searchVal: ""
        });
      })
      .catch(error => {
        console.log("get restaurant", error);
        this.setState({
          showErrorMessage: true,
          errorMessage: "Error in loading restaurants",
          searchVal: ""
        });
      });
  }

  searchRestaurantByName = restaurantName => {
    if (restaurantName) {
      getRestaurantByName(restaurantName)
        .then(response => {
          console.log("get restaurant name", response);
          this.setState({
            restaurantList:
              response.restaurants && response.restaurants.length
                ? response.restaurants
                : [],
            searchVal: restaurantName
          });
        })
        .catch(error => {
          console.log("get restaurant", error);
          this.setState({
            showErrorMessage: true,
            errorMessage: "Error in loading restaurants",
            searchVal: restaurantName
          });
        });
    } else {
      this.loadAllRestaurants();
    }
  };

  handleCloseErrorMessage = () => {
    this.setState({
      showErrorMessage: false,
      errorMessage: ""
    });
  };

  handleLoginModal = () => {
    this.setState({
      openLoginModal: !this.state.openLoginModal
    });
  };

  render() {
    const {
      restaurantList,
      showErrorMessage,
      errorMessage,
      searchVal,
      openLoginModal
    } = this.state;
    return (
      <>
        <Header
          searchVal={searchVal}
          handleLoginModal={() => this.handleLoginModal()}
          onSearch={restaurant => this.searchRestaurantByName(restaurant)}
        />
        <LoginModal
          visible={openLoginModal}
          onClose={() => this.handleLoginModal()}
        />
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          open={showErrorMessage}
          autoHideDuration={5000}
          message={errorMessage}
          onClose={() => this.handleCloseErrorMessage()}
        ></Snackbar>
        <div className="home-page-container">
          <div className="home-page-restaurant-list">
            {restaurantList.length ? (
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
              })
            ) : (
              <div>No restaurant with the given name.</div>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default HomePage;
