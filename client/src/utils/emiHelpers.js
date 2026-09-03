export function calculateTotalPayable(plan) {
  if (!plan || !Number.isFinite(plan.monthlyAmount) || !Number.isFinite(plan.tenure)) return null;
  return plan.monthlyAmount * plan.tenure;
}

export function calculateScheduledRepayment(plan) {
  return calculateTotalPayable(plan);
}

export function calculateReducingBalancePayment(principal, annualInterestRate, tenure) {
  if (![principal, annualInterestRate, tenure].every(Number.isFinite) || principal <= 0 || annualInterestRate < 0 || tenure <= 0) return null;
  const monthlyRate = annualInterestRate / 1200;
  if (monthlyRate === 0) return principal / tenure;
  return (principal * monthlyRate * (1 + monthlyRate) ** tenure) / ((1 + monthlyRate) ** tenure - 1);
}

export function getFirstPaymentAmount(plan) {
  return plan && Number.isFinite(plan.monthlyAmount) ? plan.monthlyAmount : null;
}

export function getNextDueDate(referenceDate = new Date()) {
  return getInstallmentDate(referenceDate, 2);
}

export function getInstallmentDate(referenceDate = new Date(), installmentNumber = 1) {
  const date = new Date(referenceDate);
  if (Number.isNaN(date.getTime()) || !Number.isInteger(installmentNumber) || installmentNumber < 1) return null;
  const result = new Date(date);
  result.setMonth(result.getMonth() + installmentNumber - 1);
  if (result.getDate() !== date.getDate()) result.setDate(0);
  return result;
}

export function getRemainingInstallments(tenure) {
  return Number.isInteger(tenure) && tenure > 0 ? tenure - 1 : null;
}

export function buildRepaymentPreview(plan, referenceDate = new Date()) {
  if (!plan || !Number.isFinite(plan.monthlyAmount) || !Number.isInteger(plan.tenure) || plan.tenure < 1) return [];
  const visibleNumbers = plan.tenure <= 4 ? Array.from({ length: plan.tenure }, (_, index) => index + 1) : [1, 2, 3, plan.tenure];
  return visibleNumbers.map((installmentNumber) => ({ installmentNumber, amount: plan.monthlyAmount, date: getInstallmentDate(referenceDate, installmentNumber), isFirst: installmentNumber === 1, isFinal: installmentNumber === plan.tenure }));
}

export function formatCurrencyINR(value) {
  if (!Number.isFinite(value)) return 'Unavailable';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
}

export function getRecommendedPlan(plans = []) {
  const plansWithTotals = plans.map((plan) => ({ plan, total: calculateTotalPayable(plan) })).filter(({ total }) => total !== null);
  if (plansWithTotals.length < 2) return null;

  const lowestTotal = Math.min(...plansWithTotals.map(({ total }) => total));
  const lowestPlans = plansWithTotals.filter(({ total }) => total === lowestTotal);
  return lowestPlans.length === 1 ? lowestPlans[0].plan : null;
}

export function calculateDemoInvestmentCoverage(plan) {
  if (!plan || !Number.isFinite(plan.monthlyAmount)) return null;
  return Math.round(plan.monthlyAmount * 0.2);
}

export function getDemoEligibility(investmentValue, productPrice) {
  if (!Number.isFinite(investmentValue) || !Number.isFinite(productPrice) || productPrice <= 0) return 'additional-verification';
  return investmentValue >= productPrice * 0.75 ? 'eligible' : 'additional-verification';
}

export function formatInterestRate(interestRate) {
  if (!Number.isFinite(interestRate)) return 'Interest rate unavailable';
  return `${interestRate}% interest`;
}
