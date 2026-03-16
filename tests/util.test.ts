import { describe, it, expect } from "vitest";
import {
  clamp,
  bound01,
  pad2,
  convertToPercentage,
  boundAlpha,
  isOnePointZero,
  isPercentage,
  convertDecimalToHex,
  convertHexToDecimal,
} from "../src/util.js";

describe("clamp", () => {
  it("returns value when in range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("clamps to min", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it("clamps to max", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("handles equal min and max", () => {
    expect(clamp(5, 3, 3)).toBe(3);
  });
});

describe("bound01", () => {
  it("normalizes number to 0–1 given max", () => {
    expect(bound01(128, 255)).toBeCloseTo(128 / 255, 5);
  });

  it("handles 0", () => {
    expect(bound01(0, 255)).toBe(0);
  });

  it("handles max value", () => {
    expect(bound01(255, 255)).toBe(1);
  });

  it("handles percentage string", () => {
    expect(bound01("50%", 255)).toBeCloseTo(0.5, 5);
  });

  it("handles 100%", () => {
    expect(bound01("100%", 255)).toBe(1);
  });

  it("handles 0%", () => {
    expect(bound01("0%", 255)).toBe(0);
  });

  it("handles 1.0 string as 100%", () => {
    // "1.0" is treated as isOnePointZero -> "100%"
    expect(bound01("1.0", 255)).toBe(1);
  });

  it("clamps negative to 0", () => {
    expect(bound01(-10, 255)).toBe(0);
  });

  it("clamps above max", () => {
    expect(bound01(300, 255)).toBe(1);
  });
});

describe("pad2", () => {
  it("pads single char to two", () => {
    expect(pad2("a")).toBe("0a");
  });

  it("leaves two-char string alone", () => {
    expect(pad2("ff")).toBe("ff");
  });

  it("leaves longer strings alone", () => {
    expect(pad2("abc")).toBe("abc");
  });
});

describe("convertToPercentage", () => {
  it("passes through percentage strings", () => {
    expect(convertToPercentage("50%")).toBe("50%");
  });

  it("converts 0–1 number to percentage", () => {
    expect(convertToPercentage(0.5)).toBe("50%");
  });

  it("converts 0 to 0%", () => {
    expect(convertToPercentage(0)).toBe("0%");
  });

  it("converts 1 to 100%", () => {
    expect(convertToPercentage(1)).toBe("100%");
  });
});

describe("boundAlpha", () => {
  it("returns valid alpha", () => {
    expect(boundAlpha(0.5)).toBe(0.5);
  });

  it("clamps NaN to 1", () => {
    expect(boundAlpha("invalid")).toBe(1);
  });

  it("clamps negative to 1", () => {
    expect(boundAlpha(-0.5)).toBe(1);
  });

  it("clamps > 1 to 1", () => {
    expect(boundAlpha(1.5)).toBe(1);
  });

  it("allows 0", () => {
    expect(boundAlpha(0)).toBe(0);
  });

  it("allows 1", () => {
    expect(boundAlpha(1)).toBe(1);
  });

  it("parses string to float", () => {
    expect(boundAlpha("0.7")).toBe(0.7);
  });
});

describe("isOnePointZero", () => {
  it("returns true for '1.0'", () => {
    expect(isOnePointZero("1.0")).toBe(true);
  });

  it("returns false for '1'", () => {
    expect(isOnePointZero("1")).toBe(false);
  });

  it("returns false for number 1", () => {
    expect(isOnePointZero(1)).toBe(false);
  });

  it("returns false for '0.5'", () => {
    expect(isOnePointZero("0.5")).toBe(false);
  });

  it("returns true for '1.00'", () => {
    expect(isOnePointZero("1.00")).toBe(true);
  });
});

describe("isPercentage", () => {
  it("returns true for percentage string", () => {
    expect(isPercentage("50%")).toBe(true);
  });

  it("returns false for plain number string", () => {
    expect(isPercentage("50")).toBe(false);
  });

  it("returns false for number", () => {
    expect(isPercentage(50)).toBe(false);
  });
});

describe("convertDecimalToHex", () => {
  it("converts 1 to ff", () => {
    expect(convertDecimalToHex(1)).toBe("ff");
  });

  it("converts 0 to 0", () => {
    expect(convertDecimalToHex(0)).toBe("0");
  });

  it("converts 0.5 to 80", () => {
    expect(convertDecimalToHex(0.5)).toBe("80");
  });
});

describe("convertHexToDecimal", () => {
  it("converts ff to 1", () => {
    expect(convertHexToDecimal("ff")).toBe(1);
  });

  it("converts 00 to 0", () => {
    expect(convertHexToDecimal("00")).toBe(0);
  });

  it("converts 80 to ~0.502", () => {
    expect(convertHexToDecimal("80")).toBeCloseTo(128 / 255, 5);
  });
});
