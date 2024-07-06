import { Trash } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DeleteBrainButtonProps {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  onConfirm: () => void;
  isOwnedByCurrentUser: boolean;
  isDeleteOrUnsubscribeRequestPending: boolean;
}

export default function DeleteBrainButton({
  isOpen,
  setOpen,
  onConfirm,
  isOwnedByCurrentUser,
  isDeleteOrUnsubscribeRequestPending,
}: DeleteBrainButtonProps): JSX.Element {
  const { t } = useTranslation(["delete_or_unsubscribe_from_brain"]);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="h-8 w-8 p-0">
          <span className="sr-only">Delete</span>
          <Trash className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isOwnedByCurrentUser
              ? t("deleteConfirmQuestion")
              : t("unsubscribeConfirmQuestion")}
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex sm:justify-between items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="sm:w-1/2"
            onClick={() => setOpen(false)}
            disabled={isDeleteOrUnsubscribeRequestPending}
          >
            {t("returnButton")}
          </Button>
          <Button
            disabled={isDeleteOrUnsubscribeRequestPending}
            type="button"
            variant="destructive"
            className="sm:w-1/2"
            onClick={() => onConfirm()}
          >
            {isOwnedByCurrentUser
              ? t("deleteConfirmYes")
              : t("unsubscribeButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
