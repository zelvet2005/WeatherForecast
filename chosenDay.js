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
        condition: hour.condition,
      };
    });
  }
  displayForecast() {}
  createHourElement() {}
  displayHours() {}
}

/* <p class="sunrise">Sunrise: 6:00 AM</p>
          <p class="sunset">Sunset: 9:00 PM</p>
          <p class="avg-humidity">Average Humidity: 30</p>
          <p class="condition-text">Condition: Partly Cloudy</p>
          <p class="chance-rain">Daily chance of rain: 0 %</p>
          <p class="chance-snow">Daily chance of snow: 0 %</p>
          <p class="max-temp">Max temperature: 31°C</p>
          <p class="min-temp">Min temperature: 20°C</p>
          <p class="max-wind">Max wind: 25 kph</p> */

/* <div class="hour">
            <img
              src="//cdn.weatherapi.com/weather/64x64/night/113.png"
              alt="Clear"
            />
            <p class="humidity">Humidity: 25</p>
            <p class="precipitation">Precipitation: 0 mm</p>
            <p class="temperature">Temperature: 23°C</p>
            <p class="wind">Wind: 6 kph</p>
          </div> */
