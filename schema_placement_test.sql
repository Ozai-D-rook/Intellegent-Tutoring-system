-- Add learning level tracking to profiles
alter table public.profiles 
add column if not exists learning_level text default 'Beginner',
add column if not exists has_taken_placement_test boolean default true;
