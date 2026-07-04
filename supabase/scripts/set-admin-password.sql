-- @author Katsoulakis
-- @copyright 2026
-- One-time: set admin password (run in Supabase → SQL Editor → Run)
-- Temp password: CrmTemp2026!  (change after login in /admin/settings)

UPDATE auth.users
SET
  encrypted_password = crypt('CrmTemp2026!', gen_salt('bf')),
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  updated_at = NOW()
WHERE email = 'kretalumin.paragelies@gmail.com';

-- If 0 rows updated, the user does not exist — create via Authentication → Users → Add user instead.
