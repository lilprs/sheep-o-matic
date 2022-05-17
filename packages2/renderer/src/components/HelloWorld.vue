<script setup>
import { ref, reactive, onMounted } from 'vue'

const animals = ref([])
const currentPage = ref(0)
const total = ref(0)
const sort_ref = ref('registration_number')
const sort2_ref = ref('ASC')
const form_modal = ref(false)
const form_type = ref('insert')
const insert_form = ref({
  registration_number: '',
  mother_registration_number: '',
  father_registration_number: '',
  karyotype: 'XX',
  race: '',
  genotype: '',
  use_type: 'mleczny',
  comments: '',
  przybycie_date: '',
  ubycie_date: '',
})

function openInsertModal() {
  form_type.value = 'insert'
  form_modal.value = true
  insert_form.value = {
    registration_number: '',
    mother_registration_number: '',
    father_registration_number: '',
    karyotype: 'XX',
    race: '',
    genotype: '',
    use_type: 'mleczny',
    comments: '',
    przybycie_date: '',
    ubycie_date: '',
  }
}

function closeInsertModal() {
  form_modal.value = false
}

onMounted(load)

function load() {
  const resp = ipcRenderer.sendSync('db_query_sheep', {
    limit: 10,
    offset: currentPage.value * 10,
    order_field: sort_ref.value,
    order_sort: sort2_ref.value,
    search: `%${search_ref.value}%`.toLowerCase(),
  })
  console.log('resp', resp)
  animals.value = resp.list
  total.value = resp.total
}

function seed() {
  const result = ipcRenderer.sendSync('db_seed_sheep')
  if (result === 'ok') {
    window.alert('seeded')
  } else {
    window.alert('failed to seed')
  }
}

function prevPage() {
  currentPage.value -= 1
  load()
}

function nextPage() {
  currentPage.value += 1
  load()
}

function edit(animal) {
  form_type.value = 'edit'
  insert_form.value = animal
  insert_form.value.birth_date = animal.birth_date
    ? animal.birth_date.split('T')[0]
    : ''
  insert_form.value.przybycie_date = animal.przybycie_date
    ? animal.przybycie_date.split('T')[0]
    : ''
  insert_form.value.ubycie_date = animal.ubycie_date
    ? animal.ubycie_date.split('T')[0]
    : ''
  form_modal.value = true
}

const notification_ref = ref()

function clearNotification() {
  notification_ref.value = null
}

function pushNotification(text) {
  notification_ref.value = text
  setTimeout(() => {
    notification_ref.value = null
  }, 3000)
}

function changeSort(ev) {
  sort_ref.value = ev.target.value
  load()
}

function changeSort2(ev) {
  sort2_ref.value = ev.target.value
  load()
}
const search_ref = ref('')
function changeSearch(ev) {
  search_ref.value = ev.target.value
  load()
}
const tab = ref('faktyczne')

function changeTab(new_tab) {
  tab.value = new_tab
}
</script>

