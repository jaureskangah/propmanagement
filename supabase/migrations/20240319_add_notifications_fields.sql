
-- Enable row level security
alter table maintenance_tasks enable row level security;

-- Add notification fields
alter table maintenance_tasks 
add column if not exists notification_sent boolean default false,
add column if not exists last_notification timestamp with time zone;

-- Add priority notification trigger
create or replace function notify_urgent_tasks()
returns trigger as $$
begin
  if (NEW.priority = 'high' or NEW.priority = 'urgent') and not NEW.notification_sent then
    update maintenance_tasks 
    set notification_sent = true,
        last_notification = now()
    where id = NEW.id;
  end if;
  return NEW;
end;
$$ language plpgsql;

create trigger check_urgent_tasks
after insert or update on maintenance_tasks
for each row
execute function notify_urgent_tasks();
