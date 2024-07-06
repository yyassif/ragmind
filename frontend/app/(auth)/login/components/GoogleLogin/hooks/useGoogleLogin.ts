import { useState } from "react";
import { toast } from "sonner";

import { useSupabase } from "@/lib/context/SupabaseProvider";

export const useGoogleLogin = (): {
  signInWithGoogle: () => Promise<void>;
  isPending: boolean;
} => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const { supabase } = useSupabase();

  const signInWithGoogle = async () => {
    setIsPending(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
    setIsPending(false);
    if (error) {
      toast.error("An error occurred");
    }
  };

  return {
    signInWithGoogle,
    isPending,
  };
};
