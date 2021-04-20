import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository;

describe('List statement by id', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementRepositoryInMemory
    );
  });

  it('Should be able to list a statement by your id', async () => {
    const user = await createUserUseCase.execute({
      name: 'Vinicius Saturnino',
      email: 'vinicius@email.com',
      password: '12345'
    });

    const newStatement = await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 350.0,
      description: 'Description statement test',
      type: OperationType.DEPOSIT
    });

    const statement = await statementRepositoryInMemory.findStatementOperation({
      statement_id: newStatement.id as string,
      user_id: user.id as string
    });

    expect(statement).toEqual(newStatement);
  });
});
