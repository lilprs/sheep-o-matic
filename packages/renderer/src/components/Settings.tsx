import { Button } from '@mantine/core'
import clsx from 'clsx'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  saveDatabase,
  store as vanilla_store,
  useStore,
} from '../database'
import { formatFormErrorMessage } from '../utils'

type Props = {
  open: boolean
  onClose: () => void
}
export function Settings(props: Props) {
  const store = useStore()
  const form = useForm({
    defaultValues: {
      numer_siedziby_stada:
        store.settings.numer_siedziby_stada,
    },
  })
  const onSubmit = (data: any) => {
    vanilla_store.setState((state) => ({
      settings: {
        numer_siedziby_stada: data.numer_siedziby_stada,
      },
    }))
    saveDatabase()
    toast.success('Ustawienia zostały zapisane')
    props.onClose()
  }
  const exportDatabase = () => {
    const exported = JSON.stringify({
      _version: 1,
      _date: new Date().toISOString(),
      ...vanilla_store.getState(),
    })
    window.ipcRenderer.send('save-exported', exported)
  }
  const importDatabase = () => {
    window.ipcRenderer.send('open-exported')
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
        <div
          style={{
            marginLeft: '-5px',
            marginRight: '-5px',
            marginTop: '20px',
            display: 'flex',
          }}
        >
          <Button
            size="sm"
            style={{ margin: '0 5px' }}
            color="dark"
            onClick={exportDatabase}
          >
            Eksportuj bazę danych
          </Button>
          <Button
            size="sm"
            style={{ margin: '0 5px' }}
            color="dark"
            onClick={importDatabase}
          >
            Importuj bazę danych
          </Button>
        </div>
      </div>
    </div>
  )
}
