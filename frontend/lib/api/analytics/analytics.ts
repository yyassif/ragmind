import { AxiosInstance } from "axios";

import { BrainsUsages, Range } from "./types";

export const getBrainsUsages = async (
  axiosInstance: AxiosInstance,
  brain_id: string | null,
  graph_range: Range
): Promise<BrainsUsages | undefined> => {
  const params = {
    graph_range: graph_range,
    brain_id: brain_id,
  };

  const brainsUsages: BrainsUsages = (
    await axiosInstance.get("/analytics/brains-usages", { params: params })
  ).data;

  return brainsUsages;
};
