/** @deprecated Use formatAtomic instead */
export function weiToEth(wei: string): string {
  return formatAtomic(wei);
}

/**
 * Format an atomic amount for display.
 * Reads NEXT_PUBLIC_CHAIN_TYPE to determine decimals and symbol.
 * Defaults to ETH (18 decimals) if chain type is not set.
 */
export function formatAtomic(amount: string): string {
  const chainType = process.env.NEXT_PUBLIC_CHAIN_TYPE ?? "evm";
  const decimals = chainType === "onechain" ? 9 : 18;
  const symbol = chainType === "onechain" ? "OCT" : "ETH";
  try {
    const n = BigInt(amount);
    const divisor = BigInt(10 ** decimals);
    const whole = n / divisor;
    const frac = n % divisor;
    const fracStr = frac.toString().padStart(decimals, "0").slice(0, 4);
    return `${whole}.${fracStr} ${symbol}`;
  } catch {
    return `0.0000 ${symbol}`;
  }
}

export function truncateAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
