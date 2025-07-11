-- Enable pg_cron extension for scheduling
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the lease expiry notifications to run daily at 9:00 AM
SELECT cron.schedule(
  'daily-lease-expiry-notifications',
  '0 9 * * *', -- Every day at 9:00 AM
  $$
  SELECT
    net.http_post(
        url:='https://jhjhzwbvmkurwfohjxlu.supabase.co/functions/v1/lease-expiry-notifications',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impoamh6d2J2bWt1cndmb2hqeGx1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTY0NjI2MSwiZXhwIjoyMDUxMjIyMjYxfQ.xWm3h5qBCjjNQ-sU9LQqF-7rGDJd-iC9WKZtvjdOOHE"}'::jsonb,
        body:='{"scheduled": true}'::jsonb
    ) as request_id;
  $$
);