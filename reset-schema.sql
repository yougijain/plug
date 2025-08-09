-- DANGER: This script drops and recreates all app tables. Run only on the intended database.
-- It targets: public.users, public.posts, public.conversations, public.messages, public.rides

-- 0) Prereqs
create extension if not exists pgcrypto;

-- 1) Drop existing objects (order chosen to respect FKs; CASCADE as safety)
drop table if exists public.messages cascade;
drop table if exists public.conversations cascade;
drop table if exists public.posts cascade;
drop table if exists public.rides cascade;
drop table if exists public.users cascade;

-- 2) Recreate schema
create table public.users (
  id uuid primary key,
  email text not null unique,
  name text not null,
  university text not null,
  avatar text,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  type text not null check (type in ('item','service','ride','ticket','book','sublet')),
  title text not null,
  description text not null,
  price numeric(10,2),
  category text not null,
  location text not null,
  images text[] not null default '{}',
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  status text not null default 'active' check (status in ('active','sold','expired')),
  tags text[] not null default '{}',
  is_flash_deal boolean not null default false,
  flash_deal_expires_at timestamptz
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  participants text[] not null,
  last_message_id uuid,
  unread_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.users(id) on delete cascade,
  receiver_id uuid not null references public.users(id) on delete cascade,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  post_id uuid references public.posts(id) on delete set null,
  content text not null,
  created_at timestamptz not null default now(),
  read boolean not null default false
);

create table public.rides (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references public.users(id) on delete cascade,
  origin text not null,
  destination text not null,
  departure_time timestamptz not null,
  available_seats integer not null,
  price numeric(10,2) not null,
  description text,
  status text not null default 'active' check (status in ('active','full','completed')),
  created_at timestamptz not null default now()
);

-- 3) Indexes
create index if not exists idx_posts_user_id on public.posts(user_id);
create index if not exists idx_posts_status on public.posts(status);
create index if not exists idx_posts_type on public.posts(type);
create index if not exists idx_posts_category on public.posts(category);
create index if not exists idx_posts_created_at on public.posts(created_at desc);

create index if not exists idx_conversations_participants on public.conversations using gin(participants);

create index if not exists idx_messages_conversation_id on public.messages(conversation_id);
create index if not exists idx_messages_sender_id on public.messages(sender_id);
create index if not exists idx_messages_receiver_id on public.messages(receiver_id);

create index if not exists idx_rides_driver_id on public.rides(driver_id);
create index if not exists idx_rides_departure_time on public.rides(departure_time);

-- 4) Enable RLS and policies
alter table public.users enable row level security;
alter table public.posts enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.rides enable row level security;

-- users
create policy "Allow read for FK validation" on public.users
  for select using (true);

create policy "Users can insert own record" on public.users
  for insert with check (auth.uid() = id);

create policy "Users can update own record" on public.users
  for update using (auth.uid() = id);

-- posts
create policy "Posts are viewable by everyone" on public.posts
  for select using (status = 'active');

create policy "Users can insert their own posts" on public.posts
  for insert with check (auth.uid() = user_id);

create policy "Users can update own posts" on public.posts
  for update using (auth.uid() = user_id);

create policy "Users can delete own posts" on public.posts
  for delete using (auth.uid() = user_id);

-- conversations
create policy "Users can view their own conversations" on public.conversations
  for select using (auth.uid()::text = any(participants));

create policy "Users can create conversations" on public.conversations
  for insert with check (auth.uid()::text = any(participants));

create policy "Users can update their own conversations" on public.conversations
  for update using (auth.uid()::text = any(participants));

-- messages
create policy "Users can view their own messages" on public.messages
  for select using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can send messages" on public.messages
  for insert with check (auth.uid() = sender_id);

create policy "Users can update their own messages" on public.messages
  for update using (auth.uid() = sender_id or auth.uid() = receiver_id);

-- rides
create policy "Rides are viewable by everyone" on public.rides
  for select using (status = 'active');

create policy "Users can create their own rides" on public.rides
  for insert with check (auth.uid() = driver_id);

create policy "Users can update their own rides" on public.rides
  for update using (auth.uid() = driver_id);

create policy "Users can delete their own rides" on public.rides
  for delete using (auth.uid() = driver_id);

-- 5) Final checks
select 'Setup complete!' as status;
select 'Users in database:' as info, id, email from public.users;
select 'Posts in database:' as info, count(*) as count from public.posts;

