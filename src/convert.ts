/**
 * Color space conversions.
 * All functions work with normalized values: r/g/b in 0–1, h in 0–360, s/l/v in 0–1.
 */

export interface RgbNorm {
  r: number;
  g: number;
  b: number;
}

/**
 * Convert RGB to HSL.
 * Input: r, g, b in 0–1. Output: h in 0–360, s and l in 0–1.
 */
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s, l };
}

/**
 * Convert HSL to RGB.
 * Input: h in 0–360, s and l in 0–1. Output: r, g, b in 0–1.
 */
export function hslToRgb(h: number, s: number, l: number): RgbNorm {
  h = h / 360;

  if (s === 0) {
    return { r: l, g: l, b: l };
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: hue2rgb(p, q, h + 1 / 3),
    g: hue2rgb(p, q, h),
    b: hue2rgb(p, q, h - 1 / 3),
  };
}

function hue2rgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

/**
 * Convert RGB to HSV.
 * Input: r, g, b in 0–1. Output: h in 0–360, s and v in 0–1.
 */
export function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  let h = 0;

  if (max !== min) {
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s, v };
}

/**
 * Convert HSV to RGB.
 * Input: h in 0–360, s and v in 0–1. Output: r, g, b in 0–1.
 */
export function hsvToRgb(h: number, s: number, v: number): RgbNorm {
  h = (h / 360) * 6;
  const i = Math.floor(h);
  const f = h - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  const mod = i % 6;

  const r = [v, q, p, p, t, v][mod]!;
  const g = [t, v, v, q, p, p][mod]!;
  const b = [p, p, t, v, v, q][mod]!;

  return { r, g, b };
}

/**
 * Convert RGB (0–255) to hex string (6 chars, no #).
 */
export function rgbToHex(r: number, g: number, b: number, allowShort = false): string {
  const hex = [
    pad(Math.round(r).toString(16)),
    pad(Math.round(g).toString(16)),
    pad(Math.round(b).toString(16)),
  ];

  if (
    allowShort &&
    hex[0]![0] === hex[0]![1] &&
    hex[1]![0] === hex[1]![1] &&
    hex[2]![0] === hex[2]![1]
  ) {
    return hex[0]![0]! + hex[1]![0]! + hex[2]![0]!;
  }

  return hex.join("");
}

/**
 * Convert RGBA (0–255 for rgb, 0–1 for a) to 8-char hex string (no #).
 */
export function rgbaToHex(
  r: number,
  g: number,
  b: number,
  a: number,
  allowShort = false,
): string {
  const hex = [
    pad(Math.round(r).toString(16)),
    pad(Math.round(g).toString(16)),
    pad(Math.round(b).toString(16)),
    pad(Math.round(a * 255).toString(16)),
  ];

  if (
    allowShort &&
    hex[0]![0] === hex[0]![1] &&
    hex[1]![0] === hex[1]![1] &&
    hex[2]![0] === hex[2]![1] &&
    hex[3]![0] === hex[3]![1]
  ) {
    return hex[0]![0]! + hex[1]![0]! + hex[2]![0]! + hex[3]![0]!;
  }

  return hex.join("");
}

function pad(s: string): string {
  return s.length === 1 ? "0" + s : s;
}
