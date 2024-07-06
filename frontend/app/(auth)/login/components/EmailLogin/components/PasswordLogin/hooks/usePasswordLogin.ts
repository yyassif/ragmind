import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { EmailAuthContextType } from "@/app/(auth)/login/types";
import { useSupabase } from "@/lib/context/SupabaseProvider";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const usePasswordLogin = () => {
  const { supabase } = useSupabase();
  const { t } = useTranslation("login");
  const { watch, setValue } = useFormContext<EmailAuthContextType>();

  const email = watch("email");
  const password = watch("password");

  const handlePasswordLogin = async () => {
    if (email === "") {
      return toast.error(t("errorMailMissed"));
    }

    if (password === "") {
      return toast.error(t("errorPasswordMissed"));
    }
    setValue("isPasswordSubmitting", true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setValue("isPasswordSubmitting", false);
    setValue("isPasswordSubmitted", true);

    if (error) {
      toast.error(error.message);

      throw error; // this error is caught by react-hook-form
    }
  };

  return {
    handlePasswordLogin,
  };
};
