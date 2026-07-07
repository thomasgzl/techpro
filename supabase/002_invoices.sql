-- Ajout du module Factures — à exécuter une fois dans le SQL Editor de Supabase
-- (celui-ci s'ajoute à schema.sql déjà exécuté, pas besoin de rejouer l'ancien fichier).

create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  number text not null unique,
  status text not null default 'brouillon' check (status in ('brouillon', 'envoyee', 'payee', 'annulee')),
  client_name text not null,
  client_email text,
  client_address text,
  issue_date date not null default current_date,
  due_date date,
  vat_enabled boolean not null default false,
  vat_rate numeric not null default 0,
  items jsonb not null default '[]'::jsonb, -- [{ description, quantity, unit_price }]
  notes text,
  booking_id uuid references bookings(id) on delete set null
);

alter table invoices enable row level security;

-- Only you (signed in) ever touch invoices — no anon policy at all,
-- so visitors have zero access by default.
create policy "authenticated can manage invoices"
  on invoices for all
  to authenticated
  using (true)
  with check (true);
