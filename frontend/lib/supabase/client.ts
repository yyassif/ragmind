import { createBrowserClient } from "@supabase/ssr";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function createClient() {
  return createBrowserClient<SupaTypes>(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );
}
