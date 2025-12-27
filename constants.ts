
import { Client, Contract, ContractStatus, InstallmentStatus, User } from './types';

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'João Silva',
    email: 'joao@email.com',
    taxId: '123.456.789-00',
    phone: '(11) 98765-4321',
    income: 5500,
    creditScore: 750,
    registeredAt: '2023-01-15'
  },
  {
    id: 'c2',
    name: 'Maria Oliveira',
    email: 'maria@tech.com',
    taxId: '98.765.432/0001-99',
    phone: '(21) 99988-7766',
    income: 12000,
    creditScore: 890,
    registeredAt: '2023-05-20'
  }
];

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Admin Limbank',
  role: 'ADMIN',
  email: 'admin@limbank.com'
};

export const MOCK_CONTRACTS: Contract[] = [
  {
    id: 'ct1',
    clientId: 'c1',
    amount: 10000,
    interestRate: 2.5,
    term: 12,
    startDate: '2023-11-01',
    status: ContractStatus.ACTIVE,
    totalToPay: 12500,
    remainingBalance: 8500,
    installments: [] // Populated dynamically in real app logic
  }
];
