import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Subscription } from "@/lib/api/brain/brain";
import { useBrainApi } from "@/lib/api/brain/useBrainApi";
import { useSupabase } from "@/lib/context/SupabaseProvider";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useBrainUsers = (brainId: string) => {
  const [isFetchingBrainUsers, setFetchingBrainUsers] = useState(false);
  const [brainUsers, setBrainUsers] = useState<Subscription[]>([]);
  const { getBrainUsers } = useBrainApi();
  const { session } = useSupabase();
  const { t } = useTranslation(["brain"]);

  const fetchBrainUsers = async () => {
    // Optimistic update
    setFetchingBrainUsers(brainUsers.length === 0);
    try {
      const users = await getBrainUsers(brainId);
      setBrainUsers(users.filter(({ email }) => email !== session?.user.email));
    } catch {
      toast.error(t("errorFetchingBrainUsers", { ns: "brain" }));
    } finally {
      setFetchingBrainUsers(false);
    }
  };

  useEffect(() => {
    void fetchBrainUsers();
  }, []);

  return {
    brainUsers,
    fetchBrainUsers,
    isFetchingBrainUsers,
  };
};
