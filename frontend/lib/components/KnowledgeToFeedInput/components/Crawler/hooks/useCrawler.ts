"use client";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useKnowledgeToFeedContext } from "@/lib/context/KnowledgeToFeedProvider/hooks/useKnowledgeToFeedContext";
import { useSupabase } from "@/lib/context/SupabaseProvider";
import { redirectToLogin } from "@/lib/router/redirectToLogin";

import { isValidUrl } from "../helpers/isValidUrl";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useCrawler = () => {
  const { addKnowledgeToFeed } = useKnowledgeToFeedContext();
  const urlInputRef = useRef<HTMLInputElement | null>(null);
  const { session } = useSupabase();
  const { t } = useTranslation(["translation", "upload"]);
  const [urlToCrawl, setUrlToCrawl] = useState<string>("");

  if (session === null) {
    redirectToLogin();
  }

  const handleSubmit = () => {
    if (urlToCrawl === "") {
      return;
    }
    if (!isValidUrl(urlToCrawl)) {
      toast.error(t("invalidUrl"));

      return;
    }
    addKnowledgeToFeed({
      source: "crawl",
      url: urlToCrawl,
    });
    setUrlToCrawl("");
  };

  return {
    urlInputRef,
    urlToCrawl,
    setUrlToCrawl,
    handleSubmit,
  };
};
