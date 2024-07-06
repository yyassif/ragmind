import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

import { Notification } from "@/components/partial/Notifications/Notification";
import { NotificationType } from "@/components/partial/Notifications/types/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSupabase } from "@/lib/context/SupabaseProvider";

export default function Notifications(): JSX.Element {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  const { supabase } = useSupabase();

  const updateNotifications = async () => {
    try {
      let notifs = (await supabase.from("notifications").select()).data;
      if (notifs) {
        notifs = notifs.sort(
          (a: NotificationType, b: NotificationType) =>
            new Date(b.datetime as string).getTime() -
            new Date(a.datetime as string).getTime()
        );
      }
      setNotifications(notifs ?? []);
      setUnreadNotifications(
        notifs?.filter((n: NotificationType) => !n.read).length ?? 0
      );
    } catch (error) {
      console.error(error);
    }
  };

  const deleteAllNotifications = async () => {
    for (const notification of notifications) {
      await supabase.from("notifications").delete().eq("id", notification.id);
    }
    await updateNotifications();
  };

  const markAllAsRead = async () => {
    for (const notification of notifications) {
      await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notification.id);
    }
    await updateNotifications();
  };

  useEffect(() => {
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        () => {
          void updateNotifications();
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    void (async () => {
      await updateNotifications();
    })();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="gap-y-0.5 w-full max-w-md">
        {notifications.length === 0 ? (
          <DropdownMenuLabel className="text-center">
            You have no notifications
          </DropdownMenuLabel>
        ) : (
          <DropdownMenuLabel>
            <div className="flex items-center justify-between">
              <span className="text-xl">Notifications</span>
              <span className="flex gap-x-1 items-center">
                <Button
                  variant="link"
                  onClick={() => void markAllAsRead()}
                  disabled={unreadNotifications === 0}
                >
                  Mark all as read
                </Button>
                <span>|</span>
                <Button
                  variant="link"
                  onClick={() => void deleteAllNotifications()}
                  disabled={notifications.length === 0}
                >
                  Delete all
                </Button>
              </span>
            </div>
          </DropdownMenuLabel>
        )}
        <DropdownMenuSeparator />
        {notifications.map((notification, i) => (
          <Notification
            key={i}
            notification={notification}
            lastNotification={i === notifications.length - 1}
            updateNotifications={updateNotifications}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
