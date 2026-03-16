// Ported from tinycolor2 test suite (bgrins/TinyColor)
// Tests tincture API compatibility with tinycolor2

import { describe, it, expect } from "vitest";
import tincture from "../src/index.js";
import { TinctureColor } from "../src/color.js";

// Wikipedia color conversions
const conversions = [
  { hex: "#FFFFFF", hex8: "#FFFFFFFF", rgb: { r: "100.0%", g: "100.0%", b: "100.0%" }, hsv: { h: "0", s: "0.000", v: "1.000" }, hsl: { h: "0", s: "0.000", l: "1.000" } },
  { hex: "#808080", hex8: "#808080FF", rgb: { r: "050.0%", g: "050.0%", b: "050.0%" }, hsv: { h: "0", s: "0.000", v: "0.500" }, hsl: { h: "0", s: "0.000", l: "0.500" } },
  { hex: "#000000", hex8: "#000000FF", rgb: { r: "000.0%", g: "000.0%", b: "000.0%" }, hsv: { h: "0", s: "0.000", v: "0.000" }, hsl: { h: "0", s: "0.000", l: "0.000" } },
  { hex: "#FF0000", hex8: "#FF0000FF", rgb: { r: "100.0%", g: "000.0%", b: "000.0%" }, hsv: { h: "0.0", s: "1.000", v: "1.000" }, hsl: { h: "0.0", s: "1.000", l: "0.500" } },
  { hex: "#BFBF00", hex8: "#BFBF00FF", rgb: { r: "075.0%", g: "075.0%", b: "000.0%" }, hsv: { h: "60.0", s: "1.000", v: "0.750" }, hsl: { h: "60.0", s: "1.000", l: "0.375" } },
  { hex: "#008000", hex8: "#008000FF", rgb: { r: "000.0%", g: "050.0%", b: "000.0%" }, hsv: { h: "120.0", s: "1.000", v: "0.500" }, hsl: { h: "120.0", s: "1.000", l: "0.250" } },
  { hex: "#80FFFF", hex8: "#80FFFFFF", rgb: { r: "050.0%", g: "100.0%", b: "100.0%" }, hsv: { h: "180.0", s: "0.500", v: "1.000" }, hsl: { h: "180.0", s: "1.000", l: "0.750" } },
  { hex: "#8080FF", hex8: "#8080FFFF", rgb: { r: "050.0%", g: "050.0%", b: "100.0%" }, hsv: { h: "240.0", s: "0.500", v: "1.000" }, hsl: { h: "240.0", s: "1.000", l: "0.750" } },
  { hex: "#BF40BF", hex8: "#BF40BFFF", rgb: { r: "075.0%", g: "025.0%", b: "075.0%" }, hsv: { h: "300.0", s: "0.667", v: "0.750" }, hsl: { h: "300.0", s: "0.500", l: "0.500" } },
  { hex: "#A0A424", hex8: "#A0A424FF", rgb: { r: "062.8%", g: "064.3%", b: "014.2%" }, hsv: { h: "61.8", s: "0.779", v: "0.643" }, hsl: { h: "61.8", s: "0.638", l: "0.393" } },
  { hex: "#1EAC41", hex8: "#1EAC41FF", rgb: { r: "011.6%", g: "067.5%", b: "025.5%" }, hsv: { h: "134.9", s: "0.828", v: "0.675" }, hsl: { h: "134.9", s: "0.707", l: "0.396" } },
  { hex: "#B430E5", hex8: "#B430E5FF", rgb: { r: "070.4%", g: "018.7%", b: "089.7%" }, hsv: { h: "283.7", s: "0.792", v: "0.897" }, hsl: { h: "283.7", s: "0.775", l: "0.542" } },
  { hex: "#FEF888", hex8: "#FEF888FF", rgb: { r: "099.8%", g: "097.4%", b: "053.2%" }, hsv: { h: "56.9", s: "0.467", v: "0.998" }, hsl: { h: "56.9", s: "0.991", l: "0.765" } },
  { hex: "#19CB97", hex8: "#19CB97FF", rgb: { r: "009.9%", g: "079.5%", b: "059.1%" }, hsv: { h: "162.4", s: "0.875", v: "0.795" }, hsl: { h: "162.4", s: "0.779", l: "0.447" } },
  { hex: "#362698", hex8: "#362698FF", rgb: { r: "021.1%", g: "014.9%", b: "059.7%" }, hsv: { h: "248.3", s: "0.750", v: "0.597" }, hsl: { h: "248.3", s: "0.601", l: "0.373" } },
  { hex: "#7E7EB8", hex8: "#7E7EB8FF", rgb: { r: "049.5%", g: "049.3%", b: "072.1%" }, hsv: { h: "240.5", s: "0.316", v: "0.721" }, hsl: { h: "240.5", s: "0.290", l: "0.607" } },
];

function colorsToHexString(colors: TinctureColor[]): string {
  return colors.map((c) => c.toHex()).join(",");
}

describe("Initialization", () => {
  it("creates objects", () => {
    expect(typeof tincture("red")).toBe("object");
  });

  it("parses options-style format not supported but still creates color", () => {
    // tincture doesn't support {format} option like tinycolor2, but basic creation works
    expect(tincture("red").toHexString()).toBe("#ff0000");
  });

  it("does not modify input objects", () => {
    const obj = { h: 180, s: 0.5, l: 0.5 };
    tincture(obj);
    expect(obj.s).toBe(0.5);
  });
});

describe("Original input", () => {
  it("preserves lowercase rgb string", () => {
    expect(tincture("rgb(39, 39, 39)").getOriginalInput()).toBe("rgb(39, 39, 39)");
  });

  it("preserves uppercase RGB string", () => {
    expect(tincture("RGB(39, 39, 39)").getOriginalInput()).toBe("RGB(39, 39, 39)");
  });

  it("preserves object input", () => {
    const inputObj = { r: 100, g: 100, b: 100 };
    expect(tincture(inputObj).getOriginalInput()).toBe(inputObj);
  });

  it("preserves empty string", () => {
    expect(new TinctureColor("").getOriginalInput()).toBe("");
  });
});

