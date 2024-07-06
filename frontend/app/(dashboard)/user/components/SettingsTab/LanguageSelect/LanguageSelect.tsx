"use client";

import { Fragment } from "react";
import { useTranslation } from "react-i18next";

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

import { useLanguageHook } from "./hooks/useLanguageHook";

export default function LanguageSelect(): JSX.Element {
  const { t } = useTranslation(["translation"]);
  const { currentLanguage, change, allLanguages } = useLanguageHook();

  if (!currentLanguage) {
    return <Fragment />;
  }

  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor="language">Language</Label>
      <Select
        data-testid="language-select"
        name="language"
        onValueChange={(e) =>
          change(
            allLanguages.find((language) => language.label === e) ??
              allLanguages[2]
          )
        }
        defaultValue={currentLanguage.label}
      >
        <SelectTrigger className="w-[280px]" id="language">
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{t("languageSelect")}</SelectLabel>
            {allLanguages.map((lang) => (
              <SelectItem
                data-testid={`option-${lang}`}
                value={lang.label}
                key={lang.shortName}
              >
                {lang.flag} {lang.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
