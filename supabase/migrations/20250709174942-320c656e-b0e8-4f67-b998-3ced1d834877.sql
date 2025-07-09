-- Ajouter le rôle administrateur à l'utilisateur jaureskangah2016@gmail.com
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM profiles 
WHERE email = 'jaureskangah2016@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;