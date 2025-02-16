
import { useState } from 'react';
import { User, Session } from '@supabase/supabase-js';

export function useAuthSession() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  return { user, setUser, loading, setLoading };
}
