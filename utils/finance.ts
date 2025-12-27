
export function calculatePMT(principal: number, monthlyRate: number, months: number): number {
  const rate = monthlyRate / 100;
  if (rate === 0) return principal / months;
  return (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
}

export function generateInstallments(principal: number, monthlyRate: number, months: number, startDate: string, contractId: string) {
  const installments = [];
  const pmt = calculatePMT(principal, monthlyRate, months);
  let currentBalance = principal;
  const rate = monthlyRate / 100;

  for (let i = 1; i <= months; i++) {
    const interest = currentBalance * rate;
    const principalPaid = pmt - interest;
    currentBalance -= principalPaid;

    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i);

    installments.push({
      id: `inst-${contractId}-${i}`,
      contractId,
      number: i,
      dueDate: dueDate.toISOString().split('T')[0],
      amount: Number(pmt.toFixed(2)),
      principal: Number(principalPaid.toFixed(2)),
      interest: Number(interest.toFixed(2)),
      paidAmount: 0,
      status: 'PENDING'
    });
  }
  return installments;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}
