import { getChatNotifications } from "@/lib/api/notification/notification";
import { useAxios } from "@/lib/hooks";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useNotificationApi = () => {
  const { axiosInstance } = useAxios();

  return {
    getChatNotifications: async (chatId: string) =>
      await getChatNotifications(chatId, axiosInstance),
  };
};
