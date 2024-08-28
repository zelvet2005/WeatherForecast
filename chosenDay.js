export class ChosenDay {
  chosenDay;
  hoursList;

  constructor(chosenDay) {
    this.setChosenDay(chosenDay);
  }

  setChosenDay(chosenDay) {
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
    this.hoursList = chosenDay.hour.map((hour, index) => {
      return {
        currHour: index,
        humidity: hour.humidity,
        precip: hour.precip_mm,
        temp: hour.temp_c,
        wind: hour.wind_kph,
        condition: hour.condition,
      };
    });
  }
  displayForecast(container) {
    container.innerHTML = "";
    const forecastElement = `
      <p class="sunrise">Sunrise: ${this.chosenDay.astro.sunrise}</p>
      <p class="sunset">Sunset: ${this.chosenDay.astro.sunset}</p>
      <p class="avg-humidity">Average Humidity: ${this.chosenDay.dayForecast.avghumidity}</p>
      <p class="condition-text">Condition: ${this.chosenDay.dayForecast.condition}</p>
      <p class="chance-rain">Daily chance of rain: ${this.chosenDay.dayForecast.dailyChanceOfRain} %</p>
      <p class="chance-snow">Daily chance of snow: ${this.chosenDay.dayForecast.dailyChanceOfSnow} %</p>
      <p class="max-temp">Max temperature: ${this.chosenDay.dayForecast.maxTemp}°C</p>
      <p class="min-temp">Min temperature: ${this.chosenDay.dayForecast.minTemp}°C</p>
      <p class="max-wind">Max wind: ${this.chosenDay.dayForecast.maxWind} kph</p>
    `;

    container.insertAdjacentHTML("afterbegin", forecastElement);
  }
  #createHourElement(hourObj) {
    return `
      <div class="hour">
        <p class="currHour">${
          hourObj.currHour < 10 ? "0" + hourObj.currHour : hourObj.currHour
        }:00</p>
        <img
          src="${hourObj.condition.icon}"
          alt="${hourObj.condition.text}"
        />
        <p class="humidity">Humidity: ${hourObj.humidity}</p>
        <p class="precipitation">Precipitation: ${hourObj.precip} mm</p>
        <p class="temperature">Temperature: ${hourObj.temp}°C</p>
        <p class="wind">Wind: ${hourObj.wind} kph</p>
      </div>
    `;
  }
  displayHours(container) {
    container.innerHTML = "";
    this.hoursList.forEach((hour) => {
      const hourElement = this.#createHourElement(hour);
      container.insertAdjacentHTML("beforeend", hourElement);
    });
  }
}
