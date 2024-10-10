import { WeatherForecast } from "./weatherForecast.js";
import { WeatherMap } from "./weatherMap.js";

const regionName = document.querySelector(".region-name");
const errorContainer = document.querySelector(".error");
const errorMessage = document.querySelector(".error-message");
const errorBtn = document.querySelector(".error-btn");
const form = document.querySelector(".form");
const regionInput = document.querySelector(".region-input");

class WeatherApp {
  #apiKey = "0ddba79c202945448d9175312240308";
  #daysQuantity = 3;
  #weather;
  #region;
  #weatherForecast;
  #weatherMap;

  constructor() {
    this.#getData().then(() => {
      this.#updateUI();

      form.addEventListener("submit", this.#changeRegionHandler.bind(this));
      errorBtn.addEventListener("click", this.#closeErrorWindowHandler);
    });
  }

  async #getData() {
    try {
      const position = await this.#getCurrentGeolocation();
      const responseWeather = await (
        await this.#getForecastByGeolocation(position)
      ).json();

      if (responseWeather.error)
        throw new Error("Fail to load weather forecast");

      this.#weatherMap = new WeatherMap(position);
      this.#weatherForecast = new WeatherForecast(
        responseWeather.forecast.forecastday
      );
      this.#setWeatherVariables(responseWeather);
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
    const { latitude, longitude } = position.coords;
    const geolocation = `${latitude},${longitude}`;
    return new Promise(function (resolve) {
      const response = fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${
          self.#apiKey
        }&q=${geolocation}&days=${self.#daysQuantity}`
      );
      resolve(response);
    });
  }
  #getForecastByCityName(cityName) {
    const self = this;
    return new Promise(function (resolve) {
      const response = fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${
          self.#apiKey
        }&q=${cityName}&days=${self.#daysQuantity}`
      );
      resolve(response);
    });
  }
  #setWeatherVariables(weatherObj) {
    const { name, country } = weatherObj.location;
    this.#region = `${name}, ${country}`;
    this.#weather = weatherObj.forecast.forecastday;
  }
  #updateUI() {
    this.#displayRegion();
    this.#weatherForecast.displayWeatherForecast();
  }
  #displayRegion() {
    regionName.textContent = this.#region;
  }
  #displayError(error) {
    errorMessage.textContent = error.message;
    errorContainer.classList.remove("none"); // for correct animation
    errorContainer.classList.remove("hidden");
    errorContainer.classList.add("not-hidden");
  }
  async #changeRegionHandler(event) {
    event.preventDefault();
    this.#closeErrorWindowHandler();

    const cityName = regionInput.value;
    regionInput.value = "";
    regionInput.blur();

    try {
      const responseWeather = await (
        await this.#getForecastByCityName(cityName)
      ).json();

      if (responseWeather.error) throw new Error("Invalid city name");

      const { lat, lon } = responseWeather.location;
      this.#weatherMap.setView(lat, lon);
      this.#weatherMap.setMarker(lat, lon);

      this.#setWeatherVariables(responseWeather);
      this.#weatherForecast.setWeatherForecastVariables(this.#weather);
      this.#updateUI();
    } catch (error) {
      this.#displayError(error);
    }
  }
  #closeErrorWindowHandler() {
    errorContainer.classList.remove("not-hidden");
    errorContainer.classList.add("hidden");
  }
}

const app = new WeatherApp();
