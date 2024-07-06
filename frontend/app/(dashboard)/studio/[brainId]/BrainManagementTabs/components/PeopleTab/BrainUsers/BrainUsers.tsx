import { UUID } from "crypto";
import { RocketIcon } from "lucide-react";
import { Fragment } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { BrainUser } from "./BrainUser/BrainUser";
import { useBrainUsers } from "./hooks/useBrainUsers";

type BrainUsersProps = {
  brainId: UUID;
};
export const BrainUsers = ({ brainId }: BrainUsersProps): JSX.Element => {
  const { brainUsers, fetchBrainUsers } = useBrainUsers(brainId);

  if (brainUsers.length === 0) {
    return (
      <div className="flex w-full py-2 justify-center">
        <Alert variant="destructive">
          <RocketIcon className="h-4 w-4" />
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>
            You are the only user to have access to this brain.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <Fragment>
      {brainUsers.map((subscription) => (
        <BrainUser
          key={subscription.email}
          email={subscription.email}
          role={subscription.role}
          brainId={brainId}
          fetchBrainUsers={fetchBrainUsers}
        />
      ))}
    </Fragment>
  );
};
