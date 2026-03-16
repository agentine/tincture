import { bound01, boundAlpha, convertToPercentage, isPercentage } from "./util.js";
import { names } from "./names.js";
import { hslToRgb, hsvToRgb } from "./convert.js";

export type ColorFormat =
  | "hex"
  | "hex3"
  | "hex4"
  | "hex6"
  | "hex8"
  | "rgb"
  | "rgba"
  | "hsl"
  | "hsla"
  | "hsv"
  | "hsva"
  | "name"
  | "transparent";

export interface ParsedColor {
  r: number; // 0–255
  g: number; // 0–255
  b: number; // 0–255
  a: number; // 0–1
  format: ColorFormat | null;
  ok: boolean;
}

export interface RgbInput {
  r: number | string;
  g: number | string;
  b: number | string;
  a?: number | string;
}

export interface HslInput {
  h: number | string;
  s: number | string;
  l: number | string;
  a?: number | string;
}

export interface HsvInput {
  h: number | string;
  s: number | string;
  v: number | string;
  a?: number | string;
}

export type ColorInput = string | RgbInput | HslInput | HsvInput;

// Regex matchers for CSS color strings
const matchers = {
  // <int> or <percentage>
  CSS_UNIT: "(?:" + "[-\\+]?\\d*\\.?\\d+(?:%)?)" + "(?:\\s*,\\s*|\\s+)",
  CSS_UNIT_LAST: "(?:" + "[-\\+]?\\d*\\.?\\d+(?:%)?)" + "(?:\\s*/\\s*)?",
  ALPHA: "(?:\\s*/\\s*)?(?:[-\\+]?\\d*\\.?\\d+(?:%)?)?",
};

const PERMISSIVE_MATCH3 =
  "[\\s|\\(]+(" +
  matchers.CSS_UNIT +
  ")(" +
  matchers.CSS_UNIT +
  ")(" +
  matchers.CSS_UNIT_LAST +
  ")\\s*\\)?";
const PERMISSIVE_MATCH4 =
  "[\\s|\\(]+(" +
  matchers.CSS_UNIT +
  ")(" +
  matchers.CSS_UNIT +
  ")(" +
  matchers.CSS_UNIT +
  ")(" +
  matchers.CSS_UNIT_LAST +
  ")\\s*\\)?";

const regex = {
  rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
  rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
  hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
  hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
  hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
  hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
  hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
  hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
};

const INVALID: ParsedColor = { r: 0, g: 0, b: 0, a: 1, format: null, ok: false };

/**
 * Parse any tinycolor2-compatible color input into normalized RGBA.
 */
export function parseColor(input: ColorInput): ParsedColor {
  if (!input) {
    return { ...INVALID };
  }

  // Object input
  if (typeof input === "object") {
    return parseObject(input);
  }

  // String input
  let str = input.trim().toLowerCase();

  // Named color
  if (str === "transparent") {
    return { r: 0, g: 0, b: 0, a: 0, format: "transparent", ok: true };
  }

  if (names[str]) {
    // Parse the hex value of the named color
    const parsed = parseHex(names[str]!);
    return { ...parsed, format: "name" };
  }

  // Try string matchers in order
  let match: RegExpExecArray | null;

  if ((match = regex.rgb.exec(str))) {
    return {
      r: parseIntFromPercent(match[1]!),
      g: parseIntFromPercent(match[2]!),
      b: parseIntFromPercent(match[3]!),
      a: 1,
      format: "rgb",
      ok: true,
    };
  }

  if ((match = regex.rgba.exec(str))) {
    return {
      r: parseIntFromPercent(match[1]!),
      g: parseIntFromPercent(match[2]!),
      b: parseIntFromPercent(match[3]!),
      a: boundAlpha(match[4]),
      format: "rgba",
      ok: true,
    };
  }

  if ((match = regex.hsl.exec(str))) {
    const rgb = hslToRgb(
      bound01(match[1]!, 360) * 360,
      bound01(convertToPercentage(match[2]!), 100),
      bound01(convertToPercentage(match[3]!), 100),
    );
    return {
      r: rgb.r * 255,
      g: rgb.g * 255,
      b: rgb.b * 255,
      a: 1,
      format: "hsl",
      ok: true,
    };
  }

  if ((match = regex.hsla.exec(str))) {
    const rgb = hslToRgb(
      bound01(match[1]!, 360) * 360,
      bound01(convertToPercentage(match[2]!), 100),
      bound01(convertToPercentage(match[3]!), 100),
    );
    return {
      r: rgb.r * 255,
      g: rgb.g * 255,
      b: rgb.b * 255,
      a: boundAlpha(match[4]),
      format: "hsla",
      ok: true,
    };
  }

  if ((match = regex.hsv.exec(str))) {
    const rgb = hsvToRgb(
      bound01(match[1]!, 360) * 360,
      bound01(convertToPercentage(match[2]!), 100),
      bound01(convertToPercentage(match[3]!), 100),
    );
    return {
      r: rgb.r * 255,
      g: rgb.g * 255,
      b: rgb.b * 255,
      a: 1,
      format: "hsv",
      ok: true,
    };
  }

  if ((match = regex.hsva.exec(str))) {
    const rgb = hsvToRgb(
      bound01(match[1]!, 360) * 360,
      bound01(convertToPercentage(match[2]!), 100),
      bound01(convertToPercentage(match[3]!), 100),
    );
    return {
      r: rgb.r * 255,
      g: rgb.g * 255,
      b: rgb.b * 255,
      a: boundAlpha(match[4]),
      format: "hsva",
      ok: true,
    };
  }

  // Hex formats
  const hexResult = parseHex(str);
  if (hexResult.ok) {
    return hexResult;
  }

  return { ...INVALID };
}

