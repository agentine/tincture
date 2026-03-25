# Tincture API Reference

Complete API documentation for **tincture** — a drop-in replacement for tinycolor2.

## Table of Contents

- [Construction](#construction)
- [Properties](#properties)
- [Conversion Methods](#conversion-methods)
- [Modification Methods](#modification-methods)
- [Combination Methods](#combination-methods)
- [Static Utilities](#static-utilities)
- [Types](#types)

---

## Construction

### `tincture(input?)`

Create a color from any supported input format.

```js
import tincture from "@agentine/tincture";

// From hex string
const red = tincture("#ff0000");
const shortHex = tincture("#f00");

// From named color
const coral = tincture("coral");
const transparent = tincture("transparent");

// From RGB string
const green = tincture("rgb(0, 255, 0)");
const semiBlue = tincture("rgba(0, 0, 255, 0.5)");

// From HSL string
const purple = tincture("hsl(270, 60%, 70%)");
const purpleAlpha = tincture("hsla(270, 60%, 70%, 0.8)");

// From HSV string
const gold = tincture("hsv(51, 100%, 100%)");

// From RGB object
const orange = tincture({ r: 255, g: 165, b: 0 });
const orangeAlpha = tincture({ r: 255, g: 165, b: 0, a: 0.5 });

// From HSL object
const teal = tincture({ h: 180, s: 1, l: 0.25 });

// From HSV object
const lime = tincture({ h: 120, s: 1, v: 1 });

// Empty/invalid input
const invalid = tincture("");
invalid.isValid(); // false
```

**Accepted inputs:**
- Hex strings: `#RGB`, `#RRGGBB`, `#RGBA`, `#RRGGBBAA`
- CSS functions: `rgb()`, `rgba()`, `hsl()`, `hsla()`, `hsv()`, `hsva()`
- Named colors: all 148 CSS named colors plus `"transparent"`
- Objects: `{ r, g, b, a? }`, `{ h, s, l, a? }`, `{ h, s, v, a? }`
- Percentage strings in objects: `{ r: "50%", g: "50%", b: "50%" }`

### `tincture.fromRatio(input)`

Create a color from ratio values (0-1 for r, g, b).

```js
const half = tincture.fromRatio({ r: 0.5, g: 0.5, b: 0.5 });
half.toRgbString(); // "rgb(128, 128, 128)"

const withAlpha = tincture.fromRatio({ r: 1, g: 0, b: 0, a: 0.5 });
withAlpha.toRgbString(); // "rgba(255, 0, 0, 0.5)"
```

**Parameters:**
- `input.r` — Red channel (0-1)
- `input.g` — Green channel (0-1)
- `input.b` — Blue channel (0-1)
- `input.a` — Alpha (0-1, optional, defaults to 1)

---

## Properties

### `isValid()`

Returns `true` if the color was successfully parsed.

```js
tincture("#ff0000").isValid(); // true
tincture("red").isValid();     // true
tincture("not-a-color").isValid(); // false
tincture("").isValid();        // false
```

### `getFormat()`

Returns the format the color was parsed from, or `null` if invalid.

```js
tincture("#ff0000").getFormat(); // "hex6"
tincture("#f00").getFormat();    // "hex3"
tincture("red").getFormat();     // "name"
tincture("rgb(255,0,0)").getFormat(); // "rgb"
tincture("hsl(0,100%,50%)").getFormat(); // "hsl"
```

Possible return values: `"hex"`, `"hex3"`, `"hex4"`, `"hex6"`, `"hex8"`, `"rgb"`, `"rgba"`, `"hsl"`, `"hsla"`, `"hsv"`, `"hsva"`, `"name"`, `"transparent"`, or `null`.

### `getOriginalInput()`

Returns the original input passed to the constructor.

```js
tincture("red").getOriginalInput(); // "red"
tincture({ r: 255, g: 0, b: 0 }).getOriginalInput(); // { r: 255, g: 0, b: 0 }
```

### `getAlpha()`

Returns the alpha value (0-1).

```js
tincture("#ff0000").getAlpha();        // 1
tincture("rgba(255,0,0,0.5)").getAlpha(); // 0.5
```

### `setAlpha(value)`

Sets the alpha value. Returns `this` for chaining.

```js
const color = tincture("red");
color.setAlpha(0.5);
color.getAlpha();        // 0.5
color.toRgbString();     // "rgba(255, 0, 0, 0.5)"

// Chaining
tincture("red").setAlpha(0.3).toRgbString(); // "rgba(255, 0, 0, 0.3)"
```

**Parameters:**
- `value` — Alpha value, clamped to 0-1

### `getBrightness()`

Returns the perceived brightness (0-255) using the formula `(R*299 + G*587 + B*114) / 1000`.

```js
tincture("white").getBrightness(); // 255
tincture("black").getBrightness(); // 0
tincture("#808080").getBrightness(); // 128
```

### `getLuminance()`

Returns the relative luminance (0-1) per WCAG 2.0.

```js
tincture("white").getLuminance(); // 1
tincture("black").getLuminance(); // 0
```

### `isLight()`

Returns `true` if the color's brightness is > 128.

```js
tincture("white").isLight();  // true
tincture("yellow").isLight(); // true
tincture("black").isLight();  // false
```

### `isDark()`

Returns `true` if the color's brightness is <= 128.

```js
tincture("black").isDark();     // true
tincture("darkblue").isDark();  // true
tincture("white").isDark();     // false
```

---

## Conversion Methods

### `toRgb()`

Returns an object with `r`, `g`, `b` (0-255) and `a` (0-1).

```js
tincture("red").toRgb();
// { r: 255, g: 0, b: 0, a: 1 }
```

### `toRgbString()`

Returns a CSS `rgb()` or `rgba()` string.

```js
tincture("red").toRgbString();
// "rgb(255, 0, 0)"

tincture("rgba(255, 0, 0, 0.5)").toRgbString();
// "rgba(255, 0, 0, 0.5)"
```

### `toPercentageRgb()`

Returns an object with percentage strings for `r`, `g`, `b`.

```js
tincture("red").toPercentageRgb();
// { r: "100%", g: "0%", b: "0%", a: 1 }
```

### `toPercentageRgbString()`

Returns a CSS `rgb()` string with percentage values.

```js
tincture("red").toPercentageRgbString();
// "rgb(100%, 0%, 0%)"
```

### `toHex(allowShort?)`

Returns the hex value without the `#` prefix.

```js
tincture("red").toHex();      // "ff0000"
tincture("red").toHex(true);  // "f00" (shorthand when possible)
```

### `toHexString(allowShort?)`

Returns the hex string with `#` prefix.

```js
tincture("red").toHexString();      // "#ff0000"
tincture("red").toHexString(true);  // "#f00"
```

### `toHex8(allowShort?)`

Returns the 8-character hex value (RRGGBBAA) without `#`.

```js
tincture("red").toHex8();     // "ff0000ff"
tincture("rgba(255, 0, 0, 0.5)").toHex8(); // "ff000080"
```

### `toHex8String(allowShort?)`

Returns the 8-character hex string with `#` prefix.

```js
tincture("red").toHex8String();     // "#ff0000ff"
tincture("rgba(255, 0, 0, 0.5)").toHex8String(); // "#ff000080"
```

### `toHsl()`

Returns an object with `h` (0-360), `s` (0-1), `l` (0-1), and `a` (0-1).

```js
tincture("red").toHsl();
// { h: 0, s: 1, l: 0.5, a: 1 }
```

### `toHslString()`

Returns a CSS `hsl()` or `hsla()` string.

```js
tincture("red").toHslString();
// "hsl(0, 100%, 50%)"

tincture("rgba(255, 0, 0, 0.5)").toHslString();
// "hsla(0, 100%, 50%, 0.5)"
```

### `toHsv()`

Returns an object with `h` (0-360), `s` (0-1), `v` (0-1), and `a` (0-1).

```js
tincture("red").toHsv();
// { h: 0, s: 1, v: 1, a: 1 }
```

### `toHsvString()`

Returns a CSS-like `hsv()` or `hsva()` string.

```js
tincture("red").toHsvString();
// "hsv(0, 100%, 100%)"
```

### `toName()`

Returns the CSS named color if one matches, `"transparent"` for transparent colors, or `false`.

```js
tincture("#ff0000").toName();  // "red"
tincture("#f00").toName();     // "red"
tincture("#123456").toName();  // false
tincture("rgba(0,0,0,0)").toName(); // "transparent"
```

### `toFilter()`

Returns an IE `progid:DXImageTransform.Microsoft.gradient` filter string.

```js
tincture("red").toFilter();
// "progid:DXImageTransform.Microsoft.gradient(startColorstr=#ffff0000,endColorstr=#ffff0000)"
```

### `toString(format?)`

Returns a string representation in the specified format. If no format is given, uses the original input format.

```js
const color = tincture("red");

color.toString();       // "#ff0000" (default for named input → hex)
color.toString("rgb");  // "rgb(255, 0, 0)"
color.toString("hsl");  // "hsl(0, 100%, 50%)"
color.toString("hex6"); // "#ff0000"
color.toString("hex3"); // "#f00"
color.toString("hex8"); // "#ff0000ff"
color.toString("name"); // "red"
color.toString("hsv");  // "hsv(0, 100%, 100%)"
color.toString("prgb"); // "rgb(100%, 0%, 0%)"
```

**Supported format values:** `"rgb"`, `"rgba"`, `"hex"`, `"hex3"`, `"hex4"`, `"hex6"`, `"hex8"`, `"hsl"`, `"hsla"`, `"hsv"`, `"hsva"`, `"name"`, `"prgb"`, `"transparent"`

---

## Modification Methods

All modification methods return a **new** `TinctureColor` instance — the original is not mutated.

### `lighten(amount?)`

Lighten the color by increasing its HSL lightness. Amount is 0-100, default 10.

```js
tincture("red").lighten().toHexString();    // "#ff3333"
tincture("red").lighten(20).toHexString();  // "#ff6666"
tincture("red").lighten(50).toHexString();  // "#ffffff"
```

### `brighten(amount?)`

Brighten the color by increasing RGB values directly. Amount is 0-100, default 10.

```js
tincture("#333").brighten().toHexString();    // "#4d4d4d"
tincture("#333").brighten(50).toHexString();  // "#b3b3b3"
```

### `darken(amount?)`

Darken the color by decreasing its HSL lightness. Amount is 0-100, default 10.

```js
tincture("red").darken().toHexString();    // "#cc0000"
tincture("red").darken(20).toHexString();  // "#990000"
tincture("red").darken(50).toHexString();  // "#000000"
```

### `saturate(amount?)`

Increase saturation in HSL space. Amount is 0-100, default 10.

```js
tincture("hsl(0, 50%, 50%)").saturate(10).toHslString();
// "hsl(0, 60%, 50%)"
```

### `desaturate(amount?)`

Decrease saturation in HSL space. Amount is 0-100, default 10.

```js
tincture("red").desaturate(20).toHslString();
// "hsl(0, 80%, 50%)"
```

### `greyscale()`

Fully desaturate the color (equivalent to `desaturate(100)`).

```js
tincture("red").greyscale().toHexString();    // "#808080"
tincture("green").greyscale().toHexString();  // "#404040"
```

### `spin(amount)`

Rotate the hue by a number of degrees (-360 to 360).

```js
tincture("red").spin(90).toHexString();   // "#80ff00"
tincture("red").spin(180).toHexString();  // "#00ffff"
tincture("red").spin(-90).toHexString();  // "#7f00ff"
```

### `clone()`

Create an independent copy.

```js
const original = tincture("red");
const copy = original.clone();
copy.setAlpha(0.5);

original.getAlpha(); // 1 (unchanged)
copy.getAlpha();     // 0.5
```

---

## Combination Methods

All combination methods return `TinctureColor` instance(s).

### `complement()`

Returns the complement (hue rotated 180 degrees).

```js
tincture("red").complement().toHexString();  // "#00ffff" (cyan)
tincture("blue").complement().toHexString(); // "#ffff00" (yellow)
```

### `splitcomplement()`

Returns a 3-color split-complement palette: `[original, spin(72), spin(216)]`.

```js
const palette = tincture("red").splitcomplement();
palette.map(c => c.toHexString());
// ["#ff0000", "#ccff00", "#0066ff"]
```

### `triad()`

Returns a 3-color triad: `[original, spin(120), spin(240)]`.

```js
const triad = tincture("red").triad();
triad.map(c => c.toHexString());
// ["#ff0000", "#00ff00", "#0000ff"]
```

### `tetrad()`

Returns a 4-color tetrad: `[original, spin(90), spin(180), spin(270)]`.

```js
const tetrad = tincture("red").tetrad();
tetrad.map(c => c.toHexString());
// ["#ff0000", "#80ff00", "#00ffff", "#7f00ff"]
```

### `analogous(results?, slices?)`

Returns an array of analogous colors by rotating the hue in small steps.

```js
const colors = tincture("red").analogous();
colors.length; // 6
colors.map(c => c.toHexString());

// Custom: 3 results with wider spread
const wide = tincture("red").analogous(3, 10);
```

**Parameters:**
- `results` — Number of colors to generate (default 6)
- `slices` — Hue spread as a fraction of 360 (default 30)

### `monochromatic(results?)`

Returns a monochromatic palette by varying the HSV value.

```js
const mono = tincture("red").monochromatic();
mono.length; // 6
mono.map(c => c.toHexString());
```

**Parameters:**
- `results` — Number of colors to generate (default 6)

---

## Static Utilities

### `tincture.equals(color1, color2)`

Compare two colors for equality (including alpha).

```js
tincture.equals("red", "#ff0000");          // true
tincture.equals("red", "rgb(255, 0, 0)");   // true
tincture.equals("red", "blue");             // false
tincture.equals("rgba(255,0,0,1)", "red");  // true
```

### `tincture.mix(color1, color2, amount?)`

Mix two colors by linear RGB interpolation.

```js
tincture.mix("red", "blue").toHexString();      // "#800080" (purple)
tincture.mix("red", "blue", 25).toHexString();  // "#bf0040" (more red)
tincture.mix("red", "blue", 75).toHexString();  // "#4000bf" (more blue)
```

**Parameters:**
- `amount` — 0 = all color1, 100 = all color2 (default 50)

### `tincture.random()`

Generate a random color.

```js
const random = tincture.random();
random.toHexString(); // e.g. "#a3c72f"
```

### `tincture.readability(color1, color2)`

Calculate the WCAG 2.0 contrast ratio (1 to 21).

```js
tincture.readability("white", "black");  // 21
tincture.readability("white", "white");  // 1
tincture.readability("#777", "white");   // ~4.48
```

### `tincture.isReadable(color1, color2, options?)`

Check if two colors meet WCAG readability guidelines.

```js
// Default: AA level, small text (requires contrast >= 4.5)
tincture.isReadable("white", "black");  // true
tincture.isReadable("white", "#aaa");   // false

// AAA level, small text (requires >= 7)
tincture.isReadable("#000", "#767676", { level: "AAA", size: "small" }); // false

// AA level, large text (requires >= 3)
tincture.isReadable("#777", "white", { level: "AA", size: "large" }); // true
```

**Options:**
| Option | Values | Default | Description |
|--------|--------|---------|-------------|
| `level` | `"AA"`, `"AAA"` | `"AA"` | WCAG conformance level |
| `size` | `"small"`, `"large"` | `"small"` | Text size category |

**Contrast thresholds:**
| | Small text | Large text |
|---|---|---|
| AA | 4.5 | 3 |
| AAA | 7 | 4.5 |

### `tincture.mostReadable(baseColor, colorList, options?)`

Find the most readable color from a list against a base color.

```js
tincture.mostReadable("#000", ["#444", "#888", "#fff"]).toHexString();
// "#ffffff" (white has highest contrast against black)

// With fallback colors (appends black/white if no color meets threshold)
tincture.mostReadable(
  "#555",
  ["#666", "#777"],
  { includeFallbackColors: true }
).toHexString();
// "#ffffff" or "#000000" (fallback wins if neither #666 nor #777 is readable)
```

**Options:**
Extends `ReadabilityOptions` with:
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `includeFallbackColors` | `boolean` | `false` | Append `#fff` and `#000` as fallback candidates |

---

## Types

### `ColorInput`

```ts
type ColorInput = string | RgbInput | HslInput | HsvInput;
```

### `RgbInput`

```ts
interface RgbInput {
  r: number | string;
  g: number | string;
  b: number | string;
  a?: number | string;
}
```

### `HslInput`

```ts
interface HslInput {
  h: number | string;
  s: number | string;
  l: number | string;
  a?: number | string;
}
```

### `HsvInput`

```ts
interface HsvInput {
  h: number | string;
  s: number | string;
  v: number | string;
  a?: number | string;
}
```

### `ColorFormat`

```ts
type ColorFormat =
  | "hex" | "hex3" | "hex4" | "hex6" | "hex8"
  | "rgb" | "rgba"
  | "hsl" | "hsla"
  | "hsv" | "hsva"
  | "name" | "transparent";
```

### `TinctureColor`

The main color class. See all methods documented above.

```ts
import { TinctureColor } from "@agentine/tincture";

const color = new TinctureColor("red");
```

### `TinctureStatic`

The callable interface with static methods.

```ts
import tincture from "@agentine/tincture";
// tincture("red")          — constructor
// tincture.mix(...)        — static method
// tincture.fromRatio(...)  — static method
```

### `ReadabilityOptions`

```ts
interface ReadabilityOptions {
  level?: "AA" | "AAA";
  size?: "small" | "large";
}
```

### `MostReadableOptions`

```ts
interface MostReadableOptions extends ReadabilityOptions {
  includeFallbackColors?: boolean;
}
```
