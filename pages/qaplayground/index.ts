// pages/qaplayground/index.ts
// Lesson 12: Barrel file — re-exports all page classes
// Allows clean import: import { LoginPage, DashboardPage } from '../pages/qaplayground'

export { LoginPage } from './LoginPage';
export { DashboardPage } from './DashboardPage';
export { AccountsPage } from './AccountsPage';
export { TransactionsPage } from './TransactionsPage';
