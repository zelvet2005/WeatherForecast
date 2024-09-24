export class WeatherMap {
  #apiKey = "ee684e18c13cf1eae5220ab06846dfbb";
  #scale = 9;

  map;

  constructor(position, mapContainer) {
    const { latitude, longitude } = position.coords;
    this.map = L.map(mapContainer).setView([latitude, longitude], this.#scale);

    this.#setBasicMapLayer();
    this.#setMarker(latitude, longitude);
  }

  #setBasicMapLayer() {
    L.tileLayer(
      "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}",
      {
        minZoom: 0,
        maxZoom: 20,
        attribution:
          '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: "jpg",
      }
    ).addTo(this.map);
  }
  #setMarker(latitude, longitude) {
    L.marker([latitude, longitude]).addTo(this.map).openPopup();
  }
}

// const temperatureLayer = L.tileLayer(
//    `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`,
//    {
//      attribution:
//        '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
//      opacity: 1,
//    }
//  );

// const cloudsLayer = L.tileLayer(
//   `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`,
//   {
//     attribution:
//       '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
//     opacity: 1,
//   }
// );

// const precipitationLayer = L.tileLayer(
//   `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`,
//   {
//     attribution:
//       '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
//     opacity: 1,
//   }
// );
