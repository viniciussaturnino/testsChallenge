import { hash } from "bcryptjs";
import { Connection } from "typeorm";
import request from 'supertest';
import { v4 as uuidV4 } from 'uuid';

import createConnection from '../../../../database/index';
import { app } from "../../../../app";

let connection: Connection;

describe('Show User Profile Controller', () => {
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

  it('Should be able to show a user profile', async () => {
    const responseAuthenticate = await request(app).post('/api/v1/sessions').send({
      email: 'super@test.com',
      password: 'password'
    });

    const { token } = responseAuthenticate.body;

    const response = await request(app).get('/api/v1/profile').send({
      user_id: id,
    }).set({
      Authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });
});
