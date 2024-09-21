export class ChosenDay {
  isToday = true;

  generalForecast;
  hoursList;

  constructor(chosenDay) {
    this.setChosenDayVariables(chosenDay);
  }

  isThisDayToday(index) {
    this.isToday = +index === 0;
  }
  setChosenDayVariables(chosenDay) {
    const dayForecast = chosenDay.day;
    this.generalForecast = {
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
  displayGeneralForecast(container) {
    container.innerHTML = "";
    const forecastElement = `
      <p class="sunrise">Sunrise: ${this.generalForecast.astro.sunrise}</p>
      <p class="sunset">Sunset: ${this.generalForecast.astro.sunset}</p>
      <p class="avg-humidity">Average Humidity: ${this.generalForecast.dayForecast.avghumidity} %</p>
      <p class="condition-text">Condition: ${this.generalForecast.dayForecast.condition}</p>
      <p class="chance-rain">Daily chance of rain: ${this.generalForecast.dayForecast.dailyChanceOfRain} %</p>
      <p class="chance-snow">Daily chance of snow: ${this.generalForecast.dayForecast.dailyChanceOfSnow} %</p>
      <p class="max-temp">Max temperature: ${this.generalForecast.dayForecast.maxTemp}°C</p>
      <p class="min-temp">Min temperature: ${this.generalForecast.dayForecast.minTemp}°C</p>
      <p class="max-wind">Max wind: ${this.generalForecast.dayForecast.maxWind} kph</p>
    `;

    container.insertAdjacentHTML("afterbegin", forecastElement);
  }
  #createHourElement(hourObj, isPast) {
    return `
      <div class="hour ${isPast ? "past" : ""}">
        <p class="curr-hour">${
          hourObj.currHour < 10 ? "0" + hourObj.currHour : hourObj.currHour
        }:00</p>
        <img
          src="${hourObj.condition.icon}"
          alt="${hourObj.condition.text}"
        />
        <p class="humidity">Humidity: ${hourObj.humidity} %</p>
        <p class="precipitation">Precipitation: ${hourObj.precip} mm</p>
        <p class="temperature">Temperature: ${hourObj.temp}°C</p>
        <p class="wind">Wind: ${hourObj.wind} kph</p>
      </div>
    `;
  }
  displayHours(container) {
    container.innerHTML = "";
    const currHours = new Date().getHours();
    this.hoursList.forEach((hour) => {
      const isPast = this.isToday && currHours > hour.currHour;
      const hourElement = this.#createHourElement(hour, isPast);
      container.insertAdjacentHTML("beforeend", hourElement);
    });
  }
}
