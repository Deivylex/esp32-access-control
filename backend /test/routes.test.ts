import assert from 'node:assert/strict';
import test from 'node:test';
import request from 'supertest';
import app from '../app';

test('users, access and logs routes work together', async () => {
  const createUserResponse = await request(app)
    .post('/users')
    .send({ name: 'Ada Lovelace', email: ' ADA@example.com ' });

  assert.equal(createUserResponse.status, 201);
  assert.equal(createUserResponse.body.name, 'Ada Lovelace');
  assert.equal(createUserResponse.body.email, 'ada@example.com');
  assert.equal(createUserResponse.body.active, true);

  const usersResponse = await request(app).get('/users');

  assert.equal(usersResponse.status, 200);
  assert.equal(usersResponse.body.length, 1);
  assert.equal(usersResponse.body[0].id, createUserResponse.body.id);

  const duplicateResponse = await request(app)
    .post('/users')
    .send({ name: 'Another user', email: 'ada@example.com' });

  assert.equal(duplicateResponse.status, 409);

  const accessResponse = await request(app)
    .post('/access/check')
    .send({
      userId: createUserResponse.body.id,
      resource: '/devices/door-1',
      action: 'open'
    });

  assert.equal(accessResponse.status, 200);
  assert.equal(accessResponse.body.allowed, true);
  assert.equal(accessResponse.body.reason, 'access_granted');
  assert.equal(typeof accessResponse.body.logId, 'string');

  const logsResponse = await request(app).get('/logs');

  assert.equal(logsResponse.status, 200);
  assert.equal(logsResponse.body.length, 1);
  assert.equal(logsResponse.body[0].userId, createUserResponse.body.id);
  assert.equal(logsResponse.body[0].allowed, true);
});

test('access check validates input and denies inactive users', async () => {
  const invalidResponse = await request(app)
    .post('/access/check')
    .send({ userId: 'missing-user' });

  assert.equal(invalidResponse.status, 400);

  const createUserResponse = await request(app)
    .post('/users')
    .send({ name: 'Grace Hopper', email: 'grace@example.com', active: false });

  assert.equal(createUserResponse.status, 201);

  const accessResponse = await request(app)
    .post('/access/check')
    .send({
      userId: createUserResponse.body.id,
      resource: 'control-panel',
      action: 'read'
    });

  assert.equal(accessResponse.status, 403);
  assert.equal(accessResponse.body.allowed, false);
  assert.equal(accessResponse.body.reason, 'user_inactive');
});