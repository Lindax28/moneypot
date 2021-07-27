import Configuration from "../types/configuration";

let config : Configuration;

if (process.env.NODE_ENV === "production") {
  config = {
    API_URL: process.env.REACT_APP_BASE_URL,
  };
} else {
  config = {
    API_URL: "http://localhost:3000",
  };
}

export default config;