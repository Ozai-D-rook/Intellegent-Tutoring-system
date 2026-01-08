-- Add has_seen_welcome to profiles
alter table public.profiles 
add column if not exists has_seen_welcome boolean default false;

-- Create system_settings table
create table if not exists public.system_settings (
    key text primary key,
    value text not null
);

-- Enable RLS for system_settings
alter table public.system_settings enable row level security;

-- Public read access for system_settings
create policy "Anyone can view system settings" on public.system_settings
    for select using (true);
    
-- Only admins/teachers can modify settings (for now strictly restricting to manual DB inserts or future admin panel)
create policy "Authenticated users can view" on public.system_settings
    for select using (auth.role() = 'authenticated');
    
-- Insert default welcome video URL (Example: A placeholder YouTube video)
insert into public.system_settings (key, value)
values ('welcome_video_url', 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1')
on conflict (key) do nothing;
