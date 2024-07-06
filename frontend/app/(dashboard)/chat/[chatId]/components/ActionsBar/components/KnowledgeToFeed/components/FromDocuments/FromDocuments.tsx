import { useEffect, useState } from "react";

import { useKnowledgeToFeedContext } from "@/lib/context/KnowledgeToFeedProvider/hooks/useKnowledgeToFeedContext";
import { useCustomDropzone } from "@/lib/hooks/useDropzone";
import { cn } from "@/lib/utils";

export const FromDocuments = (): JSX.Element => {
  const [dragging, setDragging] = useState<boolean>(false);
  const { getRootProps, getInputProps, open } = useCustomDropzone();
  const { knowledgeToFeed } = useKnowledgeToFeedContext();

  useEffect(() => {
    setDragging(false);
  }, [knowledgeToFeed]);

  return (
    <div
      className={cn(
        "bg-background rounded-lg p-2 w-full h-full flex flex-col justify-center items-center box-border cursor-pointer border-2 border-dashed border-gray-400",
        dragging && "bg-muted border-2 border-teal-500"
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
        SVG, PNG, JPG or GIF
      </p>
      <input {...getInputProps()} />
    </div>
  );
};
