import { GET_RESTAURANT_URL, GET_RESTAURANT_NAME } from "../common";

export function getRestaurant() {
  return new Promise(function(resolve, reject) {
    fetch(GET_RESTAURANT_URL)
      .then(resp => {
        resp.json().then(res => {
          return resolve(res);
        });
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function getRestaurantByName(restaurantName) {
  return new Promise(function(resolve, reject) {
    fetch(`${GET_RESTAURANT_NAME}${restaurantName}`)
      .then(resp => {
        resp.json().then(res => {
          return resolve(res);
        });
      })
      .catch(error => {
        reject(error);
      });
  });
}


