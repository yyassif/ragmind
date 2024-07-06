import { UUID } from "crypto";

import { MinimalBrainForUser } from "@/lib/context/BrainProvider/types";

export type SelectOptionProps<T> = {
  label: string;
  value: T;
};

export const formatMinimalBrainsToSelectComponentInput = (
  brains: MinimalBrainForUser[]
): SelectOptionProps<UUID>[] =>
  brains.map((brain) => ({
    label: brain.name,
    value: brain.id,
  }));
