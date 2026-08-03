export function calculatePoints(tokens, pricePerMillion) {
  const totalTokens = Math.max(0, Number(tokens) || 0);
  const price = Math.max(0, Number(pricePerMillion) || 0);
  return Number(((totalTokens * price) / 1000000).toFixed(4));
}
