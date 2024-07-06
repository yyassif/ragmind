"use client";

import { Info } from "lucide-react";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

import { BrainCard } from "@/components/modals/AddBrainModal/components/BrainCard/BrainCard";
import { CVAssistantModal } from "@/components/modals/CVAssistantModal/CVAssistantModal";
import { SummaryAssistantModal } from "@/components/modals/SummaryAssistantModal/SummaryAssistantModal";
import LanguageSwitcher from "@/components/partial/LanguageSwitcher";
import PageHeader from "@/components/partial/PageHeader";
import ThemeSwitcher from "@/components/partial/ThemeSwitcher";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Assistant } from "@/lib/api/assistants/types";
import { useAssistants } from "@/lib/api/assistants/useAssistants";
import { useSupabase } from "@/lib/context/SupabaseProvider";
import { redirectToLogin } from "@/lib/router/redirectToLogin";

export default function AssistansPage(): JSX.Element {
  const pathname = usePathname();
  const { session } = useSupabase();
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [assistantModalOpened, setAssistantModalOpened] =
    useState<boolean>(false);
  const [currentAssistant, setCurrentAssistant] = useState<Assistant | null>(
    null
  );
  const { getAssistants } = useAssistants();

  useEffect(() => {
    if (session === null) {
      return redirectToLogin();
    }

    void (async () => {
      try {
        const res = await getAssistants();
        if (res) {
          setAssistants(res);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [pathname, session]);

  return (
    <Fragment>
      <PageHeader title="Assistants" showNotifications>
        <LanguageSwitcher />
        <ThemeSwitcher />
      </PageHeader>
      <div className="p-4">
        <div className="flex flex-col gap-4 p-5">
          <div className="w-full">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Info</AlertTitle>
              <AlertDescription className="flex flex-col gap-1">
                <span>
                  A RAGMind Assistant is an AI-driven agent that apply specific
                  processes to an input in order to generate a usable output.
                </span>
                <span>
                  For the moment, you can try the summary assistant, that
                  summarizes a document and send the result by email or upload
                  it in one of your brains.
                </span>
              </AlertDescription>
            </Alert>
          </div>
          <div className="flex gap-2 flex-wrap">
            {assistants.map((assistant) => {
              return (
                <BrainCard
                  tooltip={assistant.description}
                  brainName={assistant.name}
                  tags={assistant.tags}
                  imageUrl={assistant.icon_url}
                  callback={() => {
                    setAssistantModalOpened(true);
                    setCurrentAssistant(assistant);
                  }}
                  key={assistant.name}
                  cardKey={assistant.name}
                />
              );
            })}
          </div>
        </div>
      </div>
      {currentAssistant &&
        currentAssistant.name.toLowerCase() === "summary" && (
          <SummaryAssistantModal
            isOpen={assistantModalOpened}
            setIsOpen={setAssistantModalOpened}
            assistant={currentAssistant}
          />
        )}
      {currentAssistant &&
        currentAssistant.name.toLowerCase() === "cv-ranker" && (
          <CVAssistantModal
            isOpen={assistantModalOpened}
            setIsOpen={setAssistantModalOpened}
            assistant={currentAssistant}
          />
        )}
    </Fragment>
  );
}
