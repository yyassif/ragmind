import { TFunction } from "i18next";
import { toast as IToast } from "sonner";

type ToastType = typeof IToast;

export const isBrainDescriptionValid = (
  description: string,
  toast: ToastType,
  t: TFunction<["translation", "brain", "config"]>
): boolean => {
  if (description.trim() === "") {
    toast.error(t("descriptionRequired", { ns: "config" }));

    return false;
  }

  return true;
};
