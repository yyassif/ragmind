import { Trash, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import Spinner from "@/components/spinner";
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
  isDisabled: boolean;
  isDeletePending: boolean;
}

export default function DeleteKnowledgeItem({
  isOpen,
  setOpen,
  onConfirm,
  isDisabled,
  isDeletePending,
}: DeleteBrainButtonProps): JSX.Element {
  const { t } = useTranslation(["delete_or_unsubscribe_from_brain"]);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="destructive"
          className="h-8 w-8"
          title="Delete"
          disabled={isDisabled}
        >
          <span className="sr-only">Delete</span>
          <Trash className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("deleteConfirmQuestion")}</DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex !justify-between items-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeletePending}
          >
            {t("returnButton")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => onConfirm()}
            disabled={isDeletePending}
          >
            {isDeletePending ? (
              <Spinner className="h-4 w-4 mr-2" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            <span>{t("deleteConfirmYes")}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
