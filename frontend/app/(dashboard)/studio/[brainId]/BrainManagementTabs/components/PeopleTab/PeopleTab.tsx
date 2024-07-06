"use client";

import { UUID } from "crypto";
import { CirclePlus, Loader, Share2 } from "lucide-react";
import { Fragment } from "react";

import { BrainUsers } from "@/app/(dashboard)/studio/[brainId]/BrainManagementTabs/components/PeopleTab/BrainUsers/BrainUsers";
import { UserToInvite } from "@/app/(dashboard)/studio/[brainId]/BrainManagementTabs/components/PeopleTab/UserToInvite/UserToInvite";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useShareBrain } from "@/lib/hooks/useShareBrain";

type ShareBrainModalProps = {
  brainId: UUID;
};

export default function PeopleTab({
  brainId,
}: ShareBrainModalProps): JSX.Element {
  const {
    roleAssignations,
    updateRoleAssignation,
    removeRoleAssignation,
    inviteUsers,
    addNewRoleAssignationRole,
    sendingInvitation,
    canAddNewRow,
  } = useShareBrain(brainId);

  return (
    <Fragment>
      <div className="flex flex-col space-y-2 text-center sm:text-left mt-4">
        <h3 className="text-lg font-semibold">Add new users</h3>
        <p className="text-sm text-muted-foreground">
          Add new users to your Brain. They will be able to view and edit it.
        </p>
      </div>
      <form
        className="flex items-center pt-4 flex-col"
        onSubmit={(event) => {
          event.preventDefault();
          void inviteUsers();
        }}
      >
        {roleAssignations.map((roleAssignation, index) => (
          <UserToInvite
            key={roleAssignation.id}
            onChange={updateRoleAssignation(index)}
            removeCurrentInvitation={removeRoleAssignation(index)}
            roleAssignation={roleAssignation}
          />
        ))}
        <div className="flex items-center my-4 justify-between w-full mr-2">
          <Button
            variant="secondary"
            type="button"
            onClick={addNewRoleAssignationRole}
            disabled={sendingInvitation || !canAddNewRow}
          >
            <CirclePlus className="mr-2 h-4 w-4" /> Add New user
          </Button>
          <Button
            variant="default"
            type="button"
            disabled={sendingInvitation || roleAssignations.length === 0}
            onClick={() => void inviteUsers()}
          >
            {sendingInvitation ? (
              <Fragment>
                <Loader className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </Fragment>
            ) : (
              <Fragment>
                <Share2 className="mr-2 h-4 w-4" /> Invite
              </Fragment>
            )}
          </Button>
        </div>
      </form>
      <Separator />
      <div className="flex flex-col space-y-2 text-center sm:text-left mt-4">
        <h3 className="text-lg font-semibold">Users with access</h3>
        <p className="text-sm text-muted-foreground">
          Users with access to this Brain. They can view and edit it.
        </p>
      </div>
      <div className="flex items-center space-x-2 pt-4">
        <BrainUsers brainId={brainId} />
      </div>
    </Fragment>
  );
}
