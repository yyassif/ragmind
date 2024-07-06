import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function createClient() {
  const cookieStore = cookies();

  return createServerClient<SupaTypes>(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
