// Drop-in tinycolor2 compatibility layer
// Allows zero-change migration: replace `import tinycolor from "tinycolor2"`
// with `import tinycolor from "@agentine/tincture/compat/tinycolor2"`

import { TinctureColor } from "../color.js";
import { bound01 } from "../util.js";
import { mix as _mix } from "../combine.js";
import {
  readability as _readability,
  isReadable as _isReadable,
  mostReadable as _mostReadable,
  type ReadabilityOptions,
  type MostReadableOptions,
} from "../readability.js";
import type { ColorInput } from "../parse.js";

export type { ColorInput } from "../parse.js";
export { TinctureColor } from "../color.js";

export interface TinyColorStatic {
  (input?: ColorInput): TinctureColor;
  fromRatio(input: {
    r: number | string;
    g: number | string;
    b: number | string;
    a?: number | string;
  }): TinctureColor;
  equals(color1: ColorInput, color2: ColorInput): boolean;
  mix(
    color1: ColorInput,
    color2: ColorInput,
    amount?: number,
  ): TinctureColor;
  random(): TinctureColor;
  readability(color1: ColorInput, color2: ColorInput): number;
  isReadable(
    color1: ColorInput,
    color2: ColorInput,
    options?: ReadabilityOptions,
  ): boolean;
  mostReadable(
    baseColor: ColorInput,
    colorList: ColorInput[],
    options?: MostReadableOptions,
  ): TinctureColor;
}

function tinycolorFactory(input?: ColorInput): TinctureColor {
  return new TinctureColor(input);
}

tinycolorFactory.fromRatio = function fromRatio(input: {
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

tinycolorFactory.equals = function equals(
  color1: ColorInput,
  color2: ColorInput,
): boolean {
  const c1 = new TinctureColor(color1);
  const c2 = new TinctureColor(color2);
  return c1.toHex8String() === c2.toHex8String();
};

tinycolorFactory.mix = function mix(
  color1: ColorInput,
  color2: ColorInput,
  amount = 50,
): TinctureColor {
  return _mix(new TinctureColor(color1), new TinctureColor(color2), amount);
};

tinycolorFactory.random = function random(): TinctureColor {
  return new TinctureColor({
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  });
};

tinycolorFactory.readability = function readability(
  color1: ColorInput,
  color2: ColorInput,
): number {
  return _readability(new TinctureColor(color1), new TinctureColor(color2));
};

tinycolorFactory.isReadable = function isReadable(
  color1: ColorInput,
  color2: ColorInput,
  options?: ReadabilityOptions,
): boolean {
  return _isReadable(
    new TinctureColor(color1),
    new TinctureColor(color2),
    options,
  );
};

tinycolorFactory.mostReadable = function mostReadable(
  baseColor: ColorInput,
  colorList: ColorInput[],
  options?: MostReadableOptions,
): TinctureColor {
  return _mostReadable(
    new TinctureColor(baseColor),
    colorList.map((c) => new TinctureColor(c)),
    options,
  );
};

const tinycolor: TinyColorStatic = tinycolorFactory as TinyColorStatic;
export { tinycolor };
export default tinycolor;
