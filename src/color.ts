import { parseColor, type ColorInput, type ColorFormat } from "./parse.js";
import {
  rgbToHsl,
  rgbToHsv,
  rgbToHex,
  rgbaToHex,
} from "./convert.js";
import { boundAlpha } from "./util.js";
import { getHexNames } from "./names.js";
import {
  lighten as _lighten,
  brighten as _brighten,
  darken as _darken,
  saturate as _saturate,
  desaturate as _desaturate,
  greyscale as _greyscale,
  spin as _spin,
} from "./modify.js";
import {
  complement as _complement,
  splitcomplement as _splitcomplement,
  triad as _triad,
  tetrad as _tetrad,
  analogous as _analogous,
  monochromatic as _monochromatic,
} from "./combine.js";

export class TinctureColor {
  private _originalInput: ColorInput | TinctureColor;
  private _r: number; // 0–255
  private _g: number; // 0–255
  private _b: number; // 0–255
  private _a: number; // 0–1
  private _format: ColorFormat | null;
  private _ok: boolean;
  private _roundA: number;

  constructor(input: ColorInput | TinctureColor = "") {
    this._originalInput = input;
    if (input instanceof TinctureColor) {
      this._r = input._r;
      this._g = input._g;
      this._b = input._b;
      this._a = input._a;
      this._format = input._format;
      this._ok = input._ok;
      this._roundA = input._roundA;
      return;
    }
    const parsed = parseColor(input);
    this._r = parsed.r;
    this._g = parsed.g;
    this._b = parsed.b;
    this._a = parsed.a;
    this._format = parsed.format;
    this._ok = parsed.ok;
    this._roundA = Math.round(100 * this._a) / 100;
  }

  // ---- Properties ----

  isValid(): boolean {
    return this._ok;
  }

  getFormat(): ColorFormat | null {
    return this._format;
  }

  getOriginalInput(): ColorInput | TinctureColor {
    return this._originalInput;
  }

  getAlpha(): number {
    return this._a;
  }

  setAlpha(value: number): TinctureColor {
    this._a = boundAlpha(value);
    this._roundA = Math.round(100 * this._a) / 100;
    return this;
  }

  getBrightness(): number {
    const rgb = this.toRgb();
    return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  }

