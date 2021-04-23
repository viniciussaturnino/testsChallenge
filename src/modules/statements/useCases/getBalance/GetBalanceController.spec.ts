import { hash } from "bcryptjs";
import { Connection } from "typeorm";
import request from 'supertest';
import { v4 as uuidV4 } from 'uuid';

import createConnection from '../../../../database/index';
import { app } from "../../../../app";
import { OperationType } from "../../entities/Statement";

let connection: Connection;

describe('Get Balance Controller', () => {
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

  it('Should be able to list the balance', async () => {
    const responseAuthenticate = await request(app).post('/api/v1/sessions').send({
      email: 'super@test.com',
      password: 'password'
    });

    const { token } = responseAuthenticate.body;

    await request(app).post('/api/v1/statements/deposit').send({
      user_id: id,
      type: OperationType.DEPOSIT,
      amount: 250,
      description: 'Description of test DEPOSIT'
    }).set({
      Authorization: `Bearer ${token}`
    });

    await request(app).post('/api/v1/statements/withdraw').send({
      user_id: id,
      type: OperationType.WITHDRAW,
      amount: 180,
      description: 'Description of test WITHDRAW'
    }).set({
      Authorization: `Bearer ${token}`
    });

    const response = await request(app).get('/api/v1/statements/balance').send({
      user_id: id,
    }).set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('statement');
    expect(response.body).toHaveProperty('balance');

  });
});
