"use client";

import {
  AreaChart,
  BotMessageSquare,
  Cable,
  LayoutDashboard,
  Repeat2,
  Sparkle,
  Sprout,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { useChatsList } from "@/app/(dashboard)/chat/[chatId]/hooks/useChatsList";
import Navigation from "@/app/(dashboard)/components/Navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface PortalLayoutProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  children: React.ReactNode;
}

export default function PortalLayout({
  defaultLayout = [20, 40, 40],
  defaultCollapsed = false,
  navCollapsedSize,
  children,
}: PortalLayoutProps): JSX.Element {
  const [isCollapsed, setIsCollapsed] =
    React.useState<boolean>(defaultCollapsed);
  const pathname = usePathname();

  useChatsList();

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-full max-h-[1200px] items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          onResize={(size) => {
            setIsCollapsed(size === 4);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              size === 4
            )}`;
          }}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          className={cn(
            isCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
        >
          <div
            className={cn(
              "flex h-[52px] items-center justify-center px-2",
              isCollapsed ? "h-[52px]" : "px-2"
            )}
          >
            <Link href="/search">
              <Avatar className="h-12 w-12">
                <AvatarImage width={48} height={48} src="/assets/logo.webp" />
                <AvatarFallback>RAG</AvatarFallback>
              </Avatar>
            </Link>
          </div>
          <Separator />
          <Navigation
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Home",
                label: "",
                icon: LayoutDashboard,
                variant: pathname.includes("/search") ? "default" : "ghost",
                link: "/search",
              },
              {
                title: "Studio",
                label: "3+",
                icon: Sprout,
                variant: pathname.includes("/studio") ? "default" : "ghost",
                link: "/studio",
              },
              {
                title: "Chats",
                label: "10+",
                icon: Repeat2,
                variant: pathname.includes("/chat") ? "default" : "ghost",
                link: "/chat",
              },
              {
                title: "Assistants",
                label: "2",
                icon: BotMessageSquare,
                variant: pathname.includes("/assistants") ? "default" : "ghost",
                link: "/assistants",
              },
              {
                title: "Connections",
                label: "",
                icon: Cable,
                variant: pathname.includes("/connections")
                  ? "default"
                  : "ghost",
                link: "/connections",
              },
              {
                title: "Analytics",
                label: "",
                icon: AreaChart,
                variant: pathname.includes("/analytics") ? "default" : "ghost",
                link: "/analytics",
              },
              {
                title: "Profile",
                label: "",
                icon: Sparkle,
                variant: pathname.includes("/user") ? "default" : "ghost",
                link: "/user",
              },
            ]}
          />
          <Separator />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <div className="w-full h-full">{children}</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
