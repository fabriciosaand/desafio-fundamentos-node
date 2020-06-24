import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransationDTO {
  balance: Balance;
  transactions: Transaction[];
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): TransationDTO {
    const transationDTO = {
      transactions: this.transactions,
      balance: this.getBalance(),
    };

    return transationDTO;
  }

  public getBalance(): Balance {
    const income = this.transactions.reduce((acumulador, transaction) => {
      return transaction.type === 'income'
        ? acumulador + transaction.value
        : acumulador;
    }, 0);

    const outcome = this.transactions.reduce((acumulador, transaction) => {
      return transaction.type === 'outcome'
        ? acumulador + transaction.value
        : acumulador;
    }, 0);

    const balance = {
      income,
      outcome,
      total: income - outcome,
    };
    return balance;
  }

  public create({ title, value, type }: Omit<Transaction, 'id'>): Transaction {
    const transaction = new Transaction({ title, value, type });

    const { total } = this.getBalance();

    if (type === 'outcome' && value > total) {
      throw Error('Value exceeds the total value in cash');
    }

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
