export interface AccessLog {
  id: string;
  userId: string;
  resource: string;
  action: string;
  allowed: boolean;
  reason: string;
  createdAt: string;
}