import { DaysList } from "./daysList.js";
import { ChosenDay } from "./chosenDay.js";

const daysContainer = document.querySelector(".days-container");
const forecastOverviewContainer = document.querySelector(".forecast-overview");
const hoursContainer = document.querySelector(".hours-container");
const regionContainer = document.querySelector(".region-name");
const errorContainer = document.querySelector(".error");
const errorMessage = document.querySelector(".error-message");
const errorBtn = document.querySelector(".error-btn");
const form = document.querySelector(".form");
const regionInput = document.querySelector(".region-input");

class WeatherApp {
  #apiKey = "0ddba79c202945448d9175312240308";
  #daysQuantity = 3;
  #currDay = 0;

  #weather;
  #region;
  #daysList;
  #chosenDay;

  constructor() {
    this.#getData().then(() => {
      this.#updateUI();

      daysContainer.addEventListener(
        "click",
        this.#changeChosenDayHandler.bind(this)
      );
      form.addEventListener("submit", this.#changeRegionHandler.bind(this));
      errorBtn.addEventListener("click", this.#closeErrorWindowHandler);
    });
  }

  async #getData() {
    try {
      const position = await this.#getCurrentGeolocation();
      const responseWeather = await this.#getForecastByGeolocation(position);
      if (!responseWeather.ok) throw new Error("Fail to load weather forecast");
      const weather = await responseWeather.json();
      this.#setWeatherVariables(weather);
    } catch (error) {
      this.#displayError(error);
    }
  }
  #setWeatherVariables(weatherObj) {
    const { name, country } = weatherObj.location;
    this.#region = `${name}, ${country}`;
    this.#weather = weatherObj.forecast.forecastday;
    this.#chosenDay = new ChosenDay(this.#weather[0]);
    this.#daysList = new DaysList(this.#weather);
  }
  #updateUI() {
    this.#displayRegion();
    this.#displayDaysList();
    this.#displayChosenDay();
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
  #displayRegion() {
    regionContainer.textContent = this.#region;
  }
  #displayDaysList() {
    this.#daysList.displayDays(daysContainer);
  }
  #displayChosenDay() {
    this.#chosenDay.displayForecast(forecastOverviewContainer);
    this.#chosenDay.displayHours(hoursContainer);
  }
  #displayError(error) {
    errorMessage.textContent = error.message;
    errorContainer.classList.remove("hidden");
  }
  async #changeRegionHandler(event) {
    event.preventDefault();
    const cityName = regionInput.value;
    regionInput.value = "";
    regionInput.blur();
    try {
      const responseWeather = await (
        await fetch(
          `http://api.weatherapi.com/v1/forecast.json?key=${
            this.#apiKey
          }&q=${cityName}&days=${this.#daysQuantity}`
        )
      ).json();
      if (responseWeather.error) throw new Error("Invalid city name");
      this.#setWeatherVariables(responseWeather);
      this.#updateUI();
      this.#currDay = 0;
    } catch (error) {
      this.#displayError(error);
    }
  }
  #changeChosenDayHandler(event) {
    const clickedDay = event.target.closest(".day");
    if (clickedDay && !clickedDay.classList.contains("chosen")) {
      daysContainer
        .querySelector(`[data-number="${this.#currDay}"]`)
        .classList.remove("chosen");
      clickedDay.classList.add("chosen");
      this.#currDay = clickedDay.dataset.number;

      forecastOverviewContainer.innerHTML = "";
      hoursContainer.innerHTML = "";

      this.#chosenDay.setChosenDay(this.#weather[this.#currDay]);
      this.#displayChosenDay();
    }
  }
  #closeErrorWindowHandler() {
    errorContainer.classList.add("hidden");
  }
}

const app = new WeatherApp();
