import React, { Component } from 'react';
import './Details.css';
import Header from '../../common/header/Header';
import { getRestaurantById } from "../../common/api/Restaurant";
import Typography from '@material-ui/core/Typography';

class Details extends Component {

  constructor(props) {
    super(props);
    this.state = {
      restaurant: {},
      restaurantId: this.props.match.params.restaurantId
    };
  }

  componentDidMount() {
    this.loadRestaurantDetails(this.state.restaurantId);
  }

  /** Method to load all the restaurant details into the state variables */
  loadRestaurantDetails(restaurantId) {
    getRestaurantById(restaurantId)
      .then(response => {
        console.log(response);
        this.setState({
          restaurant: response
        });
      })
      .catch(error => {
        console.log("get restaurant", error);
        this.setState({
          showErrorMessage: true,
          errorMessage: error.message,
        });
      });
  }

  render() {
    return (
      <div>
        {/** Header component included here */}
        <Header />
        {Object.keys(this.state.restaurant).length !== 0 ?
          <div className="body-container">
            {/** Restaurant information section starts here */}
            <div className="restaurant-section">
              <div className="restaurant-image">
                <img src={this.state.restaurant.photo_URL} alt="this.state.restaurant.restaurant_name" />
              </div>
              <div className="restaurant-details">
                <div>
                  <Typography variant="h5">
                    {this.state.restaurant.restaurant_name}
                  </Typography>
                </div>
                <div>
                  <span style={{fontWeight:"bold"}}>
                    {this.state.restaurant.address.locality.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            {/** Restaurant information section ends here */}
          </div>
          : ""}

      </div>
    )
  }
}

export default Details;