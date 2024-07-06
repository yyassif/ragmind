import { UploadDocuments } from "../components/UploadDocuments";

interface InputsStepProps {
  files: { key: string; file: File | null }[];
  onFileChange: (fileObj: { file: File; key: string }) => void;
  onRemoveFile: (fileKey: string) => void;
}

export const CVFilesStep = ({
  files,
  onFileChange,
  onRemoveFile,
}: InputsStepProps): JSX.Element => {
  return (
    <UploadDocuments
      files={files}
      onFileChange={onFileChange}
      onRemoveFile={onRemoveFile}
    />
  );
};
