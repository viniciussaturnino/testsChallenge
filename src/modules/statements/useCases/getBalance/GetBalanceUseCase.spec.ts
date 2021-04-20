import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe('Get User Balance', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementRepositoryInMemory
    );
    getBalanceUseCase = new GetBalanceUseCase(
      statementRepositoryInMemory,
      usersRepositoryInMemory
    );
  });

  it('Should be able to list all user balances', async () => {
    const user = await createUserUseCase.execute({
      name: 'Vinicius Saturnino',
      email: 'vinicius@email.com',
      password: '12345'
    });

    const statement1 = await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 300.0,
      description: 'Statement1 description test',
      type: OperationType.DEPOSIT,
    });

    const statement2 = await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 200.0,
      description: 'Statement2 description test',
      type: OperationType.WITHDRAW,
    });

    const statement3 = await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 280.0,
      description: 'Statement3 description test',
      type: OperationType.DEPOSIT,
    });

    const balance = await getBalanceUseCase.execute({
      user_id: user.id as string,
    });

    expect(balance.statement.length).toBe(3);
    expect(balance.balance).toEqual(statement3.amount + statement1.amount - statement2.amount);
  });

  it(`Should not to be able to list balance when user isn't exists`, () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: 'null_user_id',
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
