"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { PropsWithChildren, useEffect } from "react";
import { Toaster } from "sonner";

import { FromConnectionsProvider } from "@/app/(dashboard)/chat/[chatId]/components/ActionsBar/components/KnowledgeToFeed/components/FromConnections/FromConnectionsProvider/FromConnection-provider";
import { BrainCreationProvider } from "@/components/modals/AddBrainModal/brain-creation-provider";
import "@/lib/config/LocaleConfig/i18n";
import {
  BrainProvider,
  ChatProvider,
  KnowledgeToFeedProvider,
} from "@/lib/context";
import { useBrainContext } from "@/lib/context/BrainProvider/hooks/useBrainContext";
import { ChatsProvider } from "@/lib/context/ChatsProvider";
import { OnboardingProvider } from "@/lib/context/OnboardingProvider/onboarding-provider";
import { useSupabase } from "@/lib/context/SupabaseProvider";
import { UserSettingsProvider } from "@/lib/context/UserSettingsProvider/user-settings-provider";

const queryClient = new QueryClient();

// This wrapper is used to make effect calls at a high level in app rendering.
const AppWrapper = ({ children }: PropsWithChildren): JSX.Element => {
  const { fetchAllBrains } = useBrainContext();
  const { session } = useSupabase();

  useEffect(() => {
    if (session?.user) {
      void fetchAllBrains();
    }
  }, [session]);

  return (
    <NextThemesProvider attribute="class" defaultTheme="light">
      <Toaster richColors closeButton className="dark:hidden" />
      <Toaster
        richColors
        closeButton
        theme="dark"
        className="hidden dark:block"
      />
      {children}
    </NextThemesProvider>
  );
};

export default function Providers({
  children,
}: PropsWithChildren): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <UserSettingsProvider>
        <BrainProvider>
          <KnowledgeToFeedProvider>
            <BrainCreationProvider>
              <OnboardingProvider>
                <FromConnectionsProvider>
                  <ChatsProvider>
                    <ChatProvider>
                      <AppWrapper>{children}</AppWrapper>
                    </ChatProvider>
                  </ChatsProvider>
                </FromConnectionsProvider>
              </OnboardingProvider>
            </BrainCreationProvider>
          </KnowledgeToFeedProvider>
        </BrainProvider>
      </UserSettingsProvider>
    </QueryClientProvider>
  );
}