function parseHex(str: string): ParsedColor {
  let match: RegExpExecArray | null;

  if ((match = regex.hex8.exec(str))) {
    return {
      r: parseInt(match[1]!, 16),
      g: parseInt(match[2]!, 16),
      b: parseInt(match[3]!, 16),
      a: parseInt(match[4]!, 16) / 255,
      format: "hex8",
      ok: true,
    };
  }

  if ((match = regex.hex6.exec(str))) {
    return {
      r: parseInt(match[1]!, 16),
      g: parseInt(match[2]!, 16),
      b: parseInt(match[3]!, 16),
      a: 1,
      format: "hex6",
      ok: true,
    };
  }

  if ((match = regex.hex4.exec(str))) {
    return {
      r: parseInt(match[1]! + match[1]!, 16),
      g: parseInt(match[2]! + match[2]!, 16),
      b: parseInt(match[3]! + match[3]!, 16),
      a: parseInt(match[4]! + match[4]!, 16) / 255,
      format: "hex4",
      ok: true,
    };
  }

  if ((match = regex.hex3.exec(str))) {
    return {
      r: parseInt(match[1]! + match[1]!, 16),
      g: parseInt(match[2]! + match[2]!, 16),
      b: parseInt(match[3]! + match[3]!, 16),
      a: 1,
      format: "hex3",
      ok: true,
    };
  }

  return { ...INVALID };
}

function parseObject(input: RgbInput | HslInput | HsvInput): ParsedColor {
  // Check for RGB
  if ("r" in input) {
    const rgbInput = input as RgbInput;
    return {
      r: parseIntFromPercent(rgbInput.r),
      g: parseIntFromPercent(rgbInput.g),
      b: parseIntFromPercent(rgbInput.b),
      a: boundAlpha(rgbInput.a ?? 1),
      format: rgbInput.a !== undefined ? "rgba" : "rgb",
      ok: true,
    };
  }

  // Check for HSL
  if ("l" in input) {
    const hslInput = input as HslInput;
    const s = bound01(convertToPercentage(hslInput.s), 100);
    const l = bound01(convertToPercentage(hslInput.l), 100);
    const h = bound01(hslInput.h, 360) * 360;
    const rgb = hslToRgb(h, s, l);
    return {
      r: rgb.r * 255,
      g: rgb.g * 255,
      b: rgb.b * 255,
      a: boundAlpha(hslInput.a ?? 1),
      format: hslInput.a !== undefined ? "hsla" : "hsl",
      ok: true,
    };
  }

  // Check for HSV
  if ("v" in input) {
    const hsvInput = input as HsvInput;
    const s = bound01(convertToPercentage(hsvInput.s), 100);
    const v = bound01(convertToPercentage(hsvInput.v), 100);
    const h = bound01(hsvInput.h, 360) * 360;
    const rgb = hsvToRgb(h, s, v);
    return {
      r: rgb.r * 255,
      g: rgb.g * 255,
      b: rgb.b * 255,
      a: boundAlpha(hsvInput.a ?? 1),
      format: hsvInput.a !== undefined ? "hsva" : "hsv",
      ok: true,
    };
  }

  return { ...INVALID };
}

/**
 * Parse a value that may be a number, percentage, or string into a 0–255 int.
 */
function parseIntFromPercent(val: number | string): number {
  if (typeof val === "number") {
    return isNaN(val) ? 0 : val;
  }
  if (isPercentage(val)) {
    const n = parseFloat(val);
    return isNaN(n) ? 0 : (n / 100) * 255;
  }
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
}
