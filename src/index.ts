import { TinctureColor } from "./color.js";
import { bound01 } from "./util.js";
import { mix as _mix } from "./combine.js";
import type { ColorInput } from "./parse.js";

export type { ColorInput, ColorFormat } from "./parse.js";
export { TinctureColor } from "./color.js";

export interface TinctureStatic {
  (input?: ColorInput): TinctureColor;
  fromRatio(input: { r: number | string; g: number | string; b: number | string; a?: number | string }): TinctureColor;
  equals(color1: ColorInput, color2: ColorInput): boolean;
  random(): TinctureColor;
  mix(color1: ColorInput, color2: ColorInput, amount?: number): TinctureColor;
}

function tinctureFactory(input?: ColorInput): TinctureColor {
  return new TinctureColor(input);
}

tinctureFactory.fromRatio = function fromRatio(input: {
  r: number | string;
  g: number | string;
  b: number | string;
  a?: number | string;
}): TinctureColor {
  return new TinctureColor({
    r: bound01(input.r, 1) * 255,
    g: bound01(input.g, 1) * 255,
    b: bound01(input.b, 1) * 255,
    a: input.a !== undefined ? Number(input.a) : undefined,
  });
};

tinctureFactory.equals = function equals(color1: ColorInput, color2: ColorInput): boolean {
  const c1 = new TinctureColor(color1);
  const c2 = new TinctureColor(color2);
  return c1.toHex8String() === c2.toHex8String();
};

tinctureFactory.random = function random(): TinctureColor {
  return new TinctureColor({
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  });
};

tinctureFactory.mix = function mix(
  color1: ColorInput,
  color2: ColorInput,
  amount = 50,
): TinctureColor {
  return _mix(new TinctureColor(color1), new TinctureColor(color2), amount);
};

export const tincture: TinctureStatic = tinctureFactory as TinctureStatic;
export default tincture;