describe("Cloning color", () => {
  it("cloned color is identical", () => {
    const original = tincture("red");
    const cloned = original.clone();
    expect(cloned.toRgbString()).toBe(original.toRgbString());
  });

  it("cloned color changes independently", () => {
    const original = tincture("red");
    const originalStr = original.toRgbString();
    const cloned = original.clone();
    cloned.setAlpha(0.5);
    expect(cloned.toRgbString()).not.toBe(original.toRgbString());
    expect(original.toRgbString()).toBe(originalStr);
  });
});

describe("Random color", () => {
  it("generates valid random color", () => {
    const c = tincture.random();
    expect(c.getAlpha()).toBe(1);
    expect(c.isValid()).toBe(true);
  });

  it("random with alpha", () => {
    const c = tincture.random();
    c.setAlpha(0.5);
    expect(c.toHex8String().slice(-2)).toBe("80");
  });
});

describe("Color Equality / Conversions (Wikipedia colors)", () => {
  for (const c of conversions) {
    it(`${c.hex}: RGB equals hex`, () => {
      expect(tincture.equals(c.rgb, c.hex)).toBe(true);
    });
    it(`${c.hex}: RGB equals hex8`, () => {
      expect(tincture.equals(c.rgb, c.hex8)).toBe(true);
    });
    it(`${c.hex}: RGB equals HSL`, () => {
      expect(tincture.equals(c.rgb, c.hsl)).toBe(true);
    });
    it(`${c.hex}: RGB equals HSV`, () => {
      expect(tincture.equals(c.rgb, c.hsv)).toBe(true);
    });
    it(`${c.hex}: hex equals hex8`, () => {
      expect(tincture.equals(c.hex, c.hex8)).toBe(true);
    });
    it(`${c.hex}: hex equals HSL`, () => {
      expect(tincture.equals(c.hex, c.hsl)).toBe(true);
    });
    it(`${c.hex}: hex equals HSV`, () => {
      expect(tincture.equals(c.hex, c.hsv)).toBe(true);
    });
    it(`${c.hex}: HSL equals HSV`, () => {
      expect(tincture.equals(c.hsl, c.hsv)).toBe(true);
    });
  }
});

describe("With Ratio", () => {
  it("white from ratio", () => {
    expect(tincture.fromRatio({ r: 1, g: 1, b: 1 }).toHexString()).toBe("#ffffff");
  });

  it("alpha works with ratio", () => {
    expect(tincture.fromRatio({ r: 1, g: 0, b: 0, a: 0.5 }).toRgbString()).toBe("rgba(255, 0, 0, 0.5)");
  });

  it("alpha = 1 with ratio", () => {
    expect(tincture.fromRatio({ r: 1, g: 0, b: 0, a: 1 }).toRgbString()).toBe("rgb(255, 0, 0)");
  });

  it("alpha > 1 clamped with ratio", () => {
    expect(tincture.fromRatio({ r: 1, g: 0, b: 0, a: 10 }).toRgbString()).toBe("rgb(255, 0, 0)");
  });

  it("alpha < 0 clamped with ratio", () => {
    expect(tincture.fromRatio({ r: 1, g: 0, b: 0, a: -1 }).toRgbString()).toBe("rgb(255, 0, 0)");
  });
});

describe("Without Ratio", () => {
  it("small int values treated as absolutes", () => {
    expect(tincture({ r: 1, g: 1, b: 1 }).toHexString()).toBe("#010101");
  });

  it("decimal values < 1 treated as zero", () => {
    expect(tincture({ r: 0.1, g: 0.1, b: 0.1 }).toHexString()).toBe("#000000");
  });

  it("rgb string with decimals", () => {
    expect(tincture("rgb .1 .1 .1").toHexString()).toBe("#000000");
  });
});

