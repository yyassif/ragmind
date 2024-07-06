import { Trash2 } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";

import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Icon } from "@/lib/components/ui/Icon/Icon";
import { ONE_MEGA_BYTES } from "@/lib/config/CONSTANTS";
import { cloneFileWithSanitizedName } from "@/lib/helpers/cloneFileWithSanitizedName";
import { cn } from "@/lib/utils";

interface UploadDocumentsProps {
  files: { key: string; file: File | null }[];
  onFileChange: (fileObj: { file: File; key: string }) => void;
  onRemoveFile: (key: string) => void;
}

export const UploadDocuments = ({
  files,
  onFileChange,
  onRemoveFile,
}: UploadDocumentsProps): JSX.Element => {
  const [dragging, setDragging] = useState<boolean>(false);
  const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      const firstRejection = fileRejections[0];
      if (firstRejection.errors[0].code === "file-invalid-type") {
        toast.error("Invalid file type!");
      } else {
        toast.error("File is too big!");
      }

      return;
    }

    for (const file of acceptedFiles) {
      const isAlreadyInFiles =
        files.filter(
          (f) => f.file?.name === file.name && f.file.size === file.size
        ).length > 0;
      if (isAlreadyInFiles) {
        toast.warning("File already added!");
      } else {
        const sanitizedFile = cloneFileWithSanitizedName(file);
        onFileChange({ file: sanitizedFile, key: sanitizedFile.name });
      }
    }
  };

  const { getInputProps, getRootProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: 10 * ONE_MEGA_BYTES,
    accept: {
      "application/pdf": [],
    },
  });

  useEffect(() => {
    setDragging(false);
  }, [files]);

  return (
    <Fragment>
      <div
        className={cn(
          "bg-background rounded-lg p-2 w-full h-full flex flex-col justify-center items-center box-border cursor-pointer border-2 border-dashed border-gray-400",
          isDragActive && "bg-muted border-2 border-teal-500 my-4"
        )}
        {...getRootProps()}
        onDragOver={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        onClick={open}
      >
        <svg
          className={cn(
            "w-8 h-8 mb-3 text-gray-500 dark:text-gray-400",
            dragging && "text-teal-500"
          )}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 16"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
          />
        </svg>
        <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold">Click to upload</span>
          &nbsp; or drag and drop
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          .PDF files only
        </p>
        <input {...getInputProps()} />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label>CV Documents:</Label>
          <span className="w-12 rounded-md border border-transparent py-0.5 text-right text-sm text-muted-foreground hover:border-border">
            {files.length}
          </span>
        </div>

        <div className="py-1 flex w-full overflow-scroll flex-col gap-1 flex-grow">
          {files.length > 0 &&
            files.map((file, index) => (
              <div
                key={index}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "h-6 p-1 justify-between cursor-pointer relative hover:bg-muted"
                )}
              >
                <div className="font-medium leading-none tracking-tight flex items-center gap-1.5 h-full w-full">
                  <Icon name="file" size="small" color="black" />
                  <span className="whitespace-no-wrap overflow-hidden text-ellipsis">
                    {file.file?.name}
                  </span>
                </div>
                <button
                  type="button"
                  className="absolute top-1 right-1"
                  onClick={() => onRemoveFile(file.key)}
                >
                  <span className="sr-only">Remove item {index}</span>
                  <Trash2 className="w-4 h-4 hover:stroke-destructive duration-200 ease-in-out" />
                </button>
              </div>
            ))}
        </div>
      </div>
    </Fragment>
  );
};
