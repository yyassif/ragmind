import { CircleMinus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBrainContext } from "@/lib/context/BrainProvider/hooks/useBrainContext";
import { cn } from "@/lib/utils";

import { useBrainUser } from "./hooks/useBrainUser";

import { availableRoles, BrainRoleType } from "../types";

type BrainUserProps = {
  email: string;
  role: BrainRoleType;
  brainId: string;
  fetchBrainUsers: () => Promise<void>;
};

export const BrainUser = ({
  email,
  role,
  brainId,
  fetchBrainUsers,
}: BrainUserProps): JSX.Element => {
  const {
    isRemovingAccess,
    canRemoveAccess,
    selectedRole,
    removeUserAccess,
    updateSelectedRole,
  } = useBrainUser({
    fetchBrainUsers: fetchBrainUsers,
    role,
    brainId,
    email,
  });
  const { currentBrain } = useBrainContext();
  const { t } = useTranslation();

  return (
    <div
      className="w-full flex items-center py-1"
      data-testid="assignation-row"
    >
      <div className="grid flex-1 gap-2">
        {canRemoveAccess && (
          <Button
            type="submit"
            size="icon"
            variant="destructive"
            title="Delete"
            disabled={isRemovingAccess}
            className={cn(
              isRemovingAccess ? "animate-pulse opacity-90" : "cursor-pointer"
            )}
            onClick={() => void removeUserAccess()}
          >
            <span className="sr-only">Delete</span>
            <CircleMinus className="h-4 w-4" />
          </Button>
        )}
        <Input
          id="email"
          name="email"
          data-testid="role-assignation-email-input"
          className="h-9"
          value={email}
          placeholder={t("email")}
          readOnly
        />
      </div>
      <div className="w-32">
        <Select
          defaultValue={selectedRole}
          onValueChange={(e) => void updateSelectedRole(e as BrainRoleType)}
          disabled={currentBrain?.role !== "Owner" && selectedRole === "Owner"}
        >
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Roles</SelectLabel>
              {availableRoles.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