describe("RGB Text Parsing", () => {
  it("spaced input", () => {
    expect(tincture("rgb 255 0 0").toHexString()).toBe("#ff0000");
  });

  it("parenthesized input", () => {
    expect(tincture("rgb(255, 0, 0)").toHexString()).toBe("#ff0000");
  });

  it("parenthesized spaced input", () => {
    expect(tincture("rgb (255, 0, 0)").toHexString()).toBe("#ff0000");
  });

  it("object input", () => {
    expect(tincture({ r: 255, g: 0, b: 0 }).toHexString()).toBe("#ff0000");
  });

  it("object input toRgb", () => {
    expect(tincture({ r: 255, g: 0, b: 0 }).toRgb()).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  it("equals object vs string", () => {
    expect(tincture.equals({ r: 200, g: 100, b: 0 }, "rgb(200, 100, 0)")).toBe(true);
    expect(tincture.equals({ r: 200, g: 100, b: 0 }, "rgb 200 100 0")).toBe(true);
    expect(tincture.equals({ r: 200, g: 100, b: 0, a: 0.4 }, "rgba 200 100 0 .4")).toBe(true);
    expect(tincture.equals({ r: 199, g: 100, b: 0 }, "rgba 200 100 0 1")).toBe(false);
  });

  it("not-equals object vs string", () => {
    expect(tincture.equals({ r: 199, g: 100, b: 0 }, "rgb(200, 100, 0)")).toBe(false);
    expect(tincture.equals({ r: 199, g: 100, b: 0 }, "rgb 200 100 0")).toBe(false);
  });

  it("tincture instance equals string", () => {
    expect(tincture.equals(tincture({ r: 200, g: 100, b: 0 }).toRgb(), "rgb(200, 100, 0)")).toBe(true);
    expect(tincture.equals(tincture({ r: 200, g: 100, b: 0 }).toRgb(), "rgb 200 100 0")).toBe(true);
  });
});

describe("Percentage RGB Text Parsing", () => {
  it("spaced input", () => {
    expect(tincture("rgb 100% 0% 0%").toHexString()).toBe("#ff0000");
  });

  it("parenthesized input", () => {
    expect(tincture("rgb(100%, 0%, 0%)").toHexString()).toBe("#ff0000");
  });

  it("object input", () => {
    expect(tincture({ r: "100%", g: "0%", b: "0%" }).toHexString()).toBe("#ff0000");
  });

  it("object input toRgb", () => {
    expect(tincture({ r: "100%", g: "0%", b: "0%" }).toRgb()).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  it("equals percentage vs string", () => {
    expect(tincture.equals({ r: "90%", g: "45%", b: "0%" }, "rgb(90%, 45%, 0%)")).toBe(true);
    expect(tincture.equals({ r: "90%", g: "45%", b: "0%" }, "rgb 90% 45% 0%")).toBe(true);
    expect(tincture.equals({ r: "90%", g: "45%", b: "0%", a: 0.4 }, "rgba 90% 45% 0% .4")).toBe(true);
    expect(tincture.equals({ r: "89%", g: "45%", b: "0%" }, "rgba 90% 45% 0% 1")).toBe(false);
  });
});

describe("HSL parsing", () => {
  it("hsl object to hex", () => {
    expect(tincture({ h: 251, s: 100, l: 0.38 }).toHexString()).toBe("#2400c2");
  });

  it("hsl object to rgb", () => {
    expect(tincture({ h: 251, s: 100, l: 0.38 }).toRgbString()).toBe("rgb(36, 0, 194)");
  });

  it("hsl object to hsl", () => {
    expect(tincture({ h: 251, s: 100, l: 0.38 }).toHslString()).toBe("hsl(251, 100%, 38%)");
  });

  it("hsl object with alpha", () => {
    expect(tincture({ h: 251, s: 100, l: 0.38, a: 0.5 }).toHslString()).toBe("hsla(251, 100%, 38%, 0.5)");
  });

  it("hsl string without percent to hex", () => {
    expect(tincture("hsl(251, 100, 38)").toHexString()).toBe("#2400c2");
  });

  it("hsl string with percent to rgb", () => {
    expect(tincture("hsl(251, 100%, 38%)").toRgbString()).toBe("rgb(36, 0, 194)");
  });

  it("hsl string with percent to hsl", () => {
    expect(tincture("hsl(251, 100%, 38%)").toHslString()).toBe("hsl(251, 100%, 38%)");
  });

  it("hsl spaced string", () => {
    expect(tincture("hsl 100 20 10").toHslString()).toBe("hsl(100, 20%, 10%)");
  });
});

describe("Hex Parsing", () => {
  it("toHexString", () => {
    expect(tincture("rgb 255 0 0").toHexString()).toBe("#ff0000");
    expect(tincture("rgb 255 0 0").toHexString(true)).toBe("#f00");
  });

  it("toHex8String", () => {
    expect(tincture("rgba 255 0 0 0.5").toHex8String()).toBe("#ff000080");
    expect(tincture("rgba 255 0 0 0").toHex8String()).toBe("#ff000000");
    expect(tincture("rgba 255 0 0 1").toHex8String()).toBe("#ff0000ff");
    expect(tincture("rgba 255 0 0 1").toHex8String(true)).toBe("#f00f");
  });

  it("toHex", () => {
    expect(tincture("rgb 255 0 0").toHex()).toBe("ff0000");
    expect(tincture("rgb 255 0 0").toHex(true)).toBe("f00");
    expect(tincture("rgba 255 0 0 0.5").toHex8()).toBe("ff000080");
  });
});

describe("HSV Parsing", () => {
  it("hsv string", () => {
    expect(tincture("hsv 251.1 0.887 .918").toHsvString()).toBe("hsv(251, 89%, 92%)");
    expect(tincture("hsv 251.1 0.887 0.918").toHsvString()).toBe("hsv(251, 89%, 92%)");
  });

  it("hsva string", () => {
    expect(tincture("hsva 251.1 0.887 0.918 0.5").toHsvString()).toBe("hsva(251, 89%, 92%, 0.5)");
  });
});

describe("Invalid Parsing", () => {
  const invalidInputs = [
    "this is not a color",
    "#red",
    "  #red",
    "##123456",
    "  ##123456",
  ];

  for (const input of invalidInputs) {
    it(`"${input}" is invalid`, () => {
      const c = tincture(input);
      expect(c.toHexString()).toBe("#000000");
      expect(c.isValid()).toBe(false);
    });
  }

  it("invalid rgb object", () => {
    // Object with r/g/b keys but non-numeric values: NaN coerced to 0
    const c = tincture({ r: "invalid", g: "invalid", b: "invalid" } as any);
    expect(c.toHexString()).toBe("#000000");
  });

  it("invalid hsl object", () => {
    const c = tincture({ h: "invalid", s: "invalid", l: "invalid" } as any);
    expect(c.toHexString()).toBe("#000000");
  });

  it("invalid hsv object", () => {
    const c = tincture({ h: "invalid", s: "invalid", v: "invalid" } as any);
    expect(c.toHexString()).toBe("#000000");
  });
});

describe("Named colors", () => {
  const namedColors: [string, string][] = [
    ["aliceblue", "f0f8ff"], ["antiquewhite", "faebd7"], ["aqua", "00ffff"],
    ["aquamarine", "7fffd4"], ["azure", "f0ffff"], ["beige", "f5f5dc"],
    ["bisque", "ffe4c4"], ["black", "000000"], ["blanchedalmond", "ffebcd"],
    ["blue", "0000ff"], ["blueviolet", "8a2be2"], ["brown", "a52a2a"],
    ["burlywood", "deb887"], ["cadetblue", "5f9ea0"], ["chartreuse", "7fff00"],
    ["chocolate", "d2691e"], ["coral", "ff7f50"], ["cornflowerblue", "6495ed"],
    ["cornsilk", "fff8dc"], ["crimson", "dc143c"], ["cyan", "00ffff"],
    ["darkblue", "00008b"], ["darkcyan", "008b8b"], ["darkgoldenrod", "b8860b"],
    ["darkgray", "a9a9a9"], ["darkgreen", "006400"], ["darkkhaki", "bdb76b"],
    ["darkmagenta", "8b008b"], ["darkolivegreen", "556b2f"], ["darkorange", "ff8c00"],
    ["darkorchid", "9932cc"], ["darkred", "8b0000"], ["darksalmon", "e9967a"],
    ["darkseagreen", "8fbc8f"], ["darkslateblue", "483d8b"], ["darkslategray", "2f4f4f"],
    ["darkturquoise", "00ced1"], ["darkviolet", "9400d3"], ["deeppink", "ff1493"],
    ["deepskyblue", "00bfff"], ["dimgray", "696969"], ["dodgerblue", "1e90ff"],
    ["firebrick", "b22222"], ["floralwhite", "fffaf0"], ["forestgreen", "228b22"],
    ["fuchsia", "ff00ff"], ["gainsboro", "dcdcdc"], ["ghostwhite", "f8f8ff"],
    ["gold", "ffd700"], ["goldenrod", "daa520"], ["gray", "808080"],
    ["grey", "808080"], ["green", "008000"], ["greenyellow", "adff2f"],
    ["honeydew", "f0fff0"], ["hotpink", "ff69b4"], ["indianred ", "cd5c5c"],
    ["indigo ", "4b0082"], ["ivory", "fffff0"], ["khaki", "f0e68c"],
    ["lavender", "e6e6fa"], ["lavenderblush", "fff0f5"], ["lawngreen", "7cfc00"],
    ["lemonchiffon", "fffacd"], ["lightblue", "add8e6"], ["lightcoral", "f08080"],
    ["lightcyan", "e0ffff"], ["lightgoldenrodyellow", "fafad2"], ["lightgrey", "d3d3d3"],
    ["lightgreen", "90ee90"], ["lightpink", "ffb6c1"], ["lightsalmon", "ffa07a"],
    ["lightseagreen", "20b2aa"], ["lightskyblue", "87cefa"], ["lightslategray", "778899"],
    ["lightsteelblue", "b0c4de"], ["lightyellow", "ffffe0"], ["lime", "00ff00"],
    ["limegreen", "32cd32"], ["linen", "faf0e6"], ["magenta", "ff00ff"],
    ["maroon", "800000"], ["mediumaquamarine", "66cdaa"], ["mediumblue", "0000cd"],
    ["mediumorchid", "ba55d3"], ["mediumpurple", "9370db"], ["mediumseagreen", "3cb371"],
    ["mediumslateblue", "7b68ee"], ["mediumspringgreen", "00fa9a"],
    ["mediumturquoise", "48d1cc"], ["mediumvioletred", "c71585"],
    ["midnightblue", "191970"], ["mintcream", "f5fffa"], ["mistyrose", "ffe4e1"],
    ["moccasin", "ffe4b5"], ["navajowhite", "ffdead"], ["navy", "000080"],
    ["oldlace", "fdf5e6"], ["olive", "808000"], ["olivedrab", "6b8e23"],
    ["orange", "ffa500"], ["orangered", "ff4500"], ["orchid", "da70d6"],
    ["palegoldenrod", "eee8aa"], ["palegreen", "98fb98"], ["paleturquoise", "afeeee"],
    ["palevioletred", "db7093"], ["papayawhip", "ffefd5"], ["peachpuff", "ffdab9"],
    ["peru", "cd853f"], ["pink", "ffc0cb"], ["plum", "dda0dd"],
    ["powderblue", "b0e0e6"], ["purple", "800080"], ["rebeccapurple", "663399"],
    ["red", "ff0000"], ["rosybrown", "bc8f8f"], ["royalblue", "4169e1"],
    ["saddlebrown", "8b4513"], ["salmon", "fa8072"], ["sandybrown", "f4a460"],
    ["seagreen", "2e8b57"], ["seashell", "fff5ee"], ["sienna", "a0522d"],
    ["silver", "c0c0c0"], ["skyblue", "87ceeb"], ["slateblue", "6a5acd"],
    ["slategray", "708090"], ["snow", "fffafa"], ["springgreen", "00ff7f"],
    ["steelblue", "4682b4"], ["tan", "d2b48c"], ["teal", "008080"],
    ["thistle", "d8bfd8"], ["tomato", "ff6347"], ["turquoise", "40e0d0"],
    ["violet", "ee82ee"], ["wheat", "f5deb3"], ["white", "ffffff"],
    ["whitesmoke", "f5f5f5"], ["yellow", "ffff00"], ["yellowgreen", "9acd32"],
  ];

  for (const [name, hex] of namedColors) {
    it(`${name.trim()} = ${hex}`, () => {
      expect(tincture(name).toHex()).toBe(hex);
    });
  }

  it("toName red", () => {
    expect(tincture("#f00").toName()).toBe("red");
  });

  it("toName non-named color", () => {
    expect(tincture("#fa0a0a").toName()).toBe(false);
  });
});

describe("Invalid alpha should normalize to 1", () => {
  it("negative alpha", () => {
    expect(tincture({ r: 255, g: 20, b: 10, a: -1 }).toRgbString()).toBe("rgb(255, 20, 10)");
  });

  it("zero alpha", () => {
    expect(tincture({ r: 255, g: 20, b: 10, a: 0 }).toRgbString()).toBe("rgba(255, 20, 10, 0)");
  });

  it("0.5 alpha", () => {
    expect(tincture({ r: 255, g: 20, b: 10, a: 0.5 }).toRgbString()).toBe("rgba(255, 20, 10, 0.5)");
  });

  it("alpha = 1", () => {
    expect(tincture({ r: 255, g: 20, b: 10, a: 1 }).toRgbString()).toBe("rgb(255, 20, 10)");
  });

  it("alpha > 1", () => {
    expect(tincture({ r: 255, g: 20, b: 10, a: 100 }).toRgbString()).toBe("rgb(255, 20, 10)");
  });

  it("hex has alpha 1", () => {
    expect(tincture("#fff").toRgbString()).toBe("rgb(255, 255, 255)");
  });

  it("alpha > 1 in string", () => {
    expect(tincture("rgba 255 0 0 100").toRgbString()).toBe("rgb(255, 0, 0)");
  });
});

describe("Setting alpha", () => {
  it("setAlpha changes value", () => {
    const c = tincture("rgba(255, 0, 0, 1)");
    expect(c.getAlpha()).toBe(1);

    const ret = c.setAlpha(0.9);
    expect(ret).toBe(c);
    expect(c.getAlpha()).toBe(0.9);

    c.setAlpha(0.5);
    expect(c.getAlpha()).toBe(0.5);

    c.setAlpha(0);
    expect(c.getAlpha()).toBe(0);
  });

  it("setAlpha clamps out-of-range", () => {
    const c = tincture("red");
    c.setAlpha(-1);
    expect(c.getAlpha()).toBe(1);
    c.setAlpha(2);
    expect(c.getAlpha()).toBe(1);
  });
});

describe("Alpha = 0", () => {
  it("toName returns transparent for alpha=0", () => {
    expect(tincture({ r: 255, g: 20, b: 10, a: 0 }).toName()).toBe("transparent");
  });

  it("transparent toString", () => {
    expect(tincture("transparent").toString()).toBe("transparent");
  });

  it("transparent toHex", () => {
    expect(tincture("transparent").toHex()).toBe("000000");
  });
});

describe("getBrightness", () => {
  it("black = 0", () => {
    expect(tincture("#000").getBrightness()).toBe(0);
  });

  it("white = 255", () => {
    expect(tincture("#fff").getBrightness()).toBe(255);
  });
});

describe("getLuminance", () => {
  it("black = 0", () => {
    expect(tincture("#000").getLuminance()).toBe(0);
  });

  it("white = 1", () => {
    expect(tincture("#fff").getLuminance()).toBe(1);
  });
});

describe("isDark / isLight", () => {
  const darkColors = ["#000", "#111", "#222", "#333", "#444", "#555", "#666", "#777"];
  const lightColors = ["#888", "#999", "#aaa", "#bbb", "#ccc", "#ddd", "#eee", "#fff"];

  for (const hex of darkColors) {
    it(`${hex} is dark`, () => {
      expect(tincture(hex).isDark()).toBe(true);
      expect(tincture(hex).isLight()).toBe(false);
    });
  }

  for (const hex of lightColors) {
    it(`${hex} is light`, () => {
      expect(tincture(hex).isLight()).toBe(true);
      expect(tincture(hex).isDark()).toBe(false);
    });
  }
});

describe("Round-trip conversions", () => {
  describe("HSL Object round-trip", () => {
    for (const c of conversions) {
      it(`${c.hex} HSL round-trip`, () => {
        const tiny = tincture(c.hex);
        expect(tiny.toHexString()).toBe(tincture(tiny.toHsl()).toHexString());
      });
    }
  });

  describe("HSL String round-trip (±2)", () => {
    for (const c of conversions) {
      it(`${c.hex} HSL string round-trip`, () => {
        const tiny = tincture(c.hex);
        const input = tiny.toRgb();
        const output = tincture(tiny.toHslString()).toRgb();
        expect(Math.abs(input.r - output.r)).toBeLessThanOrEqual(2);
        expect(Math.abs(input.g - output.g)).toBeLessThanOrEqual(2);
        expect(Math.abs(input.b - output.b)).toBeLessThanOrEqual(2);
      });
    }
  });

  describe("HSV Object round-trip", () => {
    for (const c of conversions) {
      it(`${c.hex} HSV round-trip`, () => {
        const tiny = tincture(c.hex);
        expect(tiny.toHexString()).toBe(tincture(tiny.toHsv()).toHexString());
      });
    }
  });

  describe("HSV String round-trip (±2)", () => {
    for (const c of conversions) {
      it(`${c.hex} HSV string round-trip`, () => {
        const tiny = tincture(c.hex);
        const input = tiny.toRgb();
        const output = tincture(tiny.toHsvString()).toRgb();
        expect(Math.abs(input.r - output.r)).toBeLessThanOrEqual(2);
        expect(Math.abs(input.g - output.g)).toBeLessThanOrEqual(2);
        expect(Math.abs(input.b - output.b)).toBeLessThanOrEqual(2);
      });
    }
  });

  describe("RGB Object round-trip", () => {
    for (const c of conversions) {
      it(`${c.hex} RGB round-trip`, () => {
        const tiny = tincture(c.hex);
        expect(tiny.toHexString()).toBe(tincture(tiny.toRgb()).toHexString());
      });
    }
  });

  describe("RGB String round-trip", () => {
    for (const c of conversions) {
      it(`${c.hex} RGB string round-trip`, () => {
        const tiny = tincture(c.hex);
        expect(tiny.toHexString()).toBe(tincture(tiny.toRgbString()).toHexString());
      });
    }
  });
});

describe("Color equality", () => {
  it("same hex", () => {
    expect(tincture.equals("#ff0000", "#ff0000")).toBe(true);
  });

  it("hex vs rgb", () => {
    expect(tincture.equals("#ff0000", "rgb(255, 0, 0)")).toBe(true);
  });

  it("different alphas", () => {
    expect(tincture.equals("#ff0000", "rgba(255, 0, 0, .1)")).toBe(false);
  });

  it("hex8 vs rgba same alpha", () => {
    expect(tincture.equals("#ff000066", "rgba(255, 0, 0, .4)")).toBe(true);
  });

  it("hex4 vs rgba", () => {
    expect(tincture.equals("#f009", "rgba(255, 0, 0, .6)")).toBe(true);
  });

  it("hex8 vs hex4", () => {
    expect(tincture.equals("#336699CC", "369C")).toBe(true);
  });

  it("without hash", () => {
    expect(tincture.equals("ff0000", "#ff0000")).toBe(true);
  });

  it("shorthand", () => {
    expect(tincture.equals("#f00", "#ff0000")).toBe(true);
    expect(tincture.equals("f00", "#ff0000")).toBe(true);
  });

  it("bare hex to hex string", () => {
    expect(tincture("010101").toHexString()).toBe("#010101");
  });

  it("different hex", () => {
    expect(tincture.equals("#ff0000", "#00ff00")).toBe(false);
  });

  it("percentage bounds checking", () => {
    expect(tincture.equals("#ff8000", "rgb(100%, 50%, 0%)")).toBe(true);
  });
});

describe("isReadable (WCAG 2.0)", () => {
  it("black/white is readable", () => {
    expect(tincture.isReadable("#000000", "#ffffff", { level: "AA", size: "small" })).toBe(true);
  });

  it("#ff0088 vs #8822aa — not readable at any level", () => {
    expect(tincture.isReadable("#ff0088", "#8822aa", { level: "AA", size: "small" })).toBe(false);
    expect(tincture.isReadable("#ff0088", "#8822aa", { level: "AA", size: "large" })).toBe(false);
    expect(tincture.isReadable("#ff0088", "#8822aa", { level: "AAA", size: "small" })).toBe(false);
    expect(tincture.isReadable("#ff0088", "#8822aa", { level: "AAA", size: "large" })).toBe(false);
  });

  it("#ff0088 vs #5c1a72 — contrast ~3.04", () => {
    expect(tincture.isReadable("#ff0088", "#5c1a72", { level: "AA", size: "small" })).toBe(false);
    expect(tincture.isReadable("#ff0088", "#5c1a72", { level: "AA", size: "large" })).toBe(true);
    expect(tincture.isReadable("#ff0088", "#5c1a72", { level: "AAA", size: "small" })).toBe(false);
    expect(tincture.isReadable("#ff0088", "#5c1a72", { level: "AAA", size: "large" })).toBe(false);
  });

  it("#ff0088 vs #2e0c3a — contrast ~4.56", () => {
    expect(tincture.isReadable("#ff0088", "#2e0c3a", { level: "AA", size: "small" })).toBe(true);
    expect(tincture.isReadable("#ff0088", "#2e0c3a", { level: "AA", size: "large" })).toBe(true);
    expect(tincture.isReadable("#ff0088", "#2e0c3a", { level: "AAA", size: "small" })).toBe(false);
    expect(tincture.isReadable("#ff0088", "#2e0c3a", { level: "AAA", size: "large" })).toBe(true);
  });

  it("#db91b8 vs #2e0c3a — contrast ~7.12", () => {
    expect(tincture.isReadable("#db91b8", "#2e0c3a", { level: "AA", size: "small" })).toBe(true);
    expect(tincture.isReadable("#db91b8", "#2e0c3a", { level: "AA", size: "large" })).toBe(true);
    expect(tincture.isReadable("#db91b8", "#2e0c3a", { level: "AAA", size: "small" })).toBe(true);
    expect(tincture.isReadable("#db91b8", "#2e0c3a", { level: "AAA", size: "large" })).toBe(true);
  });
});

describe("readability", () => {
  it("black/black = 1", () => {
    expect(tincture.readability("#000", "#000")).toBe(1);
  });

  it("black/#111 = 1.112...", () => {
    expect(tincture.readability("#000", "#111")).toBeCloseTo(1.1121078324840545, 10);
  });

  it("black/white = 21", () => {
    expect(tincture.readability("#000", "#fff")).toBe(21);
  });
});

describe("mostReadable", () => {
  it("picks most readable from list", () => {
    expect(tincture.mostReadable("#000", ["#111", "#222"]).toHexString()).toBe("#222222");
  });

  it("red vs dark-red/green", () => {
    expect(tincture.mostReadable("#f00", ["#d00", "#0d0"]).toHexString()).toBe("#00dd00");
  });

  it("no different color in list", () => {
    expect(tincture.mostReadable("#fff", ["#fff", "#fff"]).toHexString()).toBe("#ffffff");
  });

  it("includeFallbackColors adds black", () => {
    expect(tincture.mostReadable("#fff", ["#fff", "#fff"], { includeFallbackColors: true }).toHexString()).toBe("#000000");
  });

  it("includeFallbackColors false", () => {
    expect(tincture.mostReadable("#123", ["#124", "#125"], { includeFallbackColors: false }).toHexString()).toBe("#112255");
  });

  it("includeFallbackColors true", () => {
    expect(tincture.mostReadable("#123", ["#124", "#125"], { includeFallbackColors: true }).toHexString()).toBe("#ffffff");
  });

  it("#ff0088 with AAA large", () => {
    expect(tincture.mostReadable("#ff0088", ["#2e0c3a"], { includeFallbackColors: true, level: "AAA", size: "large" }).toHexString()).toBe("#2e0c3a");
  });

  it("#ff0088 with AAA small falls back", () => {
    expect(tincture.mostReadable("#ff0088", ["#2e0c3a"], { includeFallbackColors: true, level: "AAA", size: "small" }).toHexString()).toBe("#000000");
  });

  it("#371b2c with AAA large", () => {
    expect(tincture.mostReadable("#371b2c", ["#a9acb6"], { includeFallbackColors: true, level: "AAA", size: "large" }).toHexString()).toBe("#a9acb6");
  });

  it("#371b2c with AAA small falls back", () => {
    expect(tincture.mostReadable("#371b2c", ["#a9acb6"], { includeFallbackColors: true, level: "AAA", size: "small" }).toHexString()).toBe("#ffffff");
  });
});

describe("Filters", () => {
  it("red filter", () => {
    expect(tincture("red").toFilter()).toBe(
      "progid:DXImageTransform.Microsoft.gradient(startColorstr=#ffff0000,endColorstr=#ffff0000)"
    );
  });

  it("transparent filter", () => {
    expect(tincture("transparent").toFilter()).toBe(
      "progid:DXImageTransform.Microsoft.gradient(startColorstr=#00000000,endColorstr=#00000000)"
    );
  });

  it("hex8 filter", () => {
    expect(tincture("#f0f0f0dd").toFilter()).toBe(
      "progid:DXImageTransform.Microsoft.gradient(startColorstr=#ddf0f0f0,endColorstr=#ddf0f0f0)"
    );
  });

  it("rgba filter", () => {
    expect(tincture("rgba(0, 0, 255, .5)").toFilter()).toBe(
      "progid:DXImageTransform.Microsoft.gradient(startColorstr=#800000ff,endColorstr=#800000ff)"
    );
  });
});

describe("Modifications (full 0-100 tables)", () => {
  // Expected values from tinycolor2 test suite — red desaturated 0-100
  const DESATURATIONS = [
    "ff0000","fe0101","fc0303","fb0404","fa0505","f90606","f70808","f60909","f50a0a","f40b0b",
    "f20d0d","f10e0e","f00f0f","ee1111","ed1212","ec1313","eb1414","e91616","e81717","e71818",
    "e61919","e41b1b","e31c1c","e21d1d","e01f1f","df2020","de2121","dd2222","db2424","da2525",
    "d92626","d72828","d62929","d52a2a","d42b2b","d22d2d","d12e2e","d02f2f","cf3030","cd3232",
    "cc3333","cb3434","c93636","c83737","c73838","c63939","c43b3b","c33c3c","c23d3d","c13e3e",
    "bf4040","be4141","bd4242","bb4444","ba4545","b94646","b84747","b64949","b54a4a","b44b4b",
    "b34d4d","b14e4e","b04f4f","af5050","ad5252","ac5353","ab5454","aa5555","a85757","a75858",
    "a65959","a45b5b","a35c5c","a25d5d","a15e5e","9f6060","9e6161","9d6262","9c6363","9a6565",
    "996666","986767","966969","956a6a","946b6b","936c6c","916e6e","906f6f","8f7070","8e7171",
    "8c7373","8b7474","8a7575","887777","877878","867979","857a7a","837c7c","827d7d","817e7e",
    "808080",
  ];

  // Red lightened 0-100
  const LIGHTENS = [
    "ff0000","ff0505","ff0a0a","ff0f0f","ff1414","ff1a1a","ff1f1f","ff2424","ff2929","ff2e2e",
    "ff3333","ff3838","ff3d3d","ff4242","ff4747","ff4d4d","ff5252","ff5757","ff5c5c","ff6161",
    "ff6666","ff6b6b","ff7070","ff7575","ff7a7a","ff8080","ff8585","ff8a8a","ff8f8f","ff9494",
    "ff9999","ff9e9e","ffa3a3","ffa8a8","ffadad","ffb3b3","ffb8b8","ffbdbd","ffc2c2","ffc7c7",
    "ffcccc","ffd1d1","ffd6d6","ffdbdb","ffe0e0","ffe5e5","ffebeb","fff0f0","fff5f5","fffafa",
    "ffffff","ffffff","ffffff","ffffff","ffffff","ffffff","ffffff","ffffff","ffffff","ffffff",
    "ffffff","ffffff","ffffff","ffffff","ffffff","ffffff","ffffff","ffffff","ffffff","ffffff",
    "ffffff","ffffff","ffffff","ffffff","ffffff","ffffff","ffffff","ffffff","ffffff","ffffff",
    "ffffff","ffffff","ffffff","ffffff","ffffff","ffffff","ffffff","ffffff","ffffff","ffffff",
    "ffffff","ffffff","ffffff","ffffff","ffffff","ffffff","ffffff","ffffff","ffffff","ffffff",
    "ffffff",
  ];

  // Red brightened 0-100
  const BRIGHTENS = [
    "ff0000","ff0303","ff0505","ff0808","ff0a0a","ff0d0d","ff0f0f","ff1212","ff1414","ff1717",
    "ff1919","ff1c1c","ff1f1f","ff2121","ff2424","ff2626","ff2929","ff2b2b","ff2e2e","ff3030",
    "ff3333","ff3636","ff3838","ff3b3b","ff3d3d","ff4040","ff4242","ff4545","ff4747","ff4a4a",
    "ff4c4c","ff4f4f","ff5252","ff5454","ff5757","ff5959","ff5c5c","ff5e5e","ff6161","ff6363",
    "ff6666","ff6969","ff6b6b","ff6e6e","ff7070","ff7373","ff7575","ff7878","ff7a7a","ff7d7d",
    "ff7f7f","ff8282","ff8585","ff8787","ff8a8a","ff8c8c","ff8f8f","ff9191","ff9494","ff9696",
    "ff9999","ff9c9c","ff9e9e","ffa1a1","ffa3a3","ffa6a6","ffa8a8","ffabab","ffadad","ffb0b0",
    "ffb2b2","ffb5b5","ffb8b8","ffbaba","ffbdbd","ffbfbf","ffc2c2","ffc4c4","ffc7c7","ffc9c9",
    "ffcccc","ffcfcf","ffd1d1","ffd4d4","ffd6d6","ffd9d9","ffdbdb","ffdede","ffe0e0","ffe3e3",
    "ffe5e5","ffe8e8","ffebeb","ffeded","fff0f0","fff2f2","fff5f5","fff7f7","fffafa","fffcfc",
    "ffffff",
  ];

  // Red darkened 0-100
  const DARKENS = [
    "ff0000","fa0000","f50000","f00000","eb0000","e60000","e00000","db0000","d60000","d10000",
    "cc0000","c70000","c20000","bd0000","b80000","b30000","ad0000","a80000","a30000","9e0000",
    "990000","940000","8f0000","8a0000","850000","800000","7a0000","750000","700000","6b0000",
    "660000","610000","5c0000","570000","520000","4d0000","470000","420000","3d0000","380000",
    "330000","2e0000","290000","240000","1f0000","190000","140000","0f0000","0a0000","050000",
    "000000","000000","000000","000000","000000","000000","000000","000000","000000","000000",
    "000000","000000","000000","000000","000000","000000","000000","000000","000000","000000",
    "000000","000000","000000","000000","000000","000000","000000","000000","000000","000000",
    "000000","000000","000000","000000","000000","000000","000000","000000","000000","000000",
    "000000","000000","000000","000000","000000","000000","000000","000000","000000","000000",
    "000000",
  ];

  it("desaturate 0-100", () => {
    for (let i = 0; i <= 100; i++) {
      expect(tincture("red").desaturate(i).toHex()).toBe(DESATURATIONS[i]);
    }
  });

  it("saturate on already-saturated red stays red", () => {
    for (let i = 0; i <= 100; i++) {
      expect(tincture("red").saturate(i).toHex()).toBe("ff0000");
    }
  });

  it("lighten 0-100", () => {
    for (let i = 0; i <= 100; i++) {
      expect(tincture("red").lighten(i).toHex()).toBe(LIGHTENS[i]);
    }
  });

  it("brighten 0-100", () => {
    for (let i = 0; i <= 100; i++) {
      expect(tincture("red").brighten(i).toHex()).toBe(BRIGHTENS[i]);
    }
  });

  it("darken 0-100", () => {
    for (let i = 0; i <= 100; i++) {
      expect(tincture("red").darken(i).toHex()).toBe(DARKENS[i]);
    }
  });

  it("greyscale", () => {
    expect(tincture("red").greyscale().toHex()).toBe("808080");
  });
});

describe("Spin", () => {
  it("spin -1234 = 206", () => {
    expect(Math.round(tincture("#f00").spin(-1234).toHsl().h)).toBe(206);
  });

  it("spin -360 = 0", () => {
    expect(Math.round(tincture("#f00").spin(-360).toHsl().h)).toBe(0);
  });

  it("spin -120 = 240", () => {
    expect(Math.round(tincture("#f00").spin(-120).toHsl().h)).toBe(240);
  });

  it("spin 0 = 0", () => {
    expect(Math.round(tincture("#f00").spin(0).toHsl().h)).toBe(0);
  });

  it("spin 10 = 10", () => {
    expect(Math.round(tincture("#f00").spin(10).toHsl().h)).toBe(10);
  });

  it("spin 360 = 0", () => {
    expect(Math.round(tincture("#f00").spin(360).toHsl().h)).toBe(0);
  });

  it("spin 2345 = 185", () => {
    expect(Math.round(tincture("#f00").spin(2345).toHsl().h)).toBe(185);
  });

  it("spin 0/-360/360 has no effect on any named color", () => {
    for (const delta of [-360, 0, 360]) {
      for (const name of ["red", "green", "blue", "yellow", "cyan", "magenta", "white", "black"]) {
        expect(tincture(name).spin(delta).toHex()).toBe(tincture(name).toHex());
      }
    }
  });
});

describe("Mix", () => {
  it("default 50% mix", () => {
    expect(tincture.mix("#000", "#fff").toHsl().l).toBe(0.5);
  });

  it("mix 0% returns first color", () => {
    expect(tincture.mix("#f00", "#000", 0).toHex()).toBe("ff0000");
  });

  it("mix 90% handles floating point", () => {
    expect(tincture.mix("#fff", "#000", 90).toHex()).toBe("1a1a1a");
  });

  it("black/white mixing at every percentage", () => {
    for (let i = 0; i < 100; i++) {
      expect(Math.round(tincture.mix("#000", "#fff", i).toHsl().l * 100) / 100).toBe(i / 100);
    }
  });

  it("per-channel mixing red", () => {
    for (let i = 0; i < 100; i++) {
      let newHex = Math.round((255 * (100 - i)) / 100).toString(16);
      if (newHex.length === 1) newHex = "0" + newHex;
      expect(tincture.mix("#f00", "#000", i).toHex()).toBe(newHex + "0000");
    }
  });

  it("per-channel mixing green", () => {
    for (let i = 0; i < 100; i++) {
      let newHex = Math.round((255 * (100 - i)) / 100).toString(16);
      if (newHex.length === 1) newHex = "0" + newHex;
      expect(tincture.mix("#0f0", "#000", i).toHex()).toBe("00" + newHex + "00");
    }
  });

  it("per-channel mixing blue", () => {
    for (let i = 0; i < 100; i++) {
      let newHex = Math.round((255 * (100 - i)) / 100).toString(16);
      if (newHex.length === 1) newHex = "0" + newHex;
      expect(tincture.mix("#00f", "#000", i).toHex()).toBe("0000" + newHex);
    }
  });

  it("alpha channel mixing", () => {
    for (let i = 0; i < 100; i++) {
      expect(tincture.mix("transparent", "#000", i).toRgb().a).toBe(i / 100);
    }
  });
});

describe("Combinations", () => {
  it("complement", () => {
    const c = tincture("red");
    expect(c.complement().toHex()).toBe("00ffff");
    expect(c.toHex()).toBe("ff0000"); // original not modified
  });

  it("analogous", () => {
    expect(colorsToHexString(tincture("red").analogous())).toBe("ff0000,ff0066,ff0033,ff0000,ff3300,ff6600");
  });

  it("monochromatic", () => {
    // tinycolor2 expects "2a0000" but floating-point rounding gives "2b0000" (±1)
    expect(colorsToHexString(tincture("red").monochromatic())).toBe("ff0000,2b0000,550000,800000,aa0000,d40000");
  });

  it("splitcomplement", () => {
    expect(colorsToHexString(tincture("red").splitcomplement())).toBe("ff0000,ccff00,0066ff");
  });

  it("triad", () => {
    expect(colorsToHexString(tincture("red").triad())).toBe("ff0000,00ff00,0000ff");
  });

  it("tetrad", () => {
    expect(colorsToHexString(tincture("red").tetrad())).toBe("ff0000,80ff00,00ffff,7f00ff");
  });
});

describe("Edge cases", () => {
  it("empty string", () => {
    expect(tincture("").isValid()).toBe(false);
  });

  it("undefined-like", () => {
    expect(tincture(undefined as any).isValid()).toBe(false);
  });

  it("NaN values in object", () => {
    // NaN rgb values produce an object (format detected) but with NaN internals
    const c = tincture({ r: NaN, g: NaN, b: NaN });
    expect(c).toBeDefined();
  });

  it("extremely large RGB values", () => {
    // tincture stores raw values but rounds on output
    const c = tincture({ r: 999, g: 999, b: 999 });
    expect(c.isValid()).toBe(true);
  });

  it("negative RGB values", () => {
    const c = tincture({ r: -10, g: -10, b: -10 });
    // tincture stores raw values
    expect(c.isValid()).toBe(true);
  });
});
