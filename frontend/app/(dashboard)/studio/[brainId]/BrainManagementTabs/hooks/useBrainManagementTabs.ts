import { UUID } from "crypto";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useSubscriptionApi } from "@/lib/api/subscription/useSubscriptionApi";
import { useBrainContext } from "@/lib/context/BrainProvider/hooks/useBrainContext";

import { getBrainPermissions } from "../utils/getBrainPermissions";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useBrainManagementTabs = (customBrainId?: UUID) => {
  const { allBrains } = useBrainContext();
  const [
    isDeleteOrUnsubscribeRequestPending,
    setIsDeleteOrUnsubscribeRequestPending,
  ] = useState(false);
  const { unsubscribeFromBrain } = useSubscriptionApi();
  const { deleteBrain, setCurrentBrainId, fetchAllBrains } = useBrainContext();
  const [
    isDeleteOrUnsubscribeModalOpened,
    setIsDeleteOrUnsubscribeModalOpened,
  ] = useState(false);
  const router = useRouter();

  const params = useParams();
  const pathname = usePathname();
  const { t } = useTranslation(["delete_or_unsubscribe_from_brain"]);
  const brainId = customBrainId ?? (params.brainId as UUID | undefined);

  const { hasEditRights, isOwnedByCurrentUser } = getBrainPermissions({
    brainId,
    userAccessibleBrains: allBrains,
  });

  const handleUnSubscription = async () => {
    if (brainId === undefined) {
      return;
    }
    await unsubscribeFromBrain(brainId);
    toast.success(t("successfully_unsubscribed"));
  };

  const handleUnsubscribeOrDeleteBrain = async () => {
    if (brainId === undefined) {
      return;
    }

    setIsDeleteOrUnsubscribeRequestPending(true);
    try {
      if (!isOwnedByCurrentUser) {
        await handleUnSubscription();
      } else {
        await deleteBrain(brainId);
      }
      setCurrentBrainId(null);
      setIsDeleteOrUnsubscribeModalOpened(false);
      void fetchAllBrains();
    } catch (error) {
      console.error("Error deleting brain: ", error);
    } finally {
      if (pathname !== "studio") {
        router.push("/studio");
      }
      void fetchAllBrains();
      setIsDeleteOrUnsubscribeRequestPending(false);
    }
  };

  return {
    brainId,
    handleUnsubscribeOrDeleteBrain,
    isDeleteOrUnsubscribeModalOpened,
    setIsDeleteOrUnsubscribeModalOpened,
    hasEditRights,
    isOwnedByCurrentUser,
    isDeleteOrUnsubscribeRequestPending,
  };
};
