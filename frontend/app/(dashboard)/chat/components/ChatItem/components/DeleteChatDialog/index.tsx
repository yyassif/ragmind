"use client";

import { Trash } from "lucide-react";
import { useState } from "react";

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DeleteChatButtonProps {
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function DeleteChatButton({
  onConfirm,
  isLoading,
}: DeleteChatButtonProps): JSX.Element {
  const [isOpened, setIsOpened] = useState<boolean>(false);

  return (
    <Dialog open={isOpened} onOpenChange={setIsOpened}>
      <DialogTrigger asChild>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="h-8 w-8 p-0"
                variant="outline"
                onClick={() => setIsOpened(true)}
              >
                <Trash className="h-4 w-4 text-red-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Delete</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Chat</DialogTitle>
          <DialogDescription>
            Delete your chat. This action is irreversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex !justify-between items-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpened(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              void onConfirm();
              setIsOpened(false);
            }}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
