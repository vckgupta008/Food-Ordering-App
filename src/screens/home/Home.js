import React, { Component } from "react";
import "./Home.css";
import Header from "../../common/header/Header";
import {
  getRestaurant,
  getRestaurantByName
} from "../../common/api/Restaurant";
import {
  Snackbar,
  Card,
  Grid,
  Typography,
  CardContent
} from "@material-ui/core";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurantList: [],
      showMessage: false,
      message: "",
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
        this.setState({
          restaurantList:
            response.restaurants && response.restaurants.length
              ? response.restaurants
              : [],
          searchVal: ""
        });
      })
      .catch(error => {
        this.setState({
          showMessage: true,
          message: "Error in loading restaurants",
          searchVal: ""
        });
      });
  }

  /** Method to load all the restaurant details for the given name into the state variables */
  searchRestaurantByName = restaurantName => {
    if (restaurantName) {
      getRestaurantByName(restaurantName)
        .then(response => {
          this.setState({
            restaurantList:
              response.restaurants && response.restaurants.length
                ? response.restaurants
                : [],
            searchVal: restaurantName
          });
        })
        .catch(error => {
          this.setState({
            showMessage: true,
            message: "Error in loading restaurants",
            searchVal: restaurantName
          });
        });
    } else {
      this.loadAllRestaurants();
    }
  };

  /** Handler to close snackbar */
  closeSnackbarHandler = () => {
    this.setState({
      showMessage: false,
      message: ""
    });
  };

  /** Handler to navigate customer to the respective restuarant when clicked on the restaurant card */
  resturantCardClickHandler = (restaurantId) => {
    this.props.history.push('/restaurant/' + restaurantId);
  }

  render() {
    const {
      restaurantList,
      showMessage,
      message,
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
          open={showMessage}
          autoHideDuration={5000}
          message={message}
          onClose={() => this.closeSnackbarHandler()}
          className="snackbar"
        ></Snackbar>

        {/** Restaurant cards begin here */}
        <div className="home-page-container">
          <Grid
            container spacing={3}
            wrap="wrap"
            alignContent="center"
            className="restaurant-grid"
          >
            {restaurantList.length ? (
              restaurantList.map(restaurant => (
                <Grid key={restaurant.id} item
                  xs={12} sm={6} md={4} lg={3}
                >
                  <Card className="restaurant-card" key={restaurant.id}>
                    <CardContent style={{ cursor: "pointer" }} onClick={() => this.resturantCardClickHandler(restaurant.id)}>
                      <div className="restaurant-img">
                        <img src={restaurant.photo_URL} alt="restaurant-img" />
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
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="body1" component="p">
                No restaurant with the given name.
              </Typography>
            )}
          </Grid>
        </div>
        {/** Restaurant cards end here */}
      </div>
    );
  }
}

export default Home;