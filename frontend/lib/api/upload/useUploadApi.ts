import { uploadFile, UploadInputProps } from "@/lib/api/upload/upload";
import { useAxios } from "@/lib/hooks";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useUploadApi = () => {
  const { axiosInstance } = useAxios();

  return {
    uploadFile: async (props: UploadInputProps) =>
      uploadFile(props, axiosInstance),
  };
};
