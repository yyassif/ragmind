"use client";

import { Check, Copy } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useApiKeyConfig } from "./hooks/useApiKeyConfig";

export default function ApiKeyConfig(): JSX.Element {
  const [apiKeyBtnPressed, setApiKeyBtnPressed] = useState<boolean>(false);
  const { apiKey, handleCopyClick, handleCreateClick } = useApiKeyConfig();
  const { t } = useTranslation(["config"]);

  useEffect(() => {
    if (apiKeyBtnPressed) {
      setTimeout(() => {
        setApiKeyBtnPressed(false);
      }, 2000);
    }
  }, [apiKeyBtnPressed]);

  return (
    <Fragment>
      {apiKey === "" ? (
        <div className="flex flex-col space-y-3">
          <Label>RAGMind {t("apiKey")} *</Label>
          <Button
            className="w-full"
            variant="default"
            onClick={() => void handleCreateClick()}
          >
            Create New Key
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <Label htmlFor="link">RAGMind {t("apiKey")}</Label>
          <div className="flex items-center gap-2">
            <Input
              className="flex-1"
              id="link"
              defaultValue={apiKey}
              readOnly
            />

            <Button
              type="button"
              size="icon"
              title="Copy"
              className="h-10 w-10"
              onClick={() => {
                handleCopyClick();
                setApiKeyBtnPressed(true);
              }}
            >
              {apiKeyBtnPressed ? (
                <Check className="h-5 w-5" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
              <span className="sr-only">Copy</span>
            </Button>
          </div>
        </div>
      )}
    </Fragment>
  );
}
