// rebalancingLogic.ts
export interface PortfolioItem {
    id: number;
    name: string;
    currentValue: number;
    targetAllocation: number; // fraction (e.g. 0.08 for 8%)
  }
  
  export interface RebalanceResult {
    id: number;
    proposedDelta: number;
    beforeDeltaPercent: number;
    afterDeltaPercent: number;
  }
  
  /**
   * Given the portfolio items and a new investment amount, this function calculates
   * for each position a proposed delta (additional investment) that uses the new investment
   * to reduce the need for selling. It also returns the before and after allocation deltas
   * (in percentage points) relative to the target allocation.
   */
  export function calculateRebalancing(
    portfolioItems: PortfolioItem[],
    newInvestment: number
  ): RebalanceResult[] {
    const currentTotal = portfolioItems.reduce((sum, item) => sum + item.currentValue, 0);
    const futureTotal = currentTotal + newInvestment;
  
    // Compute the ideal value for each position (target percentage of future total)
    const idealValues = portfolioItems.map(item => item.targetAllocation * futureTotal);
  
    // Compute how much each position would “need” to reach its ideal value
    const needed = portfolioItems.map((item, index) => {
      const diff = idealValues[index] - item.currentValue;
      return diff > 0 ? diff : 0;
    });
  
    const sumNeeded = needed.reduce((sum, value) => sum + value, 0);
  
    let proposedDeltas: number[] = [];
    if (sumNeeded > 0) {
      if (sumNeeded >= newInvestment) {
        // Scale down each needed amount proportionally so the total equals newInvestment
        proposedDeltas = needed.map(amount => amount * (newInvestment / sumNeeded));
      } else {
        // Fully allocate the needed amounts
        const initialDeltas = needed;
        const allocated = initialDeltas.reduce((sum, value) => sum + value, 0);
        const remaining = newInvestment - allocated;
        // Distribute any extra money proportionally based on targetAllocation
        const extra = portfolioItems.map(item => remaining * item.targetAllocation);
        proposedDeltas = portfolioItems.map((_, index) => initialDeltas[index] + extra[index]);
      }
    } else {
      // All positions are currently above their ideal values. In this case,
      // simply distribute the new investment proportionally to targetAllocation.
      proposedDeltas = portfolioItems.map(item => newInvestment * item.targetAllocation);
    }
  
    // Compute the percentage delta before and after rebalancing:
    // - "before": current percentage minus target (in percentage points)
    // - "after": new percentage (with proposed delta) minus target
    return portfolioItems.map((item, index) => {
      const beforePerc = currentTotal > 0 ? item.currentValue / currentTotal : 0;
      const afterPerc = futureTotal > 0 ? (item.currentValue + proposedDeltas[index]) / futureTotal : 0;
      const beforeDeltaPercent = (beforePerc - item.targetAllocation) * 100;
      const afterDeltaPercent = (afterPerc - item.targetAllocation) * 100;
      return {
        id: item.id,
        proposedDelta: proposedDeltas[index],
        beforeDeltaPercent,
        afterDeltaPercent,
      };
    });
  }
  