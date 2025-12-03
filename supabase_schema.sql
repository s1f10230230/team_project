-- Create diagnosis_results table
create table if not exists public.diagnosis_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  result jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.diagnosis_results enable row level security;

-- Create policies
create policy "Users can view their own diagnosis results"
  on public.diagnosis_results for select
  using (auth.uid() = user_id);

create policy "Users can insert their own diagnosis results"
  on public.diagnosis_results for insert
  with check (auth.uid() = user_id);
