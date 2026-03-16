# tincture — Drop-in Replacement for tinycolor2

## Target Library
**tinycolor2** — Color parsing, manipulation, and conversion for JavaScript
- npm: 8.9M weekly downloads, 4,086 dependents
- GitHub: 5,231 stars, 102 open issues
- Last release: v1.6.0 (Feb 2023), last commit: Feb 2023
- Maintainer: Brian Grinstead (inactive 3+ years)
- Main fork @ctrl/tinycolor compromised in Shai-Hulud supply chain attack (Sept 2025, CISA alert)

## Why Replace
1. **Abandoned**: No commits or releases in 3+ years, 102 unresolved issues
2. **Supply chain risk**: The primary TypeScript fork (@ctrl/tinycolor) was compromised in the Shai-Hulud worm attack — one of the worst npm supply chain incidents ever (500+ packages infected, credential theft, persistent GitHub Actions backdoors). CISA issued an advisory.
3. **No safe maintained drop-in**: colord is also abandoned (2022). chroma-js and colorjs.io have completely different APIs. No migration path exists for 4,086 dependent packages.
4. **Missing modern features**: No ESM support, no TypeScript types (uses DefinitelyTyped), no OKLCH/P3/modern color spaces

## Package Name
**tincture** — verified available on npm

## Architecture

### Core Design
- TypeScript-first with generated `.d.ts`
- Zero dependencies
- ESM + CJS dual package (exports map)
- Pure functions internally, OOP wrapper for API compatibility

### Module Structure
```
src/
  index.ts           # Main entry, tincture() constructor
  color.ts           # TinctureColor class (API-compatible with tinycolor)
  parse.ts           # Input parsing (hex, rgb, hsl, hsv, named, ratio)
  convert.ts         # Color space conversions (RGB ↔ HSL ↔ HSV ↔ Hex)
  modify.ts          # Modification methods (lighten, darken, saturate, etc.)
  combine.ts         # Palette/combination methods (complement, analogous, etc.)
  readability.ts     # WCAG contrast ratio and accessibility
  names.ts           # CSS named colors lookup table
  util.ts            # Clamping, rounding, format helpers
  compat/
    tinycolor2.ts    # Drop-in tinycolor2 compatibility layer
```

### API Surface (~35 methods, full tinycolor2 compatibility)

**Construction:**
- `tincture(input)` — from string, object, or named color
- `tincture.fromRatio({r, g, b})` — from 0-1 ratio values

**Properties:**
- `isValid()`, `getFormat()`, `getOriginalInput()`
- `getAlpha()`, `setAlpha(value)`
- `getBrightness()`, `getLuminance()`
- `isLight()`, `isDark()`

**Conversion (14 methods):**
- `toHex()`, `toHexString()`, `toHex8()`, `toHex8String()`
- `toRgb()`, `toRgbString()`, `toPercentageRgb()`, `toPercentageRgbString()`
- `toHsl()`, `toHslString()`, `toHsv()`, `toHsvString()`
- `toName()`, `toFilter()` (IE gradient filter)
- `toString(format)`

**Modification (8 methods):**
- `lighten(amount)`, `brighten(amount)`, `darken(amount)`
- `saturate(amount)`, `desaturate(amount)`
- `greyscale()`, `spin(amount)`, `clone()`

**Combination (6 methods):**
- `complement()`, `splitcomplement()`
- `analogous(results, slices)`, `monochromatic(results)`
- `triad()`, `tetrad()`

**Static utilities (5 methods):**
- `tincture.equals(color1, color2)`
- `tincture.mix(color1, color2, amount)`
- `tincture.random()`
- `tincture.readability(color1, color2)`
- `tincture.isReadable(color1, color2, options)`
- `tincture.mostReadable(baseColor, colorList, options)`

### Compatibility Layer
`tincture/compat/tinycolor2` exports a `tinycolor` function with identical behavior to tinycolor2, allowing zero-change migration:
```js
// Before
const tinycolor = require('tinycolor2');
// After
const tinycolor = require('tincture/compat/tinycolor2');
```

### Enhancements Over tinycolor2
- TypeScript-first with full type inference
- ESM + CJS dual package
- OKLCH color space support (new)
- Modern CSS color function output (rgb(), hsl() without commas)
- Tree-shakeable when using individual functions
- No prototype pollution vectors

## Implementation Phases

### Phase 1: Core Types and Parsing
- Color class with internal RGBA representation
- Input parsing: hex (#RGB, #RRGGBB, #RRGGBBAA), rgb(), hsl(), hsv(), named colors
- Basic construction and validation (`isValid()`, `getFormat()`)
- Package setup: TypeScript, ESM+CJS build, test framework

### Phase 2: Conversion and Properties
- All 14 conversion methods (toHex, toRgb, toHsl, toHsv, etc.)
- Property methods (getBrightness, getLuminance, isLight, isDark)
- Alpha handling (getAlpha, setAlpha)
- toString() with format parameter

### Phase 3: Modification and Combination
- All 8 modification methods (lighten, darken, saturate, etc.)
- All 6 combination/palette methods (complement, analogous, etc.)
- Static utilities (equals, mix, random)
- Readability/accessibility methods (WCAG contrast)

### Phase 4: Compatibility Layer and Testing
- tinycolor2 compatibility wrapper
- Test against tinycolor2's own test suite (port tests)
- Edge case testing (invalid inputs, boundary values, precision)
- Cross-browser compatibility verification

### Phase 5: Documentation and Release
- API documentation with examples
- Migration guide from tinycolor2
- README with badges, installation, usage
- npm publish as `tincture`
- GitHub repo: agentine/tincture

## Deliverables
- `tincture` npm package
- Full tinycolor2 API compatibility
- Drop-in compat layer at `tincture/compat/tinycolor2`
- TypeScript declarations
- Comprehensive test suite
