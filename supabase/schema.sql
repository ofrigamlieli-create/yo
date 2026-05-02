create table usage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  feature text not null,
  input_word_count int,
  model text,
  created_at timestamptz default now()
);

alter table usage_logs enable row level security;

create policy "Users see own logs" on usage_logs
  for select using (auth.uid() = user_id);
