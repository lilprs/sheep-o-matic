import clsx from 'clsx'
import {
  Controller,
  useForm,
  useWatch,
} from 'react-hook-form'
import { format } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import {
  AnimalSpecies,
  saveDatabase,
  store,
  useStore,
} from '../database'
import toast from 'react-hot-toast'
import { formatFormErrorMessage } from '../utils'

type Props = {
  open: boolean
  onClose: () => void
  species: AnimalSpecies
}
export function Purchase(props: Props) {
  const form = useForm({
    defaultValues: {
      birth_date: new Date(),
      marking_date: new Date(),
      purchase_date: new Date(),
      registration_number: '',
      mother_registration_number: '',
      karyotype: 'XX',
      use_type: 'mleczny',
      genotype: '',
      siedziba_stada_zbywcy: '',
    },
  })
  const onSubmit = (data: any) => {
    const normalized_registration_number =
      data.registration_number.toLowerCase().trim()
    const found_animal = store
      .getState()
      .animals.find((animal) => {
        return (
          animal.registration_number
            .toLowerCase()
            .trim() === normalized_registration_number
        )
      })
    if (found_animal) {
      form.setError('registration_number', {
        type: 'custom',
        message:
          'W bazie istnieje już zwierzę o tym numerze identyfikacyjnym',
      })
      return
    }
    const normalized_mother_registration_number =
      data.mother_registration_number.toLowerCase().trim()
    if (
      normalized_mother_registration_number ===
      normalized_registration_number
    ) {
      form.setError('mother_registration_number', {
        type: 'custom',
        message:
          'Numer identyfikacyjny matki nie może być taki sam jak numer identyfikacyjny zwierzęcia',
      })
      return
    }
    const found_mother = store
      .getState()
      .animals.find((animal) => {
        return (
          animal.registration_number
            .toLowerCase()
            .trim() ===
          normalized_mother_registration_number
        )
      })
    if (
      found_mother &&
      found_mother.species !== data.species
    ) {
      form.setError('mother_registration_number', {
        type: 'custom',
        message:
          'Numer identyfikacyjny matki odnosi sie do zwierzęcia innego gatunku',
      })
      return
    }
    store.setState((state) => ({
      animals: [
        ...state.animals,
        {
          species: props.species,
          birth_date: data.birth_date.toISOString(),
          marking_date: data.marking_date.toISOString(),
          purchase_date: data.purchase_date.toISOString(),
          sell_date: null,
          death_date: null,
          registration_number: data.registration_number,
          mother_registration_number:
            data.mother_registration_number,
          karyotype: data.karyotype,
          use_type: data.use_type,
          genotype: data.genotype,
          siedziba_stada_zbywcy: data.siedziba_stada_zbywcy,
          siedziba_stada_nabywcy: '',
          dane_przewoznika: '',
        },
      ],
    }))
    saveDatabase()
    toast.success('Zakup zwierzęcia został odnotowany')
    props.onClose()
  }
  return (
    <div
      className={clsx('sh-screen sh-form-screen', {
        'sh-screen--hidden': !props.open,
      })}
    >
      <div className="sh-form-screen__dialog">
        <h1>Kupno</h1>
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
          <label className="sh-inline">
            <span>Numer identyfikacyjny matki</span>
            <input
              {...form.register(
                'mother_registration_number',
                {
                  required: true,
                  pattern: /^[A-Za-z]{2}[0-9]{12}$/,
                }
              )}
              type="text"
              placeholder="Np. PL12345678912"
            />
          </label>
          <p className="sh-form__error">
            {formatFormErrorMessage(
              form.formState.errors
                .mother_registration_number
            )}
          </p>
          <div className="sh-split">
            <div className="sh-date">
              <label>Data urodzenia</label>
              <Controller
                name="birth_date"
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
                  form.formState.errors.birth_date
                )}
              </p>
            </div>
            <div className="sh-date">
              <label>Data oznaczenia</label>
              <Controller
                name="marking_date"
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
                  form.formState.errors.marking_date
                )}
              </p>
            </div>
            <div className="sh-date">
              <label>Data zakupu</label>
              <Controller
                name="purchase_date"
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
                  form.formState.errors.purchase_date
                )}
              </p>
            </div>
          </div>
          <div className="sh-split">
            <div>
              <label className="sh-select">
                <span>Kariotyp</span>
                <select
                  {...form.register('karyotype', {
                    required: true,
                  })}
                >
                  <option>XX</option>
                  <option>XY</option>
                </select>
              </label>
              <p className="sh-form__error">
                {formatFormErrorMessage(
                  form.formState.errors.karyotype
                )}
              </p>
            </div>
            <div>
              <label className="sh-select">
                <span>Typ użytkowy</span>
                <select
                  {...form.register('use_type', {
                    required: true,
                  })}
                >
                  <option value="mleczny">Mleczny</option>
                  <option value="miesny">Mięsny</option>
                  <option value="kombinowany">
                    Kombinowany
                  </option>
                </select>
              </label>
              <p className="sh-form__error">
                {formatFormErrorMessage(
                  form.formState.errors.use_type
                )}
              </p>
            </div>
          </div>
          <label className="sh-inline">
            <span>Kod rasy</span>
            <input
              {...form.register('genotype', {
                required: true,
              })}
              type="text"
              placeholder="Kod rasy"
            />
          </label>
          <p className="sh-form__error">
            {formatFormErrorMessage(
              form.formState.errors.genotype
            )}
          </p>
          <label className="sh-inline">
            <span>Siedziba stada zbywcy</span>
            <input
              {...form.register('siedziba_stada_zbywcy', {
                required: true,
                pattern: /^[A-Za-z]{2}[0-9]{12}$/,
              })}
              type="text"
              placeholder="Np. PL12345678912"
            />
          </label>
          <p className="sh-form__error">
            {formatFormErrorMessage(
              form.formState.errors.siedziba_stada_zbywcy
            )}
          </p>
          <button type="submit">Zgłoś kupno</button>
        </form>
      </div>
    </div>
  )
}