  getLuminance(): number {
    const rgb = this.toRgb();
    const rsRGB = rgb.r / 255;
    const gsRGB = rgb.g / 255;
    const bsRGB = rgb.b / 255;

    const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  isLight(): boolean {
    return this.getBrightness() > 128;
  }

  isDark(): boolean {
    return this.getBrightness() <= 128;
  }

  // ---- Conversion Methods ----

  toRgb(): { r: number; g: number; b: number; a: number } {
    return {
      r: Math.round(this._r),
      g: Math.round(this._g),
      b: Math.round(this._b),
      a: this._a,
    };
  }

  toRgbString(): string {
    const rgb = this.toRgb();
    return this._a < 1
      ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this._roundA})`
      : `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  }

  toPercentageRgb(): { r: string; g: string; b: string; a: number } {
    return {
      r: Math.round(this._r / 255 * 100) + "%",
      g: Math.round(this._g / 255 * 100) + "%",
      b: Math.round(this._b / 255 * 100) + "%",
      a: this._a,
    };
  }

  toPercentageRgbString(): string {
    const prgb = this.toPercentageRgb();
    return this._a < 1
      ? `rgba(${prgb.r}, ${prgb.g}, ${prgb.b}, ${this._roundA})`
      : `rgb(${prgb.r}, ${prgb.g}, ${prgb.b})`;
  }

  toHex(allowShort = false): string {
    return rgbToHex(this._r, this._g, this._b, allowShort);
  }

  toHexString(allowShort = false): string {
    return "#" + this.toHex(allowShort);
  }

  toHex8(allowShort = false): string {
    return rgbaToHex(this._r, this._g, this._b, this._a, allowShort);
  }

  toHex8String(allowShort = false): string {
    return "#" + this.toHex8(allowShort);
  }

  toHsl(): { h: number; s: number; l: number; a: number } {
    const hsl = rgbToHsl(this._r / 255, this._g / 255, this._b / 255);
    return { h: hsl.h, s: hsl.s, l: hsl.l, a: this._a };
  }

  toHslString(): string {
    const hsl = this.toHsl();
    const h = Math.round(hsl.h);
    const s = Math.round(hsl.s * 100);
    const l = Math.round(hsl.l * 100);
    return this._a < 1
      ? `hsla(${h}, ${s}%, ${l}%, ${this._roundA})`
      : `hsl(${h}, ${s}%, ${l}%)`;
  }

  toHsv(): { h: number; s: number; v: number; a: number } {
    const hsv = rgbToHsv(this._r / 255, this._g / 255, this._b / 255);
    return { h: hsv.h, s: hsv.s, v: hsv.v, a: this._a };
  }

  toHsvString(): string {
    const hsv = this.toHsv();
    const h = Math.round(hsv.h);
    const s = Math.round(hsv.s * 100);
    const v = Math.round(hsv.v * 100);
    return this._a < 1
      ? `hsva(${h}, ${s}%, ${v}%, ${this._roundA})`
      : `hsv(${h}, ${s}%, ${v}%)`;
  }

  toName(): string | false {
    if (this._a === 0) {
      return "transparent";
    }
    if (this._a < 1) {
      return false;
    }
    const hex = rgbToHex(this._r, this._g, this._b);
    const hexNames = getHexNames();
    return hexNames[hex] || false;
  }

  toFilter(): string {
    const hex8 = rgbaToHex(this._r, this._g, this._b, this._a);
    // IE filter format uses AARRGGBB
    const aarrggbb = hex8.slice(6) + hex8.slice(0, 6);
    return `progid:DXImageTransform.Microsoft.gradient(startColorstr=#${aarrggbb},endColorstr=#${aarrggbb})`;
  }

  toString(format?: string): string {
    const fmt = format || this._format;

    switch (fmt) {
      case "rgb":
        return this.toRgbString();
      case "rgba":
        return this.toRgbString();
      case "prgb":
        return this.toPercentageRgbString();
      case "hex":
      case "hex6":
        return this.toHexString();
      case "hex3":
        return this.toHexString(true);
      case "hex4":
        return this.toHex8String(true);
      case "hex8":
        return this.toHex8String();
      case "name": {
        const name = this.toName();
        return name || this.toHexString();
      }
      case "hsl":
        return this.toHslString();
      case "hsla":
        return this.toHslString();
      case "hsv":
        return this.toHsvString();
      case "hsva":
        return this.toHsvString();
      case "transparent":
        return "transparent";
      default:
        // Default: use hex if fully opaque, rgba otherwise
        return this._a < 1 ? this.toRgbString() : this.toHexString();
    }
  }

  // ---- Modification Methods ----

  lighten(amount = 10): TinctureColor {
    return _lighten(this, amount);
  }

  brighten(amount = 10): TinctureColor {
    return _brighten(this, amount);
  }

  darken(amount = 10): TinctureColor {
    return _darken(this, amount);
  }

  saturate(amount = 10): TinctureColor {
    return _saturate(this, amount);
  }

  desaturate(amount = 10): TinctureColor {
    return _desaturate(this, amount);
  }

  greyscale(): TinctureColor {
    return _greyscale(this);
  }

  spin(amount: number): TinctureColor {
    return _spin(this, amount);
  }

  // ---- Combination Methods ----

  complement(): TinctureColor {
    return _complement(this);
  }

  splitcomplement(): TinctureColor[] {
    return _splitcomplement(this);
  }

  triad(): TinctureColor[] {
    return _triad(this);
  }

  tetrad(): TinctureColor[] {
    return _tetrad(this);
  }

  analogous(results = 6, slices = 30): TinctureColor[] {
    return _analogous(this, results, slices);
  }

  monochromatic(results = 6): TinctureColor[] {
    return _monochromatic(this, results);
  }

  // ---- Clone ----

  clone(): TinctureColor {
    return new TinctureColor(this.toRgb());
  }
}
