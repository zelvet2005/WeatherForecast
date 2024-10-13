const askClothesContainer = document.querySelector(".ask-clothes");
const askInput = document.querySelector(".ask-input");
const askBtn = document.querySelector(".ask-btn");
const recommendedClothesContainer = document.querySelector(
  ".recommended-clothes"
);
const chosenClothes = document.querySelector(".chosen-clothes");

export class Clothes {
  #clothesKeyLS = "Clothes";
  #clothes;
  #currConditions;

  constructor(currWeather = null) {
    this.#setLocalStorageIfNotExist();
    if (currWeather) {
      this.setClothesVariables(currWeather);
      this.updateClothesUI();
    }

    askBtn.addEventListener("click", this.#addClothesToMapHandler.bind(this));
  }

  #getClothesFromLocalStorage() {
    return new Map(JSON.parse(localStorage.getItem(this.#clothesKeyLS)));
  }
  #setLocalStorageIfNotExist() {
    if (!localStorage.hasOwnProperty(this.#clothesKeyLS)) {
      localStorage.setItem(this.#clothesKeyLS, JSON.stringify([]));
    }
  }
  setClothesVariables(currWeather) {
    this.#setCurrentConditions(currWeather);
    this.#clothes = this.#getClothesFromLocalStorage();
  }
  #setCurrentConditions(currWeather) {
    const currHour = new Date().getHours();
    const weatherOnCurrentHour = currWeather.hour[currHour];
    const { temp_c: temp, precip_mm: precip } = weatherOnCurrentHour;
    const formattedTemp = Math.round(temp);
    const formattedPrecip = precip.toFixed(1) === "0.0" ? 0 : precip.toFixed(1);
    this.#currConditions = `${formattedTemp}/${formattedPrecip}`;
  }
  updateClothesUI() {
    if (this.#clothes.has(this.#currConditions)) {
      this.#displayRecommendedClothes(this.#currConditions);
    } else {
      this.#displayAskClothes();
    }
  }
  #displayRecommendedClothes(conditions) {
    const recommendedClothes = this.#clothes.get(conditions);
    chosenClothes.innerHTML = recommendedClothes;
    askClothesContainer.classList.add("none");
    recommendedClothesContainer.classList.remove("none");
  }
  #displayAskClothes() {
    recommendedClothesContainer.classList.add("none");
    askClothesContainer.classList.remove("none");
  }
  #makeConditionsForClothes(clothes) {
    const [temp, precip] = this.#currConditions.split("/");
    this.#clothes.set(`${Number(temp) + 1}/${precip}`, clothes);
    this.#clothes.set(`${temp - 1}/${precip}`, clothes);
    this.#clothes.set(`${temp}/${precip}`, clothes);
    this.#clothes.set(`${temp}/${Number(precip) + 0.1}`, clothes);
    if (precip >= 0.1) this.#clothes.set(`${temp}/${precip - 0.1}`, clothes);
  }
  #formatMapForLocalStorage(map) {
    return JSON.stringify(Array.from(map));
  }
  #addClothesToMapHandler(event) {
    event.preventDefault();

    const clothes = askInput.value;
    if (clothes && clothes.trim() !== "") {
      this.#makeConditionsForClothes(clothes);
      localStorage.setItem(
        this.#clothesKeyLS,
        this.#formatMapForLocalStorage(this.#clothes)
      );
      this.#displayRecommendedClothes(this.#currConditions);

      askInput.value = "";
      askInput.blur();
    }
  }
}
