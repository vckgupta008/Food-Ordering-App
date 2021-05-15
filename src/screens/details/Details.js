import React, { Component } from 'react';
import './Details.css';
import Header from '../../common/header/Header';
import { getRestaurantById } from "../../common/api/Restaurant";
import {
  Typography,
  List,
  ListSubheader,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Card,
  CardContent,
  Badge,
  Button,
  Snackbar
}
  from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import CloseIcon from '@material-ui/icons/Close';

class Details extends Component {

  constructor(props) {
    super(props);
    this.state = {
      restaurant: {},
      restaurantId: this.props.match.params.restaurantId,
      categories: '',
      totalItem: 0,
      totalAmount: 0,
      itemsAddedToCartList: [],
      itemAddedToCart: {},
      showItemMessage: false,
      itemMessage: ''
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

  addItemHandler = (item) => {
    var totalItem = this.state.totalItem;
    var totalAmount = this.state.totalAmount;
    var itemsInCartTemp = this.state.itemsAddedToCartList;
    totalItem++;

    console.log(itemsInCartTemp);
    var itemInCartList;
    if (this.state.itemsAddedToCartList) {
      itemInCartList = this.state.itemsAddedToCartList.filter((itemInCart, index) => {
        if (itemInCart.id === item.id) {
          return true;
        }
        return false;
      })[0];
    }

    if (itemInCartList) {
      itemInCartList.price += item.price;
      itemInCartList.quantity++;
    } else {
      var itemToadd = {
        id: item.id,
        name: item.item_name,
        type: item.item_type,
        price: item.price,
        quantity: 1
      }
      itemsInCartTemp.push(itemToadd);
      totalAmount += item.price;
    }

    this.setState({
      totalItem: totalItem,
      totalAmount: totalAmount,
      itemsAddedToCartList: itemsInCartTemp,
      showItemMessage: true,
      itemMessage: 'Item added to cart!'
    })

    console.log(itemsInCartTemp);

  }

  itemSnackBarCloseHandler = () => {
    this.setState({
      showItemMessage: false,
      itemMessage: ''
    })
  }

  render() {

    return (
      <div>
        {/** Header component included here */}
        <Header />

        {/** Snackbar added to show item is added/ removed from cart */}
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          open={this.state.showItemMessage}
          message={this.state.itemMessage}
          autoHideDuration={5000}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.itemSnackBarCloseHandler}>
              <CloseIcon />
            </IconButton>
          ]}
          className="details-snackbar"
        ></Snackbar>

        {Object.keys(this.state.restaurant).length !== 0 ?
          <div className="details-body-container">
            {/** Restaurant information section starts here */}
            <div className="details-restaurant-info-section">
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

            {/** Restaurant menu and cart section starts here */}
            <div className="details-menu-cart-section">
              {/** Restaurant menu items section starts here */}
              <div className="details-menu">
                {this.state.restaurant.categories ?
                  <List>
                    {this.state.restaurant.categories.map(category => (
                      <li key={'category_' + category.id}>
                        <ul className="details-menu-list-item">
                          <ListSubheader disableSticky>{category.category_name.toUpperCase()}</ListSubheader>
                          <Divider style={{ marginBottom: 10 }} />
                          {category.item_list.map((item) => (
                            <ListItem key={'item_' + item.id} className="details-menu-item-type">
                              <ListItemIcon>
                                {item.item_type === "VEG" ?
                                  <i className="fa fa-circle" aria-hidden="true" style={{ color: "#138313" }}></i>
                                  :
                                  <i className="fa fa-circle" aria-hidden="true" style={{ color: "#c30909" }}></i>}
                              </ListItemIcon>
                              <ListItemText primary={item.item_name.replace(/\b\w/g, l => l.toUpperCase())} />
                              <ListItemIcon>
                                <i className="fa fa-rupee-sign" aria-hidden="true" style={{ color: "black" }}></i>
                              </ListItemIcon>
                              <ListItemText primary={" " + item.price.toFixed(2)} />
                              <IconButton onClick={() => this.addItemHandler(item)}>
                                <AddIcon />
                              </IconButton>
                            </ListItem>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </List>
                  : ""}
              </div>
              {/** Restaurant menu items section ends here */}

              {/** Restaurant cart section starts here */}
              <div className="details-cart">
                <Card className="details-card">
                  <CardContent>
                    <div className="details-card-header">
                      <Badge badgeContent={this.state.totalItem} showZero color="primary">
                        <ShoppingCartIcon />
                      </Badge>
                      <span className="details-card-title">
                        My Cart
                      </span>
                    </div>
                    <div className="details-cart-item">

                    </div>
                    <div className="details-cart-total">
                      <Typography variant="body1">
                        TOTAL AMOUNT
                      </Typography>
                      <span>
                        <i className="fa fa-rupee-sign" aria-hidden="true" /> {this.state.totalAmount.toFixed(2)}
                      </span>
                    </div>
                    <Button variant="contained" color="primary" className="details-cart-button">
                      CHECKOUT
                    </Button>
                  </CardContent>
                </Card>
              </div>
              {/** Restaurant cart section ends here */}
            </div>
            {/** Restaurant menu and cart section ends here */}
          </div>
          : ""}

      </div>
    )
  }
}

export default Details;