<script setup lang="ts">
import Menu from './components/Menu.vue'
import Birth from './components/Birth.vue'
import Purchase from './components/Purchase.vue'
import { current_screen } from './state.js'
</script>

<template>
  <Menu />
  <Birth
    :class="{
      'sh-screen': true,
      'sh-screen--hidden': current_screen !== 'birth',
    }"
  ></Birth>
  <Purchase
    :class="{
      'sh-screen': true,
      'sh-screen--hidden': current_screen !== 'purchase',
    }"
  ></Purchase>
</template>

<style>
/* latin-ext */
@font-face {
  font-family: 'Signika Negative';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(./assets/signika_negative_latin_ext.woff)
    format('woff');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020,
    U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F,
    U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Signika Negative';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(./assets/signika_negative_latin.woff)
    format('woff');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153,
    U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074,
    U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF,
    U+FFFD;
}
html,
body {
  margin: 0;
  --sh-accent: #2c3e50;
  --sh-white: #f2ede2;
  --sh-white2: #fffbf4;
}
body {
  height: 100%;
}
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: #f2ede2;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.sh-screen {
  transition: opacity ease-in 0.2s;
}
.sh-screen--hidden {
  opacity: 0;
  pointer-events: none;
}

h1,
h2,
strong {
  font-family: 'Signika Negative';
  font-weight: 700;
}

.sh-dialog__close {
  position: absolute;
  top: 24px;
  right: 24px;
  line-height: 0;
  padding: 8px 0;
  color: rgb(0, 0, 0, 0.4);
  font-size: 32px;
  width: auto;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color ease-in 0.2s, transform ease-in 0.2s;
}
.sh-dialog__close:hover,
.sh-dialog__close:active {
  color: rgb(0, 0, 0, 0.8);
  transform: scale(1.1);
}

.sh-select {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.sh-select span {
  flex-shrink: 0;
}

.sh-select select {
  margin-left: 12px;
  flex-grow: 1;
  border-radius: 2px;
  padding: 8px 12px;
  font-size: 18px;
  border: none;
  background: transparent;
  border-bottom: solid 2px var(--sh-dialog-color);
  min-width: 50px;
}

.sh-date > div {
  width: 100%;
  height: 220px;
}

.sh-date .vc-day {
  min-height: 24px !important;
  width: 24px !important;
}

.sh-date .vc-highlight {
  width: 24px !important;
  height: 24px !important;
  background: var(--sh-dialog-color) !important;
}

.sh-date .vc-day-content {
  line-height: 24px !important;
  width: 24px !important;
  height: 24px !important;
}

.sh-date .vc-weeks {
  min-width: auto !important;
}

.sh-date .vc-pane {
  min-width: auto !important;
}

.sh-date {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
}

.sh-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 12px;
}

.sh-inline {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sh-inline span {
  flex-shrink: 0;
  margin-right: 12px;
}

.sh-form {
  font-size: 18px;
}

.sh-form input {
  transition: background-color ease-in 0.2s;
}

.sh-form input:focus {
  background-color: var(--sh-dialog-color);
  outline: none;
  color: var(--sh-white2) !important;
}

.sh-form input:focus::placeholder {
  color: var(--sh-white) !important;
}

.sh-form select:focus {
  background-color: var(--sh-dialog-color);
  outline: none;
  color: var(--sh-white2) !important;
}

.sh-form select:focus::placeholder {
  color: var(--sh-white) !important;
}

.sh-form button[type='submit'] {
  background-color: var(--sh-dialog-color);
  color: var(--sh-white2) !important;
  border: none;
  border-radius: 4px;
  padding: 12px;
  font-size: 20px;
  font-family: 'Signika Negative';
  font-weight: 700;
  width: 100%;
  cursor: pointer;
  transition: transform ease-in 0.2s;
  margin-top: 12px;
}
.sh-form button[type='submit']:hover,
.sh-form button[type='submit']:focus {
  transform: scale(1.025);
}
</style>
