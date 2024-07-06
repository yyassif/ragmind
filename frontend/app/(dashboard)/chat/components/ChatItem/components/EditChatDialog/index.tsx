"use client";

import { FileEdit } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EditChatDialogProps {
  initialChatName: string;
  onChange: (name: string) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function EditChatDialog({
  onConfirm,
  onChange,
  isLoading,
  initialChatName,
}: EditChatDialogProps): JSX.Element {
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
                <FileEdit className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Edit</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Chat Name</DialogTitle>
          <DialogDescription>
            Change the name of your chat whenever you want.
          </DialogDescription>
        </DialogHeader>
        <div className="p-4 w-full">
          <Input
            type="text"
            value={initialChatName}
            placeholder="Chat Name"
            onChange={(e) => onChange(e.target.value)}
            className="w-full"
          />
        </div>
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
            onClick={() => {
              void onConfirm();
              setIsOpened(false);
            }}
          >
            {isLoading ? "Please wait..." : "Change Name"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
