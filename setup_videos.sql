-- Create a table for videos
create table videos (
  id uuid default gen_random_uuid() not null primary key,
  user_id uuid references auth.users not null,
  video_url text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table videos enable row level security;

create policy "Users can insert their own videos."
  on videos for insert
  with check ( auth.uid() = user_id );

create policy "Videos are viewable by everyone."
  on videos for select
  using ( true );
