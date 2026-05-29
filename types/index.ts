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

export interface BankTransaction {
    date: string;
    description: string;
    amount: number;
    type: 'credit' | 'debit';
}
