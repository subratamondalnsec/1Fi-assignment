export function calculateTotalPayable(plan) {
  if (!plan || !Number.isFinite(plan.monthlyAmount) || !Number.isFinite(plan.tenure)) return null;
  return plan.monthlyAmount * plan.tenure;
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

export function formatInterestRate(interestRate) {
  if (!Number.isFinite(interestRate)) return 'Interest rate unavailable';
  return `${interestRate}% interest`;
}
