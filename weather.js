//days choice: 5 || 7 || 10

/////////////////////////////////
// day:
// 1) date
// 2) day { avgtemp_c; condition {icon}; }

// activeDay:
// 1) astro { sunrise; sunset }
// 2) day { avghumidity; daily_chance_of_rain; daily_chance_of_snow;
// maxtemp_c; mintemp_c; maxwind_kph; condition {text}; }
// 3) hours { humidity; precip_mm; temp_c; wind_kph; condition {icon}; }

import { DaysList } from "./daysList.js";
import { ChosenDay } from "./chosenDay.js";

class WeatherApp {
  #apiKey = "0ddba79c202945448d9175312240308";
  #maxDaysQuantity = 10;
  #region;
  #daysList;
  #chosenDay;
  constructor() {
    this.#getData();
  }
  async #getData() {
    try {
      const position = await this.#getCurrentGeolocation();
      const responseWeather = await this.#getForecastByGeolocation(position);
      if (!responseWeather.ok) throw new Error("Fail to load weather forecast");
      const weather = await responseWeather.json();
      console.log(weather); // temporary
    } catch (error) {
      this.#displayError(error);
    }
  }
  #getCurrentGeolocation() {
    return new Promise(function (resolve, reject) {
      if (!navigator.geolocation)
        reject(new Error("Impossible to load geolocation"));

      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }
  #getForecastByGeolocation(position) {
    const self = this;
    return new Promise(function (resolve, reject) {
      if (!position) reject(new Error("Geolocation is undefined"));

      const { latitude, longitude } = position.coords;
      const geolocation = `${latitude},${longitude}`;
      const response = fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=${
          self.#apiKey
        }&q=${geolocation}&days=${self.#maxDaysQuantity}`
      );
      resolve(response);
    });
  }
  #displayRegion() {}
  #displayDaysList() {}
  #displayChosenDay() {}
  #displayError(error) {
    console.error(error.message); // temporary
  }
  #changeDisplayedDaysAmountHandler() {}
  #changeRegionHandler() {}
  #changeChosenDayHandler() {}
}

const app = new WeatherApp();
