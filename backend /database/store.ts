import { randomUUID } from 'node:crypto';
import { AccessLog } from '../models/access-log';
import { CreateUserInput, User } from '../models/user';

const users: User[] = [];
const logs: AccessLog[] = [];

export function listUsers(): User[] {
  return [...users];
}

export function findUser(id: string): User | undefined {
  return users.find((user) => user.id === id);
}

export function findUserByEmail(email: string): User | undefined {
  return users.find((user) => user.email === email);
}

export function createUser(input: CreateUserInput): User {
  const user: User = {
    id: randomUUID(),
    name: input.name,
    email: input.email,
    role: input.role ?? 'user',
    active: input.active ?? true,
    createdAt: new Date().toISOString()
  };

  users.push(user);
  return user;
}

export function listLogs(): AccessLog[] {
  return [...logs];
}

export function addLog(input: Omit<AccessLog, 'id' | 'createdAt'>): AccessLog {
  const log: AccessLog = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString()
  };

  logs.push(log);
  return log;
}