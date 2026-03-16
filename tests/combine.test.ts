import { describe, it, expect } from "vitest";
import { tincture } from "../src/index.js";

describe("complement", () => {
  it("returns spin(180) of red → cyan", () => {
    expect(tincture("red").complement().toHex()).toBe("00ffff");
  });

  it("complement of blue → yellow", () => {
    expect(tincture("blue").complement().toHex()).toBe("ffff00");
  });
});

describe("splitcomplement", () => {
  it("returns 3 colors", () => {
    const colors = tincture("red").splitcomplement();
    expect(colors).toHaveLength(3);
  });

  it("first color is the original", () => {
    const colors = tincture("red").splitcomplement();
    expect(colors[0]!.toHex()).toBe("ff0000");
  });

  it("second is spin(72)", () => {
    const colors = tincture("red").splitcomplement();
    const hsl = colors[1]!.toHsl();
    expect(Math.round(hsl.h)).toBe(72);
  });

  it("third is spin(216)", () => {
    const colors = tincture("red").splitcomplement();
    const hsl = colors[2]!.toHsl();
    expect(Math.round(hsl.h)).toBe(216);
  });
});

describe("triad", () => {
  it("returns 3 colors", () => {
    expect(tincture("red").triad()).toHaveLength(3);
  });

  it("hues are 0, 120, 240 for red", () => {
    const colors = tincture("red").triad();
    expect(Math.round(colors[0]!.toHsl().h)).toBe(0);
    expect(Math.round(colors[1]!.toHsl().h)).toBe(120);
    expect(Math.round(colors[2]!.toHsl().h)).toBe(240);
  });
});

describe("tetrad", () => {
  it("returns 4 colors", () => {
    expect(tincture("red").tetrad()).toHaveLength(4);
  });

  it("hues are 0, 90, 180, 270 for red", () => {
    const colors = tincture("red").tetrad();
    expect(Math.round(colors[0]!.toHsl().h)).toBe(0);
    expect(Math.round(colors[1]!.toHsl().h)).toBe(90);
    expect(Math.round(colors[2]!.toHsl().h)).toBe(180);
    expect(Math.round(colors[3]!.toHsl().h)).toBe(270);
  });
});

describe("analogous", () => {
  it("returns 6 colors by default", () => {
    expect(tincture("red").analogous()).toHaveLength(6);
  });

  it("returns custom number of results", () => {
    expect(tincture("red").analogous(3)).toHaveLength(3);
  });

  it("first color is the original", () => {
    const colors = tincture("red").analogous();
    expect(colors[0]!.toHex()).toBe("ff0000");
  });
});

describe("monochromatic", () => {
  it("returns 6 colors by default", () => {
    expect(tincture("red").monochromatic()).toHaveLength(6);
  });

  it("returns custom number of results", () => {
    expect(tincture("red").monochromatic(3)).toHaveLength(3);
  });
});

describe("tincture.mix", () => {
  it("mixes red and blue 50/50", () => {
    const mixed = tincture.mix("red", "blue");
    const rgb = mixed.toRgb();
    expect(rgb.r).toBe(128);
    expect(rgb.g).toBe(0);
    expect(rgb.b).toBe(128);
  });

  it("mix at 0 returns first color", () => {
    const mixed = tincture.mix("red", "blue", 0);
    expect(mixed.toHex()).toBe("ff0000");
  });

  it("mix at 100 returns second color", () => {
    const mixed = tincture.mix("red", "blue", 100);
    expect(mixed.toHex()).toBe("0000ff");
  });

  it("mixes black and white to grey", () => {
    const mixed = tincture.mix("#000", "#fff");
    const rgb = mixed.toRgb();
    expect(rgb.r).toBe(128);
    expect(rgb.g).toBe(128);
    expect(rgb.b).toBe(128);
  });

  it("mixes alpha channels", () => {
    const mixed = tincture.mix("rgba(255,0,0,1)", "rgba(0,0,255,0)");
    expect(mixed.getAlpha()).toBe(0.5);
  });
});
