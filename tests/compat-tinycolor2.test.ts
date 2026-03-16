import { describe, it, expect } from "vitest";
import tinycolor from "../src/compat/tinycolor2.js";

describe("tinycolor2 compat layer", () => {
  describe("constructor", () => {
    it("creates a color from string", () => {
      const c = tinycolor("red");
      expect(c.isValid()).toBe(true);
      expect(c.toHex()).toBe("ff0000");
    });

    it("creates a color from rgb object", () => {
      const c = tinycolor({ r: 255, g: 0, b: 0 });
      expect(c.toHex()).toBe("ff0000");
    });

    it("creates a color from hex", () => {
      const c = tinycolor("#0f0");
      expect(c.toRgb().g).toBe(255);
    });

    it("handles invalid input", () => {
      const c = tinycolor("not a color");
      expect(c.isValid()).toBe(false);
    });

    it("handles no input", () => {
      const c = tinycolor();
      expect(c.isValid()).toBe(false);
    });
  });

  describe("instance methods", () => {
    it("getFormat returns detected format", () => {
      expect(tinycolor("#ff0000").getFormat()).toBe("hex6");
      expect(tinycolor("rgb(255,0,0)").getFormat()).toBe("rgb");
    });

    it("getOriginalInput returns original", () => {
      expect(tinycolor("red").getOriginalInput()).toBe("red");
    });

    it("getAlpha / setAlpha", () => {
      const c = tinycolor("red");
      expect(c.getAlpha()).toBe(1);
      c.setAlpha(0.5);
      expect(c.getAlpha()).toBe(0.5);
    });

    it("getBrightness", () => {
      expect(tinycolor("white").getBrightness()).toBe(255);
      expect(tinycolor("black").getBrightness()).toBe(0);
    });

    it("getLuminance", () => {
      expect(tinycolor("white").getLuminance()).toBe(1);
      expect(tinycolor("black").getLuminance()).toBe(0);
    });

    it("isLight / isDark", () => {
      expect(tinycolor("white").isLight()).toBe(true);
      expect(tinycolor("black").isDark()).toBe(true);
    });

    it("toHex / toHexString", () => {
      expect(tinycolor("red").toHex()).toBe("ff0000");
      expect(tinycolor("red").toHexString()).toBe("#ff0000");
    });

    it("toHex8 / toHex8String", () => {
      const c = tinycolor("rgba(255,0,0,0.5)");
      expect(c.toHex8String()).toBe("#ff000080");
    });

    it("toRgb / toRgbString", () => {
      expect(tinycolor("red").toRgbString()).toBe("rgb(255, 0, 0)");
      const rgb = tinycolor("red").toRgb();
      expect(rgb).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    });

    it("toPercentageRgb / toPercentageRgbString", () => {
      expect(tinycolor("red").toPercentageRgbString()).toBe("rgb(100%, 0%, 0%)");
    });

    it("toHsl / toHslString", () => {
      expect(tinycolor("red").toHslString()).toBe("hsl(0, 100%, 50%)");
    });

    it("toHsv / toHsvString", () => {
      expect(tinycolor("red").toHsvString()).toBe("hsv(0, 100%, 100%)");
    });

    it("toName", () => {
      expect(tinycolor("#ff0000").toName()).toBe("red");
      expect(tinycolor("#ff0001").toName()).toBe(false);
    });

    it("toFilter", () => {
      const f = tinycolor("red").toFilter();
      expect(f).toContain("progid:DXImageTransform");
    });

    it("toString with format", () => {
      expect(tinycolor("red").toString("hex")).toBe("#ff0000");
      expect(tinycolor("red").toString("rgb")).toBe("rgb(255, 0, 0)");
    });

    it("clone returns independent copy", () => {
      const c = tinycolor("red");
      const c2 = c.clone();
      c2.setAlpha(0.5);
      expect(c.getAlpha()).toBe(1);
      expect(c2.getAlpha()).toBe(0.5);
    });
  });

  describe("modification methods", () => {
    it("lighten", () => {
      const c = tinycolor("red").lighten(20);
      expect(c.isValid()).toBe(true);
      expect(c.toHsl().l).toBeGreaterThan(tinycolor("red").toHsl().l);
    });

    it("brighten", () => {
      const c = tinycolor("#333").brighten(20);
      expect(c.isValid()).toBe(true);
    });

    it("darken", () => {
      const c = tinycolor("red").darken(20);
      expect(c.toHsl().l).toBeLessThan(tinycolor("red").toHsl().l);
    });

    it("saturate", () => {
      const c = tinycolor("hsl(0, 50%, 50%)").saturate(20);
      expect(c.isValid()).toBe(true);
    });

    it("desaturate", () => {
      const c = tinycolor("red").desaturate(20);
      expect(c.isValid()).toBe(true);
    });

    it("greyscale", () => {
      const c = tinycolor("red").greyscale();
      expect(c.isValid()).toBe(true);
      const hsl = c.toHsl();
      expect(hsl.s).toBe(0);
    });

    it("spin", () => {
      expect(tinycolor("red").spin(120).toHex()).toBe("00ff00");
    });
  });

  describe("combination methods", () => {
    it("complement", () => {
      const c = tinycolor("red").complement();
      expect(c.isValid()).toBe(true);
    });

    it("splitcomplement returns 3 colors", () => {
      expect(tinycolor("red").splitcomplement()).toHaveLength(3);
    });

    it("triad returns 3 colors", () => {
      expect(tinycolor("red").triad()).toHaveLength(3);
    });

    it("tetrad returns 4 colors", () => {
      expect(tinycolor("red").tetrad()).toHaveLength(4);
    });

    it("analogous returns 6 by default", () => {
      expect(tinycolor("red").analogous()).toHaveLength(6);
    });

    it("monochromatic returns 6 by default", () => {
      expect(tinycolor("red").monochromatic()).toHaveLength(6);
    });
  });

  describe("static methods", () => {
    it("tinycolor.fromRatio", () => {
      const c = tinycolor.fromRatio({ r: 1, g: 0, b: 0 });
      expect(c.toHex()).toBe("ff0000");
    });

    it("tinycolor.equals", () => {
      expect(tinycolor.equals("red", "#ff0000")).toBe(true);
      expect(tinycolor.equals("red", "blue")).toBe(false);
    });

    it("tinycolor.mix", () => {
      const mixed = tinycolor.mix("red", "blue", 50);
      expect(mixed.isValid()).toBe(true);
      const rgb = mixed.toRgb();
      expect(rgb.r).toBe(128);
      expect(rgb.b).toBe(128);
    });

    it("tinycolor.random", () => {
      const c = tinycolor.random();
      expect(c.isValid()).toBe(true);
    });

    it("tinycolor.readability", () => {
      const ratio = tinycolor.readability("black", "white");
      expect(ratio).toBeCloseTo(21, 0);
    });

    it("tinycolor.isReadable", () => {
      expect(tinycolor.isReadable("black", "white")).toBe(true);
      expect(tinycolor.isReadable("#777", "#888")).toBe(false);
    });

    it("tinycolor.mostReadable", () => {
      const best = tinycolor.mostReadable("black", ["#444", "white", "#888"]);
      expect(best.toHex()).toBe("ffffff");
    });
  });
});
