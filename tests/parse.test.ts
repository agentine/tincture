import { describe, it, expect } from "vitest";
import { parseColor } from "../src/parse.js";

describe("parseColor", () => {
  describe("hex input", () => {
    it("parses 6-digit hex with #", () => {
      const c = parseColor("#ff0000");
      expect(c.ok).toBe(true);
      expect(c.r).toBe(255);
      expect(c.g).toBe(0);
      expect(c.b).toBe(0);
      expect(c.a).toBe(1);
      expect(c.format).toBe("hex6");
    });

    it("parses 6-digit hex without #", () => {
      const c = parseColor("ff0000");
      expect(c.ok).toBe(true);
      expect(c.r).toBe(255);
    });

    it("parses 3-digit hex", () => {
      const c = parseColor("#f00");
      expect(c.ok).toBe(true);
      expect(c.r).toBe(255);
      expect(c.g).toBe(0);
      expect(c.b).toBe(0);
      expect(c.format).toBe("hex3");
    });

    it("parses 8-digit hex (RRGGBBAA)", () => {
      const c = parseColor("#ff000080");
      expect(c.ok).toBe(true);
      expect(c.r).toBe(255);
      expect(c.g).toBe(0);
      expect(c.b).toBe(0);
      expect(c.a).toBeCloseTo(128 / 255, 2);
      expect(c.format).toBe("hex8");
    });

    it("parses 4-digit hex (RGBA)", () => {
      const c = parseColor("#f008");
      expect(c.ok).toBe(true);
      expect(c.r).toBe(255);
      expect(c.g).toBe(0);
      expect(c.b).toBe(0);
      expect(c.a).toBeCloseTo(136 / 255, 2);
      expect(c.format).toBe("hex4");
    });

    it("is case insensitive", () => {
      const c = parseColor("#FF0000");
      expect(c.ok).toBe(true);
      expect(c.r).toBe(255);
    });
  });

  describe("rgb() input", () => {
    it("parses rgb(r, g, b)", () => {
      const c = parseColor("rgb(255, 0, 128)");
      expect(c.ok).toBe(true);
      expect(c.r).toBe(255);
      expect(c.g).toBe(0);
      expect(c.b).toBe(128);
      expect(c.a).toBe(1);
      expect(c.format).toBe("rgb");
    });

    it("parses rgb with spaces (no commas)", () => {
      const c = parseColor("rgb(255 0 128)");
      expect(c.ok).toBe(true);
      expect(c.r).toBe(255);
      expect(c.g).toBe(0);
      expect(c.b).toBe(128);
    });

    it("parses rgb with percentages", () => {
      const c = parseColor("rgb(100%, 0%, 50%)");
      expect(c.ok).toBe(true);
      expect(c.r).toBe(255);
      expect(c.g).toBe(0);
      expect(c.b).toBeCloseTo(127.5, 0);
    });
  });

  describe("rgba() input", () => {
    it("parses rgba(r, g, b, a)", () => {
      const c = parseColor("rgba(255, 0, 0, 0.5)");
      expect(c.ok).toBe(true);
      expect(c.r).toBe(255);
      expect(c.g).toBe(0);
      expect(c.b).toBe(0);
      expect(c.a).toBe(0.5);
      expect(c.format).toBe("rgba");
    });

    it("parses rgba with alpha 0", () => {
      const c = parseColor("rgba(0, 0, 0, 0)");
      expect(c.ok).toBe(true);
      expect(c.a).toBe(0);
    });
  });

  describe("hsl() input", () => {
    it("parses hsl(h, s, l)", () => {
      const c = parseColor("hsl(0, 100%, 50%)");
      expect(c.ok).toBe(true);
      expect(c.r).toBeCloseTo(255, 0);
      expect(c.g).toBeCloseTo(0, 0);
      expect(c.b).toBeCloseTo(0, 0);
      expect(c.format).toBe("hsl");
    });

    it("parses hsl for green", () => {
      const c = parseColor("hsl(120, 100%, 50%)");
      expect(c.ok).toBe(true);
      expect(c.r).toBeCloseTo(0, 0);
      expect(c.g).toBeCloseTo(255, 0);
      expect(c.b).toBeCloseTo(0, 0);
    });

    it("parses hsl for blue", () => {
      const c = parseColor("hsl(240, 100%, 50%)");
      expect(c.ok).toBe(true);
      expect(c.r).toBeCloseTo(0, 0);
      expect(c.g).toBeCloseTo(0, 0);
      expect(c.b).toBeCloseTo(255, 0);
    });
  });

  describe("hsla() input", () => {
    it("parses hsla(h, s, l, a)", () => {
      const c = parseColor("hsla(0, 100%, 50%, 0.5)");
      expect(c.ok).toBe(true);
      expect(c.r).toBeCloseTo(255, 0);
      expect(c.a).toBe(0.5);
      expect(c.format).toBe("hsla");
    });
  });

  describe("hsv() input", () => {
    it("parses hsv(h, s, v)", () => {
      const c = parseColor("hsv(0, 100%, 100%)");
      expect(c.ok).toBe(true);
      expect(c.r).toBeCloseTo(255, 0);
      expect(c.g).toBeCloseTo(0, 0);
      expect(c.b).toBeCloseTo(0, 0);
      expect(c.format).toBe("hsv");
    });
  });

  describe("hsva() input", () => {
    it("parses hsva(h, s, v, a)", () => {
      const c = parseColor("hsva(0, 100%, 100%, 0.5)");
      expect(c.ok).toBe(true);
      expect(c.r).toBeCloseTo(255, 0);
      expect(c.a).toBe(0.5);
      expect(c.format).toBe("hsva");
    });
  });

  describe("named colors", () => {
    it("parses named color 'red'", () => {
      const c = parseColor("red");
      expect(c.ok).toBe(true);
      expect(c.r).toBe(255);
      expect(c.g).toBe(0);
      expect(c.b).toBe(0);
      expect(c.format).toBe("name");
    });

    it("parses named color 'rebeccapurple'", () => {
      const c = parseColor("rebeccapurple");
      expect(c.ok).toBe(true);
      expect(c.r).toBe(0x66);
      expect(c.g).toBe(0x33);
      expect(c.b).toBe(0x99);
    });

    it("parses 'transparent'", () => {
      const c = parseColor("transparent");
      expect(c.ok).toBe(true);
      expect(c.r).toBe(0);
      expect(c.g).toBe(0);
      expect(c.b).toBe(0);
      expect(c.a).toBe(0);
      expect(c.format).toBe("transparent");
    });

    it("is case insensitive for names", () => {
      const c = parseColor("Red");
      expect(c.ok).toBe(true);
      expect(c.r).toBe(255);
    });
  });

  describe("object input", () => {
    it("parses {r, g, b}", () => {
      const c = parseColor({ r: 255, g: 0, b: 0 });
      expect(c.ok).toBe(true);
      expect(c.r).toBe(255);
      expect(c.format).toBe("rgb");
    });

    it("parses {r, g, b, a}", () => {
      const c = parseColor({ r: 255, g: 0, b: 0, a: 0.5 });
      expect(c.ok).toBe(true);
      expect(c.r).toBe(255);
      expect(c.a).toBe(0.5);
      expect(c.format).toBe("rgba");
    });

    it("parses {h, s, l}", () => {
      const c = parseColor({ h: 0, s: "100%", l: "50%" });
      expect(c.ok).toBe(true);
      expect(c.r).toBeCloseTo(255, 0);
      expect(c.g).toBeCloseTo(0, 0);
      expect(c.b).toBeCloseTo(0, 0);
      expect(c.format).toBe("hsl");
    });

    it("parses {h, s, l, a}", () => {
      const c = parseColor({ h: 0, s: "100%", l: "50%", a: 0.5 });
      expect(c.ok).toBe(true);
      expect(c.a).toBe(0.5);
      expect(c.format).toBe("hsla");
    });

    it("parses {h, s, v}", () => {
      const c = parseColor({ h: 0, s: "100%", v: "100%" });
      expect(c.ok).toBe(true);
      expect(c.r).toBeCloseTo(255, 0);
      expect(c.format).toBe("hsv");
    });

    it("parses {h, s, v, a}", () => {
      const c = parseColor({ h: 0, s: "100%", v: "100%", a: 0.5 });
      expect(c.ok).toBe(true);
      expect(c.a).toBe(0.5);
      expect(c.format).toBe("hsva");
    });

    it("handles percentage strings in rgb object", () => {
      const c = parseColor({ r: "100%", g: "0%", b: "50%" });
      expect(c.ok).toBe(true);
      expect(c.r).toBe(255);
      expect(c.g).toBe(0);
      expect(c.b).toBeCloseTo(127.5, 0);
    });
  });

  describe("invalid input", () => {
    it("returns ok=false for empty string", () => {
      expect(parseColor("").ok).toBe(false);
    });

    it("returns ok=false for nonsense", () => {
      expect(parseColor("notacolor").ok).toBe(false);
    });

    it("returns ok=false for invalid hex", () => {
      expect(parseColor("#xyz").ok).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("handles whitespace", () => {
      const c = parseColor("  #ff0000  ");
      expect(c.ok).toBe(true);
      expect(c.r).toBe(255);
    });

    it("handles mixed case hex", () => {
      const c = parseColor("#FfAa00");
      expect(c.ok).toBe(true);
      expect(c.r).toBe(255);
      expect(c.g).toBe(170);
      expect(c.b).toBe(0);
    });
  });
});
