import calculator from "calculator";

describe("calculator tests", () => {
  it("should sum two numbers", async () => {
    const result = calculator.sum(2, 2);
    expect(result).toBe(4);
  });

  it("should subtract two numbers", async () => {
    const result = calculator.sub(2, 2);
    expect(result).toBe(0);
  });
  it("should multiply two numbers", async () => {
    const result = calculator.mul(3, 3);
    expect(result).toBe(9);
  });

  it("should divide two numbers", async () => {
    const result = calculator.div(3, 3);
    expect(result).toBe(1);
  });

  it("should return 0 when diving by zero", async () => {
    const result = calculator.div(3, 0);
    expect(result).toBe(0);
  });
});
