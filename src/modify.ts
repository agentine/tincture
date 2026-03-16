import { TinctureColor } from "./color.js";
import { hslToRgb } from "./convert.js";
import { clamp } from "./util.js";

/**
 * Build a TinctureColor from HSL (h 0-360, s/l 0-1) and alpha.
 */
function fromHsl(h: number, s: number, l: number, a: number): TinctureColor {
  const rgb = hslToRgb(h, s, l);
  return new TinctureColor({
    r: rgb.r * 255,
    g: rgb.g * 255,
    b: rgb.b * 255,
  }).setAlpha(a);
}

/**
 * Lighten a color by increasing its lightness in HSL space.
 * Amount is 0–100 (default 10).
 */
export function lighten(color: TinctureColor, amount = 10): TinctureColor {
  const hsl = color.toHsl();
  hsl.l = clamp(hsl.l + amount / 100, 0, 1);
  return fromHsl(hsl.h, hsl.s, hsl.l, hsl.a);
}

/**
 * Brighten a color by increasing RGB values directly.
 * Amount is 0–100 (default 10).
 */
export function brighten(color: TinctureColor, amount = 10): TinctureColor {
  const rgb = color.toRgb();
  rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
  rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
  rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
  return new TinctureColor(rgb);
}

/**
 * Darken a color by decreasing its lightness in HSL space.
 * Amount is 0–100 (default 10).
 */
export function darken(color: TinctureColor, amount = 10): TinctureColor {
  const hsl = color.toHsl();
  hsl.l = clamp(hsl.l - amount / 100, 0, 1);
  return fromHsl(hsl.h, hsl.s, hsl.l, hsl.a);
}

/**
 * Saturate a color by increasing saturation in HSL space.
 * Amount is 0–100 (default 10).
 */
export function saturate(color: TinctureColor, amount = 10): TinctureColor {
  const hsl = color.toHsl();
  hsl.s = clamp(hsl.s + amount / 100, 0, 1);
  return fromHsl(hsl.h, hsl.s, hsl.l, hsl.a);
}

/**
 * Desaturate a color by decreasing saturation in HSL space.
 * Amount is 0–100 (default 10).
 */
export function desaturate(color: TinctureColor, amount = 10): TinctureColor {
  const hsl = color.toHsl();
  hsl.s = clamp(hsl.s - amount / 100, 0, 1);
  return fromHsl(hsl.h, hsl.s, hsl.l, hsl.a);
}

/**
 * Completely desaturate a color — alias for desaturate(100).
 */
export function greyscale(color: TinctureColor): TinctureColor {
  return desaturate(color, 100);
}

/**
 * Spin the hue by a given amount in degrees (-360 to 360).
 */
export function spin(color: TinctureColor, amount: number): TinctureColor {
  const hsl = color.toHsl();
  const hue = (hsl.h + amount) % 360;
  hsl.h = hue < 0 ? hue + 360 : hue;
  return fromHsl(hsl.h, hsl.s, hsl.l, hsl.a);
}
