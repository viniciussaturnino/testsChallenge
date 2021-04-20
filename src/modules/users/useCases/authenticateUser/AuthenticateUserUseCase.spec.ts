import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUsecase: AuthenticateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe('Authenticate User', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    authenticateUserUsecase = new AuthenticateUserUseCase(usersRepositoryInMemory);
  });

  it('Should be able to authenticate a user', async () => {
    const user: ICreateUserDTO = {
      name: 'Vinicius Saturnino',
      email: 'vinicius@email.com',
      password: '12345',
    };
    await createUserUseCase.execute(user);

    const result = await authenticateUserUsecase.execute({
      email: 'vinicius@email.com',
      password: '12345'
    });

    expect(result).toHaveProperty('token');
  });

  it('Should not to be able to authenticate a non existent user', () => {
    expect(async () => {
      await authenticateUserUsecase.execute({
        email: 'null@email.com',
        password: '12345'
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it('Should not to be able to authenticate a user with wrong credentials', () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: 'Vinicius Saturnino',
        email: 'vinicius@email.com',
        password: '12345',
      };

      await createUserUseCase.execute(user);

      await authenticateUserUsecase.execute({
        email: user.email,
        password: 'wrong_password'
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
