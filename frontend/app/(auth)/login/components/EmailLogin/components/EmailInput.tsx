import { Fragment } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthModes } from "@/lib/hooks/useAuthModes";

export default function EmailInput(): JSX.Element {
  const { t } = useTranslation();
  const { password, magicLink } = useAuthModes();

  if (!password && !magicLink) {
    return <Fragment />;
  }

  return (
    <div className="grid gap-1">
      <Label htmlFor="email">{t("email", { ns: "login" })}</Label>
      <Controller
        name="email"
        defaultValue=""
        render={({ field }) => (
          <Input
            id="email"
            placeholder={t("email", { ns: "login" })}
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
    </div>
  );
}
