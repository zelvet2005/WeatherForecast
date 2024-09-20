export class DaysList {
  daysList;

  constructor(daysList) {
    this.#setDaysList(daysList);
  }

  #setDaysList(daysList) {
    this.daysList = daysList.map((dayForecast) => {
      const date = new Date(dayForecast.date).toDateString().split(" ");
      return {
        date: {
          dayName: date[0],
          dayAndMonth: `${date[2]} ${date[1]}`,
        },
        day: {
          avgTemp: dayForecast.day.avgtemp_c,
          condition: dayForecast.day.condition,
        },
      };
    });
  }
  #createDayElement(dayObj, index, isFirst = false) {
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
  displayDays(container) {
    container.innerHTML = "";
    this.daysList.forEach((day, index) => {
      const dayElement =
        index === 0
          ? this.#createDayElement(day, index, true)
          : this.#createDayElement(day, index);
      container.insertAdjacentHTML("beforeend", dayElement);
    });
  }
}
