export class DaysList {
  daysList;

  constructor(daysList) {
    this.#parseDaysList(daysList);
  }

  #parseDaysList(daysList) {
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
  #createDayElement(dayObj) {
    return `
      <div class="day">
        <p class="name">${dayObj.date.dayName}</p>
        <p class="day-month">${dayObj.date.dayAndMonth}</p>
        <img src="${dayObj.day.condition.icon}" alt="${dayObj.day.condition.text}" />
        <p class="avg-temp">${dayObj.day.avgTemp}</p>
      </div>
    `;
  }
  displayDays(container) {
    this.daysList.forEach((day) => {
      const dayElement = this.#createDayElement(day);
      container.insertAdjacentHTML("beforeend", dayElement);
    });
  }
}
