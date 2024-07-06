"use client";

import LogOutModal from "@/components/modals/LogOutModal";
import PageHeader from "@/components/partial/PageHeader";
import { Tabs } from "@/components/ui/tabs";
import { useUserData } from "@/lib/hooks/useUserData";

import SettingsTab from "./components/SettingsTab/SettingsTab";

export default function UserPage(): JSX.Element {
  const { userData } = useUserData();

  return (
    <Tabs defaultValue="settings">
      <PageHeader title="Profile Settings" showNotifications>
        <LogOutModal />
      </PageHeader>
      <div className="m-0 p-2 mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <SettingsTab email={userData?.email ?? "unknown@email.com"} />
      </div>
    </Tabs>
  );
}
