import axios from "axios";
import { CloudDownload } from "lucide-react";
import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { useKnowledgeApi } from "@/lib/api/knowledge/useKnowledgeApi";
import { Icon } from "@/lib/components/ui/Icon/Icon";
import { getFileIcon } from "@/lib/helpers/getFileIcon";
import { useUrlBrain } from "@/lib/hooks/useBrainIdFromUrl";
import { isUploadedKnowledge, Knowledge } from "@/lib/types/Knowledge";
import { cn } from "@/lib/utils";

import DeleteKnowledgeItem from "./components/DeleteKnowledgeItem";
import { useKnowledgeItem } from "./hooks/useKnowledgeItem";

export default function KnowledgeItem({
  knowledge,
}: {
  knowledge: Knowledge;
}): JSX.Element {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const { onDeleteKnowledge, isDeleting } = useKnowledgeItem();
  const { brain } = useUrlBrain();
  const { generateSignedUrlKnowledge } = useKnowledgeApi();

  const downloadFile = async () => {
    if (isUploadedKnowledge(knowledge)) {
      const download_url = await generateSignedUrlKnowledge({
        knowledgeId: knowledge.id,
      });

      try {
        const response = await axios.get(download_url, {
          responseType: "blob",
        });

        const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = knowledge.fileName;
        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error("Error downloading the file:", error);
      }
    }
  };

  return (
    <div
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "p-2 flex justify-between items-center cursor-pointer relative hover:bg-muted overflow-hidden gap-0.5 my-1 rounded-xl"
      )}
    >
      <div className="flex items-center gap-1">
        {isUploadedKnowledge(knowledge) ? (
          getFileIcon(knowledge.fileName)
        ) : (
          <Icon name="link" size="normal" color="black" />
        )}
        {isUploadedKnowledge(knowledge) ? (
          <span>{knowledge.fileName}</span>
        ) : (
          <a href={knowledge.url} target="_blank" rel="noopener noreferrer">
            {knowledge.url}
          </a>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <DeleteKnowledgeItem
          isOpen={isOpened}
          setOpen={setIsOpened}
          onConfirm={() => void onDeleteKnowledge(knowledge)}
          isDisabled={brain?.role !== "Owner"}
          isDeletePending={isDeleting}
        />
        <Button
          size="icon"
          className="h-8 w-8"
          title="Download"
          onClick={() => void downloadFile()}
          disabled={brain?.role !== "Owner" || !isUploadedKnowledge(knowledge)}
        >
          <span className="sr-only">Download</span>
          <CloudDownload className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
