import * as idb from 'idb'
import createVanilla from 'zustand/vanilla'
import create from 'zustand'

export type AnimalSpecies = 'sheep' | 'goat'

export type Animal = {
  species: AnimalSpecies
  birth_date: string
  marking_date: string
  purchase_date: string | null
  sell_date: string | null
  death_date: string | null
  registration_number: string
  mother_registration_number: string
  karyotype: string
  use_type: string
  genotype: string
  siedziba_stada_zbywcy: string
  siedziba_stada_nabywcy: string
  dane_przewoznika: string
}

export const store = createVanilla<{
  animals: Animal[]
}>((set) => ({
  animals: [],
}))

export const useStore = create(store)

async function getDb() {
  const db = await idb.openDB('db', 1, {
    upgrade(db) {
      db.createObjectStore('keyval')
    },
  })
  return db
}

export async function openDatabase() {
  const db = await getDb()
  try {
    const string_db = await db.get('keyval', 'database')
    if (!string_db) {
      return
    }
    const parsed_db = JSON.parse(string_db) as any
    if (!parsed_db) {
      return
    }
    store.setState({
      animals: parsed_db.animals,
    })
    await db.close()
  } catch (err) {}
}

export async function saveDatabase() {
  const db = await getDb()
  const state = store.getState()
  await db.put(
    'keyval',
    JSON.stringify({
      animals: state.animals,
    }),
    'database'
  )
  await db.close()
}
