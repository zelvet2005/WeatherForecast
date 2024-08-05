"use strict";

const apiKey = "0ddba79c202945448d9175312240308";
const days = 7;

const getCurrentGeolocation = function () {
  return new Promise(function (resolve, reject) {
    if (!navigator.geolocation)
      reject(new Error("Impossible to load geolocation"));

    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const getForecast = function (position) {
  return new Promise(function (resolve, reject) {
    if (!position) reject(new Error("Geolocation is undefined"));

    const { latitude, longitude } = position.coords;
    const geolocation = `${latitude},${longitude}`;
    resolve(
      fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${geolocation}&days=${days}`
      )
    );
  });
};

getCurrentGeolocation()
  .then(getForecast)
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
