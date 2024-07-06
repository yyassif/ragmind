export enum NotificationStatus {
  Info = "info",
  Warning = "warning",
  Error = "error",
  Success = "success",
}

export type NotificationType =
  SupaTypes["public"]["Tables"]["notifications"]["Row"];
