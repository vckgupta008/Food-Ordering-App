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
      restaurantId: this.props.match.params.restaurantId,
      categories: ''
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
        const categories = response.categories.map(category => category.category_name).join(", ");
        this.setState({
          restaurant: response,
          categories: categories
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
          <div className="details-body-container">
            {/** Restaurant information section starts here */}
            <div className="details-restaurant-section">
              <div>
                <img src={this.state.restaurant.photo_URL} alt="this.state.restaurant.restaurant_name"
                  className="details-restaurant-image" />
              </div>
              <div className="details-restaurant-info">
                <div className="details-restaurant-name">
                  <Typography variant="body1">
                    {this.state.restaurant.restaurant_name}
                  </Typography>
                </div>
                <div className="details-restaurant-locality">
                  <Typography variant="body1">
                    {this.state.restaurant.address.locality.toUpperCase()}
                  </Typography>
                </div>
                <div className="details-restaurant-categories">
                  <Typography variant="body1">
                    {this.state.categories}
                  </Typography>
                </div>
                <div className="details-reataurant-rating-cost-info">
                  <div className="details-restaurant-rating-info">
                    <div className="details-restaurant-icon">
                      <i className="fa fa-star" aria-hidden="true" /> {this.state.restaurant.customer_rating}
                    </div>
                    <div>
                      <p className="details-restaurant-text">
                        AVERAGE RATING BY
                      </p>
                      <p className="details-restaurant-text">
                        <span style={{ fontWeight: "bold" }}>{this.state.restaurant.number_customers_rated}</span> CUSTOMERS
                      </p>
                    </div>
                  </div>
                  <div className="details-restaurant-cost-info">
                    <div className="details-restaurant-icon">
                      <i className="fa fa-rupee-sign" aria-hidden="true" /> {this.state.restaurant.average_price}
                    </div>
                    <div>
                      <p className="details-restaurant-text">
                        AVERAGE COST FOR
                      </p>
                      <p className="details-restaurant-text">
                        TWO PEOPLE
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/** Restaurant information section ends here */}
            <div>

            </div>
          </div>
          : ""}

      </div>
    )
  }
}

export default Details;