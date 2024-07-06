import { CrawlInputProps, crawlWebsiteUrl } from "@/lib/api/crawl/crawl";
import { useAxios } from "@/lib/hooks";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useCrawlApi = () => {
  const { axiosInstance } = useAxios();

  return {
    crawlWebsiteUrl: async (props: CrawlInputProps) =>
      crawlWebsiteUrl(props, axiosInstance),
  };
};
