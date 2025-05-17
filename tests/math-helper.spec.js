import { MathHelper } from "../lib/math-helper";

describe("MathHelper", function () {
  it("should pad number with zero in case it has only one digit", function () {
    expect(MathHelper.padZero(1)).toBe("01");
    expect(MathHelper.padZero(11)).toBe("11");
  });
});
