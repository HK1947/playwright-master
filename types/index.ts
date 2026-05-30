export interface BankCredentials {
    username: string;
    password: string;
}

export interface BankAccount {
    accountType: string;
    balance: number;
    enableOverdraft?: boolean;
    accountName: string;
}

// Shape mirrors SecureBank's actual `bankTransactions` localStorage records
// (verified against the running app — the previous 'credit' | 'debit' shape
// did not match). Used by upcoming transaction specs (see README roadmap).
export interface BankTransaction {
    id: string;
    transactionId: string;
    date: string;
    type: 'deposit' | 'withdrawal' | 'transfer';
    accountId: string;
    accountName: string;
    amount: number;
    balanceAfter: number;
    description: string;
    status: 'completed' | 'pending' | 'failed';
}
