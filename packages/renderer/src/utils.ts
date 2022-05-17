export function formatFormErrorMessage(error: any) {
  if (!error) {
    return ''
  }
  if (error.type === 'custom') {
    return error.message
  }
  if (error.type === 'required') {
    return 'Pole wymagane'
  }
  return 'Nieprawidłowa wartość'
}
