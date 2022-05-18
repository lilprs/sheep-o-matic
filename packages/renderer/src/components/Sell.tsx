import clsx from 'clsx'
import { DayPicker } from 'react-day-picker'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  AnimalSpecies,
  saveDatabase,
  store,
} from '../database'
import { formatFormErrorMessage } from '../utils'

type Props = {
  open: boolean
  onClose: () => void
  species: AnimalSpecies
}
export function Sell(props: Props) {
  const form = useForm({
    defaultValues: {
      sell_date: new Date(),
      registration_number: '',
      siedziba_stada_nabywcy: '',
      dane_przewoznika: '',
    },
  })
  const onSubmit = (data: any) => {
    const normalized_registration_number =
      data.registration_number.toLowerCase().trim()
    const found_animal = store
      .getState()
      .animals.find((animal) => {
        return (
          animal.species === props.species &&
          animal.registration_number
            .toLowerCase()
            .trim() === normalized_registration_number
        )
      })
    if (!found_animal) {
      form.setError('registration_number', {
        type: 'custom',
        message: 'Nie znaleziono zwierzęcia w bazie',
      })
      return
    } else if (
      found_animal &&
      found_animal.sell_date !== null
    ) {
      form.setError('registration_number', {
        type: 'custom',
        message:
          'Zwierzę zostało już sprzedane nabywcy ' +
          found_animal.siedziba_stada_nabywcy,
      })
      return
    }
    store.setState((state) => ({
      animals: state.animals.map((a) => {
        if (
          a.registration_number ===
          normalized_registration_number
        ) {
          return {
            ...a,
            sell_date: data.sell_date,
            siedziba_stada_nabywcy:
              data.siedziba_stada_nabywcy,
            dane_przewoznika: data.dane_przewoznika ?? '',
          }
        }
        return a
      }),
    }))
    saveDatabase()
    toast.success('Sprzedaż zwierzęcia została odnotowana')
    props.onClose()
  }
  return (
    <div
      className={clsx('sh-screen sh-form-screen', {
        'sh-screen--hidden': !props.open,
      })}
    >
      <div className="sh-form-screen__dialog">
        <h1>Sprzedaż</h1>
        <button
          className="sh-dialog__close"
          onClick={() => props.onClose()}
        >
          ×
        </button>
        <form
          className="sh-form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <label className="sh-inline">
            <span>Numer identyfikacyjny</span>
            <input
              {...form.register('registration_number', {
                required: true,
                pattern: /^[A-Za-z]{2}[0-9]{12}$/,
              })}
              type="text"
              placeholder="Np. PL12345678912"
            />
          </label>
          <p className="sh-form__error">
            {formatFormErrorMessage(
              form.formState.errors.registration_number
            )}
          </p>
          <div className="sh-split">
            <div className="sh-date">
              <label>Data zbycia</label>
              <Controller
                name="sell_date"
                control={form.control}
                rules={{ required: true }}
                render={({ field }: any) => (
                  <DayPicker
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                  />
                )}
              />
              <p className="sh-form__error">
                {formatFormErrorMessage(
                  form.formState.errors.sell_date
                )}
              </p>
            </div>
          </div>
          <label className="sh-inline">
            <span>Siedziba stada nabywcy</span>
            <input
              {...form.register('siedziba_stada_nabywcy', {
                required: true,
                pattern: /^[A-Za-z]{2}[0-9]{12}$/,
              })}
              type="text"
              placeholder="Np. PL12345678912"
            />
          </label>
          <p className="sh-form__error">
            {formatFormErrorMessage(
              form.formState.errors.siedziba_stada_nabywcy
            )}
          </p>
          <label className="sh-inline">
            <span>Dane przewoźnika</span>
            <input
              {...form.register('dane_przewoznika', {
                required: false,
              })}
              type="text"
            />
          </label>
          <p className="sh-form__error">
            {formatFormErrorMessage(
              form.formState.errors.dane_przewoznika
            )}
          </p>
          <button type="submit">Zgłoś sprzedaż</button>
        </form>
      </div>
    </div>
  )
}
