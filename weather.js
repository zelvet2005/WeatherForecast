import { DaysList } from "./daysList.js";
import { ChosenDay } from "./chosenDay.js";

const daysContainer = document.querySelector(".days-container");
const forecastOverviewContainer = document.querySelector(".forecast-overview");
const hoursContainer = document.querySelector(".hours-container");
const regionContainer = document.querySelector(".region-name");

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
      // console.log(this.#chosenDay);
      // console.log(this.#region);
      // console.log(this.#daysList);

      this.#displayRegion();
      this.#displayDaysList();
      this.#displayChosenDay();

      daysContainer.addEventListener(
        "click",
        this.#changeChosenDayHandler.bind(this)
      );
    });
  }

  async #getData() {
    try {
      const position = await this.#getCurrentGeolocation();
      const responseWeather = await this.#getForecastByGeolocation(position);
      if (!responseWeather.ok) throw new Error("Fail to load weather forecast");
      const weather = await responseWeather.json();
      const { name, country } = weather.location;
      this.#region = `${name}, ${country}`;
      this.#weather = weather.forecast.forecastday;
      this.#chosenDay = new ChosenDay(this.#weather[0]);
      this.#daysList = new DaysList(this.#weather);
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
    console.error(error.message); // temporary
  }
  #changeRegionHandler() {}
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
}

const app = new WeatherApp();
