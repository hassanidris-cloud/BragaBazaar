-- Supabase schema for grocery app

-- Products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT
);

-- Profiles table (user info)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  address TEXT,
  phone TEXT
);

-- Orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  total_price NUMERIC NOT NULL,
  status TEXT NOT NULL,
  payment_method TEXT
);

-- Order Items table
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL
);
create table if not exists profiles (
  id uuid primary key,
  username text not null,
  name text,
  loyalty_points integer not null default 0,
  loyalty_tier text not null default 'Bronze',
  total_saved numeric(10, 2) not null default 0,
  preferences text[] not null default '{}'
);

-- Products: id must be UUID (admin sends id on insert). Categories: fruits, bakery, meat, eggs, drinks, promotions
-- unit: 'unit' (per item) or 'kg' (per kg). price_per_kg used for fruits/vegetables.
create table if not exists products (
  id uuid primary key,
  name text not null,
  price numeric(10, 2) not null,
  stock_level integer not null default 0,
  category text not null,
  image_url text,
  description text,
  unit text default 'unit',
  price_per_kg numeric(10, 2),
  nutritional_info jsonb not null default '{}',
  on_sale boolean default false,
  old_price numeric(10, 2),
  member_points_earned integer default 5
);

create table if not exists orders (
  id uuid primary key,
  user_id uuid references profiles(id) on delete cascade,
  status text not null,
  total_price numeric(10, 2) not null,
  fulfillment text not null default 'delivery',
  payment_method text not null default 'stripe',
  pickup_slot_id text
);

-- "Bazaar Savings" — Pingo Doce Poupa Mais style loyalty ledger
create table if not exists loyalty_transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  points_change integer not null,
  description text,
  created_at timestamptz default now()
);
