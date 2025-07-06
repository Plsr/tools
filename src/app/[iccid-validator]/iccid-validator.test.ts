import { luhnCheck, validateIccid } from "./iccid-validator";
import { describe, expect, test } from "vitest";

describe("validateIccid", () => {
  test("it returns false if the number is longer than 20 digits", () => {
    const tooLong = "894249716191977157159";
    expect(validateIccid(tooLong)).toBe(false);
  });

  test("it returns false if the number is shorter than 19 digits", () => {
    const tooShort = "894249716191977154";
    expect(validateIccid(tooShort)).toBe(false);
  });

  test('it returns false if the ICCID does not start with "89"', () => {
    const wrongStart = "88424971619197715715";
    expect(validateIccid(wrongStart)).toBe(false);
  });

  test.each([
    "89424971619197715715",
    "89424920054848715710",
    "89424979715848715716",
    "89424984475848715710",
    "89424992116848715710",
  ])("returns true for valid ICCIDs", (iccid) =>
    expect(validateIccid(iccid)).toBe(true)
  );

  test.each([
    "89424971619197715712",
    "89424920054848717710",
    "89424979715842715716",
    "89424984475848815710",
    "89424992112848715710",
  ])("returns false for invalid ICCIDs", (iccid) =>
    expect(validateIccid(iccid)).toBe(false)
  );
});

describe("luhn check", () => {
  test.each([
    "79927398713",
    "49927398716",
    "8912345678901234562",
    "89123456789012345675",
    "0",
    "1234567812345678123456786",
    "4111111111111111",
    "5500000000000004",
    "340000000000009",
  ])("it returns true %s", (number) => {
    expect(luhnCheck(number)).toBe(true);
  });

  test("it returns false for a invalid numbers", () => {
    const invalidLuhnNumbers = [
      "79927398714",
      "8912345678901234561",
      "1",
      "4111111111111112",
      "1234567812345678123456782",
      "9999999999999999999",
    ];

    invalidLuhnNumbers.forEach((number) => {
      expect(luhnCheck(number)).toBe(false);
    });
  });
});
