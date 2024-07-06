import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import DashboardLayout from "./components/DashboardLayout";

export default async function MainDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {
  const defaultCookies = cookies();
  const layout = defaultCookies.get("react-resizable-panels:layout");
  const collapsed = defaultCookies.get("react-resizable-panels:collapsed");
  const defaultLayout: number[] | undefined = layout?.value
    ? JSON.parse(layout.value)
    : undefined;
  const defaultCollapsed: boolean | undefined =
    collapsed?.value && collapsed.value !== "undefined"
      ? JSON.parse(`${collapsed.value}`)
      : undefined;
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col h-screen">
      <DashboardLayout
        defaultLayout={defaultLayout}
        defaultCollapsed={defaultCollapsed}
        navCollapsedSize={4}
      >
        {children}
      </DashboardLayout>
    </div>
  );
}
