import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { EmailAuthContextType } from "@/app/(auth)/login/types";
import { useSupabase } from "@/lib/context/SupabaseProvider";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useMagicLinkLogin = () => {
  const { supabase } = useSupabase();
  const { watch, setValue } = useFormContext<EmailAuthContextType>();

  const { t } = useTranslation("login");

  const email = watch("email");

  const handleMagicLinkLogin = async () => {
    if (email === "") {
      return toast.error(t("errorMailMissed"));
    }
    setValue("isMagicLinkSubmitting", true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.hostname,
      },
    });
    setValue("isMagicLinkSubmitting", false);
    setValue("isMagicLinkSubmitted", true);

    if (error) {
      toast.error(error.message);

      throw error;
    }
  };

  return {
    handleMagicLinkLogin,
  };
};
