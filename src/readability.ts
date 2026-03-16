import { TinctureColor } from "./color.js";

export interface ReadabilityOptions {
  level?: "AA" | "AAA";
  size?: "small" | "large";
}

export interface MostReadableOptions extends ReadabilityOptions {
  includeFallbackColors?: boolean;
}

/**
 * Calculate WCAG 2.0 contrast ratio between two colors.
 * Returns a value between 1 and 21.
 */
export function readability(
  color1: TinctureColor,
  color2: TinctureColor,
): number {
  const l1 = color1.getLuminance();
  const l2 = color2.getLuminance();
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check whether two colors meet WCAG readability guidelines.
 * Default: AA level, small text (contrast >= 4.5).
 *
 * Thresholds:
 *   AA  small: 4.5
 *   AA  large: 3
 *   AAA small: 7
 *   AAA large: 4.5
 */
export function isReadable(
  color1: TinctureColor,
  color2: TinctureColor,
  options?: ReadabilityOptions,
): boolean {
  const ratio = readability(color1, color2);
  const level = options?.level ?? "AA";
  const size = options?.size ?? "small";

  if (level === "AAA") {
    return size === "large" ? ratio >= 4.5 : ratio >= 7;
  }
  // AA
  return size === "large" ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Return the color from `colorList` with the highest contrast against `baseColor`.
 * If `includeFallbackColors` is true, black and white are appended to the list
 * when no color meets the readability threshold.
 */
export function mostReadable(
  baseColor: TinctureColor,
  colorList: TinctureColor[],
  options?: MostReadableOptions,
): TinctureColor {
  let bestColor: TinctureColor | null = null;
  let bestScore = 0;
  let bestIsReadable = false;

  for (const candidate of colorList) {
    const score = readability(baseColor, candidate);
    const readable = isReadable(baseColor, candidate, options);

    if (readable && score > bestScore) {
      bestColor = candidate;
      bestScore = score;
      bestIsReadable = true;
    } else if (!bestIsReadable && score > bestScore) {
      bestColor = candidate;
      bestScore = score;
    }
  }

  if (!bestIsReadable && options?.includeFallbackColors) {
    const fallbacks = [
      new TinctureColor("#fff"),
      new TinctureColor("#000"),
    ];
    for (const fb of fallbacks) {
      const score = readability(baseColor, fb);
      if (score > bestScore) {
        bestColor = fb;
        bestScore = score;
      }
    }
  }

  return bestColor ?? new TinctureColor("#000");
}
