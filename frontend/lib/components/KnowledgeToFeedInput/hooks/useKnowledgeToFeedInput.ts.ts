import { UUID } from "crypto";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useCrawlApi } from "@/lib/api/crawl/useCrawlApi";
import { useUploadApi } from "@/lib/api/upload/useUploadApi";
import { getAxiosErrorParams } from "@/lib/helpers/getAxiosErrorParams";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useKnowledgeToFeedInput = () => {
  const { uploadFile } = useUploadApi();
  const { t } = useTranslation(["upload"]);
  const { crawlWebsiteUrl } = useCrawlApi();

  const crawlWebsiteHandler = useCallback(
    async (url: string, brainId: UUID, chat_id?: UUID) => {
      // Configure parameters
      const config = {
        url: url,
        js: false,
        depth: 1,
        max_pages: 100,
        max_time: 60,
      };

      try {
        await crawlWebsiteUrl({
          brainId,
          config,
          chat_id,
        });
      } catch (error: unknown) {
        const errorParams = getAxiosErrorParams(error);
        if (errorParams !== undefined) {
          toast.error(
            t("crawlFailed", {
              message: JSON.stringify(errorParams.message),
            })
          );
        } else {
          toast.error(
            t("crawlFailed", {
              message: JSON.stringify(error),
            })
          );
        }
      }
    },
    [crawlWebsiteUrl, toast, t]
  );

  const uploadFileHandler = useCallback(
    async (file: File, brainId: UUID, chat_id?: UUID) => {
      const formData = new FormData();
      formData.append("uploadFile", file);
      try {
        await uploadFile({
          brainId,
          formData,
          chat_id,
        });
      } catch (e: unknown) {
        const errorParams = getAxiosErrorParams(e);
        if (errorParams !== undefined) {
          toast.error(
            t("uploadFailed", {
              message: JSON.stringify(errorParams.message),
            })
          );
        } else {
          toast.error(
            t("uploadFailed", {
              message: JSON.stringify(e),
            })
          );
        }
      }
    },
    [toast, t, uploadFile]
  );

  return {
    crawlWebsiteHandler,
    uploadFileHandler,
  };
};
