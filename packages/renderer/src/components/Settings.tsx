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
}
export function Settings(props: Props) {
  const form = useForm({
    defaultValues: {
      numer_siedziby_stada: '',
    },
  })
  const onSubmit = (data: any) => {
    store.setState((state) => ({
      settings: {
        numer_siedziby_stada: data.numer_siedziby_stada,
      },
    }))
    saveDatabase()
    toast.success('Ustawienia zostały zapisane')
    props.onClose()
  }
  return (
    <div
      className={clsx('sh-screen sh-form-screen', {
        'sh-screen--hidden': !props.open,
      })}
    >
      <div className="sh-form-screen__dialog">
        <h1>Ustawienia</h1>
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
            <span>Numer siedziby stada</span>
            <input
              {...form.register('numer_siedziby_stada', {
                required: true,
                pattern: /^[A-Za-z]{2}[0-9]{12}$/,
              })}
              type="text"
              placeholder="Np. PL12345678912"
            />
          </label>
          <p className="sh-form__error">
            {formatFormErrorMessage(
              form.formState.errors.numer_siedziby_stada
            )}
          </p>
          <button type="submit">Zapisz ustawienia</button>
        </form>
      </div>
    </div>
  )
}
