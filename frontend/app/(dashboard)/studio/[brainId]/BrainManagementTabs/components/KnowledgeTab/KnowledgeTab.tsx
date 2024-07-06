"use client";

import { UUID } from "crypto";
import { AnimatePresence, motion } from "framer-motion";
import { DatabaseZap, Loader, RocketIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useKnowledgeToFeedContext } from "@/lib/context/KnowledgeToFeedProvider/hooks/useKnowledgeToFeedContext";
import { Knowledge } from "@/lib/types/Knowledge";

import KnowledgeTable from "./KnowledgeTable/KnowledgeTable";
import { useAddedKnowledge } from "./hooks/useAddedKnowledge";

type KnowledgeTabProps = {
  brainId: UUID;
  hasEditRights: boolean;
  allKnowledge: Knowledge[];
};
export default function KnowledgeTab({
  brainId,
  allKnowledge,
}: KnowledgeTabProps): JSX.Element {
  const { isPending } = useAddedKnowledge({
    brainId,
  });
  const { setShouldDisplayFeedCard } = useKnowledgeToFeedContext();

  if (isPending) {
    return (
      <div className="flex flex-col space-y-2 text-center sm:text-left px-4 py-2 w-full">
        <h3 className="text-lg font-semibold">Loading...</h3>
        <Loader className="animate-spin py-2 h-4 w-4" />
      </div>
    );
  }

  if (allKnowledge.length === 0) {
    return (
      <div className="flex w-full gap-4 justify-center">
        <Alert>
          <RocketIcon className="h-4 w-4" />
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>
            <span className="flex items-center">
              This brain is empty! You can add knowledge by clicking on
              <Button
                variant="outline"
                className="h-7 mx-2"
                onClick={() => setShouldDisplayFeedCard(true)}
              >
                <DatabaseZap className="h-4 w-4 mr-2" />
                <span>Add Knowledge</span>
              </Button>{" "}
              to get started.
            </span>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex w-full gap-4 justify-center">
      <motion.div layout className="w-full flex flex-col gap-5">
        <AnimatePresence mode="popLayout">
          <KnowledgeTable knowledgeList={allKnowledge} />
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
