-- Create function to increment votes
CREATE OR REPLACE FUNCTION increment_votes(idea_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE ideas
  SET votes = COALESCE(votes, 0) + 1
  WHERE id = idea_id;
END;
$$; 