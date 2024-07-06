export type RequestStat = {
  date: string;
  daily_requests_count: number;
  user_id: string;
};

export interface UserStats {
  id: string;
  email: string;
  models: string[];
}
