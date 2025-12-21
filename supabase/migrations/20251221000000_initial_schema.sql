-- Profiles table
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  avatar_url text,
  preferred_language text default 'en' check (preferred_language in ('en', 'ja')),
  theme_preference text default 'system' check (theme_preference in ('light', 'dark', 'system'))
);

-- Career Goals table
create table career_goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  type text check (type in ('3-year', '5-year', '10-year')) not null,
  title text not null,
  description text,
  notes text,
  updated_at timestamp with time zone default now(),
  unique(user_id, type)
);

-- Job Applications table
create table job_applications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  company_name text not null,
  job_title text not null,
  application_url text,
  status text check (status in ('Draft', 'Applied', 'Interview', 'Offer', 'Rejected', 'Archived')) default 'Draft' not null,
  priority text check (priority in ('High', 'Medium', 'Low')) default 'Medium' not null,
  application_date date default current_date,
  location text,
  notes text,
  motivation text, -- Why I applied
  fit_notes text, -- Why this role fits my career goals
  pitch_text text, -- Personal pitch
  company_research text, -- "Why this company?" notes
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Application Questions (specific questions for the company)
create table application_questions (
  id uuid default gen_random_uuid() primary key,
  application_id uuid references job_applications on delete cascade not null,
  question text not null,
  answer text,
  sort_order int default 0,
  created_at timestamp with time zone default now()
);

-- Application Notes (free notes learned during interviews, etc.)
create table application_notes (
  id uuid default gen_random_uuid() primary key,
  application_id uuid references job_applications on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table profiles enable row level security;
alter table career_goals enable row level security;
alter table job_applications enable row level security;
alter table application_questions enable row level security;
alter table application_notes enable row level security;

-- Policies
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

create policy "Users can manage own career goals" on career_goals for all using (auth.uid() = user_id);
create policy "Users can manage own applications" on job_applications for all using (auth.uid() = user_id);
create policy "Users can manage own application questions" on application_questions for all 
  using (exists (select 1 from job_applications where id = application_id and user_id = auth.uid()));
create policy "Users can manage own application notes" on application_notes for all 
  using (exists (select 1 from job_applications where id = application_id and user_id = auth.uid()));

-- Functions for automatic updated_at
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at_profiles before update on profiles for each row execute procedure handle_updated_at();
create trigger set_updated_at_job_applications before update on job_applications for each row execute procedure handle_updated_at();
create trigger set_updated_at_application_notes before update on application_notes for each row execute procedure handle_updated_at();

-- Profile creation on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
