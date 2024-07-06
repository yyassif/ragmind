import { formatDistanceToNow } from "date-fns";
import { Mail, MailCheck, MailMinus, MailOpen, Trash2 } from "lucide-react";

import { NotificationType } from "@/components/partial/Notifications/types/types";
import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useSupabase } from "@/lib/context/SupabaseProvider";
import { cn } from "@/lib/utils";

interface NotificationProps {
  notification: NotificationType;
  lastNotification?: boolean;
  updateNotifications: () => Promise<void>;
}

export const Notification = ({
  notification,
  lastNotification,
  updateNotifications,
}: NotificationProps): JSX.Element => {
  const { supabase } = useSupabase();

  const deleteNotif = async () => {
    await supabase.from("notifications").delete().eq("id", notification.id);
    await updateNotifications();
  };

  const readNotif = async () => {
    await supabase
      .from("notifications")
      .update({ read: !notification.read })
      .eq("id", notification.id);

    await updateNotifications();
  };

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger
        className={cn(lastNotification && "border-border")}
      >
        <div className="flex items-center gap-x-2 w-full">
          {!notification.read ? (
            <Mail className="mr-2 h-4 w-4" />
          ) : (
            <MailOpen className="mr-2 h-4 w-4" />
          )}
          <div className="flex flex-col w-full">
            <h2
              className="text-ellipsis text-sm w-full overflow-hidden whitespace-nowrap"
              title={notification.title}
            >
              {notification.title}
            </h2>
            <span
              className="text-ellipsis text-xs w-full overflow-hidden whitespace-nowrap"
              title={notification.description as string}
            >
              {notification.description}
            </span>
            <span className="text-ellipsis text-xs">
              {formatDistanceToNow(new Date(notification.datetime as string), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuItem onClick={() => void readNotif()}>
            {notification.read ? (
              <MailMinus className="mr-2 h-4 w-4" />
            ) : (
              <MailCheck className="mr-2 h-4 w-4" />
            )}
            <span>{notification.read ? "Unread" : "Read"}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => void deleteNotif()}>
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
};
