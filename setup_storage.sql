-- Set up Storage!
insert into storage.buckets (id, name)
values ('videos', 'videos');

create policy "Video files are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'videos' );

create policy "Anyone can upload a video."
  on storage.objects for insert
  with check ( bucket_id = 'videos' );
