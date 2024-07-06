import { TFunction } from "i18next";
import { toast as IToast } from "sonner";

type ToastType = typeof IToast;

export const isBrainNameValid = (
  name: string,
  toast: ToastType,
  t: TFunction<["translation", "brain", "config"]>
): boolean => {
  if (name.trim() === "") {
    toast.error(t("nameRequired", { ns: "config" }));

    return false;
  }

  return true;
};
