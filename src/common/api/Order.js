import { PLACE_ORDER_URL } from "../common";

/** Functional component to place order for the signed in customer */
export function placeOrder(reqBody, accessToken) {
  return new Promise(function (resolve, reject) {
    fetch(`${PLACE_ORDER_URL}`, {
      method: "POST",
      headers: {
        "authorization": "Bearer " + accessToken,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reqBody)
    })
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