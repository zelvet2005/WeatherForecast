import { ChosenDay } from "./chosenDay.js";

const daysContainer = document.querySelector(".days-container");
const weatherMapContainer = document.querySelector(".weather-map");

export class WeatherForecast {
  #weather;
  #chosenDay;
  daysList;
  chosenDayIndex;

  constructor(weather) {
    this.#weather = weather;
    this.chosenDayIndex = 0;
    this.#chosenDay = new ChosenDay(this.#weather[this.chosenDayIndex]);

    this.#setDaysList(this.#weather);

    daysContainer.addEventListener(
      "click",
      this.changeChosenDayHandler.bind(this)
    );
  }

  setWeatherForecastVariables(weather) {
    this.#weather = weather;
    this.chosenDayIndex = 0;
    this.#chosenDay.setChosenDayVariables(this.#weather[this.chosenDayIndex]);
    this.#setDaysList(this.#weather);

    weatherMapContainer.classList.remove("none");
  }
  #setDaysList(daysList) {
    this.daysList = daysList.map((dayForecast) => {
      const date = new Date(dayForecast.date).toDateString().split(" ");
      const [dayName, month, dayNum] = date;
      return {
        date: {
          dayName: dayName,
          dayAndMonth: `${dayNum} ${month}`,
        },
        day: {
          avgTemp: dayForecast.day.avgtemp_c,
          condition: dayForecast.day.condition,
        },
      };
    });
  }
  displayWeatherForecast() {
    this.#displayDays();
    this.#displayChosenDay();
  }
  #displayDays() {
    daysContainer.innerHTML = "";
    this.daysList.forEach((day, index) => {
      const isFirst = index === 0;
      const dayElement = this.#createDayElement(day, index, isFirst);
      daysContainer.insertAdjacentHTML("beforeend", dayElement);
    });
  }
  #displayChosenDay() {
    this.#chosenDay.displayGeneralForecast();
    this.#chosenDay.displayHours();
  }
  #createDayElement(dayObj, index, isFirst) {
    return `
      <div class="day ${isFirst ? "chosen" : ""}" data-number=${index}>
        <p class="name">${dayObj.date.dayName}</p>
        <p class="day-month">${dayObj.date.dayAndMonth}</p>
        <img src="${dayObj.day.condition.icon}" alt="${
      dayObj.day.condition.text
    }" />
        <p class="avg-temp">${dayObj.day.avgTemp}°C</p>
      </div>
    `;
  }
  changeChosenDayHandler(event) {
    const clickedDay = event.target.closest(".day");
    if (clickedDay && !clickedDay.classList.contains("chosen")) {
      daysContainer
        .querySelector(`[data-number="${this.chosenDayIndex}"]`)
        .classList.remove("chosen");
      clickedDay.classList.add("chosen");
      this.chosenDayIndex = Number(clickedDay.dataset.number);

      if (Number(this.chosenDayIndex) === 0) {
        weatherMapContainer.classList.remove("none");
      } else {
        weatherMapContainer.classList.add("none");
      }

      this.#chosenDay.setChosenDayVariables(this.#weather[this.chosenDayIndex]);
      this.#chosenDay.setIsToday(this.chosenDayIndex);
      this.#displayChosenDay();
    }
  }
}
