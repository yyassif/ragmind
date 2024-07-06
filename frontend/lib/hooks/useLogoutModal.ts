import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useSupabase } from "@/lib/context/SupabaseProvider";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useLogoutModal = () => {
  const { supabase } = useSupabase();
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [isLogoutModalOpened, setIsLogoutModalOpened] =
    useState<boolean>(false);
  const { t } = useTranslation(["translation", "logout"]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const { error } = await supabase.auth.signOut();
    localStorage.clear();

    if (error) {
      console.error("Error logging out:", error.message);
      toast.error(t("error", { errorMessage: error.message, ns: "logout" }));
    } else {
      toast.success(t("loggedOut", { ns: "logout" }));
      window.location.href = "/";
    }
    setIsLoggingOut(false);
  };

  return {
    handleLogout,
    isLoggingOut,
    isLogoutModalOpened,
    setIsLogoutModalOpened,
  };
};
