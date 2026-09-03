import { getRecommendedPlan } from '../../utils/emiHelpers';
import { EmiCard } from './EmiCard';

export function EmiPlans({ plans, selectedPlan, onSelect }) {
  const recommendedPlan = getRecommendedPlan(plans);

  if (!plans.length) return <div className="rounded-xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-600">No EMI plans are currently available for this variant.</div>;

  return <div className="grid gap-3 sm:grid-cols-2">{plans.map((plan, index) => <EmiCard isRecommended={recommendedPlan?.id === plan.id} isSelected={selectedPlan?.id === plan.id} key={plan.id || `${plan.tenure}-${plan.monthlyAmount}-${index}`} onSelect={onSelect} plan={plan} />)}</div>;
}
