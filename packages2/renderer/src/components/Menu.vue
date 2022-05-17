<script setup>
import {
  switchScreen,
  current_animal_type,
  switchAnimalType,
} from './../state.js'
function toggleAnimalType() {
  switchAnimalType(
    current_animal_type.value === 'sheep' ? 'goat' : 'sheep'
  )
}
</script>
<template>
  <div class="sh-menu">
    <button
      :class="{
        'sh-menu__animal-switcher': true,
        'sh-menu__animal-switcher--sheep':
          current_animal_type === 'sheep',
        'sh-menu__animal-switcher--goat':
          current_animal_type === 'goat',
      }"
      @click="toggleAnimalType"
    >
      <img src="/assets/sheep.png" />
      <div>
        <div></div>
      </div>
      <img src="/assets/goat.png" />
    </button>
    <div
      :class="{
        'sh-menu__items': true,
        'sh-menu__items--sheep':
          current_animal_type === 'sheep',
        'sh-menu__items--goat':
          current_animal_type === 'goat',
      }"
    >
      <div class="sh-menu__item sh-menu__item--birth">
        <button
          class="sh-menu__item__button"
          @click="switchScreen('birth')"
        >
          <img src="/assets/sheep.png" />
          <img src="/assets/goat.png" />
          <img src="/assets/add_tag.png" />
        </button>
        Urodzenie
      </div>
      <div class="sh-menu__item sh-menu__item--purchase">
        <button
          class="sh-menu__item__button"
          @click="switchScreen('purchase')"
        >
          <img src="/assets/sheep.png" />
          <img src="/assets/goat.png" />

          <svg
            class="sh-buy-arrow"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 172 172"
          >
            <g transform="">
              <g
                fill="none"
                fill-rule="nonzero"
                stroke="none"
                stroke-width="1"
                stroke-linecap="butt"
                stroke-linejoin="miter"
                stroke-miterlimit="10"
                stroke-dasharray=""
                stroke-dashoffset="0"
                font-family="none"
                font-weight="none"
                font-size="none"
                text-anchor="none"
                style="mix-blend-mode: normal"
              >
                <path
                  d="M0,172v-172h172v172z"
                  fill="none"
                ></path>
                <g fill="currentColor">
                  <path
                    d="M144.66275,66.67688c-0.86101,1.94379 -2.7868,3.19745 -4.91275,3.19813h-26.875v96.75c0,2.96853 -2.40647,5.375 -5.375,5.375h-43c-2.96853,0 -5.375,-2.40647 -5.375,-5.375v-96.75h-26.875c-2.1283,0.00076 -4.0566,-1.25434 -4.91753,-3.20073c-0.86093,-1.9464 -0.49232,-4.21746 0.94003,-5.79164l53.75,-59.125c1.04442,-1.07444 2.47909,-1.68064 3.9775,-1.68064c1.49841,0 2.93308,0.6062 3.9775,1.68064l53.75,59.125c1.43181,1.57572 1.79859,3.84806 0.93525,5.79425z"
                  ></path>
                </g>
                <path d="" fill="none"></path>
              </g>
            </g>
          </svg>
        </button>
        Kupno
      </div>
      <div class="sh-menu__item sh-menu__item--sell">
        <button class="sh-menu__item__button">
          <img src="/assets/sheep.png" />
          <img src="/assets/goat.png" />

          <svg
            class="sh-sell-arrow"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 172 172"
          >
            <g transform="">
              <g
                fill="none"
                fill-rule="nonzero"
                stroke="none"
                stroke-width="1"
                stroke-linecap="butt"
                stroke-linejoin="miter"
                stroke-miterlimit="10"
                stroke-dasharray=""
                stroke-dashoffset="0"
                font-family="none"
                font-weight="none"
                font-size="none"
                text-anchor="none"
                style="mix-blend-mode: normal"
              >
                <path
                  d="M0,172v-172h172v172z"
                  fill="none"
                ></path>
                <g fill="currentColor">
                  <path
                    d="M144.66275,66.67688c-0.86101,1.94379 -2.7868,3.19745 -4.91275,3.19813h-26.875v96.75c0,2.96853 -2.40647,5.375 -5.375,5.375h-43c-2.96853,0 -5.375,-2.40647 -5.375,-5.375v-96.75h-26.875c-2.1283,0.00076 -4.0566,-1.25434 -4.91753,-3.20073c-0.86093,-1.9464 -0.49232,-4.21746 0.94003,-5.79164l53.75,-59.125c1.04442,-1.07444 2.47909,-1.68064 3.9775,-1.68064c1.49841,0 2.93308,0.6062 3.9775,1.68064l53.75,59.125c1.43181,1.57572 1.79859,3.84806 0.93525,5.79425z"
                  ></path>
                </g>
                <path d="" fill="none"></path>
              </g>
            </g>
          </svg>
        </button>
        Sprzedaż
      </div>
    </div>
  </div>
