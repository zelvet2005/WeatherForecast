export class DaysList {
  daysList;

  constructor(daysList) {
    this.parseDaysList(daysList);
  }
  parseDaysList(daysList) {
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
  createDayElement() {}
  displayDays() {}
}

/* <div class="day">
  <p class="name">Mon</p>
  <p class="day-month">20 Aug</p>
  <img src="//cdn.weatherapi.com/weather/64x64/day/113.png" alt="Sunny" />
  <p class="avg-temp">28.5°C</p>
</div> */
