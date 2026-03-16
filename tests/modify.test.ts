import { describe, it, expect } from "vitest";
import { tincture } from "../src/index.js";

describe("lighten", () => {
  it("lightens red by default 10%", () => {
    expect(tincture("red").lighten().toHex()).toBe("ff3333");
  });

  it("lightens by a specific amount", () => {
    expect(tincture("red").lighten(20).toHex()).toBe("ff6666");
  });

  it("lighten(0) returns same color", () => {
    expect(tincture("red").lighten(0).toHex()).toBe("ff0000");
  });

  it("lighten(100) returns white", () => {
    expect(tincture("red").lighten(100).toHex()).toBe("ffffff");
  });

  it("preserves alpha", () => {
    const c = tincture("rgba(255, 0, 0, 0.5)").lighten();
    expect(c.getAlpha()).toBe(0.5);
  });
});

describe("brighten", () => {
  it("brightens red by default 10%", () => {
    expect(tincture("red").brighten().toHex()).toBe("ff1919");
  });

  it("brightens by a specific amount", () => {
    expect(tincture("#000").brighten(50).toHex()).toBe("7f7f7f");
  });

  it("brighten(0) returns same color", () => {
    expect(tincture("red").brighten(0).toHex()).toBe("ff0000");
  });

  it("brighten(100) returns white", () => {
    expect(tincture("#000").brighten(100).toHex()).toBe("ffffff");
  });
});

describe("darken", () => {
  it("darkens red by default 10%", () => {
    expect(tincture("red").darken().toHex()).toBe("cc0000");
  });

  it("darkens by a specific amount", () => {
    expect(tincture("red").darken(20).toHex()).toBe("990000");
  });

  it("darken(0) returns same color", () => {
    expect(tincture("red").darken(0).toHex()).toBe("ff0000");
  });

  it("darken(100) returns black", () => {
    expect(tincture("red").darken(100).toHex()).toBe("000000");
  });

  it("preserves alpha", () => {
    const c = tincture("rgba(255, 0, 0, 0.5)").darken();
    expect(c.getAlpha()).toBe(0.5);
  });
});

describe("saturate", () => {
  it("saturates by default 10%", () => {
    const c = tincture("hsl(0, 50%, 50%)").saturate();
    const hsl = c.toHsl();
    expect(Math.round(hsl.s * 100)).toBe(60);
  });

  it("saturate(100) from 50% reaches 100%", () => {
    const c = tincture("hsl(0, 50%, 50%)").saturate(100);
    const hsl = c.toHsl();
    expect(Math.round(hsl.s * 100)).toBe(100);
  });

  it("preserves alpha", () => {
    const c = tincture("hsla(0, 50%, 50%, 0.3)").saturate();
    expect(c.getAlpha()).toBeCloseTo(0.3, 1);
  });
});

describe("desaturate", () => {
  it("desaturates by default 10%", () => {
    const c = tincture("hsl(0, 50%, 50%)").desaturate();
    const hsl = c.toHsl();
    expect(Math.round(hsl.s * 100)).toBe(40);
  });

  it("desaturate(100) produces grey", () => {
    const c = tincture("red").desaturate(100);
    const hsl = c.toHsl();
    expect(Math.round(hsl.s * 100)).toBe(0);
  });
});

describe("greyscale", () => {
  it("produces a fully desaturated color", () => {
    const c = tincture("red").greyscale();
    const hsl = c.toHsl();
    expect(Math.round(hsl.s * 100)).toBe(0);
  });

  it("is same as desaturate(100)", () => {
    const c1 = tincture("blue").greyscale();
    const c2 = tincture("blue").desaturate(100);
    expect(c1.toHex()).toBe(c2.toHex());
  });
});

describe("spin", () => {
  it("spins hue by 180 degrees", () => {
    const c = tincture("red").spin(180);
    expect(c.toHex()).toBe("00ffff"); // cyan
  });

  it("spins hue by -60 degrees", () => {
    const c = tincture("red").spin(-60);
    const hsl = c.toHsl();
    expect(Math.round(hsl.h)).toBe(300);
  });

  it("spin(0) returns same color", () => {
    expect(tincture("red").spin(0).toHex()).toBe("ff0000");
  });

  it("spin(360) wraps around to same hue", () => {
    const c = tincture("red").spin(360);
    expect(c.toHex()).toBe("ff0000");
  });

  it("spin(-360) wraps around to same hue", () => {
    const c = tincture("red").spin(-360);
    expect(c.toHex()).toBe("ff0000");
  });

  it("preserves alpha", () => {
    const c = tincture("rgba(255, 0, 0, 0.5)").spin(90);
    expect(c.getAlpha()).toBe(0.5);
  });
});

describe("modification immutability", () => {
  it("lighten returns new instance", () => {
    const original = tincture("red");
    const modified = original.lighten();
    expect(original.toHex()).toBe("ff0000");
    expect(modified.toHex()).not.toBe("ff0000");
  });

  it("darken returns new instance", () => {
    const original = tincture("red");
    const modified = original.darken();
    expect(original.toHex()).toBe("ff0000");
    expect(modified.toHex()).not.toBe("ff0000");
  });

  it("spin returns new instance", () => {
    const original = tincture("red");
    const modified = original.spin(90);
    expect(original.toHex()).toBe("ff0000");
    expect(modified.toHex()).not.toBe("ff0000");
  });
});

describe("chaining modifications", () => {
  it("lighten then darken approximates original", () => {
    const c = tincture("red").lighten(20).darken(20);
    // Due to rounding, it may not be exact
    expect(c.toHex()).toBe("ff0000");
  });

  it("saturate then desaturate approximates original", () => {
    const c = tincture("hsl(0, 50%, 50%)").saturate(10).desaturate(10);
    const hsl = c.toHsl();
    expect(Math.round(hsl.s * 100)).toBe(50);
  });
});
