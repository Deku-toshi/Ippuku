import { describe, it, expect } from "vitest";
import { toSmokingAreaDisplay } from "./mapper";

describe('toSmokingAreaDisplay', () => {
  const data = {
    id: 1,
    name: "テスト喫煙所",
    latitude: "35.6",
    longitude: "47.8",
    tobacco_type_ids: [1, 2]
  };

  const result = toSmokingAreaDisplay(data);

  it('convert snake_case to camelCase', () => {
    expect(result.tobaccoTypeIds).toEqual([1, 2]);
  });
  it('convert latitude and longitude to number', () => {
    expect(result.latitude).toBe(35.6);
    expect(result.longitude).toBe(47.8);
  });
});
