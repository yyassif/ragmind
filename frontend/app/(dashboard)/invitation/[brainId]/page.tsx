"use client";

import { Fragment } from "react";
import { useTranslation } from "react-i18next";

import PageHeader from "@/components/partial/PageHeader";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/lib/context/SupabaseProvider";
import { redirectToLogin } from "@/lib/router/redirectToLogin";

import { useInvitation } from "./hooks/useInvitation";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const InvitationPage = (): JSX.Element => {
  const { t } = useTranslation("invitation");
  const {
    handleAccept,
    isProcessingRequest,
    handleDecline,
    isLoading,
    brainName,
    role,
  } = useInvitation();
  const { session } = useSupabase();

  if (isLoading) {
    return (
      <div>
        <PageHeader
          title={t("wellcome", { brain: brainName, ns: "invitation" })}
        />
        <div className="flex flex-col space-y-2 text-center sm:text-left px-4 py-2">
          <h3 className="text-lg font-semibold">Loading...</h3>
          <Spinner />
        </div>
      </div>
    );
  }

  if (session?.user === undefined) {
    redirectToLogin();
  }

  if (role === undefined) {
    // This should never happen
    // It is a way to prevent the page from crashing when invitation is invalid instead of throwing an error
    // The user will be redirected to the home page (handled in the useInvitation hook)
    return (
      <div>
        <PageHeader
          title={t("wellcome", { brain: brainName, ns: "invitation" })}
        />
        <div className="flex flex-col space-y-2 text-center sm:text-left px-4 py-2">
          <h3 className="text-lg font-semibold">
            Ooups, Looks like you hit the wrong Brain!
          </h3>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <PageHeader
        title={t("wellcome", { brain: brainName, ns: "invitation" })}
        showNotifications
      />
      <div className="p-4">
        <span>{t("invitationMessage", { role: role, ns: "invitation" })}</span>
        {isProcessingRequest ? (
          <div className="flex flex-col items-center justify-center mt-5">
            <Spinner />
            <p className="text-center">
              {t("processingRequest", { ns: "invitation" })}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-5 mt-5">
            <Button
              onClick={() => void handleAccept()}
              variant={"default"}
              className="py-3"
            >
              {t("accept", { ns: "invitation" })}
            </Button>
            <Button onClick={() => void handleDecline()} variant="destructive">
              {t("reject", { ns: "invitation" })}
            </Button>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default InvitationPage;
