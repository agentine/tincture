# tincture

[![npm version](https://img.shields.io/npm/v/@agentine/tincture.svg)](https://www.npmjs.com/package/@agentine/tincture)
[![Build Status](https://img.shields.io/github/actions/workflow/status/agentine/tincture/ci.yml?branch=main)](https://github.com/agentine/tincture/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-first-blue.svg)](https://www.typescriptlang.org/)

Fast, zero-dependency color parsing, manipulation, and conversion for JavaScript and TypeScript. Drop-in replacement for [tinycolor2](https://github.com/bgrins/TinyColor).

## Why tincture?

**tinycolor2** is abandoned: no releases since Feb 2023, 102 unresolved issues, and its primary TypeScript fork ([@ctrl/tinycolor](https://www.npmjs.com/package/@ctrl/tinycolor)) was compromised in the [Shai-Hulud supply chain attack](https://en.wikipedia.org/wiki/Shai-Hulud_(malware)) (Sept 2025, CISA advisory) — one of the worst npm supply chain incidents ever.

**tincture** provides a safe, maintained alternative with full API compatibility:

- Full tinycolor2 API compatibility (~35 methods)
- TypeScript-first with complete type inference (no `@types/` needed)
- ESM + CJS dual package via `exports` map
- Zero dependencies
- Drop-in migration via compatibility layer

## Installation

```bash
npm install @agentine/tincture
```

## Quick Start

```js
import tincture from "@agentine/tincture";

// Parse any color format
const color = tincture("#e74c3c");

// Query properties
color.isValid();      // true
color.isLight();      // false
color.getLuminance();  // 0.14...

// Convert between formats
color.toRgbString();  // "rgb(231, 76, 60)"
color.toHslString();  // "hsl(6, 78%, 57%)"
color.toHex();        // "e74c3c"

// Manipulate
color.lighten(20).toHexString();  // "#ef9a93"
color.darken(10).toHexString();   // "#d62c1a"
color.complement().toHexString(); // "#3cd6e7"

// Generate palettes
color.analogous().map(c => c.toHexString());
color.triad().map(c => c.toHexString());

// Accessibility
tincture.readability("#fff", "#333");  // 12.63
tincture.isReadable("#fff", "#333");   // true
```

## Accepted Input Formats

```js
// Hex
tincture("#ff0000");
tincture("#f00");
tincture("#ff000080");  // with alpha

// CSS functions
tincture("rgb(255, 0, 0)");
tincture("rgba(255, 0, 0, 0.5)");
tincture("hsl(0, 100%, 50%)");
tincture("hsv(0, 100%, 100%)");

// Named colors
tincture("red");
tincture("coral");
tincture("transparent");

// Objects
tincture({ r: 255, g: 0, b: 0 });
tincture({ h: 0, s: 1, l: 0.5 });
tincture({ h: 0, s: 1, v: 1 });

// Ratio values (0-1)
tincture.fromRatio({ r: 1, g: 0, b: 0 });
```

## Drop-in Migration from tinycolor2

Use the compatibility layer for zero-change migration:

```js
// Before
const tinycolor = require("tinycolor2");

// After — just change the import
const tinycolor = require("@agentine/tincture/compat/tinycolor2");

// ESM
import tinycolor from "@agentine/tincture/compat/tinycolor2";
```

All existing code continues to work unchanged. See the [Migration Guide](docs/MIGRATION.md) for details on migrating directly to the tincture API.

## API Overview

| Category | Methods |
|----------|---------|
| **Construction** | `tincture(input)`, `tincture.fromRatio({r, g, b})` |
| **Properties** | `isValid()`, `getFormat()`, `getAlpha()`, `setAlpha()`, `getBrightness()`, `getLuminance()`, `isLight()`, `isDark()` |
| **Conversion** | `toHex()`, `toHexString()`, `toHex8()`, `toHex8String()`, `toRgb()`, `toRgbString()`, `toPercentageRgb()`, `toPercentageRgbString()`, `toHsl()`, `toHslString()`, `toHsv()`, `toHsvString()`, `toName()`, `toFilter()`, `toString(format?)` |
| **Modification** | `lighten()`, `brighten()`, `darken()`, `saturate()`, `desaturate()`, `greyscale()`, `spin()`, `clone()` |
| **Combinations** | `complement()`, `splitcomplement()`, `triad()`, `tetrad()`, `analogous()`, `monochromatic()` |
| **Static** | `tincture.equals()`, `tincture.mix()`, `tincture.random()`, `tincture.readability()`, `tincture.isReadable()`, `tincture.mostReadable()` |

See the full [API Reference](docs/API.md) for detailed documentation with examples.

## License

[MIT](LICENSE)
