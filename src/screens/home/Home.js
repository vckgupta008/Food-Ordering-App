import React, { Component } from "react";
import { Snackbar, Card } from "@material-ui/core";
import Header from "../../common/header/Header";
import {
  getRestaurant,
  getRestaurantByName
} from "../../common/api/Restaurant";
// import LoginModal from "../../common/modal/LoginModal";
import "./Home.css";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurantList: [],
      showErrorMessage: false,
      errorMessage: "",
      searchVal: ""
    };
  }

  componentDidMount() {
    this.loadAllRestaurants();
  }

  /** Method to load all the restaurant details into the state variables */
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

  /** Method to load all the restaurant details for the given name into the state variables */
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

  /** Handler to close error message snackbar */
  closeErrorMessageHandler = () => {
    this.setState({
      showErrorMessage: false,
      errorMessage: ""
    });
  };

 

  render() {
    const {
      restaurantList,
      showErrorMessage,
      errorMessage,
      searchVal,
      
    } = this.state;
    return (
      <div>
        {/** Header component included here */}
        <Header
          searchVal={searchVal}
          handleLoginModal={() => this.loginModalHandler()}
          onSearch={restaurant => this.searchRestaurantByName(restaurant)}
          isHomePage={true}
          props={this.props}
        />

        

        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          open={showErrorMessage}
          autoHideDuration={5000}
          message={errorMessage}
          onClose={() => this.closeErrorMessageHandler()}
        ></Snackbar>

        {/** Restaurant cards begin here */}
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
                          <i className="fa fa-star" aria-hidden="true" />
                          {restaurant.customer_rating} ({restaurant.number_customers_rated})
                        </div>
                        <div className="restaurant-price">
                          <i className="fa fa-rupee-sign"
                            aria-hidden="true" />
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
        {/** Restaurant cards end here */}
      </div>
    );
  }
}

export default Home;