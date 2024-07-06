import { Fragment } from "react";

import Notifications from "@/components/partial/Notifications";
import { Separator } from "@/components/ui/separator";
import { useDevice } from "@/lib/hooks/useDevice";

interface PageHeaderProps {
  title: string;
  showNotifications?: boolean;
  children?: React.ReactNode;
}

export default function PageHeader({
  title,
  showNotifications,
  children,
}: PageHeaderProps): JSX.Element {
  const { isMobile } = useDevice();

  return (
    <Fragment>
      <div className="flex h-[52px] items-center justify-between px-4 py-2">
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <Fragment>{children}</Fragment>
          {!isMobile && showNotifications && <Notifications />}
        </div>
      </div>
      <Separator />
    </Fragment>
  );
}
