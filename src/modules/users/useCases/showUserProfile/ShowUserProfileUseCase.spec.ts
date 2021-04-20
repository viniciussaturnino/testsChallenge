import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe('List User', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
  });

  it('Should be able to list a user', async () => {
    const newUser = await usersRepositoryInMemory.create({
      name: 'Vinicius Saturnino',
      email: 'vinicius@email.com',
      password: '12345'
    });

    const user = await showUserProfileUseCase.execute(`${newUser.id}`);

    expect(user).toEqual(newUser);
  });

  it('Should not to be able to list a non existing user', async () => {
    expect(async () => {
      await showUserProfileUseCase.execute('unexisting_id');
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
