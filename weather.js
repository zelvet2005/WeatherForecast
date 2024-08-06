"use strict";

const apiKey = "0ddba79c202945448d9175312240308";
const days = 10;

let currentAmountOfDays = 5; // 5 || 7 || 10

const getCurrentGeolocation = function () {
  return new Promise(function (resolve, reject) {
    if (!navigator.geolocation)
      reject(new Error("Impossible to load geolocation"));

    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
const getForecastByGeolocation = function (position) {
  return new Promise(function (resolve, reject) {
    if (!position) reject(new Error("Geolocation is undefined"));

    const { latitude, longitude } = position.coords;
    const geolocation = `${latitude},${longitude}`;
    const response = fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${geolocation}&days=${days}`
    );
    resolve(response);
  });
};

const getData = async function () {
  try {
    const position = await getCurrentGeolocation();
    const responseWeather = await getForecastByGeolocation(position);
    if (!responseWeather.ok) throw new Error("Fail to load weather forecast");
    const weather = await responseWeather.json();
    const { forecastday } = weather.forecast;
    console.log(forecastday); // temporary
  } catch (error) {
    console.error(error.message); // temporary
  }
};

getData();

/////////////////////////////////
// day:
// 1) date
// 2) day { avgtemp_c; condition {icon}; }

// activeDay:
// 1) astro { sunrise; sunset }
// 2) day { avghumidity; daily_chance_of_rain; daily_chance_of_snow;
// maxtemp_c; mintemp_c; maxwind_kph; condition {text}; }
// 3) hours { humidity; precip_mm; temp_c; wind_kph; condition {icon}; }
