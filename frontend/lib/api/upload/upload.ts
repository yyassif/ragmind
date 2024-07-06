import { AxiosInstance } from "axios";
import { UUID } from "crypto";

export type UploadResponse = {
  data: { type: "success" | "error" | "warning"; message: string };
};

export type UploadInputProps = {
  brainId: UUID;
  formData: FormData;
  chat_id?: UUID;
};

export const uploadFile = async (
  props: UploadInputProps,
  axiosInstance: AxiosInstance
): Promise<UploadResponse> => {
  let uploadUrl = `/upload?brain_id=${props.brainId}`;
  if (props.chat_id !== undefined) {
    uploadUrl = uploadUrl.concat(`&chat_id=${props.chat_id}`);
  }

  return axiosInstance.post(uploadUrl, props.formData);
};
