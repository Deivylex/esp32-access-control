import { Request, Response } from 'express';
import { listLogs } from '../database/store';

export function getLogs(_request: Request, response: Response): void {
  response.json(listLogs());
}