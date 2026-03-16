import { TinctureColor } from "./color.js";
import { hslToRgb, hsvToRgb } from "./convert.js";

/**
 * Return the complement (spin 180).
 */
export function complement(color: TinctureColor): TinctureColor {
  return color.spin(180);
}

/**
 * Return a split-complement palette: [self, spin(72), spin(216)].
 */
export function splitcomplement(color: TinctureColor): TinctureColor[] {
  return [color, color.spin(72), color.spin(216)];
}

/**
 * Return a triad palette: [self, spin(120), spin(240)].
 */
export function triad(color: TinctureColor): TinctureColor[] {
  return [color, color.spin(120), color.spin(240)];
}

/**
 * Return a tetrad palette: [self, spin(90), spin(180), spin(270)].
 */
export function tetrad(color: TinctureColor): TinctureColor[] {
  return [color, color.spin(90), color.spin(180), color.spin(270)];
}

/**
 * Generate analogous colors by rotating hue in small steps.
 * results: total number of colors (default 6), slices: hue span (default 30).
 */
export function analogous(
  color: TinctureColor,
  results = 6,
  slices = 30,
): TinctureColor[] {
  const hsl = color.toHsl();
  const part = 360 / slices;
  const ret: TinctureColor[] = [color];

  // tinycolor2 moves hue both directions from center
  hsl.h = ((hsl.h - ((part * results) >> 1)) + 720) % 360;
  for (let i = 1; i < results; i++) {
    hsl.h = (hsl.h + part) % 360;
    const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    const c = new TinctureColor({
      r: rgb.r * 255,
      g: rgb.g * 255,
      b: rgb.b * 255,
    }).setAlpha(hsl.a);
    ret.push(c);
  }

  return ret;
}

/**
 * Generate monochromatic palette by varying HSV value.
 * results: number of colors (default 6).
 */
export function monochromatic(
  color: TinctureColor,
  results = 6,
): TinctureColor[] {
  const hsv = color.toHsv();
  const h = hsv.h;
  let s = hsv.s;
  let v = hsv.v;
  const ret: TinctureColor[] = [];
  const modification = 1 / results;

  for (let i = 0; i < results; i++) {
    const rgb = hsvToRgb(h, s, v);
    ret.push(
      new TinctureColor({
        r: rgb.r * 255,
        g: rgb.g * 255,
        b: rgb.b * 255,
      }).setAlpha(hsv.a),
    );
    v = (v + modification) % 1;
  }

  return ret;
}

/**
 * Mix two colors by linear RGB interpolation.
 * amount: 0 = all color1, 100 = all color2 (default 50).
 */
export function mix(
  color1: TinctureColor,
  color2: TinctureColor,
  amount = 50,
): TinctureColor {
  const p = amount / 100;
  const rgb1 = color1.toRgb();
  const rgb2 = color2.toRgb();

  return new TinctureColor({
    r: (rgb2.r - rgb1.r) * p + rgb1.r,
    g: (rgb2.g - rgb1.g) * p + rgb1.g,
    b: (rgb2.b - rgb1.b) * p + rgb1.b,
    a: (rgb2.a - rgb1.a) * p + rgb1.a,
  });
}
