import { Fragment } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { EmailAuthContextType } from "@/app/(auth)/login/types";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthModes } from "@/lib/hooks/useAuthModes";

import { usePasswordLogin } from "./hooks/usePasswordLogin";

export default function PasswordLogin(): JSX.Element {
  const { t } = useTranslation(["login"]);
  const { password } = useAuthModes();
  const { handlePasswordLogin } = usePasswordLogin();
  const { watch } = useFormContext<EmailAuthContextType>();

  if (!password) {
    return <Fragment />;
  }

  return (
    <div>
      <div className="grid gap-1">
        <Label className="sr-only" htmlFor="password">
          {t("password", { ns: "login" })}
        </Label>
        <Controller
          name="password"
          defaultValue=""
          render={({ field }) => (
            <Input
              id="password"
              placeholder={t("password", { ns: "login" })}
              disabled={watch("isPasswordSubmitting")}
              value={field.value as string}
              onChange={field.onChange}
              type="password"
            />
          )}
        />
      </div>
      <Button
        disabled={watch("isPasswordSubmitting")}
        className="py-2 font-normal w-full my-2"
        onClick={() => void handlePasswordLogin()}
      >
        {watch("isPasswordSubmitting") && <Spinner className="mr-2 h-4 w-4" />}
        {t("login")}
      </Button>
    </div>
  );
}
