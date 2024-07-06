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

type DeleteOrUnsubscribeConfirmationModalProps = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  onConfirm: () => void;
  isOwnedByCurrentUser: boolean;
  isDeleteOrUnsubscribeRequestPending: boolean;
};

export default function DeleteOrUnsubscribeConfirmationModal({
  isOpen,
  setOpen,
  onConfirm,
  isOwnedByCurrentUser,
  isDeleteOrUnsubscribeRequestPending,
}: DeleteOrUnsubscribeConfirmationModalProps): JSX.Element {
  const { t } = useTranslation(["delete_or_unsubscribe_from_brain"]);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash className="h-4 w-4 mr-2" />
          <span>
            {isOwnedByCurrentUser ? "Delete Brain" : "Unsubscribe from Brain"}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[568px]">
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
