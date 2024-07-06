import { FileRejection, useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { FeedItemUploadType } from "@/app/(dashboard)/chat/[chatId]/components/ActionsBar/types";
import { useBrainCreationContext } from "@/components/modals/AddBrainModal/brain-creation-provider";
import { ONE_MEGA_BYTES } from "@/lib/config/CONSTANTS";
import { useKnowledgeToFeedContext } from "@/lib/context/KnowledgeToFeedProvider/hooks/useKnowledgeToFeedContext";
import { acceptedFormats } from "@/lib/helpers/acceptedFormats";
import { cloneFileWithSanitizedName } from "@/lib/helpers/cloneFileWithSanitizedName";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useCustomDropzone = () => {
  const { knowledgeToFeed, addKnowledgeToFeed, setShouldDisplayFeedCard } =
    useKnowledgeToFeedContext();
  const { isBrainCreationModalOpened } = useBrainCreationContext();
  const { t } = useTranslation(["upload"]);

  const files: File[] = (
    knowledgeToFeed.filter((c) => c.source === "upload") as FeedItemUploadType[]
  ).map((c) => c.file);

  const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (!isBrainCreationModalOpened) {
      setShouldDisplayFeedCard(true);
    }
    if (fileRejections.length > 0) {
      const firstRejection = fileRejections[0];

      if (firstRejection.errors[0].code === "file-invalid-type") {
        toast.error(t("invalidFileType"));
      } else {
        toast.error(t("maxSizeError", { ns: "upload" }));
      }

      return;
    }

    for (const file of acceptedFiles) {
      const isAlreadyInFiles =
        files.filter((f) => f.name === file.name && f.size === file.size)
          .length > 0;
      if (isAlreadyInFiles) {
        toast.warning(t("alreadyAdded", { fileName: file.name, ns: "upload" }));
      } else {
        addKnowledgeToFeed({
          source: "upload",
          file: cloneFileWithSanitizedName(file),
        });
      }
    }
  };

  const { getInputProps, getRootProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    maxSize: 5 * ONE_MEGA_BYTES,
    accept: acceptedFormats,
  });

  return {
    getInputProps,
    getRootProps,
    isDragActive,
    open,
  };
};
