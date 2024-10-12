const forecastOverviewContainer = document.querySelector(".forecast-overview");
const hoursContainer = document.querySelector(".hours-container");

export class ChosenDay {
  isToday = true;
  forecastOverview;
  hoursList;
  localTimeHours;

  constructor(chosenDay, localTime) {
    this.setLocalTime(localTime);
    this.setChosenDayVariables(chosenDay);
  }

  setChosenDayVariables(chosenDay) {
    const dayForecast = chosenDay.day;
    this.forecastOverview = {
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
  setIsToday(indexOfDay) {
    this.isToday = Number(indexOfDay) === 0;
  }
  setLocalTime(localTime) {
    const localTimeWithoutDate = localTime.split(" ")[1];
    this.localTimeHours = Number(localTimeWithoutDate.split(":")[0]);
  }
  displayGeneralForecast() {
    forecastOverviewContainer.innerHTML = "";
    const { astro, dayForecast } = this.forecastOverview;
    const forecastElement = `
      <p class="sunrise">Sunrise: ${astro.sunrise}</p>
      <p class="sunset">Sunset: ${astro.sunset}</p>
      <p class="avg-humidity">Average Humidity: ${dayForecast.avghumidity} %</p>
      <p class="condition-text">Condition: ${dayForecast.condition}</p>
      <p class="chance-rain">Daily chance of rain: ${dayForecast.dailyChanceOfRain} %</p>
      <p class="chance-snow">Daily chance of snow: ${dayForecast.dailyChanceOfSnow} %</p>
      <p class="max-temp">Max temperature: ${dayForecast.maxTemp}°C</p>
      <p class="min-temp">Min temperature: ${dayForecast.minTemp}°C</p>
      <p class="max-wind">Max wind: ${dayForecast.maxWind} kph</p>
    `;

    forecastOverviewContainer.insertAdjacentHTML("afterbegin", forecastElement);
  }
  displayHours() {
    hoursContainer.innerHTML = "";
    this.hoursList.forEach((hour) => {
      const isPast = this.isToday && this.localTimeHours > hour.currHour;
      const hourElement = this.#createHourElement(hour, isPast);
      hoursContainer.insertAdjacentHTML("beforeend", hourElement);
    });
  }
  #createHourElement(hourObj, isPast) {
    return `
      <div class="hour ${isPast ? "past" : ""}">
        <p class="curr-hour">${this.#formatHour(hourObj.currHour)}</p>
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
  #formatHour(hour) {
    return `${hour < 10 ? "0" + hour : hour}:00`;
  }
}
