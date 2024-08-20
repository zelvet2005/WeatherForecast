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
