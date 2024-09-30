// types.ts
export interface Transaction {
    _id: string;
    amount: number;
    date: string;
    type: 'income' | 'expense';
    note: string;
    userId: string;
  }
  
  export interface NewTransaction {
    amount: string;
    date: string;
    type: 'income' | 'expense';
    note: string;
  }
  
  export interface SummaryData {
    date: string;
    income: number;
    expense: number;
  }