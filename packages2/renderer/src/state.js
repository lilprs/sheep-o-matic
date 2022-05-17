import { ref } from 'vue'

export const current_screen = ref(null)

export const current_animal_type = ref('sheep')

export function switchScreen(new_screen) {
  current_screen.value = new_screen
}

export function switchAnimalType(new_animal_type) {
  current_animal_type.value = new_animal_type
}
