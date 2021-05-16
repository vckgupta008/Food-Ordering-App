import { LOGIN_CUSTOMER_URL } from "../common";

/** Functional component to login the user */
export function loginCustomer(encodedCredential) {
  return new Promise(function(resolve, reject) {
    fetch(LOGIN_CUSTOMER_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${encodedCredential}`
      }
    })
      .then(resp => {
        let accessToken = resp.headers.get("access-token");
        localStorage.setItem("access-token", accessToken);
        // console.log(resp.headers.get('access-token'));
        resp.json().then(res => {
          return resolve(res);
        });
      })
      .catch(error => {
        reject(error);
      });
  });
}
