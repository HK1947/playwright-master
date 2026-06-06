// helpers/data-factory.ts

// DESIGN PATTERN: Factory
// Creates test data objects with random but valid values
// No more hardcoded "Test Account" in every test

import { faker } from '@faker-js/faker';
import { BankAccount, BankCredentials } from '../types';

export class DataFactory {
    // Create random bank account
    // Lesson Type-deep: Partial<BankAccount> allows overriding specific fields
    static createAccount(overrides?: Partial<BankAccount>): BankAccount {
        return {
            accountName: faker.finance.accountName(),
            //           ^^^^^^^^^^^^^^^^^^^^^^^^^^
            //  faker generates: "Personal Loan Account", "Auto Loan Account", etc.
            //  Different EVERY run → catches more bugs than "Test Account"
            accountType: faker.helpers.arrayElement(['Savings', 'Checking']),
            //  Randomly picks ONE from the array
            balance: faker.number.int({ min: 100, max: 10_000 }),
            //       Random number between 100 and 10000
            enableOverdraft: faker.datatype.boolean(),
            //               Random true or false
            ...overrides,
            //  ^^^^^^^^^^
            //  Lesson 7: Spread operator
            //  If caller passes { accountType: 'Savings Account' }
            //  it OVERRIDES the random value above
            //  Everything else stays random
        };
    }

    // Create random credentials (for negative testing)
    static createCredentials(overrides?: Partial<BankCredentials>): BankCredentials {
        return {
            username: faker.internet.username().toLowerCase(),
            password: faker.internet.password({ length: 12 }),
            ...overrides,
        };
    }

    // Create multiple accounts at once
    // Lesson 9: Array.from creates array of N items
    static createAccounts(count: number): BankAccount[] {
        return Array.from({ length: count }, () => DataFactory.createAccount());
        //     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        //  Array.from({ length: 5 }) creates array of 5 items
        //  Second argument = function that generates each item
        //  Result: [randomAccount1, randomAccount2, ..., randomAccount5]
    }

    // Create account with SPECIFIC type (helper shortcut)
    static createSavingsAccount(overrides?: Partial<BankAccount>): BankAccount {
        return DataFactory.createAccount({
            accountType: 'Savings',
            ...overrides,
        });
    }
}
