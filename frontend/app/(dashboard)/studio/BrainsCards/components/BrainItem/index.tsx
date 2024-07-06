import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useBrainManagementTabs } from "@/app/(dashboard)/studio//[brainId]/BrainManagementTabs/hooks/useBrainManagementTabs";
import DeleteBrainButton from "@/app/(dashboard)/studio/BrainsCards/components/DeleteBrain";
import { getBrainPermissions } from "@/app/(dashboard)/studio/[brainId]/BrainManagementTabs/utils/getBrainPermissions";
import { Card, CardTitle } from "@/components/ui/card";
import { useBrainContext } from "@/lib/context/BrainProvider/hooks/useBrainContext";
import { MinimalBrainForUser } from "@/lib/context/BrainProvider/types";

type BrainItemProps = {
  brain: MinimalBrainForUser;
};

export default function BrainItem({ brain }: BrainItemProps): JSX.Element {
  const {
    handleUnsubscribeOrDeleteBrain,
    isDeleteOrUnsubscribeModalOpened,
    setIsDeleteOrUnsubscribeModalOpened,
    isDeleteOrUnsubscribeRequestPending,
  } = useBrainManagementTabs(brain.id);
  const { allBrains } = useBrainContext();
  const { isOwnedByCurrentUser } = getBrainPermissions({
    brainId: brain.id,
    userAccessibleBrains: allBrains,
  });

  return (
    <Card
      key={brain.id}
      className="group flex items-center justify-between p-3 hover:bg-gray-100/20 cursor-pointer transition-colors"
    >
      <div className="flex-1 grow w-full">
        <Image
          src={
            brain.integration_logo_url
              ? brain.integration_logo_url
              : "/assets/default_brain_image.png"
          }
          alt="logo_image"
          width={18}
          height={18}
        />
        <Link href={`/studio/${brain.id}`}>
          <CardTitle className="text-md font-bold">{brain.name}</CardTitle>
          <p className="text-sm text-gray-500">{brain.description}</p>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <DeleteBrainButton
          isOpen={isDeleteOrUnsubscribeModalOpened}
          setOpen={setIsDeleteOrUnsubscribeModalOpened}
          onConfirm={() => void handleUnsubscribeOrDeleteBrain()}
          isOwnedByCurrentUser={isOwnedByCurrentUser}
          isDeleteOrUnsubscribeRequestPending={
            isDeleteOrUnsubscribeRequestPending
          }
        />
        <Link href={`/studio/${brain.id}`}>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </Link>
      </div>
    </Card>
  );
}
