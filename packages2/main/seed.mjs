import Chance from 'chance'

const chance = new Chance()

function randomRegistrationNumber() {
  return (
    'PL' +
    chance.string({
      pool: '123456789',
      length: 11,
    })
  )
}

export function seed(req, res) {
  const stmt = db.db.prepare(`
insert into "animals" (
  "type",
  "registration_number",
  "mother_registration_number",
  "birth_date",
  "marking_date",
  "father_registration_number",
  "przybycie_date",
  "przybycie_type",
  "przybycie_place_info",
  "ubycie_date",
  "ubycie_type",
  "ubycie_place_info",
  "ubycie_carrier_info",
  "karyotype",
  "comments",
  "use_type"
) values (
  :type,
  :registration_number,
  :mother_registration_number,
  :birth_date,
  :marking_date,
  :father_registration_number,
  :przybycie_date,
  :przybycie_type,
  :przybycie_place_info,
  :ubycie_date,
  :ubycie_type,
  :ubycie_place_info,
  :ubycie_carrier_info,
  :karyotype,
  :comments,
  :use_type
)
`)
  for (let i = 0; i < 100; i += 1) {
    const u = chance.date().toISOString()
    const sheep = {
      type: chance.pickone(['owca', 'koza']),
      registration_number: randomRegistrationNumber(),
      mother_registration_number:
        randomRegistrationNumber(),
      birth_date: chance.date().toISOString(),
      genotype: 'asdf',
      marking_date: chance.date().toISOString(),
      father_registration_number:
        randomRegistrationNumber(),
      przybycie_date: u,
      przybycie_type: 'U',
      przybycie_place_info: 'wqe',
      ubycie_date: '',
      ubycie_type: '',
      ubycie_place_info: '',
      ubycie_carrier_info: '',
      karyotype: chance.pickone(['XX', 'XY']),
      comments: '',
      lp: i + 1,
      use_type: chance.pickone([
        'mleczny',
        'miesny',
        'kombinowany',
      ]),
    }
    stmt.run(sheep)
  }
}
