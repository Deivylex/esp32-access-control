import { Request, Response } from 'express';
import { addLog, findUser } from '../database/store';

export function checkAccess(request: Request, response: Response): void {
  const { userId, resource, action } = request.body as {
    userId?: unknown;
    resource?: unknown;
    action?: unknown;
  };

  if (
    typeof userId !== 'string' || !userId.trim() ||
    typeof resource !== 'string' || !resource.trim() ||
    typeof action !== 'string' || !action.trim()
  ) {
    response.status(400).json({ error: 'userId, resource and action are required' });
    return;
  }

  const user = findUser(userId);
  const allowed = Boolean(user?.active);
  const reason = !user ? 'user_not_found' : user.active ? 'access_granted' : 'user_inactive';
  const log = addLog({
    userId,
    resource: resource.trim(),
    action: action.trim(),
    allowed,
    reason
  });

  response.status(allowed ? 200 : 403).json({
    allowed,
    reason,
    userId,
    resource: resource.trim(),
    action: action.trim(),
    logId: log.id
  });
}