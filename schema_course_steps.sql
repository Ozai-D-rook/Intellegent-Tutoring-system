-- Create a table for Course Steps/Lessons
create table if not exists public.course_steps (
  id uuid default gen_random_uuid() primary key,
  course_id bigint references public.content(id) on delete cascade not null,
  title text not null,
  body text, -- Markdown content
  sequence_order integer not null,
  quiz_data jsonb, -- Stores questions, options, and answers
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table public.course_steps enable row level security;

-- Everyone can read steps (if they have access to the course)
create policy "Public steps are viewable by everyone."
  on public.course_steps for select
  using ( true );

-- Only authenticated users (Teachers) can insert/update/delete
create policy "Teachers can insert steps."
  on public.course_steps for insert
  with check ( auth.role() = 'authenticated' );

create policy "Teachers can update their steps."
  on public.course_steps for update
  using ( auth.role() = 'authenticated' );

create policy "Teachers can delete their steps."
  on public.course_steps for delete
  using ( auth.role() = 'authenticated' );
