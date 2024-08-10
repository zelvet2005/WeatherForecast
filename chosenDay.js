export class ChosenDay {
  chosenDay;
  hoursList;

  constructor(chosenDay) {
    this.parseChosenDay(chosenDay);
  }
  parseChosenDay(chosenDay) {
    const dayForecast = chosenDay.day;
    this.chosenDay = {
      astro: {
        sunrise: chosenDay.astro.sunrise,
        sunset: chosenDay.astro.sunset,
      },
      dayForecast: {
        avghumidity: dayForecast.avghumidity,
        dailyChanceOfRain: dayForecast.daily_chance_of_rain,
        dailyChanceOfSnow: dayForecast.daily_chance_of_snow,
        maxTemp: dayForecast.maxtemp_c,
        minTemp: dayForecast.mintemp_c,
        maxWind: dayForecast.maxwind_kph,
        condition: dayForecast.condition.text,
      },
    };
    this.hoursList = chosenDay.hour.map((hour) => {
      return {
        humidity: hour.humidity,
        precip: hour.precip_mm,
        temp: hour.temp_c,
        wind: hour.wind_kph,
        conditionIcon: hour.condition.icon,
      };
    });
  }
  displayForecast() {}
  createHourElement() {}
  displayHours() {}
}
