CREATE OR REPLACE FUNCTION public.increment_activity_count(user_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET activities_generated_today = activities_generated_today + 1
  WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
