import NavBar from "@/components/layout/navbar";
import SiteFooter from "@/components/layout/site-footer";
import { homeNavConfig } from "@/lib/config/navigation";
import { createClient } from "@/lib/supabase/server";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function HomeLayout({
  children,
}: MarketingLayoutProps): Promise<JSX.Element> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar user={user} items={homeNavConfig.mainNav} scroll={true} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
