"use client";
import { Languages } from "lucide-react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";

import { useLanguageHook } from "@/app/(dashboard)/user/components/SettingsTab/LanguageSelect/hooks/useLanguageHook";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LanguageSwitcher(): JSX.Element {
  const { t } = useTranslation(["translation"]);
  const { currentLanguage, change, allLanguages } = useLanguageHook();

  if (!currentLanguage) {
    return <Fragment />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Languages />
          <span className="sr-only">Switch Language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t("languageSelect")}</DropdownMenuLabel>
        {allLanguages.map((lang) => (
          <DropdownMenuItem key={lang.label} onClick={() => change(lang)}>
            {lang.flag} {lang.label}
            <span className="sr-only">{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
