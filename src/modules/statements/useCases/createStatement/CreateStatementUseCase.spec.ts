import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository;

describe('Create Statement', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementRepositoryInMemory
    );
  });

  it('Should be able to create a new deposit statement', async () => {
    const user = await createUserUseCase.execute({
      name: 'Vinicius Saturnino',
      email: 'vinicius@email.com',
      password: '12345'
    });

    const statement: ICreateStatementDTO = {
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 300.0,
      description: 'Statement DEPOSIT test'
    };

    const result = await createStatementUseCase.execute(statement);

    expect(result).toHaveProperty('id');
  });

  it('Should be able to create a new withdraw statement', async () => {
    const user = await createUserUseCase.execute({
      name: 'Vinicius Saturnino',
      email: 'vinicius@email.com',
      password: '12345'
    });

    const statementDeposit: ICreateStatementDTO = {
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 300.0,
      description: 'Statement DEPOSIT test'
    };

    await createStatementUseCase.execute(statementDeposit);

    const statementWithdraw: ICreateStatementDTO = {
      user_id: user.id as string,
      type: OperationType.WITHDRAW,
      amount: 150.0,
      description: 'Statement WITHDRAW test'
    };

    const result = await createStatementUseCase.execute(statementWithdraw);

    expect(result).toHaveProperty('id');
  });
});
