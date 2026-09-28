import { Request, Response } from 'express';
import { createUser, findUserByEmail, listUsers } from '../database/store';

export function getUsers(_request: Request, response: Response): void {
  response.json(listUsers());
}

export function postUser(request: Request, response: Response): void {
  const { name, email, role, active } = request.body as {
    name?: unknown;
    email?: unknown;
    role?: unknown;
    active?: unknown;
  };

  if (typeof name !== 'string' || !name.trim() || typeof email !== 'string' || !email.trim()) {
    response.status(400).json({ error: 'name and email are required' });
    return;
  }

  if (findUserByEmail(email.trim())) {
    response.status(409).json({ error: 'a user with this email already exists' });
    return;
  }

  if (role !== undefined && typeof role !== 'string') {
    response.status(400).json({ error: 'role must be a string' });
    return;
  }

  if (active !== undefined && typeof active !== 'boolean') {
    response.status(400).json({ error: 'active must be a boolean' });
    return;
  }

  const user = createUser({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role,
    active
  });

  response.status(201).json(user);
}