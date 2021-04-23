import { hash } from "bcryptjs";
import { Connection } from "typeorm";
import request from 'supertest';
import { v4 as uuidV4 } from 'uuid';

import createConnection from '../../../../database/index';
import { app } from "../../../../app";

let connection: Connection;

describe('Create User Controller', () => {
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

  it('Should be able to create a user', async () => {
    const response = await request(app).post('/api/v1/users').send({
      name: 'Vinicius Saturnino',
      email: 'vinicius@email.com',
      password: 'password'
    });

    expect(response.status).toBe(201);
  });

  it('Should not be able to create a user when email already exists', async () => {
    const response = await request(app).post('/api/v1/users').send({
      name: 'Supertest',
      email: 'super@test.com',
      password: 'password'
    });

    expect(response.status).toBe(400);
  });
});
