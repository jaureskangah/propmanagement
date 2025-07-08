
-- Créer le trigger manquant pour exécuter handle_new_user() automatiquement après chaque inscription
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
