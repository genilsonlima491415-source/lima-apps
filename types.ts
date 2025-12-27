
export enum ContractStatus {
  ACTIVE = 'ACTIVE',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  RENEGOTIATED = 'RENEGOTIATED',
  CLOSED = 'CLOSED'
}

export enum InstallmentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE'
}

export interface Client {
  id: string;
  name: string;
  email: string;
  taxId: string; // CPF or CNPJ
  phone: string;
  income: number;
  creditScore: number;
  registeredAt: string;
}

export interface Installment {
  id: string;
  contractId: string;
  number: number;
  dueDate: string;
  amount: number;
  principal: number;
  interest: number;
  paidAmount: number;
  paidAt?: string;
  status: InstallmentStatus;
  fine?: number;
  lateInterest?: number;
}

export interface Contract {
  id: string;
  clientId: string;
  amount: number;
  interestRate: number; // monthly
  term: number; // months
  startDate: string;
  status: ContractStatus;
  installments: Installment[];
  totalToPay: number;
  remainingBalance: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  details: string;
}

export interface User {
  id: string;
  name: string;
  role: 'ADMIN' | 'OPERATOR' | 'VIEWER';
  email: string;
}
