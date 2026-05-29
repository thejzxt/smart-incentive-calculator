export function calculateIncentive(units, slabs) {
  if (!slabs || !Array.isArray(slabs) || slabs.length === 0 || typeof units !== "number" || units <= 0) {
    return { slab: null, payoutPerUnit: 0, total: 0 };
  }


  const sortedSlabs = [...slabs].sort((a, b) => a.min - b.min);


  const matchedSlab = sortedSlabs.find(slab => {
    const minOk = units >= slab.min;
    const maxOk = slab.max === null || slab.max === undefined || units <= slab.max;
    return minOk && maxOk;
  });

  if (matchedSlab) {
    return {
      slab: matchedSlab,
      payoutPerUnit: matchedSlab.payout,
      total: units * matchedSlab.payout
    };
  }

  return { slab: null, payoutPerUnit: 0, total: 0 };
}
