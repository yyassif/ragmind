import { AxiosInstance } from "axios";

import { Notification } from "@/app/(dashboard)/chat/[chatId]/types";

export const getChatNotifications = async (
  chatId: string,
  axiosInstance: AxiosInstance
): Promise<Notification[]> => {
  return (await axiosInstance.get<Notification[]>(`/notifications/${chatId}`))
    .data;
};
