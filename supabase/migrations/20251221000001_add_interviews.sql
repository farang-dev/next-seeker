-- Add interviews tracking
create table application_interviews (
  id uuid default gen_random_uuid() primary key,
  application_id uuid references job_applications on delete cascade not null,
  round_number int not null,
  interview_date timestamp with time zone,
  location text,
  notes text,
  feedback text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(application_id, round_number)
);

-- Enable RLS
alter table application_interviews enable row level security;

-- Policies
create policy "Users can manage own application interviews" on application_interviews for all 
  using (exists (select 1 from job_applications where id = application_id and user_id = auth.uid()));

-- Trigger for updated_at
create trigger set_updated_at_application_interviews before update on application_interviews for each row execute procedure handle_updated_at();

-- Add a check that round_number is between 1 and 5 if requested specifically, 
-- but maybe better to just leave it open-ended while implementing UI for 5.
alter table application_interviews add constraint check_round_number check (round_number >= 1 and round_number <= 5);
