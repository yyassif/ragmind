import { Trash } from "lucide-react";
import { useEffect, useState } from "react";

import {
  BrainRoleAssignation,
  BrainRoleType,
  userRoleToAssignableRoles,
} from "@/app/(dashboard)/studio/[brainId]/BrainManagementTabs/components/PeopleTab/BrainUsers/types";
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

type UserToInviteProps = {
  onChange: (newRole: BrainRoleAssignation) => void;
  removeCurrentInvitation?: () => void;
  roleAssignation: BrainRoleAssignation;
};

export const UserToInvite = ({
  onChange,
  removeCurrentInvitation,
  roleAssignation,
}: UserToInviteProps): JSX.Element => {
  const [selectedRole, setSelectedRole] = useState<BrainRoleType>(
    roleAssignation.role
  );
  const [email, setEmail] = useState(roleAssignation.email);

  useEffect(() => {
    if (
      email !== roleAssignation.email ||
      selectedRole !== roleAssignation.role
    ) {
      onChange({
        ...roleAssignation,
        email,
        role: selectedRole,
      });
    }
  }, [email, onChange, roleAssignation, selectedRole]);

  return (
    <div className="w-full flex items-center py-1">
      <div className="flex flex-1 gap-2 pr-2">
        <Button
          type="submit"
          size="icon"
          variant="destructive"
          title="Delete"
          onClick={removeCurrentInvitation}
        >
          <span className="sr-only">Delete</span>
          <Trash className="h-4 w-4" />
        </Button>
        <Input
          id="email"
          placeholder="Email"
          className="h-10"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="w-32">
        <Select
          onValueChange={(e) => setSelectedRole(e as BrainRoleType)}
          defaultValue={selectedRole}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Roles</SelectLabel>
              {userRoleToAssignableRoles["Owner"].map((role) => (
                <SelectItem
                  key={role.value}
                  value={role.value}
                  className="cursor-pointer font-medium"
                >
                  {role.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
