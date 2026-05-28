-- Church records table for Zion Evangelical Church death register (1872–1934)
-- Run this migration against your Supabase project before using /church-records

create extension if not exists "uuid-ossp";

create table if not exists church_records (
  id uuid default uuid_generate_v4() primary key,
  record_number text,
  date_of_death text,
  time_of_death text,
  name text,
  age_raw text,
  age_years int,
  age_months int,
  age_days int,
  survivors text,
  burial_date text,
  pastor text,
  source_page_id int,
  source_image_url text,
  raw_text text,
  created_at timestamp with time zone default now()
);

create index if not exists church_records_source_page_idx on church_records(source_page_id);
create index if not exists church_records_name_idx on church_records(name);
