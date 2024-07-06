import { AvatarProps } from "@radix-ui/react-avatar";
import { User } from "@supabase/supabase-js";
import { User as UserIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "user_metadata" | "email">;
}

export function UserAvatar({ user, ...props }: UserAvatarProps): JSX.Element {
  const user_metadata = user.user_metadata;

  return (
    <Avatar {...props}>
      {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
      {user_metadata ? (
        <AvatarImage
          alt="Picture"
          src={user_metadata.avatar_url}
          referrerPolicy="no-referrer"
        />
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user.email}</span>
          <UserIcon className="h-4 w-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
}
