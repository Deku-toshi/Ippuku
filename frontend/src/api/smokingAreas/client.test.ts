import { describe, it, expect } from "vitest";
import { buildSmokingAreasQuery } from "./client";

describe('buildSmokingAreasQuery', () => {
  it('convert camelCase to snake_case', () => {
    const queryData = {
      tobaccoTypeId: 1
    };
    const result = buildSmokingAreasQuery(queryData);
    expect(result?.tobacco_type_id).toBe(1);
  });
  it('empty value return undefined', () => {
    const queryData = {
      tobaccoTypeId: undefined,
      electronicOnly: undefined
    };
    const result = buildSmokingAreasQuery(queryData);
    expect(result).toBeUndefined();
  });
  it('convert true of electronicOnly to string', () => {
    const queryData = {
      electronicOnly: true
    };
    const result = buildSmokingAreasQuery(queryData);
    expect(result?.electronic_only).toBe("true");
  });
});
