const mapContainer = document.querySelector("#map");
const mapBtnsContainer = document.querySelector(".map-type");

export class WeatherMap {
  #apiKey = "ee684e18c13cf1eae5220ab06846dfbb";
  #scale = 9;
  #currWeatherLayer;
  #temperatureLayer = L.tileLayer(
    `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${
      this.#apiKey
    }`,
    {
      attribution:
        '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
      opacity: 1,
      noWrap: true,
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
      noWrap: true,
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
      noWrap: true,
    }
  );
  #weatherLayers = [
    this.#precipitationLayer,
    this.#cloudsLayer,
    this.#temperatureLayer,
  ];
  #currMarker;
  map;

  constructor(position = null) {
    if (position) {
      const { latitude, longitude } = position;
      this.setWeatherMapVariables(latitude, longitude);
    }

    mapBtnsContainer.addEventListener(
      "click",
      this.#changeMapLayerHandler.bind(this)
    );
  }
  setWeatherMapVariables(latitude, longitude) {
    if (!this.map) {
      this.map = L.map(mapContainer, {
        minZoom: 3,
        maxZoom: 15,
        maxBounds: [
          [-85, -180],
          [85, 180],
        ],
        maxBoundsViscosity: 1.0,
      });
    }
    const weatherMap = this.map;
    weatherMap.eachLayer(function (layer) {
      weatherMap.removeLayer(layer);
    });
    weatherMap.setView([latitude, longitude], this.#scale);
    this.#currMarker = L.marker([latitude, longitude]);

    this.#setBasicMapLayer();
    this.#currMarker.addTo(weatherMap);
    this.#precipitationLayer.addTo(weatherMap);
    this.#currWeatherLayer = 0;

    mapBtnsContainer.innerHTML = "";
    mapBtnsContainer.insertAdjacentHTML("beforeend", this.#createLayerBtns());
  }
  setMarker(latitude, longitude) {
    this.map.removeLayer(this.#currMarker);
    this.#currMarker = L.marker([latitude, longitude]);
    this.#currMarker.addTo(this.map);
  }
  setView(latitude, longitude) {
    this.map.setView([latitude, longitude], this.#scale);
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
        noWrap: true,
      }
    ).addTo(this.map);
  }
  #changeLayer(indexOfNewLayer) {
    this.map.removeLayer(this.#weatherLayers[this.#currWeatherLayer]);
    this.#weatherLayers[indexOfNewLayer].addTo(this.map);
    this.#currWeatherLayer = indexOfNewLayer;
  }
  #createLayerBtns() {
    return `
      <button class="map-btn chosen" data-layer="0">Precipitation</button>
      <button class="map-btn" data-layer="1">Clouds</button>
      <button class="map-btn" data-layer="2">Temperature</button>
    `;
  }
  #changeMapLayerHandler(event) {
    const clickedElement = event.target;

    if (
      clickedElement.classList.contains("map-btn") &&
      !clickedElement.classList.contains("chosen")
    ) {
      document
        .querySelector(`[data-layer="${this.#currWeatherLayer}"]`)
        .classList.remove("chosen");
      clickedElement.classList.add("chosen");

      const newLayer = clickedElement.dataset.layer;
      this.#changeLayer(newLayer);
    }
  }
}
