"use client";

import { User } from "@supabase/supabase-js";

import useScroll from "@/lib/hooks/useScroll";
import { MainNavItem } from "@/lib/types/MainNavItem";
import { cn } from "@/lib/utils";

import { MainNav } from "./main-nav";
import { UserAccountNav } from "./user-account-nav";

interface NavBarProps {
  user?: User | null;
  items?: MainNavItem[];
  children?: React.ReactNode;
  rightElements?: React.ReactNode;
  scroll?: boolean;
}

export default function NavBar({
  user,
  items,
  children,
  rightElements,
  scroll = false,
}: NavBarProps): JSX.Element {
  const scrolled = useScroll(50);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex w-full justify-center bg-background/60 backdrop-blur-xl transition-all",
        scroll ? (scrolled ? "border-b" : "bg-background/0") : "border-b"
      )}
    >
      <div className="flex h-16 w-full items-center justify-between p-4">
        <MainNav items={items}>{children}</MainNav>

        <div className="flex items-center space-x-3">
          {rightElements}
          <UserAccountNav user={user} />
        </div>
      </div>
    </header>
  );
}
