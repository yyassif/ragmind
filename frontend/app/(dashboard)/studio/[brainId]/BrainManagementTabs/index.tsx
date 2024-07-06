/* eslint-disable max-lines */

import { useEffect, useState } from "react";

import Spinner from "@/components/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Knowledge } from "@/lib/types/Knowledge";

import KnowledgeTab from "./components/KnowledgeTab/KnowledgeTab";
import { useAddedKnowledge } from "./components/KnowledgeTab/hooks/useAddedKnowledge";
import PeopleTab from "./components/PeopleTab/PeopleTab";
import PromptTab from "./components/PromptTab/PromptTab";
import SettingsTab from "./components/SettingsTab/SettingsTab";
import { useBrainFetcher } from "./hooks/useBrainFetcher";
import { useBrainManagementTabs } from "./hooks/useBrainManagementTabs";

export const BrainManagementTabs = (): JSX.Element => {
  const [knowledgeTabDisabled, setKnowledgeTabDisabled] =
    useState<boolean>(false);
  const { brainId, hasEditRights } = useBrainManagementTabs();
  const { allKnowledge } = useAddedKnowledge({ brainId: brainId ?? undefined });
  const { brain, isLoading } = useBrainFetcher({
    brainId,
  });

  const isKnowledgeTabDisabled = (): boolean => {
    return (
      !hasEditRights ||
      (brain?.integration_description?.max_files === 0 &&
        brain.brain_type !== "doc")
    );
  };

  useEffect(() => {
    setKnowledgeTabDisabled(isKnowledgeTabDisabled());
  }, [hasEditRights]);

  if (!brainId) {
    return (
      <div>
        <div className="flex flex-col space-y-2 text-center sm:text-left px-4 py-2">
          <h3 className="text-lg font-semibold">
            Ooups, Looks like you hit the wrong Brain!
          </h3>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-full p-4 max-w-full max-h-full">
        <div className="flex flex-col space-y-2 text-center sm:text-left px-4 py-2">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <Tabs defaultValue="settings">
      <div className="m-0 p-4">
        <TabsList className="w-full py-2">
          <TabsTrigger
            value="settings"
            className="text-zinc-600 dark:text-zinc-200"
          >
            Settings
          </TabsTrigger>
          <TabsTrigger
            value="prompt"
            className="text-zinc-600 dark:text-zinc-200"
          >
            Prompt
          </TabsTrigger>
          <TabsTrigger
            disabled={!hasEditRights}
            value="people"
            className="text-zinc-600 dark:text-zinc-200"
          >
            People
          </TabsTrigger>
          <TabsTrigger
            disabled={knowledgeTabDisabled}
            value="knowledge"
            className="text-zinc-600 dark:text-zinc-200"
          >
            {`Knowledge${allKnowledge && allKnowledge.length > 1 ? "s" : ""} (${
              allKnowledge?.length
            })`}
          </TabsTrigger>
        </TabsList>
        <ScrollArea className="h-[100vh_-_52px]">
          <TabsContent value="settings" className="m-0 p-2">
            <SettingsTab brainId={brainId} />
          </TabsContent>
          <TabsContent value="prompt" className="m-0 p-2">
            <PromptTab brainId={brainId} />
          </TabsContent>
          <TabsContent value="people" className="m-0 p-2">
            <PeopleTab brainId={brainId} />
          </TabsContent>
          <TabsContent value="knowledge" className="m-0 p-2">
            <KnowledgeTab
              brainId={brainId}
              hasEditRights={hasEditRights}
              allKnowledge={allKnowledge as Knowledge[]}
            />
          </TabsContent>
        </ScrollArea>
      </div>
    </Tabs>
  );
};