</template>
<style>
.sh-menu {
  background: var(--sh-accent);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.sh-menu__items {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.sh-menu__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: white;
  font-family: 'Signika Negative';
  font-weight: 700;
  font-size: 20px;
}

.sh-menu__item__button {
  background: linear-gradient(
    to bottom,
    var(--sh-white2) 0%,
    var(--sh-white) 100%
  );
  border-radius: 12px;
  position: relative;
  border: solid 2px var(--sh-white);
  cursor: pointer;
  margin-bottom: 6px;
  transition: transform ease-in 0.2s;
  width: 128px;
  height: 128px;
}

.sh-menu__item:hover .sh-menu__item__button,
.sh-menu__item__button:active {
  transform: scale(1.05);
}

.sh-menu__item img:nth-child(1),
.sh-menu__item img:nth-child(2) {
  width: 120px;
  height: 120px;
  margin: 0;
  padding: 0;
  border-radius: 12px;
  pointer-events: none;
  position: absolute;
  opacity: 0;
  transition: opacity ease-in 0.2s;
  top: 2px;
  left: 2px;
}

.sh-menu__items--sheep img:nth-child(1) {
  opacity: 1;
}

.sh-menu__items--goat img:nth-child(2) {
  opacity: 1;
}

.sh-menu__item img:nth-child(3),
.sh-menu__item svg:nth-child(3) {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 64px;
  height: 64px;
  margin: 0;
  padding: 0;
  border-radius: 12px;
  pointer-events: none;
}

.sh-buy-arrow {
  color: rgb(55, 138, 55);
  transform: scale(0.8);
}

.sh-sell-arrow {
  color: rgb(219, 67, 67);
  transform: rotateX(180deg) scale(0.8);
}
/* 
.sh-menu__item--registration .sh-menu__item__button {
  background: #36b03c !important;
} */

.sh-menu__animal-switcher {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  margin-bottom: 24px;
}

.sh-menu__animal-switcher:focus {
  outline: none;
}

.sh-menu__animal-switcher img {
  width: 64px;
  height: 64px;
}

.sh-menu__animal-switcher > div {
  border: solid 2px var(--sh-white);
  width: 64px;
  height: 32px;
  border-radius: 16px;
  position: relative;
  padding: 2px;
  margin: 0 12px;
}

.sh-menu__animal-switcher > div > div {
  background: var(--sh-white);
  width: 24px;
  height: 24px;
  border-radius: 16px;
  position: absolute;
  transition: transform ease-in-out 0.2s;
}

.sh-menu__animal-switcher--goat > div > div {
  transform: translateX(32px);
}

.sh-menu__animal-switcher img {
  filter: saturate(0.7);
  opacity: 0.7;
}

.sh-menu__animal-switcher--sheep img:nth-of-type(1) {
  filter: saturate(1);
  opacity: 1;
}

.sh-menu__animal-switcher--goat img:nth-of-type(2) {
  filter: saturate(1);
  opacity: 1;
}
</style>
