import { describe, it, expect } from "vitest";
import { formatSelectedTobaccoTypes } from "./formatSelectedTobaccoTypes";

describe('formatSelectedTobaccoTypes', () => {
  it('concatenate in order of displayOrder', () => {
    const tobaccoTypes = [
      {
        id: 1,
        name: "紙タバコ",
        icon: "",
        displayOrder: 2
      },
      {
        id: 2,
        name: "電子タバコ",
        icon: "",
        displayOrder: 1
      }
    ];
    const result = formatSelectedTobaccoTypes(tobaccoTypes, [1, 2]);
    expect(result).toBe("電子タバコ, 紙タバコ");
  });
  it('extract name only', () => {
    const tobaccoTypes = [
      {
        id: 1,
        name: "紙タバコ",
        icon: "",
        displayOrder: 1
      }
    ];
    const result = formatSelectedTobaccoTypes(tobaccoTypes, [1]);
    expect(result).toBe("紙タバコ");
  });
  it('ignore ID do not exist', () => {
    const tobaccoTypes = [
      {
        id: 1,
        name: "紙タバコ",
        icon: "",
        displayOrder: 1
      }
    ];
    const result = formatSelectedTobaccoTypes(tobaccoTypes, [1, 3]);
    expect(result).toBe("紙タバコ");
  });
  it('return string even if empty array', () => {
    const tobaccoTypes = [
      {
        id: 1,
        name: "紙タバコ",
        icon: "",
        displayOrder: 1
      },
      {
        id: 2,
        name: "電子タバコ",
        icon: "",
        displayOrder: 2
      }
    ];
    const result = formatSelectedTobaccoTypes(tobaccoTypes, []);
    expect(result).toBe("");
  });
});
