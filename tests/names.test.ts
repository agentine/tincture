import { describe, it, expect } from "vitest";
import { names, getHexNames } from "../src/names.js";

describe("names", () => {
  it("contains standard CSS colors", () => {
    expect(names["red"]).toBe("ff0000");
    expect(names["green"]).toBe("008000");
    expect(names["blue"]).toBe("0000ff");
    expect(names["white"]).toBe("ffffff");
    expect(names["black"]).toBe("000000");
  });

  it("contains all 148 CSS named colors", () => {
    expect(Object.keys(names).length).toBe(148);
  });

  it("all values are 6-char lowercase hex", () => {
    for (const [name, hex] of Object.entries(names)) {
      expect(hex, `${name} should be 6-char hex`).toMatch(/^[0-9a-f]{6}$/);
    }
  });

  it("includes grey/gray variants", () => {
    expect(names["gray"]).toBe("808080");
    expect(names["grey"]).toBe("808080");
    expect(names["darkgray"]).toBe(names["darkgrey"]);
    expect(names["lightgray"]).toBe(names["lightgrey"]);
  });

  it("includes rebeccapurple", () => {
    expect(names["rebeccapurple"]).toBe("663399");
  });

  it("cyan and aqua are the same", () => {
    expect(names["cyan"]).toBe(names["aqua"]);
  });

  it("fuchsia and magenta are the same", () => {
    expect(names["fuchsia"]).toBe(names["magenta"]);
  });
});

describe("getHexNames (reverse lookup)", () => {
  it("maps hex to name", () => {
    const hexNames = getHexNames();
    expect(hexNames["ff0000"]).toBe("red");
    expect(hexNames["0000ff"]).toBe("blue");
    expect(hexNames["ffffff"]).toBe("white");
    expect(hexNames["000000"]).toBe("black");
  });

  it("returns the first name for duplicate hex values", () => {
    const hexNames = getHexNames();
    // aqua and cyan share the same hex — should get the first one encountered
    const val = hexNames["00ffff"];
    expect(["aqua", "cyan"]).toContain(val);
  });

  it("returns same instance on repeated calls", () => {
    const a = getHexNames();
    const b = getHexNames();
    expect(a).toBe(b);
  });
});
