import { useTranslation } from "react-i18next";
import { FcGoogle } from "react-icons/fc";

import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";

import { useGoogleLogin } from "./hooks/useGoogleLogin";

export default function GoogleLoginButton(): JSX.Element {
  const { isPending, signInWithGoogle } = useGoogleLogin();
  const { t } = useTranslation(["login"]);

  return (
    <Button
      type="button"
      variant="outline"
      data-testid="google-login-button"
      className="font-normal bg-white text-black py-2 hover:text-white"
      disabled={isPending}
      onClick={() => void signInWithGoogle()}
    >
      {isPending ? (
        <Spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <FcGoogle className="mr-2 h-4 w-4" />
      )}{" "}
      {t("googleLogin", { ns: "login" })}
    </Button>
  );
}
