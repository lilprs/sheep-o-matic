import Database from 'better-sqlite3'

export const db = new Database('app.db', {})

db.exec(`
create table if not exists animals
(
  type                   text    not null,
    id                         integer
        constraint animals_pk
            primary key autoincrement,
    registration_number        text    not null,
    mother_registration_number text,
    birth_date                 text,
    genotype                   text    not null,
    marking_date               text,
    father_registration_number text,
    przybycie_date             text    not null,
    przybycie_type             text    not null,
    przybycie_place_info       text default '',
    ubycie_date                text,
    ubycie_type                text   ,
    ubycie_place_info          text default '',
    ubycie_carrier_info        text default '',
    karyotype                  text,
    comments                   text,
    use_type                   text
);

create unique index if not exists animal_registration_number_uindex
    on animals (registration_number);
`)
