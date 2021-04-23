import { hash } from 'bcryptjs';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { app } from '../../../../app';
import { OperationType } from '../../entities/Statement';

import createConnection from '../../../../database/index';

let connection: Connection;

describe('Create Statement Controller', () => {
  const id = uuidV4();
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const password = await hash('password', 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password)
    values('${id}', 'test', 'super@test.com', '${password}')
    `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to create a new DEPOSIT statement', async () => {
    const responseAuthenticate = await request(app).post('/api/v1/sessions').send({
      email: 'super@test.com',
      password: 'password'
    });

    const { token } = responseAuthenticate.body;

    const response = await request(app).post('/api/v1/statements/deposit').send({
      user_id: id,
      type: OperationType.DEPOSIT,
      amount: 250,
      description: 'Description of test DEPOSIT'
    }).set({
      Authorization: `Bearer ${token}`
    });

    expect(response.body).toHaveProperty('id');
    expect(response.status).toBe(201);
  });

  it('Should be able to create a new WITHDRAW statement', async () => {
    const responseAuthenticate = await request(app).post('/api/v1/sessions').send({
      email: 'super@test.com',
      password: 'password'
    });

    const { token } = responseAuthenticate.body;

    const response = await request(app).post('/api/v1/statements/withdraw').send({
      user_id: id,
      type: OperationType.WITHDRAW,
      amount: 180,
      description: 'Description of test WITHDRAW'
    }).set({
      Authorization: `Bearer ${token}`
    });

    expect(response.body).toHaveProperty('id');
    expect(response.status).toBe(201);
  });

});
