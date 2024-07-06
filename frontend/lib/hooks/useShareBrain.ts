/* eslint-disable max-lines */
import { AxiosResponse, isAxiosError } from "axios";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { BrainRoleAssignation } from "@/app/(dashboard)/studio/[brainId]/BrainManagementTabs/components/PeopleTab/BrainUsers/types";
import { generateBrainAssignation } from "@/app/(dashboard)/studio/[brainId]/BrainManagementTabs/components/PeopleTab/BrainUsers/utils/generateBrainAssignation";
import { Subscription } from "@/lib/api/brain/brain";
import { useBrainApi } from "@/lib/api/brain/useBrainApi";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useShareBrain = (brainId: string) => {
  const [sendingInvitation, setSendingInvitation] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [roleAssignations, setRoleAssignation] = useState<
    BrainRoleAssignation[]
  >([generateBrainAssignation()]);
  const { addBrainSubscriptions } = useBrainApi();
  const { t } = useTranslation(["brain"]);

  const baseUrl = window.location.origin;
  const brainShareLink = `${baseUrl}/invitation/${brainId}`;

  const handleCopyInvitationLink = async () => {
    await navigator.clipboard.writeText(brainShareLink);
    toast.success(t("copiedToClipboard", { ns: "brain" }));
  };

  const removeRoleAssignation = (assignationIndex: number) => () => {
    if (roleAssignations.length === 1) {
      return;
    }
    setRoleAssignation(
      roleAssignations.filter((_, index) => index !== assignationIndex)
    );
  };

  const updateRoleAssignation =
    (rowIndex: number) => (data: BrainRoleAssignation) => {
      const concernedRow = roleAssignations[rowIndex];

      if (concernedRow !== undefined) {
        setRoleAssignation(
          roleAssignations.map((row, index) => {
            if (index === rowIndex) {
              return data;
            }

            return row;
          })
        );
      } else {
        setRoleAssignation([...roleAssignations, data]);
      }
    };

  const inviteUsers = async (): Promise<void> => {
    setSendingInvitation(true);
    try {
      const inviteUsersPayload: Subscription[] = roleAssignations
        .filter(({ email }) => email !== "")
        .map((assignation) => ({
          email: assignation.email,
          role: assignation.role,
        }));

      await addBrainSubscriptions(brainId, inviteUsersPayload);
      toast.success(t("usersInvited", { ns: "brain" }));
      setIsShareModalOpen(false);
      setRoleAssignation([generateBrainAssignation()]);
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
        toast.error(t("errorSendingInvitation", { ns: "brain" }));
      }
    } finally {
      setSendingInvitation(false);
    }
  };

  const addNewRoleAssignationRole = () => {
    setRoleAssignation([...roleAssignations, generateBrainAssignation()]);
  };
  const canAddNewRow =
    roleAssignations.length === 0 ||
    roleAssignations.filter((invitingUser) => invitingUser.email === "")
      .length === 0;

  return {
    roleAssignations,
    brainShareLink,
    handleCopyInvitationLink,
    updateRoleAssignation,
    removeRoleAssignation,
    inviteUsers,
    addNewRoleAssignationRole,
    sendingInvitation,
    setIsShareModalOpen,
    isShareModalOpen,
    canAddNewRow,
  };
};
