import assert from 'node:assert/strict';
import { buildRepaymentPreview, calculateReducingBalancePayment, calculateScheduledRepayment, getDemoEligibility, getFirstPaymentAmount, getInstallmentDate, getNextDueDate, getRemainingInstallments } from './emiHelpers.js';

const plan = { monthlyAmount: 11242, tenure: 12, interestRate: 0, cashback: 5000 };
const referenceDate = new Date('2026-09-03T00:00:00.000Z');
assert.equal(calculateScheduledRepayment(plan), 134904);
assert.equal(Math.round(calculateReducingBalancePayment(100000, 10.5, 36)), 3250);
assert.equal(getFirstPaymentAmount(plan), 11242);
assert.equal(getNextDueDate(referenceDate).toISOString().slice(0, 10), '2026-10-03');
assert.equal(getInstallmentDate(referenceDate, 3).toISOString().slice(0, 10), '2026-11-03');
assert.equal(getRemainingInstallments(12), 11);
assert.equal(buildRepaymentPreview({ ...plan, tenure: 60 }, referenceDate).length, 4);
assert.equal(getDemoEligibility(80000, 100000), 'eligible');
assert.equal(getDemoEligibility(70000, 100000), 'additional-verification');
console.log('EMI utility tests passed.');