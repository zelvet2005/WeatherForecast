import { DaysList } from "./daysList.js";
import { ChosenDay } from "./chosenDay.js";

class WeatherApp {
  #apiKey = "0ddba79c202945448d9175312240308";
  #daysQuantity = 3;
  #region;
  #daysList;
  #chosenDay;

  constructor() {
    this.#getData();

    setTimeout(() => {
      console.log(this.#daysList);
    }, 800);
  }
  async #getData() {
    try {
      const position = await this.#getCurrentGeolocation();
      const responseWeather = await this.#getForecastByGeolocation(position);
      if (!responseWeather.ok) throw new Error("Fail to load weather forecast");
      const weather = await responseWeather.json();
      const { name, country } = weather.location;
      this.#region = `${name}, ${country}`;
      this.#chosenDay = new ChosenDay(weather.forecast.forecastday[0]);
      this.#daysList = new DaysList(weather.forecast.forecastday);
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
        }&q=${geolocation}&days=${self.#daysQuantity}`
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
  #changeRegionHandler() {}
  #changeChosenDayHandler() {}
}

const app = new WeatherApp();
