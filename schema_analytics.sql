-- Create a table for tracking Student Progress
create table if not exists public.student_progress (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references auth.users(id) on delete cascade not null,
  course_id bigint references public.content(id) on delete cascade not null,
  step_index integer not null, -- Index of the completed step in course_steps (0-based or sequence order)
  passed_quiz boolean default false,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(student_id, course_id, step_index) -- Ensure a student can only complete a specific step once
);

-- RLS Policies
alter table public.student_progress enable row level security;

-- Students can read their own progress, teachers can read all
create policy "Users can read their own progress and Teachers can read all."
  on public.student_progress for select
  using ( 
    auth.uid() = student_id OR
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'teacher'
    )
  );

-- Students can insert their own progress
create policy "Students can insert their own progress."
  on public.student_progress for insert
  with check ( auth.uid() = student_id );

-- Students can update their own progress (e.g., passed a quiz after initially failing)
create policy "Students can update their own progress."
  on public.student_progress for update
  using ( auth.uid() = student_id );

-- Teachers can delete progress (admin action)
create policy "Teachers can delete progress."
  on public.student_progress for delete
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'teacher'
    )
  );
