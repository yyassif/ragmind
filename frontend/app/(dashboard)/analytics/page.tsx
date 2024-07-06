"use client";

import { Fragment } from "react";

import { AddBrainModal } from "@/components/modals/AddBrainModal";
import { OnboardingModal } from "@/components/modals/OnboardingModal/OnboardingModal";
import { UploadDocumentModal } from "@/components/modals/UploadDocumentModal/UploadDocumentModal";
import LanguageSwitcher from "@/components/partial/LanguageSwitcher";
import PageHeader from "@/components/partial/PageHeader";
import ThemeSwitcher from "@/components/partial/ThemeSwitcher";

import Analytics from "./components/Analytics/Analytics";

export default function AnalyticsPage(): JSX.Element {
  return (
    <Fragment>
      <PageHeader title="Analytics" showNotifications>
        <AddBrainModal />
        <UploadDocumentModal />
        <OnboardingModal />
        <LanguageSwitcher />
        <ThemeSwitcher />
      </PageHeader>
      <div className="p-4">
        <Analytics />
      </div>
    </Fragment>
  );
}
