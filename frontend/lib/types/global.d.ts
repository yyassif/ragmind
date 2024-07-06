/* eslint-disable @typescript-eslint/no-empty-interface  */

import { Database } from "./Database";

export {};

declare global {
  interface SupaTypes extends Database {}
}
