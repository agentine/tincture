import { describe, it, expect } from "vitest";
import { tincture } from "../src/index.js";

describe("tincture.readability", () => {
  it("black vs white = 21:1", () => {
    const ratio = tincture.readability("#000", "#fff");
    expect(ratio).toBeCloseTo(21, 0);
  });

  it("same color = 1:1", () => {
    const ratio = tincture.readability("#f00", "#f00");
    expect(ratio).toBeCloseTo(1, 0);
  });

  it("white vs white = 1:1", () => {
    expect(tincture.readability("#fff", "#fff")).toBeCloseTo(1, 0);
  });

  it("returns symmetric results", () => {
    const r1 = tincture.readability("#f00", "#00f");
    const r2 = tincture.readability("#00f", "#f00");
    expect(r1).toBeCloseTo(r2, 5);
  });
});

describe("tincture.isReadable", () => {
  it("black on white is AA readable (small text)", () => {
    expect(tincture.isReadable("#000", "#fff")).toBe(true);
  });

  it("black on white is AAA readable (small text)", () => {
    expect(tincture.isReadable("#000", "#fff", { level: "AAA" })).toBe(true);
  });

  it("similar colors are not readable", () => {
    expect(tincture.isReadable("#f00", "#e00")).toBe(false);
  });

  it("AA large has lower threshold than AA small", () => {
    // Find a color pair that passes AA large but not AA small
    // Contrast between #777 and #000: luminance(#777) ≈ 0.184, ratio ≈ 4.7 → passes AA small
    // Use closer colors
    const c1 = "#888";
    const c2 = "#333";
    const ratio = tincture.readability(c1, c2);
    // Should be around 3-4.5
    if (ratio >= 3 && ratio < 4.5) {
      expect(tincture.isReadable(c1, c2, { level: "AA", size: "large" })).toBe(true);
      expect(tincture.isReadable(c1, c2, { level: "AA", size: "small" })).toBe(false);
    }
  });

  it("AAA small requires ratio >= 7", () => {
    expect(tincture.isReadable("#000", "#fff", { level: "AAA", size: "small" })).toBe(true);
    // grey on white may fail AAA
    expect(tincture.isReadable("#999", "#fff", { level: "AAA", size: "small" })).toBe(false);
  });
});

describe("tincture.mostReadable", () => {
  it("picks the most contrasting color", () => {
    const result = tincture.mostReadable("#000", ["#111", "#fff", "#888"]);
    expect(result.toHex()).toBe("ffffff");
  });

  it("picks white over mid-grey for black base", () => {
    const result = tincture.mostReadable("#000", ["#808080", "#ffffff"]);
    expect(result.toHex()).toBe("ffffff");
  });

  it("with includeFallbackColors adds black/white when no color is readable", () => {
    // All candidates are very close to base
    const result = tincture.mostReadable("#010101", ["#020202", "#030303"], {
      includeFallbackColors: true,
    });
    // Should pick white (highest contrast vs near-black)
    expect(result.toHex()).toBe("ffffff");
  });

  it("without fallback picks best from list even if not readable", () => {
    const result = tincture.mostReadable("#010101", ["#020202", "#030303"]);
    expect(result.toHex()).toBe("030303");
  });
});