<template>
  <div
    v-if="notification_ref"
    class="notification is-primary"
    style="
      position: absolute;
      bottom: 10px;
      left: 10px;
      width: 400px;
      height: 100px;
      margin: 0;
    "
  >
    <button
      class="delete"
      @click="clearNotification"
    ></button>
    {{ notification_ref }}
  </div>

  <div class="table-container">
    <div style="margin-bottom: 1rem">
      <button type="button" @click="seed">seed</button>
      <button
        @click="openInsertModal"
        class="button is-primary"
      >
        dodaj zwierzę
      </button>
      <div>
        <div class="tabs is-centered">
          <ul>
            <li
              :class="{ 'is-active': tab === 'faktyczne' }"
              @click="changeTab('faktyczne')"
            >
              <a>faktyczne</a>
            </li>
            <li
              :class="{ 'is-active': tab === 'urodzenia' }"
              @click="changeTab('urodzenia')"
            >
              <a>urodzenia</a>
            </li>
            <li
              :class="{ 'is-active': tab === 'zgony' }"
              @click="changeTab('zgony')"
            >
              <a>zgony</a>
            </li>
            <li
              :class="{ 'is-active': tab === 'sprzedaże' }"
              @click="changeTab('sprzedaże')"
            >
              <a>sprzedaże</a>
            </li>
          </ul>
        </div>
      </div>
      <div>
        <div class="control">
          <input
            class="input"
            type="text"
            placeholder="Znajdź zwierzę po numerze rejestracyjnym"
            :value="search_ref"
            @input="changeSearch"
          />
        </div>
      </div>
      <div>
        sortuj według:
        <div class="select">
          <select :value="sort_ref" @change="changeSort">
            <option value="registration_number">
              num. rejestracyjny
            </option>
            <option value="mother_registration_number">
              num. rejestracyjny matki
            </option>
            <option value="karyotype">kariotyp</option>
            <option value="birth_date">
              data urodzenia
            </option>
            <option value="przybycie_date">
              data przybycia
            </option>
            <option value="ubycie_date">data ubycia</option>
          </select>
        </div>
        <div class="select">
          <select :value="sort2_ref" @change="changeSort2">
            <option value="ASC">rosnąco</option>
            <option value="DESC">malejąco</option>
          </select>
        </div>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>Num. rejestracyjny</th>
          <th>Kariotyp</th>
          <th>Num. rej. matki</th>
          <th>Data urodzenia</th>
          <th>Data przybycia</th>
          <th>Data ubycia</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="animal in animals">
          <td>{{ animal.registration_number }}</td>
          <td>{{ animal.karyotype }}</td>
          <td>{{ animal.mother_registration_number }}</td>
          <td>{{ animal.birth_date.split('T')[0] }}</td>
          <td>
            {{
              animal.przybycie_date
                ? animal.przybycie_date.split('T')[0]
                : '-'
            }}
          </td>
          <td>
            {{
              animal.ubycie_date
                ? animal.ubycie_date.split('T')[0]
                : '-'
            }}
          </td>
          <td>
            <button
              class="button is-primary is-small"
              @click="edit(animal)"
            >
              edytuj
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p>Znaleziono {{ total }} zwierząt</p>

    <button
      :class="{
        button: true,
        'is-static': currentPage === 0,
      }"
      @click="prevPage"
    >
      Poprzednia strona</button
    >&nbsp;
    <button
      :class="{
        button: true,
        'is-static':
          currentPage + 1 >= Math.ceil(total / 10),
      }"
      @click="nextPage"
    >
      Następna strona
    </button>
  </div>

  <div :class="{ modal: true, 'is-active': form_modal }">
    <div
      class="modal-background"
      @click="closeInsertModal"
    ></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p
          class="modal-card-title"
          v-if="form_type === 'insert'"
        >
          Dodawanie zwierzęcia
        </p>
        <p class="modal-card-title" v-else>
          Edycja zwierzęcia
        </p>
        <button
          class="delete"
          aria-label="close"
          @click="closeInsertModal"
        ></button>
      </header>
      <section class="modal-card-body">
        <div
          style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-gap: 1rem;
          "
        >
          <div class="field">
            <label class="label"
              >Numer identyfikacyjny zwierzęcia</label
            >
            <div class="control">
              <input
                class="input"
                type="text"
                placeholder="Np. PL12345678912"
                v-model="insert_form.registration_number"
              />
            </div>
          </div>
          <div class="field">
            <label class="label">Data urodzenia</label>
            <div class="control">
              <input
                class="input"
                type="date"
                v-model="insert_form.birth_date"
              />
            </div>
          </div>
        </div>
        <div
          style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-gap: 1rem;
            margin-top: 0.5rem;
          "
        >
          <div class="field">
            <label class="label"
              >Numer identyfikacyjny matki</label
            >
            <div class="control">
              <input
                class="input"
                type="text"
                placeholder="Np. PL12345678912"
                v-model="
                  insert_form.mother_registration_number
                "
              />
            </div>
          </div>
          <div class="field">
            <label class="label"
              >Numer identyfikacyjny ojca</label
            >
            <div class="control">
              <input
                class="input"
                type="text"
                placeholder="Np. PL12345678912"
                v-model="
                  insert_form.father_registration_number
                "
              />
            </div>
          </div>
        </div>
        <div
          style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-gap: 1rem;
            margin-top: 0.5rem;
          "
        >
          <div class="field">
            <label class="label">Kariotyp</label>
            <div class="control">
              <div class="select">
                <select v-model="insert_form.karyotype">
                  <option>XX</option>
                  <option>XY</option>
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <label class="label">Rasa</label>
            <div class="control">
              <input
                class="input"
                type="text"
                v-model="insert_form.race"
              />
            </div>
          </div>
        </div>
        <div
          style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-gap: 1rem;
            margin-top: 0.5rem;
          "
        >
          <div class="field">
            <label class="label">Typ użytkowy</label>
            <div class="control">
              <div class="select">
                <select v-model="insert_form.use_type">
                  <option value="mleczny">Mleczny</option>
                  <option value="miesny">Mięsny</option>
                  <option value="kombinowany">
                    Kombinowany
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="field">
            <label class="label">Genotyp</label>
            <div class="control">
              <input
                class="input"
                type="text"
                v-model="insert_form.genotype"
              />
            </div>
          </div>
        </div>

        <div class="field">
          <label class="label">Uwagi</label>
          <div class="control">
            <textarea
              class="textarea"
              type="text"
              rows="2"
              v-model="insert_form.comments"
            />
          </div>
        </div>
        <h2 style="font-weight: bold">Przybycie</h2>

        <div
          style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-gap: 1rem;
            margin-top: 0.5rem;
          "
        >
          <div class="field">
            <label class="label">Data przybycia</label>
            <div class="control">
              <input
                class="input"
                type="date"
                v-model="insert_form.przybycie_date"
              />
            </div>
          </div>
        </div>
        <h2 style="font-weight: bold; margin-top: 0.5rem">
          Ubycie
        </h2>

        <div
          style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-gap: 1rem;
            margin-top: 0.5rem;
          "
        >
          <div class="field">
            <label class="label">Data ubycia</label>
            <div class="control">
              <input
                class="input"
                type="date"
                v-model="insert_form.ubycie_date"
              />
            </div>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success">Zapisz</button>
        <button class="button" @click="closeInsertModal">
          Anuluj
        </button>
      </footer>
    </div>
  </div>
</template>

<style>
.table {
  margin: 0 auto;
  border: solid 3px #3300cc;
  border-radius: 6px;
  border-collapse: separate;
}
.table thead {
  background: #3300cc;
  color: white;
}

.table thead th {
  color: white;
  border-bottom: none;
}

.table td {
}
</style>
