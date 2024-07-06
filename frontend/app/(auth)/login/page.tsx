"use client";

import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useAuthModes } from "@/lib/hooks/useAuthModes";

import EmailLogin from "./components/EmailLogin";
import GoogleLoginButton from "./components/GoogleLogin";
import { EmailAuthContextType } from "./types";

export default function Login(): JSX.Element {
  const { googleSso } = useAuthModes();
  const { t } = useTranslation(["translation", "login"]);
  const methods = useForm<EmailAuthContextType>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div className="grid gap-6">
      <FormProvider {...methods}>
        <EmailLogin />
      </FormProvider>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      {googleSso && <GoogleLoginButton />}
      <p className="text-[10px] text-center">
        {t("restriction_message", { ns: "login" })}
      </p>
    </div>
  );
}
