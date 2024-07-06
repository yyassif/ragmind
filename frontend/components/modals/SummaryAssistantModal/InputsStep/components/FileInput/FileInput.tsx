import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FileInputProps {
  label: string;
  onFileChange: (file: File) => void;
  acceptedFileTypes?: string[];
}

export const FileInput = ({
  label,
  onFileChange,
  acceptedFileTypes,
}: FileInputProps): JSX.Element => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileExtension = file.name.split(".").pop();
      if (acceptedFileTypes?.includes(fileExtension || "")) {
        onFileChange(file);
      } else {
        toast.error("Invalid file type");
      }
    }
  };

  return (
    <div className="w-full p-2">
      <Label htmlFor={label}>{label}*</Label>
      <Input
        type="file"
        className="w-full mt-2"
        onChange={handleFileChange}
        accept={acceptedFileTypes
          ?.map((type) => `application/${type}`)
          .join(",")}
      />
    </div>
  );
};
