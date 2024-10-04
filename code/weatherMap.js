export class WeatherMap {
  #apiKey = "ee684e18c13cf1eae5220ab06846dfbb";
  #scale = 9;
  #currLayer = 0;

  #temperatureLayer = L.tileLayer(
    `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${
      this.#apiKey
    }`,
    {
      attribution:
        '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
      opacity: 1,
    }
  );
  #cloudsLayer = L.tileLayer(
    `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${
      this.#apiKey
    }`,
    {
      attribution:
        '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
      opacity: 1,
    }
  );
  #precipitationLayer = L.tileLayer(
    `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${
      this.#apiKey
    }`,
    {
      attribution:
        '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
      opacity: 1,
    }
  );
  #layers = [
    this.#precipitationLayer,
    this.#cloudsLayer,
    this.#temperatureLayer,
  ];

  #currMarker;
  map;

  constructor(position, mapContainer) {
    const { latitude, longitude } = position.coords;
    this.map = L.map(mapContainer).setView([latitude, longitude], this.#scale);
    this.#layers[0].addTo(this.map);
    this.#currMarker = L.marker([latitude, longitude]);

    this.#setBasicMapLayer();
    this.setMarker(latitude, longitude);
  }

  #setBasicMapLayer() {
    L.tileLayer(
      "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}?api_key=cd4d72d8-da11-4901-b7f6-aa8199d5303f",
      {
        minZoom: 0,
        maxZoom: 20,
        attribution:
          '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: "jpg",
      }
    ).addTo(this.map);
  }
  setMarker(latitude, longitude) {
    this.map.removeLayer(this.#currMarker);
    this.#currMarker = L.marker([latitude, longitude]);
    this.#currMarker.addTo(this.map).openPopup();
  }
  setView(latitude, longitude) {
    this.map.setView([latitude, longitude], this.#scale);
  }
  changeLayer(index) {
    this.map.removeLayer(this.#layers[this.#currLayer]);
    this.#layers[index].addTo(this.map);
    this.#currLayer = index;
  }
}
