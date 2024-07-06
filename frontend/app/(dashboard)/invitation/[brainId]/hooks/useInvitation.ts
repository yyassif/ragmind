"use client";

import { AxiosResponse, isAxiosError } from "axios";
import { UUID } from "crypto";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { BrainRoleType } from "@/app/(dashboard)/studio/[brainId]/BrainManagementTabs/components/PeopleTab/BrainUsers/types";
import { useSubscriptionApi } from "@/lib/api/subscription/useSubscriptionApi";
import { useBrainContext } from "@/lib/context/BrainProvider/hooks/useBrainContext";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useInvitation = () => {
  const { t } = useTranslation(["brain", "invitation"]);
  const params = useParams();
  const brainId = params.brainId as UUID | undefined;
  const [isLoading, setIsLoading] = useState(false);
  const [brainName, setBrainName] = useState<string>("");
  const [role, setRole] = useState<BrainRoleType | undefined>();
  const [isProcessingRequest, setIsProcessingRequest] = useState(false);
  const { getInvitation, acceptInvitation, declineInvitation } =
    useSubscriptionApi();

  if (brainId === undefined) {
    throw new Error(t("brainUndefined", { ns: "brain" }));
  }

  const { fetchAllBrains, setCurrentBrainId } = useBrainContext();
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);

    const checkInvitationValidity = async () => {
      try {
        const { name, role: assignedRole } = await getInvitation(brainId);
        setBrainName(name);
        setRole(assignedRole);
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
          toast.warning(t("invitationNotFound", { ns: "invitation" }));
        } else {
          toast.error(t("errorCheckingInvitation", { ns: "invitation" }));
        }
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };
    void checkInvitationValidity();
  }, [brainId]);

  const handleAccept = async () => {
    setIsProcessingRequest(true);
    try {
      await acceptInvitation(brainId);
      await fetchAllBrains();
      toast.success(t("accept", { ns: "invitation" }));
      setCurrentBrainId(brainId);
    } catch (error) {
      if (isAxiosError(error) && error.response?.data !== undefined) {
        toast.error(
          (
            error.response as AxiosResponse<{
              detail: string;
            }>
          ).data.detail
        );
      } else {
        console.error("Error calling the API:", error);
        toast.error(t("errorAccepting", { ns: "invitation" }));
      }
    } finally {
      setIsProcessingRequest(false);
      void router.push("/chat");
    }
  };

  const handleDecline = async () => {
    setIsProcessingRequest(true);
    try {
      await declineInvitation(brainId);
      toast.error(t("declined", { ns: "invitation" }));
    } catch (error) {
      if (isAxiosError(error) && error.response?.data !== undefined) {
        toast.error(
          (
            error.response as AxiosResponse<{
              detail: string;
            }>
          ).data.detail
        );
      } else {
        toast.error(t("errorDeclining", { ns: "invitation" }));
      }
    } finally {
      setIsProcessingRequest(false);
      void router.push("/chat");
    }
  };

  return {
    handleAccept,
    handleDecline,
    brainName,
    role,
    isLoading,
    isProcessingRequest,
  };
};
