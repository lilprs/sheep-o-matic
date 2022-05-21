import clsx from 'clsx'
import { useState } from 'react'
import DataTable from 'react-data-table-component'
import { useForm } from 'react-hook-form'
import {
  Animal,
  AnimalSpecies,
  saveDatabase,
  store as vanilla_store,
  useStore,
} from '../database'
import {
  Button,
  Input,
  InputWrapper,
  Select,
  TextInput,
} from '@mantine/core'

type Props = {
  open: boolean
  onClose: () => void
  species: AnimalSpecies
}
export function Search(props: Props) {
  const form = useForm({
    defaultValues: {
      death_date: new Date(),
      registration_number: '',
    },
  })
  const store = useStore()
  const [activeTab, setActiveTab] = useState(1)
  const [selectedRows, setSelectedRows] = useState<
    Animal[]
  >([])
  const [toggledClearRows, setToggleClearRows] =
    useState(false)
  const [sorting, setSorting] = useState(
    'data-przybycia-malejaco'
  )
  const [
    registration_number_filter,
    setRegistrationNumberFilter,
  ] = useState('')
  const [
    mother_registration_number_filter,
    setMotherRegistrationNumberFilter,
  ] = useState('')

  const handleChange = ({ selectedRows }: any) => {
    setSelectedRows(selectedRows)
  }

  const herd_animals = store.animals
    .filter((a) => {
      if (a.species !== props.species) {
        return false
      }
      if (
        registration_number_filter.trim() !== '' &&
        !a.registration_number.includes(
          registration_number_filter.trim()
        )
      ) {
        return false
      }
      if (
        mother_registration_number_filter.trim() !== '' &&
        !a.mother_registration_number.includes(
          mother_registration_number_filter.trim()
        )
      ) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      if (sorting === 'numer-identyfikacyjny') {
        return a.registration_number < b.registration_number
          ? -1
          : 1
      }
      if (sorting === 'numer-identyfikacyjny-matki') {
        return a.mother_registration_number <
          b.mother_registration_number
          ? -1
          : 1
      }
      const birth_date_a = new Date(a.birth_date)
      const purchase_date_a = a.purchase_date
        ? new Date(a.purchase_date)
        : null
      const data_przybycia_a =
        purchase_date_a ?? birth_date_a

      const birth_date_b = new Date(b.birth_date)
      const purchase_date_b = b.purchase_date
        ? new Date(b.purchase_date)
        : null
      const data_przybycia_b =
        purchase_date_b ?? birth_date_b
      if (sorting === 'data-przybycia-malejaco') {
        return data_przybycia_a.getTime() >
          data_przybycia_b.getTime()
          ? -1
          : 1
      }
      if (sorting === 'data-przybycia-rosnaco') {
        return data_przybycia_a.getTime() <
          data_przybycia_b.getTime()
          ? -1
          : 1
      }

      const death_date_a = a.death_date
        ? new Date(a.death_date)
        : null
      const sell_date_a = a.sell_date
        ? new Date(a.sell_date)
        : null
      const data_ubycia_a = sell_date_a ?? death_date_a

      const death_date_b = b.death_date
        ? new Date(b.death_date)
        : null
      const sell_date_b = b.sell_date
        ? new Date(b.sell_date)
        : null
      const data_ubycia_b = sell_date_b ?? death_date_b
      if (
        sorting === 'data-ubycia-malejaco' &&
        data_ubycia_a &&
        data_ubycia_b
      ) {
        return data_ubycia_a.getTime() >
          data_ubycia_b.getTime()
          ? -1
          : 1
      }
      if (
        sorting === 'data-ubycia-rosnaco' &&
        data_ubycia_a &&
        data_ubycia_b
      ) {
        return data_ubycia_a.getTime() <
          data_ubycia_b.getTime()
          ? -1
          : 1
      }
      return 0
    })

  const pdf_animals = store.animals.filter(
    (a) =>
      a.species === props.species &&
      selectedRows.includes(a)
  )

  const seed = () => {
    vanilla_store.setState((state) => {
      return {
        ...state,
        animals: [...state.animals, ...state.animals],
      }
    })
  }

  const numer_siedziby = store.settings.numer_siedziby_stada

  const makeReportPdf = () => {
    if (pdf_animals.length < 1) {
      window.alert('Nie wybrano żadnych zwierząt')
      return
    }
    window.ipcRenderer.send(
      'print-to-pdf',
      `
      <p style="display: none; text-align: right; margin-right: 50px; margin-top: 10px; margin-bottom: 10px">
        Karta wsadowa strona nr ............
      </p>
      <table style="margin: 0 auto; margin-bottom: 10px; width: 100%">
        <thead>
          <tr>
          <th colspan="14">Numer siedziby stada, numer miejsca gromadzenia zwierząt, numer targu, wystawy, pokazu lub konkursu, numer miejsca prowadzenia działalności w zakresie obrotu zwierzętami, pośrednictwa w tym obrocie lub skupu zwierząt, numer rzeźni *)</th>
          </tr>
        </thead>
        <tbody>
        <tr>
        <td>${numer_siedziby[0] ?? 'P'}</td>
        <td>${numer_siedziby[1] ?? 'L'}</td>
        <td>${numer_siedziby[2] ?? ''}</td>
        <td>${numer_siedziby[3] ?? ''}</td>
        <td>${numer_siedziby[4] ?? ''}</td>
        <td>${numer_siedziby[5] ?? ''}</td>
        <td>${numer_siedziby[6] ?? ''}</td>
        <td>${numer_siedziby[7] ?? ''}</td>
        <td>${numer_siedziby[8] ?? ''}</td>
        <td>${numer_siedziby[9] ?? ''}</td>
        <td>${numer_siedziby[10] ?? ''}</td>
        <td>${numer_siedziby[11] ?? ''}</td>
        <td>${numer_siedziby[12] ?? ''}</td>
        <td>${numer_siedziby[13] ?? ''}</td>
        </tr>
        </tbody>
      </table>
      <table style="margin: 0 auto; width: 100%">
      <thead>
      <tr>
        <th rowspan="3"><b>Lp.</b><br />(1)</th>
        <th rowspan="3"><b>Numer identyfikacyjny zwierzęcia</b><br />(2)</th>
        <th rowspan="3"><b>Data urodzenia zwierzęcia</b><br />(3)</th>
        <th rowspan="3"><b>Płeć</b><br />(4)</th>
        <th rowspan="3"><b>Kod rasy lub maść </b><br />(5)</th>
        <th rowspan="3"><b>Data  oznakowania zwierzęcia</b><br />(6)</th>
        <th rowspan="3"><b>Numer identyfikacyjny matki zwierzęcia</b><br />(7a)</th>
        <th rowspan="1" colspan="2"><b>PRZYBYCIE zwierzęcia</b></th>
        <th rowspan="1" colspan="2"><b>UBYCIE zwierzęcia</b></th>
        <th rowspan="3"><b>Uwagi</b><br />(11)</th>
      </tr>
      <tr>
        <th><b>Data przybycia</b><br />(8a)</th>
        <th rowspan="2"><b>Dane o miejscu „z” którego przybyło zwierzę</b><br />(8c)</th>
        <th><b>Data  ubycia</b><br />(9a)</th>
        <th><b>Dane o miejscu „do” którego ubyło  zwierzę</b><br />(9c)</th>
      </tr>
      <tr>
        <th><b>Kod zdarzenia</b><br />(8b)</th>
        <th><b>Kod zdarzenia</b><br />(9b)</th>
        <th><b>Dane przewoźnika</b><br />(10)</th>
      </tr>
      </thead>
      <tbody>
        ${pdf_animals
          .map((a, i) => {
            return `
          <tr>
            <td rowspan="2">${i + 1}</td>
            <td rowspan="2">${a.registration_number}</td>
            <td rowspan="2">${new Date(
              a.birth_date
            ).toLocaleDateString()}</td>
            <td rowspan="2">${a.karyotype}</td>
            <td rowspan="2">${a.genotype}</td>
            <td rowspan="2">${new Date(
              a.marking_date
            ).toLocaleDateString()}</td>
            <td rowspan="2">${
              a.mother_registration_number
            }</td>
            <td>${
              a.purchase_date
                ? new Date(
                    a.purchase_date
                  ).toLocaleDateString()
                : new Date(
                    a.birth_date
                  ).toLocaleDateString()
            }</td>
            <td rowspan="2">${
              a.siedziba_stada_zbywcy ?? ''
            }</td>
            <td>${
              a.sell_date
                ? new Date(a.sell_date).toLocaleDateString()
                : a.death_date
                ? new Date(
                    a.death_date
                  ).toLocaleDateString()
                : ''
            }</td>
            <td>${a.siedziba_stada_nabywcy ?? ''}</td>
            <td rowspan="2" style="width: 150px"></td>
          </tr>
          <tr>
          <td>${a.purchase_date ? 'Do' : 'U'}</td>
          <td>${
            a.sell_date ? 'Z' : a.death_date ? 'PG' : ''
          }</td>
          <td>${a.dane_przewoznika ?? ''}</td>
          </tr>`
          })
          .join('')}
      </tbody>
    </table>
    <strong style="display: block; margin: 10px 0">Kontrole lub korekty</strong>
    <table style="width: 100%">
          <thead>
            <tr>
              <th style="width:100px">Data</th>
              <th>Uwagi dotyczące kontroli lub korekty</th>
              <th>Pieczątka i podpis osoby dokonującej kontroli lub pracownika Agencji Restrukturyzacji i Modernizacji Rolnictwa</th>
            </tr>
          </thead>
          <tbody>
            <tr style="height: 70px">
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
    </table>
    <style>
    body {
      font-family: sans-serif;
      font-size: 12px;
      padding: 15px;
    }
    th, td {
      border: solid 1px black;
      padding: 4px;
      text-align: center;
      font-size: 12px;
    }
    table {
      border-collapse: collapse;
    }
    </style>
    `
    )
  }

  const makeQuantityPdf = () => {
    if (pdf_animals.length < 1) {
      window.alert('Nie wybrano żadnych zwierząt')
      return
    }
    let first_date: Date | null = null
    for (const a of pdf_animals) {
      const birth_date = new Date(a.birth_date)
      const purchase_date = a.purchase_date
        ? new Date(a.purchase_date)
        : null
      if (purchase_date) {
        if (
          !first_date ||
          purchase_date.getTime() < first_date.getTime()
        ) {
          first_date = purchase_date
        }
      } else {
        if (
          !first_date ||
          birth_date.getTime() < first_date.getTime()
        ) {
          first_date = birth_date
        }
      }
    }
    let rows = []
    if (first_date) {
      const first_year = first_date.getFullYear()
      for (let i = 0; ; i += 1) {
        const year = first_year + i
        const date = `${year}-12-31`
        if (
          new Date(`${year}-01-01`).getTime() >
          new Date().getTime()
        ) {
          break
        }
        rows.push({
          date,
          count:
            pdf_animals.filter((a) => {
              if (a.species !== props.species) {
                return false
              }
              const date = new Date(`${year}-12-31`)
              const birth_date = new Date(a.birth_date)
              const purchase_date = a.purchase_date
                ? new Date(a.purchase_date)
                : null
              const sell_date = a.sell_date
                ? new Date(a.sell_date)
                : null
              const death_date = a.death_date
                ? new Date(a.death_date)
                : null
              if (birth_date.getTime() > date.getTime()) {
                return false
              }
              if (
                purchase_date &&
                purchase_date.getTime() > date.getTime()
              ) {
                return false
              }
              if (
                sell_date &&
                sell_date.getTime() <= date.getTime()
              ) {
                return false
              }
              if (
                death_date &&
                death_date.getTime() <= date.getTime()
              ) {
                return false
              }
              return true
            }).length + '',
        })
      }
    }
    window.ipcRenderer.send(
      'print-to-pdf',
      `
      <p style="display: none; text-align: right; margin-right: 50px; margin-top: 10px; margin-bottom: 10px">
        Karta wsadowa strona nr ............
      </p>      
      <table class="header" style="margin: 0 auto; margin-bottom: 10px; width: 100%">
      <thead>
        <tr>
        <th colspan="14">Numer siedziby stada, numer miejsca gromadzenia zwierząt, numer targu, wystawy, pokazu lub konkursu, numer miejsca prowadzenia działalności w zakresie obrotu zwierzętami, pośrednictwa w tym obrocie lub skupu zwierząt, numer rzeźni *)</th>
        </tr>
      </thead>
      <tbody>
      <tr>
      <td>${numer_siedziby[0] ?? 'P'}</td>
      <td>${numer_siedziby[1] ?? 'L'}</td>
      <td>${numer_siedziby[2] ?? ''}</td>
      <td>${numer_siedziby[3] ?? ''}</td>
      <td>${numer_siedziby[4] ?? ''}</td>
      <td>${numer_siedziby[5] ?? ''}</td>
      <td>${numer_siedziby[6] ?? ''}</td>
      <td>${numer_siedziby[7] ?? ''}</td>
      <td>${numer_siedziby[8] ?? ''}</td>
      <td>${numer_siedziby[9] ?? ''}</td>
      <td>${numer_siedziby[10] ?? ''}</td>
      <td>${numer_siedziby[11] ?? ''}</td>
      <td>${numer_siedziby[12] ?? ''}</td>
      <td>${numer_siedziby[13] ?? ''}</td>
      </tr>
      </tbody>
    </table>
      <strong style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; text-align: center; margin: 10px 0; font-size: 18px">Wynik spisu stada owiec<sup>*)</sup>&nbsp;<div class="box">${
        props.species === 'sheep' ? 'x' : '&nbsp;'
      }</div>&nbsp;lub kóz<sup>*)</sup>&nbsp;<div class="box">${
        props.species === 'goat' ? 'x' : '&nbsp;'
      }</div></strong>
      <strong style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; text-align: center; margin: 10px 0">Druk wypełnia się dla jednego gatunku</strong>
      <strong style="display: flex; flex-wrap: wrap; justify-content: flex-start; align-items: center; margin: 10px 0; font-size: 18px">Spis stanu stada owiec<sup>*)</sup>&nbsp;<div class="box">${
        props.species === 'sheep' ? 'x' : '&nbsp;'
      }</div>&nbsp;lub kóz<sup>*)</sup>&nbsp;<div class="box">${
        props.species === 'goat' ? 'x' : '&nbsp;'
      }</div></strong>
      <table>
        <thead>
          <tr>
            <th>na dzień:</th>
            <th>liczba zwierząt:</th>
          </tr>
        </thead>
        <tbody>
        ${rows
          .map((row) => {
            return `
          <tr>
            <td>
            <div class="date">
            <div class="box-group">
              <div class="box">${
                row.date[8]
              }</div><div class="box">${row.date[9]}</div>
            </div>
            <div class="box-group">
              <div class="box">${
                row.date[5]
              }</div><div class="box">${row.date[6]}</div>
            </div>
              <div class="box">${
                row.date[0]
              }</div><div class="box">${row.date[1]}</div>
              <div class="box">${
                row.date[2]
              }</div><div class="box">${row.date[3]}</div>
            </td>
            </div>
            <td>
            <div class="num">
            <div class="box">${
              row.count[0] ?? ''
            }</div><div class="box">${
              row.count[1] ?? ''
            }</div>
            <div class="box">${
              row.count[2] ?? ''
            }</div><div class="box">${
              row.count[3] ?? ''
            }</div>
            <div class="box">${
              row.count[4] ?? ''
            }</div><div class="box">${
              row.count[4] ?? ''
            }</div>
            </div>
            </td>
          </tr>`
          })
          .join('')}
        </tbody>
      </table>
      <p style="text-align: left; margin-top: 10px;">
      <sup>*)</sup> Zaznaczyć właściwe wpisując X w odpowiednim kwadracie.<br />
      Wynik spisu stada owiec albo kóz wypełnia się co najmniej raz na dwanaście miesięcy, nie później jednak niż w dniu 31 grudnia.
    </p>      
    <style>
    body {
      font-family: sans-serif;
      font-size: 12px;
      padding: 15px;
    }
    th, td {
      border: none;
      text-align: center;
    }
    table {
      border-collapse: collapse;
    }
    .date, .num {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .num {
      margin-left: 40px;
    }
    .box {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 30px;
      border: solid 1px black;
      margin: 1px;
    }
    .box-group {
      display: inline-block;
      margin-right: 10px;
    }
    .header {
      font-family: sans-serif;
      font-size: 12px;
      border-collapse: collapse;
    }
    .header th, .header td {
      border: solid 1px black;
      padding: 4px;
      text-align: center;
      font-size: 12px;
    }
    </style>
    `
    )
  }

  const deleteAnimals = () => {
    if (selectedRows.length < 1) {
      window.alert('Nie wybrano żadnych zwierząt')
      return
    }
    const ok = window.confirm(
      `Czy na pewno usunąć wybrane zwierzęta?`
    )
    if (!ok) {
      return
    }
    vanilla_store.setState({
      animals: store.animals.filter(
        (a) => !selectedRows.includes(a)
      ),
    })
    saveDatabase()
  }

  const columns = [
    {
      name: 'Numer ident.',
      selector: (row: Animal) => row.registration_number,
      compact: true,
      width: '120px',
    },
    {
      name: 'Data urodzenia',
      selector: (row: Animal) =>
        new Date(row.birth_date).toLocaleDateString(),
      compact: true,
      width: '100px',
    },
    {
      name: 'Kariotyp',
      selector: (row: Animal) => row.karyotype,
      compact: true,
      width: '60px',
    },
    {
      name: 'Kod rasy',
      selector: (row: Animal) => row.genotype,
      compact: true,
      width: '60px',
    },
    {
      name: 'Data oznakowania',
      selector: (row: Animal) =>
        new Date(row.birth_date).toLocaleDateString(),
      compact: true,
      width: '120px',
    },
    {
      name: 'Numer ident. matki',
      selector: (row: Animal) =>
        row.mother_registration_number,
      compact: true,
      width: '120px',
    },
    {
      name: 'Przybycie',
      selector: (row: Animal) => {
        if (row.purchase_date) {
          return (
            <>
              {new Date(
                row.purchase_date
              ).toLocaleDateString()}{' '}
              Do
            </>
          )
        }
        return (
          <>
            {new Date(row.birth_date).toLocaleDateString()}
            <br />U
          </>
        )
      },
      compact: true,
      width: '120px',
    },
    {
      name: 'Ubycie',
      selector: (row: Animal) => {
        if (row.sell_date) {
          return (
            <>
              {new Date(row.sell_date).toLocaleDateString()}{' '}
              Z
            </>
          )
        }
        if (row.death_date) {
          return (
            <>
              {new Date(
                row.death_date
              ).toLocaleDateString()}
              <br />
              PG
            </>
          )
        }
        return '—'
      },
      compact: true,
      width: '120px',
    },
  ]

  return (
    <div
      className={clsx('sh-screen sh-generic-screen', {
        'sh-screen--hidden': !props.open,
      })}
    >
      <div className="sh-generic-screen__dialog--wide">
        <h1>
          Baza {props.species === 'sheep' ? 'owiec' : 'kóz'}
        </h1>
        <button
          className="sh-dialog__close"
          onClick={() => props.onClose()}
        >
          ×
        </button>

        <div
          style={{
            display: 'flex',
            width: '100%',
            flexGrow: '1',
            gap: '10px',
            marginBottom: '10px',
          }}
        >
          {/* <button onClick={seed}>seed</button> */}
          <Select
            style={{
              width: '320px',
            }}
            value={sorting}
            onChange={setSorting as any}
            label="Sortowanie"
            data={[
              {
                value: 'data-przybycia-malejaco',
                label: 'Data przybycia (od najnowszych)',
              },
              {
                value: 'data-przybycia-rosnaco',
                label: 'Data przybycia (od najstarszych)',
              },
              {
                value: 'data-ubycia-malejaco',
                label: 'Data ubycia (od najnowszych)',
              },
              {
                value: 'data-ubycia-rosnaco',
                label: 'Data ubycia (od najstarszych)',
              },
              {
                value: 'numer-identyfikacyjny',
                label: 'Numer identyfikacyjny',
              },
              {
                value: 'numer-identyfikacyjny-matki',
                label: 'Numer identyfikacyjny matki',
              },
            ]}
          />
          <TextInput
            label="Num. ident."
            value={registration_number_filter}
            onChange={(ev) => {
              setRegistrationNumberFilter(
                ev.currentTarget.value
              )
            }}
          />
          <TextInput
            label="Num. ident. matki"
            value={mother_registration_number_filter}
            onChange={(ev) => {
              setMotherRegistrationNumberFilter(
                ev.currentTarget.value
              )
            }}
          />
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            <Button
              size="xs"
              style={{ margin: '0 5px' }}
              color="green"
              onClick={makeReportPdf}
            >
              Księga rejestracji
            </Button>
            <Button
              size="xs"
              style={{ margin: '0 5px' }}
              color="green"
              onClick={makeQuantityPdf}
            >
              Spis stada
            </Button>
            <br />
            <Button
              size="xs"
              style={{ margin: '0 5px' }}
              color="red"
              onClick={deleteAnimals}
            >
              Usuń wybrane zwierzęta z bazy
            </Button>
          </div>
        </div>

        {/* <Tabs
          active={activeTab}
          onTabChange={setActiveTab}
          color="dark"
          variant="pills"
          styles={{
            tabControl: {
              '&:hover': {
                backgroundColor:
                  'rgba(0, 0, 0, 0.1) !important',
                color: 'black !important',
              },
            },
            tabActive: {
              backgroundColor:
                'var(--sh-accent) !important',
              color: 'white !important',
              '&:hover': {
                backgroundColor:
                  'var(--sh-accent) !important',
                color: 'white !important',
              },
            },
          }}
        >
          <Tabs.Tab label="faktyczne" />
          <Tabs.Tab label="urodzenia" />
          <Tabs.Tab label="zgony" />
          <Tabs.Tab label="sprzedaże" />
        </Tabs> */}
        <div
          style={{
            margin: '-20px',
            marginTop: '0',
          }}
        >
          <DataTable
            columns={columns as any}
            data={herd_animals}
            pagination
            selectableRows
            onSelectedRowsChange={handleChange}
            clearSelectedRows={toggledClearRows}
          />
        </div>
      </div>
    </div>
  )
}
