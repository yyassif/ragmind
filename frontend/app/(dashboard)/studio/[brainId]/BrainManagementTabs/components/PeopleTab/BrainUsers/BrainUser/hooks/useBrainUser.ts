import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useBrainApi } from "@/lib/api/brain/useBrainApi";
import { useBrainContext } from "@/lib/context/BrainProvider/hooks/useBrainContext";
import { getAxiosErrorParams } from "@/lib/helpers/getAxiosErrorParams";

import { BrainRoleType } from "../../types";

type UseBrainUserProps = {
  fetchBrainUsers: () => Promise<void>;
  role: BrainRoleType;
  brainId: string;
  email: string;
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useBrainUser = ({
  brainId,
  fetchBrainUsers,
  role,
  email,
}: UseBrainUserProps) => {
  const { updateBrainAccess } = useBrainApi();
  const [selectedRole, setSelectedRole] = useState<BrainRoleType>(role);
  const [isRemovingAccess, setIsRemovingAccess] = useState(false);
  const { currentBrain } = useBrainContext();
  const { t } = useTranslation(["translation", "brain"]);

  const updateSelectedRole = async (newRole: BrainRoleType) => {
    setSelectedRole(newRole);
    try {
      await updateBrainAccess(brainId, email, {
        role: newRole,
      });
      toast.success(
        t("userRoleUpdated", {
          email: email,
          role: newRole,
          ns: "brain",
        })
      );
      void fetchBrainUsers();
    } catch (e) {
      const axiosError = getAxiosErrorParams(e);
      if (axiosError !== undefined && axiosError.status === 403) {
        toast.error(axiosError.message);
      } else {
        toast.error(
          t("userRoleUpdateFailed", {
            email: email,
            role: newRole,
            ns: "brain",
          })
        );
      }
    }
  };

  const removeUserAccess = async () => {
    setIsRemovingAccess(true);
    try {
      await updateBrainAccess(brainId, email, {
        role: null,
      });
      toast.success(t("userRemoved", { email: email, ns: "brain" }));
      void fetchBrainUsers();
    } catch (e) {
      const axiosError = getAxiosErrorParams(e);
      if (axiosError !== undefined) {
        toast.error(axiosError.message);
      } else {
        toast.error(t("userRemoveFailed", { email: email, ns: "brain" }));
      }
    } finally {
      setIsRemovingAccess(false);
    }
  };

  const canRemoveAccess = currentBrain?.role === "Owner";

  return {
    isRemovingAccess,
    removeUserAccess,
    updateSelectedRole,
    selectedRole,
    canRemoveAccess,
  };
};
