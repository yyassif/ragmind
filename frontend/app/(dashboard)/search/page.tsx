"use client";

import { RocketIcon } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

import { AddBrainModal } from "@/components/modals/AddBrainModal";
import { useBrainCreationContext } from "@/components/modals/AddBrainModal/brain-creation-provider";
import { OnboardingModal } from "@/components/modals/OnboardingModal/OnboardingModal";
import LanguageSwitcher from "@/components/partial/LanguageSwitcher";
import PageHeader from "@/components/partial/PageHeader";
import ThemeSwitcher from "@/components/partial/ThemeSwitcher";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useOnboardingContext } from "@/lib/context/OnboardingProvider/hooks/useOnboardingContext";
import { useSupabase } from "@/lib/context/SupabaseProvider";
import { useUserData } from "@/lib/hooks/useUserData";
import { redirectToLogin } from "@/lib/router/redirectToLogin";

import { SearchBar } from "./components/SearchBar";

export default function SearchPage(): JSX.Element {
  const [isUserDataFetched, setIsUserDataFetched] = useState<boolean>(false);
  const { isBrainCreationModalOpened } = useBrainCreationContext();
  const { isBrainCreated } = useOnboardingContext();
  const pathname = usePathname();
  const { session } = useSupabase();
  const { userIdentityData } = useUserData();

  useEffect(() => {
    if (userIdentityData) {
      setIsUserDataFetched(true);
    }
  }, [userIdentityData]);

  useEffect(() => {
    if (session === null) {
      redirectToLogin();
    }
  }, [pathname, session]);

  return (
    <Fragment>
      <PageHeader title="Search" showNotifications>
        <AddBrainModal />
        <OnboardingModal />
        <LanguageSwitcher />
        <ThemeSwitcher />
      </PageHeader>
      <div className="p-4">
        <div className="w-full h-full flex flex-col justify-center items-center p-2">
          <div className="w-full flex-1 gap-4 space-y-4">
            <div className="flex flex-col my-4 space-y-4 justify-center items-center">
              <Image
                src="/assets/quick_chat.svg"
                width={192}
                height={192}
                alt="RAGMind Logo"
              />
              <div className="text-4xl text-accent-foreground font-heading">
                <span>Talk to</span>
                <span className="text-indigo-600 font-semibold">
                  &nbsp;RAGMind
                </span>
              </div>
            </div>
            <div className="w-full">
              <SearchBar />
            </div>
          </div>
          <div className="flex p-4 my-6 flex-col space-y-4 bg-accent text-accent-foreground rounded-xl select-none">
            <div className="flex">
              <span>Press&nbsp;</span>
              <span className="text-indigo-600 font-bold">@</span>
              <span>&nbsp;Select a brain</span>
            </div>
          </div>
        </div>
      </div>
      {!isBrainCreationModalOpened &&
        !userIdentityData?.onboarded &&
        !isBrainCreated &&
        !!isUserDataFetched && (
          <div className="p-4 flex w-full gap-4 justify-center">
            <Alert className="w-full">
              <RocketIcon className="h-4 w-4" />
              <AlertTitle>Tutorial</AlertTitle>
              <AlertDescription>
                <div className="flex flex-col">
                  <span>Welcome {userIdentityData?.username}!</span>
                  <span>
                    We will guide you through your RAGMind adventure and the
                    creation of your first brain.
                  </span>
                  <span className="font-bold">
                    First, Press the Create Brain button on the top right corner
                    to create your first brain.
                  </span>
                </div>
                <AddBrainModal />
              </AlertDescription>
            </Alert>
          </div>
        )}
    </Fragment>
  );
}
