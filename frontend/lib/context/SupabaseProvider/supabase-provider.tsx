"use client";

// eslint-disable-next-line import/no-extraneous-dependencies
import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createContext, Fragment, useEffect, useState } from "react";

import { SupabaseContextType } from "@/lib/context/SupabaseProvider/types";
import { createClient } from "@/lib/supabase/client";

export const SupabaseContext = createContext<SupabaseContextType | undefined>(
  undefined
);

export const SupabaseProvider = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}): JSX.Element => {
  const [supabase] = useState(() => createClient());
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      router.refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  return (
    <SupabaseContext.Provider value={{ supabase, session }}>
      <Fragment>{children}</Fragment>
    </SupabaseContext.Provider>
  );
};
