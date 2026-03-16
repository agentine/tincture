import { describe, it, expect } from "vitest";
import { tincture, TinctureColor } from "../src/index.js";

describe("tincture() constructor", () => {
  it("creates from hex string", () => {
    const c = tincture("#ff0000");
    expect(c.isValid()).toBe(true);
    expect(c.toHex()).toBe("ff0000");
  });

  it("creates from rgb string", () => {
    const c = tincture("rgb(255, 0, 0)");
    expect(c.isValid()).toBe(true);
    expect(c.toRgb()).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  it("creates from named color", () => {
    const c = tincture("red");
    expect(c.isValid()).toBe(true);
    expect(c.toHex()).toBe("ff0000");
  });

  it("creates from rgb object", () => {
    const c = tincture({ r: 255, g: 0, b: 0 });
    expect(c.isValid()).toBe(true);
    expect(c.toHex()).toBe("ff0000");
  });

  it("creates from hsl object", () => {
    const c = tincture({ h: 0, s: "100%", l: "50%" });
    expect(c.isValid()).toBe(true);
    expect(c.toHex()).toBe("ff0000");
  });

  it("creates from hsv object", () => {
    const c = tincture({ h: 0, s: "100%", v: "100%" });
    expect(c.isValid()).toBe(true);
    expect(c.toHex()).toBe("ff0000");
  });

  it("creates invalid from bad input", () => {
    const c = tincture("notacolor");
    expect(c.isValid()).toBe(false);
  });

  it("creates from empty input", () => {
    const c = tincture();
    expect(c.isValid()).toBe(false);
  });
});

describe("TinctureColor properties", () => {
  it("isValid()", () => {
    expect(tincture("red").isValid()).toBe(true);
    expect(tincture("xyz").isValid()).toBe(false);
  });

  it("getFormat()", () => {
    expect(tincture("#ff0000").getFormat()).toBe("hex6");
    expect(tincture("#f00").getFormat()).toBe("hex3");
    expect(tincture("rgb(255,0,0)").getFormat()).toBe("rgb");
    expect(tincture("red").getFormat()).toBe("name");
  });

  it("getOriginalInput()", () => {
    expect(tincture("#ff0000").getOriginalInput()).toBe("#ff0000");
    expect(tincture("red").getOriginalInput()).toBe("red");
  });

  it("getAlpha() / setAlpha()", () => {
    const c = tincture("red");
    expect(c.getAlpha()).toBe(1);
    c.setAlpha(0.5);
    expect(c.getAlpha()).toBe(0.5);
  });

  it("setAlpha clamps invalid values", () => {
    const c = tincture("red");
    c.setAlpha(2);
    expect(c.getAlpha()).toBe(1);
    c.setAlpha(-1);
    expect(c.getAlpha()).toBe(1);
  });

  it("getBrightness()", () => {
    expect(tincture("white").getBrightness()).toBe(255);
    expect(tincture("black").getBrightness()).toBe(0);
  });

  it("getLuminance()", () => {
    expect(tincture("white").getLuminance()).toBeCloseTo(1, 2);
    expect(tincture("black").getLuminance()).toBeCloseTo(0, 2);
  });

  it("isLight() / isDark()", () => {
    expect(tincture("white").isLight()).toBe(true);
    expect(tincture("white").isDark()).toBe(false);
    expect(tincture("black").isDark()).toBe(true);
    expect(tincture("black").isLight()).toBe(false);
  });
});

describe("conversion methods", () => {
  it("toRgb()", () => {
    expect(tincture("red").toRgb()).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  it("toRgbString()", () => {
    expect(tincture("red").toRgbString()).toBe("rgb(255, 0, 0)");
  });

  it("toRgbString() with alpha", () => {
    const c = tincture("red");
    c.setAlpha(0.5);
    expect(c.toRgbString()).toBe("rgba(255, 0, 0, 0.5)");
  });

  it("toPercentageRgb()", () => {
    expect(tincture("red").toPercentageRgb()).toEqual({
      r: "100%",
      g: "0%",
      b: "0%",
      a: 1,
    });
  });

  it("toPercentageRgbString()", () => {
    expect(tincture("red").toPercentageRgbString()).toBe("rgb(100%, 0%, 0%)");
  });

  it("toHex()", () => {
    expect(tincture("red").toHex()).toBe("ff0000");
  });

  it("toHexString()", () => {
    expect(tincture("red").toHexString()).toBe("#ff0000");
  });

  it("toHex(allowShort=true) for shortable hex", () => {
    expect(tincture("#ff0000").toHex(true)).toBe("f00");
  });

  it("toHex8()", () => {
    expect(tincture("red").toHex8()).toBe("ff0000ff");
  });

  it("toHex8String()", () => {
    expect(tincture("red").toHex8String()).toBe("#ff0000ff");
  });

  it("toHsl()", () => {
    const hsl = tincture("red").toHsl();
    expect(hsl.h).toBeCloseTo(0, 0);
    expect(hsl.s).toBeCloseTo(1, 2);
    expect(hsl.l).toBeCloseTo(0.5, 2);
    expect(hsl.a).toBe(1);
  });

  it("toHslString()", () => {
    expect(tincture("red").toHslString()).toBe("hsl(0, 100%, 50%)");
  });

  it("toHsv()", () => {
    const hsv = tincture("red").toHsv();
    expect(hsv.h).toBeCloseTo(0, 0);
    expect(hsv.s).toBeCloseTo(1, 2);
    expect(hsv.v).toBeCloseTo(1, 2);
    expect(hsv.a).toBe(1);
  });

  it("toHsvString()", () => {
    expect(tincture("red").toHsvString()).toBe("hsv(0, 100%, 100%)");
  });

  it("toName()", () => {
    expect(tincture("#ff0000").toName()).toBe("red");
    expect(tincture("#ff0001").toName()).toBe(false);
  });

  it("toName() returns 'transparent' for alpha 0", () => {
    const c = tincture("red");
    c.setAlpha(0);
    expect(c.toName()).toBe("transparent");
  });

  it("toName() returns false for non-1 alpha", () => {
    const c = tincture("red");
    c.setAlpha(0.5);
    expect(c.toName()).toBe(false);
  });

  it("toFilter()", () => {
    const filter = tincture("red").toFilter();
    expect(filter).toContain("progid:DXImageTransform");
    expect(filter).toContain("ffff0000");
  });

  it("toString() defaults to format", () => {
    expect(tincture("red").toString()).toBe("red");
    expect(tincture("#ff0000").toString()).toBe("#ff0000");
    expect(tincture("rgb(255,0,0)").toString()).toBe("rgb(255, 0, 0)");
  });

  it("toString(format) overrides", () => {
    expect(tincture("red").toString("hex")).toBe("#ff0000");
    expect(tincture("red").toString("rgb")).toBe("rgb(255, 0, 0)");
    expect(tincture("red").toString("hsl")).toBe("hsl(0, 100%, 50%)");
  });
});

describe("clone", () => {
  it("creates independent copy", () => {
    const c1 = tincture("red");
    const c2 = c1.clone();
    c2.setAlpha(0.5);
    expect(c1.getAlpha()).toBe(1);
    expect(c2.getAlpha()).toBe(0.5);
  });

  it("preserves color values", () => {
    const c1 = tincture("#ff0000");
    const c2 = c1.clone();
    expect(c2.toHex()).toBe("ff0000");
  });
});

describe("tincture.fromRatio", () => {
  it("creates from 0–1 ratios", () => {
    const c = tincture.fromRatio({ r: 1, g: 0, b: 0 });
    expect(c.isValid()).toBe(true);
    expect(c.toHex()).toBe("ff0000");
  });

  it("creates with alpha", () => {
    const c = tincture.fromRatio({ r: 1, g: 0, b: 0, a: 0.5 });
    expect(c.getAlpha()).toBe(0.5);
  });

  it("handles mid-range values", () => {
    const c = tincture.fromRatio({ r: 0.5, g: 0.5, b: 0.5 });
    expect(c.isValid()).toBe(true);
    const rgb = c.toRgb();
    expect(rgb.r).toBe(128);
    expect(rgb.g).toBe(128);
    expect(rgb.b).toBe(128);
  });
});

describe("tincture.equals", () => {
  it("returns true for same colors", () => {
    expect(tincture.equals("red", "#ff0000")).toBe(true);
    expect(tincture.equals("red", "rgb(255,0,0)")).toBe(true);
  });

  it("returns false for different colors", () => {
    expect(tincture.equals("red", "blue")).toBe(false);
  });
});

describe("tincture.random", () => {
  it("creates valid random color", () => {
    const c = tincture.random();
    expect(c.isValid()).toBe(true);
    const rgb = c.toRgb();
    expect(rgb.r).toBeGreaterThanOrEqual(0);
    expect(rgb.r).toBeLessThan(256);
    expect(rgb.g).toBeGreaterThanOrEqual(0);
    expect(rgb.g).toBeLessThan(256);
    expect(rgb.b).toBeGreaterThanOrEqual(0);
    expect(rgb.b).toBeLessThan(256);
  });
});
