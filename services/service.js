import axios from "axios";

const ConstantsUrl = "http://localhost:3003/";


function handleAuthError(err, router) {
  if (typeof window !== "undefined") {
    console.warn("Auth error:", err?.response?.data?.message || err.message);
    localStorage.removeItem("token");
    localStorage.removeItem("userDetail");
    router.push("/login");
  }
}

function Api(method, url, data, router) {
  return new Promise(function (resolve, reject) {
    let token = "";
    if (typeof window !== "undefined") {
      token = localStorage?.getItem("token") || "";
    }

    axios({
      method,
      url: ConstantsUrl + url,
      data,
      headers: { Authorization: `jwt ${token}` },
    }).then(
      (res) => resolve(res.data),
      (err) => {
        console.log("API Error:", err?.response?.data || err.message);

        if (err.response) {
          const status = err.response.status;
          const msg = err.response.data?.message || "";

          // check for expired/invalid token
          if (
            status === 401 ||
            msg.toLowerCase().includes("expired") ||
            msg.toLowerCase().includes("invalid token")
          ) {
            handleAuthError(err, router);
          }

          reject(err.response.data);
        } else {
          reject(err);
        }
      }
    );
  });
}

function ApiFormData(method, url, data, router) {
  return new Promise(function (resolve, reject) {
    let token = "";
    if (typeof window !== "undefined") {
      token = localStorage?.getItem("token") || "";
    }

    axios({
      method,
      url: ConstantsUrl + url,
      data,
      headers: {
        Authorization: `jwt ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }).then(
      (res) => resolve(res.data),
      (err) => {
        console.log("API Error:", err?.response?.data || err.message);

        if (err.response) {
          const status = err.response.status;
          const msg = err.response.data?.message || "";

          if (
            status === 401 ||
            msg.toLowerCase().includes("expired") ||
            msg.toLowerCase().includes("invalid token")
          ) {
            handleAuthError(err, router);
          }

          reject(err.response.data);
        } else {
          reject(err);
        }
      }
    );
  });
}

const timeSince = (date) => {
  date = new Date(date);
  const diff = new Date().valueOf() - date.valueOf();
  const seconds = Math.floor(diff / 1000);
  var interval = seconds / 31536000;

  if (interval > 1) return Math.floor(interval) + " Years";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + (Math.floor(interval) > 1 ? " Months" : " Month") + " ago";
  interval = seconds / 604800;
  if (interval > 1) return Math.floor(interval) + (Math.floor(interval) > 1 ? " Weeks" : " Week") + " ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + (Math.floor(interval) > 1 ? " Days" : " Day") + " ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + (Math.floor(interval) > 1 ? " Hours" : " Hour") + " ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + (Math.floor(interval) > 1 ? " Min" : " min") + " ago";
  return "Just now";
};

export { Api, timeSince, ApiFormData };
