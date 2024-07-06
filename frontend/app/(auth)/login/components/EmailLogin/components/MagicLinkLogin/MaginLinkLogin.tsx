import { Fragment } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { EmailAuthContextType } from "@/app/(auth)/login/types";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { useAuthModes } from "@/lib/hooks/useAuthModes";

import { useMagicLinkLogin } from "./hooks/useMagicLinkLogin";

export default function MagicLinkLogin(): JSX.Element {
  const { t } = useTranslation(["login", "translation"]);
  const { magicLink } = useAuthModes();
  const { handleMagicLinkLogin } = useMagicLinkLogin();
  const { watch } = useFormContext<EmailAuthContextType>();

  if (!magicLink) {
    return <Fragment />;
  }

  return (
    <Button
      disabled={watch("isMagicLinkSubmitting")}
      className="py-2 font-normal w-full mb-1"
      onClick={() => void handleMagicLinkLogin()}
    >
      {watch("isMagicLinkSubmitting") && <Spinner className="mr-2 h-4 w-4 " />}
      {t("magicLink", { ns: "login" })}
    </Button>
  );
}
