import { GET_ADDRESS_CUSTOMER_URL } from "../common";

/** Functional component to fetch address of the customer */
export function getAddressCustomer(accessToken) {
  return new Promise(function (resolve, reject) {
    fetch(GET_ADDRESS_CUSTOMER_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
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
