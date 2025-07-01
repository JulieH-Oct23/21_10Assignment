/* eslint-env mocha */
import { strict as assert } from "assert";

describe("Sample Test", () => {
  it("should return true for a truthy value", () => {
    assert.ok(true); // This is a simple passing test
  });

  it("should add numbers correctly", () => {
    const sum = 1 + 1;
    assert.equal(sum, 2);
  });
});
