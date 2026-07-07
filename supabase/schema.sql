-- TechPro back office — run this once in the Supabase SQL editor
-- (Dashboard → SQL Editor → New query → paste → Run).

create extension if not exists pgcrypto;

-- ========== Réservations (RDV) ==========
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  booking_day int not null,
  booking_month int not null,
  booking_year int not null,
  slot text not null,
  service text not null,
  name text not null,
  phone text not null,
  email text not null,
  description text,
  status text not null default 'nouveau' check (status in ('nouveau', 'confirme', 'termine', 'annule'))
);

alter table bookings enable row level security;

-- Visitors (anonymous, public key) can create a booking but never read others'.
create policy "public can insert bookings"
  on bookings for insert
  to anon
  with check (true);

-- Only signed-in users (you, via the admin login) can read/update/delete.
create policy "authenticated can manage bookings"
  on bookings for all
  to authenticated
  using (true)
  with check (true);

-- ========== Messages de contact ==========
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  prenom text not null,
  nom text not null,
  email text not null,
  sujet text not null,
  message text not null,
  read boolean not null default false
);

alter table contact_messages enable row level security;

create policy "public can insert contact messages"
  on contact_messages for insert
  to anon
  with check (true);

create policy "authenticated can manage contact messages"
  on contact_messages for all
  to authenticated
  using (true)
  with check (true);

-- ========== Factures ==========
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

-- ========== Ton compte admin ==========
-- Create your own login in Dashboard → Authentication → Users → Add user
-- (email + password). That's the account you'll use to sign in at /admin.
