<script setup>
import {
  switchScreen,
  current_animal_type,
} from '../state.js'
import { DatePicker } from 'v-calendar'
import { ref, watch } from 'vue'

const birth_date = ref(null)
const marking_date = ref(null)
const birth_date_el = ref(null)
const marking_date_el = ref(null)
const form_el = ref(null)

function cancelFocus(ev) {
  ev.preventDefault()
  ev.stopPropagation()
  return false
}

watch(birth_date, () => {
  if (birth_date.value) {
    console.log(birth_date.value)
    birth_date_el.value.setCustomValidity('')
  }
})

watch(marking_date, () => {
  if (marking_date.value) {
    console.log(marking_date.value)
    marking_date_el.value.setCustomValidity('')
  }
})

function validate() {
  console.log('validating')
  if (!birth_date.value) {
    const birth_date = form_el.value.querySelector(
      "input[name='birth_date']"
    )
    birth_date.setCustomValidity(
      'Proszę podać datę urodzenia'
    )
    birth_date.reportValidity()
    return false
  }
  if (!marking_date.value) {
    const marking_date = form_el.value.querySelector(
      "input[name='marking_date']"
    )
    marking_date.setCustomValidity(
      'Proszę podać datę oznaczenia'
    )
    marking_date.reportValidity()
    return false
  }
  const registration_number = form_el.value.querySelector(
    "input[name='registration_number']"
  )
  const found_animal = ipcRenderer.sendSync(
    'db_find_by_number',
    {
      search: `${registration_number.value}`.toLowerCase(),
    }
  )
  if (found_animal) {
    registration_number.setCustomValidity(
      'W bazie istnieje już zwierzę o tym numerze identyfikacyjnym'
    )
    registration_number.reportValidity()
    return false
  }
  const mother_registration_number =
    form_el.value.querySelector(
      "input[name='mother_registration_number']"
    )
  const found_mother = ipcRenderer.sendSync(
    'db_find_by_number',
    {
      search:
        `${mother_registration_number.value}`.toLowerCase(),
    }
  )
  console.log('a', found_animal)
  if (
    found_mother &&
    (found_mother.karyotype !== 'XX' ||
      found_mother.type !== current_animal_type.value)
  ) {
    mother_registration_number.setCustomValidity(
      'Podany numer identyfikacyjny odnosi się do zwierzęcia nieprawidłowym kariotypie/rodzaju'
    )
    mother_registration_number.reportValidity()
    return false
  }
  return true
}

function submit(ev) {
  ev.preventDefault()
  if (!validate()) {
    return
  }
  const found_animal = ipcRenderer.sendSync(
    'db_insert_animal',
    {
      type: current_animal_type.value,
      registration_number: form_el.value.querySelector(
        "input[name='registration_number']"
      ).value,
      mother_registration_number:
        form_el.value.querySelector(
          "input[name='mother_registration_number']"
        ).value,
      genotype: form_el.value.querySelector(
        "input[name='genotype']"
      ).value,
      father_registration_number: null,
      birth_date: birth_date.value,
      marking_date: marking_date.value,
      karyotype: form_el.value.querySelector(
        "select[name='karyotype']"
      ).value,
      use_type: form_el.value.querySelector(
        "select[name='use_type']"
      ).value,
      przybycie_type: 'U',
      przybycie_date: new Date().toISOString(),
      przybycie_place_info: '',
      ubycie_date: null,
      ubycie_type: null,
      ubycie_place_info: '',
      ubycie_carrier_info: '',
      comments: '',
    }
  )
  console.log(found_animal)
}
</script>
<template>
  <div class="sh-birth">
    <div class="sh-birth__dialog">
      <h1>Kupno</h1>
      <button
        class="sh-dialog__close"
        @click="switchScreen(null)"
      >
        ×
      </button>
      <form
        class="sh-form"
        @submit="submit"
        @blur="validate"
        ref="form_el"
      >
        <label class="sh-inline">
          <span>Numer identyfikacyjny</span>
          <input
            name="registration_number"
            type="text"
            placeholder="Np. PL12345678912"
            pattern="[A-Za-z]{2}[0-9]{12}"
            required
            @change="validate"
        /></label>
        <label class="sh-inline">
          <span>Numer identyfikacyjny matki</span>
          <input
            name="mother_registration_number"
            type="text"
            placeholder="Np. PL12345678912"
            pattern="[A-Za-z]{2}[0-9]{12}"
            required
            @change="validate"
          />
        </label>
        <div class="sh-split">
          <label class="sh-date">
            Data urodzenia
            <input
              type="date"
              name="birth_date"
              style="
                opacity: 0;
                pointer-events: none;
                height: 1px;
                padding: 0;
              "
              @focus="cancelFocus"
              ref="birth_date_el"
            />
            <DatePicker
              mode="date"
              locale="pl"
              v-model="birth_date"
              required
            >
            </DatePicker>
          </label>
          <label class="sh-date">
            Data oznaczenia
            <input
              type="date"
              name="marking_date"
              style="
                opacity: 0;
                pointer-events: none;
                height: 1px;
                padding: 0;
              "
              @focus="cancelFocus"
              ref="marking_date_el"
            />
            <DatePicker
              mode="date"
              locale="pl"
              v-model="marking_date"
              required
            >
            </DatePicker>
          </label>
        </div>
        <div class="sh-split">
          <label class="sh-select">
            <span>Kariotyp</span>
            <select name="karyotype" required>
              <option>XX</option>
              <option>XY</option>
            </select>
          </label>
          <label class="sh-select">
            <span>Typ użytkowy</span>
            <select name="use_type" required>
              <option value="mleczny">Mleczny</option>
              <option value="miesny">Mięsny</option>
              <option value="kombinowany">
                Kombinowany
              </option>
            </select>
          </label>
        </div>
        <label class="sh-inline">
          <span>Kod rasy</span>
          <input
            type="text"
            placeholder="Kod rasy"
            name="genotype"
            required
          />
        </label>
        <label class="sh-inline">
          <span>Siedziba stada zbywcy</span>
          <input
            type="text"
            placeholder="Siedziba stada zbywcy"
            name="siedziba_stada_zbywcy"
            pattern="[A-Za-z]{2}[0-9]{12}"
            required
          />
        </label>
        <button type="submit">Sprawdź i zapisz</button>
      </form>
    </div>
  </div>
</template>
<style>
.sh-birth {
  background: var(--sh-white);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  --sh-dialog-color: #36b03c;
  accent-color: var(--sh-dialog-color);
  overflow: auto;
  padding: 12px;
}

.sh-birth__dialog {
  background: var(--sh-white2);
  padding: 24px;
  border-radius: 12px;
  width: 500px;
  position: relative;
}

.sh-birth h1 {
  font-size: 32px;
  color: var(--sh-dialog-color);
}

.sh-birth input {
  font-size: 18px;
  border: none;
  background: transparent;
  padding: 8px 12px;
  width: 100%;
  border-bottom: solid 2px var(--sh-dialog-color);
  border-radius: 2px;
}

.sh-birth label {
  display: flex;
  width: 100%;
  margin-bottom: 12px;
}
</style>
