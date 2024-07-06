// eslint-disable-next-line import/no-extraneous-dependencies
import { Session, SupabaseClient } from "@supabase/supabase-js";

export type SupabaseContextType = {
  supabase: SupabaseClient<SupaTypes>;
  session: Session | null;
};
