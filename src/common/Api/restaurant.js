import { GET_RESTAURANT_URL } from "../common";

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

