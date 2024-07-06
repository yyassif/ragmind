import { MainNavItem } from "@/lib/types/MainNavItem";

export type HomeNavConfig = {
  mainNav: MainNavItem[];
};

export const homeNavConfig: HomeNavConfig = {
  mainNav: [
    {
      title: "Pricing",
      href: "/pricing",
    },
    {
      title: "Blog",
      href: "/blog",
      disabled: true,
    },
    {
      title: "Open Startup",
      href: "/open",
    },
    {
      title: "Documentation",
      href: "/docs",
      disabled: true,
    },
  ],
};
