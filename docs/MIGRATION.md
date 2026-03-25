# Migration Guide: tinycolor2 to tincture

This guide covers migrating from [tinycolor2](https://github.com/bgrins/TinyColor) to **tincture**. There are two approaches — choose the one that fits your needs.

## Option 1: Drop-in Replacement (Zero Changes)

The fastest migration path. Replace only your import/require statement — all existing code works unchanged.

### CommonJS

```diff
- const tinycolor = require("tinycolor2");
+ const tinycolor = require("@agentine/tincture/compat/tinycolor2");
```

### ESM

```diff
- import tinycolor from "tinycolor2";
+ import tinycolor from "@agentine/tincture/compat/tinycolor2";
```

The compatibility layer exports a `tinycolor` function with identical behavior to tinycolor2. Every method, property, and static function works the same way.

### When to Use the Compat Layer

- You have a large codebase with many `tinycolor` calls
- You need the migration done quickly
- You want to verify everything works before committing to a full rename
- You depend on libraries that expect tinycolor2's interface

## Option 2: Direct Migration to tincture API

Migrate to the native tincture API. The API surface is the same — only the import and constructor name change.

### Step 1: Update Imports

**CommonJS:**
```diff
- const tinycolor = require("tinycolor2");
+ const { tincture } = require("@agentine/tincture");
```

**ESM:**
```diff
- import tinycolor from "tinycolor2";
+ import tincture from "@agentine/tincture";
```

### Step 2: Rename Constructor Calls

```diff
- const color = tinycolor("red");
+ const color = tincture("red");

- const ratio = tinycolor.fromRatio({ r: 0.5, g: 0.5, b: 0.5 });
+ const ratio = tincture.fromRatio({ r: 0.5, g: 0.5, b: 0.5 });

- tinycolor.equals("red", "#ff0000");
+ tincture.equals("red", "#ff0000");

- tinycolor.mix("red", "blue", 50);
+ tincture.mix("red", "blue", 50);

- tinycolor.readability("#fff", "#000");
+ tincture.readability("#fff", "#000");

- tinycolor.isReadable("#fff", "#000");
+ tincture.isReadable("#fff", "#000");

- tinycolor.mostReadable("#000", ["#fff", "#ccc"]);
+ tincture.mostReadable("#000", ["#fff", "#ccc"]);

- tinycolor.random();
+ tincture.random();
```

### Step 3: That's It

All instance methods are identical:

```js
// These all work exactly the same
color.toHexString();
color.lighten(20);
color.complement();
color.isLight();
color.toRgbString();
color.setAlpha(0.5);
color.analogous();
// ... every method from tinycolor2 is supported
```

## ESM and CJS Support

tincture ships as a dual ESM/CJS package. Both module systems are fully supported via the `exports` field in `package.json`.

### ESM (recommended)

```js
import tincture from "@agentine/tincture";
import { TinctureColor } from "@agentine/tincture";
```

### CommonJS

```js
const { tincture } = require("@agentine/tincture");
const { TinctureColor } = require("@agentine/tincture");
```

### Compat Layer (both)

```js
// ESM
import tinycolor from "@agentine/tincture/compat/tinycolor2";

// CJS
const tinycolor = require("@agentine/tincture/compat/tinycolor2");
```

## TypeScript Benefits

tinycolor2 relies on `@types/tinycolor2` from DefinitelyTyped, which can drift from the actual implementation. tincture is TypeScript-first:

- **Full type inference** — no `@types/` package needed
- **Accurate types** — generated from the same source code
- **Generic input types** — `ColorInput` accepts strings, RGB/HSL/HSV objects
- **Return type precision** — methods return typed objects, not `any`

### Before (tinycolor2 + DefinitelyTyped)

```ts
// Requires: npm install @types/tinycolor2
import tinycolor from "tinycolor2";

const color = tinycolor("red");        // type: tinycolor.Instance
const rgb = color.toRgb();             // type: tinycolor.ColorFormats.RGBA
```

### After (tincture)

```ts
// No additional @types/ package needed
import tincture from "@agentine/tincture";
import type { TinctureColor, ColorInput } from "@agentine/tincture";

const color = tincture("red");         // type: TinctureColor
const rgb = color.toRgb();             // type: { r: number; g: number; b: number; a: number }

// Type-safe input
function setBackground(input: ColorInput) {
  return tincture(input).toHexString();
}
```

## Removing tinycolor2

Once migration is verified:

```bash
npm uninstall tinycolor2 @types/tinycolor2
```

## API Compatibility Reference

Every tinycolor2 method is supported in tincture:

| tinycolor2 | tincture | Notes |
|-----------|----------|-------|
| `tinycolor(input)` | `tincture(input)` | Same input formats |
| `tinycolor.fromRatio()` | `tincture.fromRatio()` | Identical |
| `tinycolor.equals()` | `tincture.equals()` | Identical |
| `tinycolor.mix()` | `tincture.mix()` | Identical |
| `tinycolor.random()` | `tincture.random()` | Identical |
| `tinycolor.readability()` | `tincture.readability()` | Identical |
| `tinycolor.isReadable()` | `tincture.isReadable()` | Identical |
| `tinycolor.mostReadable()` | `tincture.mostReadable()` | Identical |
| `.toHex()` | `.toHex()` | Identical |
| `.toHexString()` | `.toHexString()` | Identical |
| `.toRgb()` | `.toRgb()` | Identical |
| `.toRgbString()` | `.toRgbString()` | Identical |
| `.toHsl()` | `.toHsl()` | Identical |
| `.toHslString()` | `.toHslString()` | Identical |
| `.toHsv()` | `.toHsv()` | Identical |
| `.toHsvString()` | `.toHsvString()` | Identical |
| `.toName()` | `.toName()` | Identical |
| `.toFilter()` | `.toFilter()` | Identical |
| `.toString(fmt)` | `.toString(fmt)` | Identical |
| `.lighten()` | `.lighten()` | Identical |
| `.darken()` | `.darken()` | Identical |
| `.saturate()` | `.saturate()` | Identical |
| `.desaturate()` | `.desaturate()` | Identical |
| `.greyscale()` | `.greyscale()` | Identical |
| `.spin()` | `.spin()` | Identical |
| `.complement()` | `.complement()` | Identical |
| `.analogous()` | `.analogous()` | Identical |
| `.monochromatic()` | `.monochromatic()` | Identical |
| `.triad()` | `.triad()` | Identical |
| `.tetrad()` | `.tetrad()` | Identical |
| `.splitcomplement()` | `.splitcomplement()` | Identical |
| `.clone()` | `.clone()` | Identical |
| `.isValid()` | `.isValid()` | Identical |
| `.getFormat()` | `.getFormat()` | Identical |
| `.getAlpha()` | `.getAlpha()` | Identical |
| `.setAlpha()` | `.setAlpha()` | Identical |
| `.getBrightness()` | `.getBrightness()` | Identical |
| `.getLuminance()` | `.getLuminance()` | Identical |
| `.isLight()` | `.isLight()` | Identical |
| `.isDark()` | `.isDark()` | Identical |
