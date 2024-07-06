"use client";

import { Fragment, useEffect } from "react";

import { UploadDocumentModal } from "@/components/modals/UploadDocumentModal/UploadDocumentModal";
import LanguageSwitcher from "@/components/partial/LanguageSwitcher";
import PageHeader from "@/components/partial/PageHeader";
import ThemeSwitcher from "@/components/partial/ThemeSwitcher";
import { useBrainContext } from "@/lib/context/BrainProvider/hooks/useBrainContext";

import { BrainManagementTabs } from "./BrainManagementTabs";
import DeleteOrUnsubscribeConfirmationModal from "./BrainManagementTabs/components/DeleteOrUnsubscribeModal";
import { useBrainManagementTabs } from "./BrainManagementTabs/hooks/useBrainManagementTabs";
import { getBrainPermissions } from "./BrainManagementTabs/utils/getBrainPermissions";
import { useBrainManagement } from "./hooks/useBrainManagement";

export default function BrainsManagement(): JSX.Element {
  const { brain } = useBrainManagement();
  const {
    handleUnsubscribeOrDeleteBrain,
    isDeleteOrUnsubscribeModalOpened,
    setIsDeleteOrUnsubscribeModalOpened,
    isDeleteOrUnsubscribeRequestPending,
  } = useBrainManagementTabs(brain?.id);
  const { allBrains } = useBrainContext();
  const { isOwnedByCurrentUser } = getBrainPermissions({
    brainId: brain?.id,
    userAccessibleBrains: allBrains,
  });

  const { setCurrentBrainId } = useBrainContext();

  useEffect(() => {
    if (brain) {
      setCurrentBrainId(brain.id);
    }
  }, [brain]);

  if (!brain) {
    return (
      <div>
        <PageHeader title="Brain Settings" />
        <div className="flex flex-col space-y-2 text-center sm:text-left px-4 py-2">
          <h3 className="text-lg font-semibold">
            Ooups, Looks like you hit the wrong Brain!
          </h3>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <PageHeader title={`Brain Settings: ${brain.name}`}>
        {/* <span className="text-indigo-600 font-heading">{brain.name}</span> */}
        <UploadDocumentModal />
        <DeleteOrUnsubscribeConfirmationModal
          isOpen={isDeleteOrUnsubscribeModalOpened}
          setOpen={setIsDeleteOrUnsubscribeModalOpened}
          onConfirm={() => void handleUnsubscribeOrDeleteBrain()}
          isOwnedByCurrentUser={isOwnedByCurrentUser}
          isDeleteOrUnsubscribeRequestPending={
            isDeleteOrUnsubscribeRequestPending
          }
        />
        <LanguageSwitcher />
        <ThemeSwitcher />
      </PageHeader>
      <BrainManagementTabs />
    </Fragment>
  );
}
