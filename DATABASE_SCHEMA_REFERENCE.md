# Plug Database Schema Reference

## Overview
This document provides a complete reference for the Plug app's Supabase database schema, including tables, relationships, policies, and triggers.

## Database Tables

### 1. Users Table
```sql
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
```

**Purpose**: Stores user profiles and authentication data
**Key Fields**:
- `id`: UUID primary key (matches Supabase auth.users.id)
- `email`: User's email address (unique)
- `name`: User's display name
- `university`: User's university affiliation
- `avatar`: Optional profile picture URL
- `verified`: Email/phone verification status

### 2. Posts Table
```sql
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
```

**Purpose**: Stores marketplace listings and posts
**Key Fields**:
- `type`: Post type (item, service, ride, ticket, book, sublet)
- `price`: Optional price (numeric with 2 decimal places)
- `category`: Item category (Electronics, Books, etc.)
- `images`: Array of image URLs
- `status`: Post status (active, sold, expired)
- `is_flash_deal`: Whether post appears in Live Now feed
- `tags`: Array of searchable tags

### 3. Conversations Table
```sql
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  participants text[] not null,
  last_message_id uuid,
  unread_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

**Purpose**: Manages chat conversations between users
**Key Fields**:
- `participants`: Array of user IDs in the conversation
- `last_message_id`: Reference to the most recent message
- `unread_count`: Number of unread messages

### 4. Messages Table
```sql
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
```

**Purpose**: Stores individual chat messages
**Key Fields**:
- `sender_id`: User who sent the message
- `receiver_id`: User who received the message
- `post_id`: Optional reference to a post being discussed
- `read`: Whether the message has been read

### 5. Rides Table
```sql
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
```

**Purpose**: Manages ride-sharing listings
**Key Fields**:
- `driver_id`: User offering the ride
- `origin/destination`: Trip endpoints
- `departure_time`: When the ride leaves
- `available_seats`: Number of available seats
- `status`: Ride status (active, full, completed)

## Indexes

### Posts Indexes
- `idx_posts_user_id`: For filtering posts by user
- `idx_posts_status`: For filtering by status (active/sold/expired)
- `idx_posts_type`: For filtering by post type
- `idx_posts_category`: For filtering by category
- `idx_posts_created_at`: For chronological ordering

### Conversations Indexes
- `idx_conversations_participants`: GIN index for array searches

### Messages Indexes
- `idx_messages_conversation_id`: For conversation message queries
- `idx_messages_sender_id`: For user's sent messages
- `idx_messages_receiver_id`: For user's received messages

### Rides Indexes
- `idx_rides_driver_id`: For driver's rides
- `idx_rides_departure_time`: For time-based queries

## Row Level Security (RLS) Policies

### Users Policies
- **Read**: Everyone can read user profiles (for FK validation)
- **Insert**: Users can only create their own profile
- **Update**: Users can only update their own profile

### Posts Policies
- **Read**: Everyone can view active posts
- **Insert**: Users can only create posts for themselves
- **Update**: Users can only update their own posts
- **Delete**: Users can only delete their own posts

### Conversations Policies
- **Read**: Users can only view conversations they're part of
- **Insert**: Users can create conversations they're part of
- **Update**: Users can update conversations they're part of

### Messages Policies
- **Read**: Users can view messages they sent or received
- **Insert**: Users can only send messages as themselves
- **Update**: Users can update messages they sent or received

### Rides Policies
- **Read**: Everyone can view active rides
- **Insert**: Users can only create rides as themselves
- **Update**: Users can only update their own rides
- **Delete**: Users can only delete their own rides

## Triggers

### Updated-At Trigger
```sql
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
```
Automatically updates the `updated_at` timestamp when records are modified.

### Auth User Creation Trigger
```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, name, university, avatar, verified)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'university', ''),
    new.raw_user_meta_data->>'avatar',
    false
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
```
Automatically creates a user profile when someone signs up through Supabase Auth.

## TypeScript Types

The database schema maps to these TypeScript types in `src/types/database.ts`:

```typescript
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          university: string
          avatar?: string
          verified: boolean
          created_at: string
          updated_at: string
        }
        // ... Insert and Update types
      }
      posts: {
        Row: {
          id: string
          user_id: string
          type: 'item' | 'service' | 'ride' | 'ticket' | 'book' | 'sublet'
          title: string
          description: string
          price?: number
          category: string
          location: string
          images?: string[]
          created_at: string
          expires_at?: string
          status: 'active' | 'sold' | 'expired'
          tags: string[]
          is_flash_deal?: boolean
          flash_deal_expires_at?: string
          users?: {
            name: string
            avatar?: string
            university: string
          }
        }
        // ... Insert and Update types
      }
      // ... other tables
    }
  }
}
```

## API Functions

The database is accessed through these API functions in `src/lib/api.ts`:

- `userApi`: User profile management
- `postsApi`: Post CRUD operations
- `messagesApi`: Messaging functionality
- `ridesApi`: Ride-sharing operations

## Demo Mode

When Supabase environment variables are not set, the app runs in demo mode with mock data for testing purposes.

## Common Queries

### Get all active posts with user info
```sql
SELECT p.*, u.name, u.avatar, u.university 
FROM posts p 
JOIN users u ON p.user_id = u.id 
WHERE p.status = 'active' 
ORDER BY p.created_at DESC;
```

### Get user's posts
```sql
SELECT * FROM posts 
WHERE user_id = $1 
ORDER BY created_at DESC;
```

### Get conversation messages
```sql
SELECT m.*, u.name as sender_name 
FROM messages m 
JOIN users u ON m.sender_id = u.id 
WHERE m.conversation_id = $1 
ORDER BY m.created_at ASC;
```

## Notes

- All tables use UUID primary keys for security
- Timestamps are in UTC (timestamptz)
- Arrays are used for tags and images for flexibility
- RLS ensures data security at the database level
- Triggers automate common operations like timestamps and user creation
