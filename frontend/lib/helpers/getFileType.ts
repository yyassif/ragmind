import {
  SupportedFileExtensions,
  supportedFileExtensions,
} from "@/lib/types/SupportedFileExtensions";

export const getFileType = (
  fileName: string
): SupportedFileExtensions | undefined => {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (supportedFileExtensions.includes(extension as SupportedFileExtensions)) {
    return extension as SupportedFileExtensions;
  }

  return undefined;
};
