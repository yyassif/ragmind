import { UUID } from "crypto";
import { Brain, Trash2 } from "lucide-react";
import { useEffect, useMemo } from "react";

import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSync } from "@/lib/api/sync/useSync";
import { Icon } from "@/lib/components/ui/Icon/Icon";
import { requiredRolesForUpload } from "@/lib/config/upload";
import { useBrainContext } from "@/lib/context/BrainProvider/hooks/useBrainContext";
import { useKnowledgeToFeedContext } from "@/lib/context/KnowledgeToFeedProvider/hooks/useKnowledgeToFeedContext";
import { cn } from "@/lib/utils";

import { FromConnections } from "./components/FromConnections/FromConnections";
import { useFromConnectionsContext } from "./components/FromConnections/FromConnectionsProvider/hooks/useFromConnectionContext";
import { FromDocuments } from "./components/FromDocuments/FromDocuments";
import { FromWebsites } from "./components/FromWebsites/FromWebsites";
import { formatMinimalBrainsToSelectComponentInput } from "./utils/formatMinimalBrainsToSelectComponentInput";

export default function KnowledgeToFeed({
  hideBrainSelector,
}: {
  hideBrainSelector?: boolean;
}): JSX.Element {
  const { allBrains, setCurrentBrainId, currentBrainId, currentBrain } =
    useBrainContext();
  const { openedConnections, setOpenedConnections, setCurrentSyncId } =
    useFromConnectionsContext();
  const { knowledgeToFeed, removeKnowledgeToFeed } =
    useKnowledgeToFeedContext();
  const { getActiveSyncsForBrain } = useSync();

  const brainsWithUploadRights = formatMinimalBrainsToSelectComponentInput(
    useMemo(
      () =>
        allBrains.filter(
          (brain) =>
            requiredRolesForUpload.includes(brain.role) && !!brain.max_files
        ),
      [allBrains]
    )
  );

  useEffect(() => {
    if (currentBrain) {
      void (async () => {
        try {
          const res = await getActiveSyncsForBrain(currentBrain.id);
          setCurrentSyncId(undefined);
          setOpenedConnections(
            res.map((sync) => ({
              user_sync_id: sync.syncs_user_id,
              id: sync.id,
              provider: sync.syncs_user.provider,
              submitted: true,
              selectedFiles: {
                files: [
                  ...(sync.settings.folders?.map((folder) => ({
                    id: folder,
                    name: undefined,
                    is_folder: true,
                  })) ?? []),
                  ...(sync.settings.files?.map((file) => ({
                    id: file,
                    name: undefined,
                    is_folder: false,
                  })) ?? []),
                ],
              },
              name: sync.name,
              last_synced: sync.last_synced,
            }))
          );
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [currentBrainId]);

  return (
    <div className="flex flex-col w-full gap-4 overflow-hidden p-1">
      {!hideBrainSelector && (
        <div className="w-full">
          <Select
            defaultValue={currentBrain ? currentBrain.id : undefined}
            onValueChange={(e) => void setCurrentBrainId(e as UUID)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a Brain" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Brains</SelectLabel>
                {brainsWithUploadRights.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    className="cursor-pointer font-medium"
                  >
                    <div className="flex flex-row items-center justify-start w-full">
                      <Brain className="h-4 w-4 mr-2" />
                      <span>{item.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}
      <Tabs defaultValue="connections" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="connections">
            From Connections
            <span className="ml-2">
              {
                openedConnections.filter((connection) => connection.submitted)
                  .length
              }
            </span>
          </TabsTrigger>
          <TabsTrigger value="documents">
            From Documents
            <span className="ml-2">
              {
                knowledgeToFeed.filter(
                  (knowledge) => knowledge.source === "upload"
                ).length
              }
            </span>
          </TabsTrigger>
          <TabsTrigger value="websites">
            From Websites
            <span className="ml-2">
              {
                knowledgeToFeed.filter(
                  (knowledge) => knowledge.source === "crawl"
                ).length
              }
            </span>
          </TabsTrigger>
        </TabsList>
        <div className="mt-4">
          <TabsContent value="connections">
            <FromConnections />
          </TabsContent>
          <TabsContent value="documents">
            <FromDocuments />
          </TabsContent>
          <TabsContent value="websites">
            <FromWebsites />
          </TabsContent>
        </div>
      </Tabs>

      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="maxTokens">Knowledges to upload</Label>
          <span className="w-12 rounded-md border border-transparent py-0.5 text-right text-sm text-muted-foreground hover:border-border">
            {knowledgeToFeed.length}
          </span>
        </div>

        <div className="py-1 flex w-full overflow-scroll flex-col gap-1 flex-grow">
          {knowledgeToFeed.length > 0 &&
            knowledgeToFeed.map((knowledge, index) => (
              <div
                key={index}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "h-6 p-1 justify-between cursor-pointer relative hover:bg-muted"
                )}
              >
                <div className="font-medium leading-none tracking-tight flex items-center gap-1.5 h-full w-full">
                  <Icon
                    name={knowledge.source === "crawl" ? "website" : "file"}
                    size="small"
                    color="black"
                  />
                  <span className="whitespace-no-wrap overflow-hidden text-ellipsis">
                    {knowledge.source === "crawl"
                      ? knowledge.url
                      : knowledge.file.name}
                  </span>
                </div>
                <button
                  type="button"
                  className="absolute top-1 right-1"
                  onClick={() => removeKnowledgeToFeed(index)}
                >
                  <span className="sr-only">Remove item {index}</span>
                  <Trash2 className="w-4 h-4 hover:stroke-destructive duration-200 ease-in-out" />
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
