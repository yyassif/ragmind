"use client";

import { UUID } from "crypto";
import { useEffect } from "react";

import { AddBrainModal } from "@/components/modals/AddBrainModal";
import { UploadDocumentModal } from "@/components/modals/UploadDocumentModal/UploadDocumentModal";
import LanguageSwitcher from "@/components/partial/LanguageSwitcher";
import PageHeader from "@/components/partial/PageHeader";
import ThemeSwitcher from "@/components/partial/ThemeSwitcher";
import { useChatContext } from "@/lib/context";
import { useBrainContext } from "@/lib/context/BrainProvider/hooks/useBrainContext";
import { useCustomDropzone } from "@/lib/hooks/useDropzone";

import { ActionsBar } from "./components/ActionsBar";
import { ChatDialogueArea } from "./components/ChatDialogueArea/ChatDialogue";
import ManageCurrentBrainButton from "./components/ManageCurrentBrain";
import { useChatNotificationsSync } from "./hooks/useChatNotificationsSync";

export default function SelectedChatPage(): JSX.Element {
  const { currentBrain, setCurrentBrainId } = useBrainContext();
  const { getRootProps } = useCustomDropzone();
  const { messages } = useChatContext();

  useChatNotificationsSync();

  useEffect(() => {
    if (!currentBrain && messages.length > 0) {
      setCurrentBrainId(messages[messages.length - 1].brain_id as UUID);
    }
  }, [messages]);

  return (
    <div className="w-full h-full">
      <PageHeader title="Brain">
        <AddBrainModal />
        {!!currentBrain?.max_files && <UploadDocumentModal />}
        <ManageCurrentBrainButton pathname={`/studio/${currentBrain?.id}`} />
        <LanguageSwitcher />
        <ThemeSwitcher />
      </PageHeader>
      <div
        className="flex h-[calc(100%_-_52px)] w-full p-4 overflow-hidden"
        data-testid="chat-page"
        {...getRootProps()}
      >
        <div className="flex flex-row h-full w-full">
          <div className="flex flex-col grow items-center justify-stretch w-full h-full overflow-hidden gap-4 p-4 pt-0 dark:bg-black transition-colors ease-out duration-500">
            <div className="flex flex-col flex-1 w-full max-w-4xl h-full dark:shadow-primary/25 overflow-hidden">
              <div className="flex flex-1 flex-col overflow-y-auto">
                <ChatDialogueArea />
              </div>
              <ActionsBar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
