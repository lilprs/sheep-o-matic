import clsx from 'clsx'
import { useState } from 'react'
import DataTable from 'react-data-table-component'
import { useForm } from 'react-hook-form'
import {
  Animal,
  AnimalSpecies,
  store as vanilla_store,
  useStore,
} from '../database'

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
  const [selectedRows, setSelectedRows] = useState(false)
  const [toggledClearRows, setToggleClearRows] =
    useState(false)

  const handleChange = ({ selectedRows }: any) => {
    setSelectedRows(selectedRows)
  }

  // Toggle the state so React Data Table changes to clearSelectedRows are triggered
  const handleClearRows = () => {
    setToggleClearRows(!toggledClearRows)
  }

  console.log(store.animals)

  const seed = () => {
    vanilla_store.setState((state) => {
      return {
        ...state,
        animals: [...state.animals, ...state.animals],
      }
    })
  }

  const makePdf = () => {
    window.ipcRenderer.send(
      'print-to-pdf',
      `
      <p style="text-align: right; margin-right: 50px; margin-top: 10px; margin-bottom: 10px">
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
        <td>P</td>
        <td>L</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
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
        ${store.animals
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
            <td rowspan="2">${
              a.siedziba_stada_nabywcy ?? ''
            }</td>
            <td rowspan="2" style="width: 150px"></td>
          </tr>
          <tr>
          <td>${a.purchase_date ? 'Do' : 'U'}</td>
          <td>${
            a.sell_date ? 'Z' : a.death_date ? 'PG' : ''
          }</td>
          </tr>`
          })
          .join('')}
      </tbody>
    </table>
    <strong style="display: block; margin: 10px 0">Kontrole lub korekty</strong>
    <table style="width: 100%">
          <thead>
            <tr>
              <th>Data</th>
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

  const data = store.animals.filter((a) => {
    return true
  })

  return (
    <div
      className={clsx('sh-screen sh-form-screen', {
        'sh-screen--hidden': !props.open,
      })}
    >
      <div className="sh-form-screen__dialog--wide">
        <h1>Baza zwierząt</h1>
        <button
          className="sh-dialog__close"
          onClick={() => props.onClose()}
        >
          ×
        </button>

        <button onClick={seed}>seed</button>
        <button onClick={makePdf}>Generuj PDF</button>

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

        <form></form>

        <DataTable
          columns={columns as any}
          data={data}
          pagination
          selectableRows
          onSelectedRowsChange={handleChange}
          clearSelectedRows={toggledClearRows}
        />
      </div>
    </div>
  )
}
