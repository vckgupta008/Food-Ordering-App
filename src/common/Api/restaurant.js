import { GET_RESTAURANT_URL, GET_RESTAURANT_NAME } from "../common";

/** Functional component to retrieve all restaurants */
export function getRestaurant() {
  return new Promise(function (resolve, reject) {
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

/** Functional component to retrieve all restaurants for the given name */
export function getRestaurantByName(restaurantName) {
  return new Promise(function (resolve, reject) {
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