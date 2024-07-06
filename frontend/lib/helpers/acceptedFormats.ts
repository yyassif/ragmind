import { SupportedFileExtensionsWithDot } from "@/lib/types/SupportedFileExtensions";

export const acceptedFormats: Record<string, SupportedFileExtensionsWithDot[]> =
  {
    "text/plain": [".txt"],
    "text/csv": [".csv"],
    "text/markdown": [".md", ".markdown"],
    "audio/x-m4a": [".m4a"],
    "audio/mpeg": [".mp3", ".mpga", ".mpeg"],
    "audio/webm": [".webm"],
    "video/mp4": [".mp4"],
    "audio/wav": [".wav"],
    "application/pdf": [".pdf"],
    "text/html": [".html"],
    "text/telegram": [".telegram"],
    "application/epub+zip": [".epub"],
    "text/x-python": [".py"],
    "text/bib": [".bib"],
    "application/x-ipynb+json": [".ipynb"],
    "application/vnd.oasis.opendocument.text": [".odt"],
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      [".pptx", ".ppt"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
      ".xlsx",
      ".xls",
    ],
  };
