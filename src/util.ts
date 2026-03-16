/**
 * Clamp a value between min and max.
 */
export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

/**
 * Normalize a value to 0–1 range given its maximum.
 * Handles percentages ("50%"), numbers, and 0–1 float strings.
 */
export function bound01(value: number | string, max: number): number {
  if (isOnePointZero(value)) {
    value = "100%";
  }

  const isPercent = isPercentage(value);
  const parsed = parseFloat(String(value));
  value = isNaN(parsed) ? 0 : Math.min(max, Math.max(0, parsed));

  // Automatically convert percentage into number
  if (isPercent) {
    value = (value * max) / 100;
  }

  // Handle floating point rounding errors
  if (Math.abs(value - max) < 0.000001) {
    return 1;
  }

  // Convert into [0, 1] range
  return (value % max) / max;
}

/**
 * Pad a hex string to 2 characters.
 */
export function pad2(str: string): string {
  return str.length === 1 ? "0" + str : str;
}

/**
 * Convert n to percentage if it isn't already.
 * Values <= 1 are treated as ratios and converted to percentage strings.
 * Values > 1 are left unchanged (already absolute).
 * Percentage strings are returned as-is.
 */
export function convertToPercentage(n: number | string): number | string {
  if (typeof n === "string" && n.indexOf("%") !== -1) {
    return n;
  }
  if (Number(n) <= 1) {
    return Number(n) * 100 + "%";
  }
  return n;
}

/**
 * Ensure alpha is between 0 and 1.
 */
export function boundAlpha(a: unknown): number {
  a = parseFloat(a as string);
  if (isNaN(a as number) || (a as number) < 0 || (a as number) > 1) {
    a = 1;
  }
  return a as number;
}

/**
 * Check if value looks like a CSS 0–1 float (e.g., "0.5").
 * These need to be treated as ratios rather than absolutes.
 */
export function isOnePointZero(n: number | string): boolean {
  return typeof n === "string" && n.indexOf(".") !== -1 && parseFloat(n) === 1;
}

/**
 * Check if value is a percentage string (e.g., "50%").
 */
export function isPercentage(n: number | string): boolean {
  return typeof n === "string" && n.indexOf("%") !== -1;
}

/**
 * Convert a decimal number to a 2-char hex string.
 */
export function convertDecimalToHex(d: number | string): string {
  return Math.round(parseFloat(String(d)) * 255).toString(16);
}

/**
 * Convert a hex string to a decimal (0–1).
 */
export function convertHexToDecimal(h: string): number {
  return parseInt(h, 16) / 255;
}
