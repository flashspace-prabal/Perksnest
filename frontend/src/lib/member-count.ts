function readPositiveNumber(...values: unknown[]): number {
  for (const value of values) {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return 0;
}

export function getStableMemberCount(seed: string): number {
  const normalizedSeed = seed || "perksnest-deal";
  let hash = 0;

  for (let index = 0; index < normalizedSeed.length; index += 1) {
    hash = (hash * 31 + normalizedSeed.charCodeAt(index)) >>> 0;
  }

  return 500 + (hash % 4500);
}

export function normalizeMemberCount(rawDeal: Record<string, any>, fallbackSeed?: string): number {
  const explicitCount = readPositiveNumber(
    rawDeal.member_count,
    rawDeal.memberCount,
    rawDeal.claims,
    rawDeal.claim_count,
    rawDeal.claimCount,
    rawDeal.socialProof?.redeemedCount
  );

  if (explicitCount > 0) {
    return explicitCount;
  }

  return getStableMemberCount(fallbackSeed || rawDeal.slug || rawDeal.id || rawDeal.name);
}
