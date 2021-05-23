import { GET_PAYMENT_METHODS_URL } from "../common";

/** Functional component to fetch payment methods */
export function getPaymentMethods() {
  return new Promise(function (resolve, reject) {
    fetch(GET_PAYMENT_METHODS_URL, {
      method: "GET"
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