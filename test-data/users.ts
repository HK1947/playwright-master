import { BankAccount, BankCredentials } from '../types';

// Read from .env.qa — never hardcode credentials
export const BANK_VALID_USER: BankCredentials = {
    username: process.env.BANK_USERNAME!,
    password: process.env.BANK_PASSWORD!,
};

export const BANK_INVALID_USER: BankCredentials = {
    username: 'wronguser',
    password: 'wrongpass',
    // Invalid creds are OK to hardcode — they're intentionally wrong
};

export const ALL_BANK_USERS: BankCredentials[] = [
    { username: process.env.BANK_USERNAME!, password: process.env.BANK_PASSWORD! },
    { username: 'wronguser', password: 'wrongpass' },
];
export const NEW_BANK_ACCOUNT_DETAILS: BankAccount = {
    accountName: 'Test harsha',
    accountType: 'Savings Account',
    balance: 100,
    enableOverdraft: true,
};
