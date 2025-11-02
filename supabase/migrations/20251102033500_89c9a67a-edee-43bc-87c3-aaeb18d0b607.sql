-- Ensure bucket exists and is public
insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

-- Public read policy
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public can read portfolio-images'
  ) then
    create policy "Public can read portfolio-images"
      on storage.objects
      for select
      to public
      using (bucket_id = 'portfolio-images');
  end if;
end $$;

-- Admin insert policy
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Admins can upload portfolio-images'
  ) then
    create policy "Admins can upload portfolio-images"
      on storage.objects
      for insert
      to authenticated
      with check (bucket_id = 'portfolio-images' and has_role(auth.uid(), 'admin'));
  end if;
end $$;

-- Admin update policy
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Admins can update portfolio-images'
  ) then
    create policy "Admins can update portfolio-images"
      on storage.objects
      for update
      to authenticated
      using (bucket_id = 'portfolio-images' and has_role(auth.uid(), 'admin'));
  end if;
end $$;

-- Admin delete policy
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Admins can delete portfolio-images'
  ) then
    create policy "Admins can delete portfolio-images"
      on storage.objects
      for delete
      to authenticated
      using (bucket_id = 'portfolio-images' and has_role(auth.uid(), 'admin'));
  end if;
end $$;