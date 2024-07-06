import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLogoutModal } from "@/lib/hooks/useLogoutModal";

export default function LogOutModal(): JSX.Element {
  const { t } = useTranslation(["translation", "logout"]);
  const {
    handleLogout,
    isLoggingOut,
    isLogoutModalOpened,
    setIsLogoutModalOpened,
  } = useLogoutModal();

  return (
    <Dialog open={isLogoutModalOpened} onOpenChange={setIsLogoutModalOpened}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="h-10">
          <LogOut className="h-4 w-4 mr-2" />
          <span>Logout</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("areYouSure", { ns: "logout" })}</DialogTitle>
          <DialogDescription>Logging out securely.</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex items-center sm:justify-between gap-2">
          <Button
            type="button"
            variant="default"
            className="sm:w-1/2"
            onClick={() => setIsLogoutModalOpened(false)}
          >
            {t("cancel", { ns: "logout" })}
          </Button>
          <Button
            type="button"
            className="sm:w-1/2"
            variant="destructive"
            disabled={isLoggingOut}
            onClick={() => void handleLogout()}
          >
            {t("logoutButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
