import {
  capitalizeFirstLetter,
  shuffle,
  floatToPercentageString,
  getTop3Rank,
  getWinRateClassName,
  isObjEmpty,
  timeSince,
  convertSecondsToMinutesAndSeconds,
  convertSecondsToMinutesAndSeconds2,
  getKDA,
  formatNumber,
} from "./utils.js";

describe("Utils Functions", () => {
  describe("capitalizeFirstLetter", () => {
    test("should capitalize the first letter of a lowercase string", () => {
      expect(capitalizeFirstLetter("hello")).toBe("Hello");
    });

    test("should handle already capitalized strings", () => {
      expect(capitalizeFirstLetter("Hello")).toBe("Hello");
    });

    test("should handle empty strings", () => {
      expect(capitalizeFirstLetter("")).toBe("");
    });

    test("should handle single character strings", () => {
      expect(capitalizeFirstLetter("a")).toBe("A");
      expect(capitalizeFirstLetter("A")).toBe("A");
    });

    test("should handle strings with numbers and special characters", () => {
      expect(capitalizeFirstLetter("123abc")).toBe("123abc");
      expect(capitalizeFirstLetter("!hello")).toBe("!hello");
    });
  });

  describe("shuffle", () => {
    test("should return an array with the same length", () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffle([...original]);
      expect(shuffled).toHaveLength(original.length);
    });

    test("should contain all original elements", () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffle([...original]);
      expect(shuffled).toEqual(expect.arrayContaining(original));
    });

    test("should handle empty arrays", () => {
      const result = shuffle([]);
      expect(result).toEqual([]);
    });

    test("should handle single element arrays", () => {
      const result = shuffle([1]);
      expect(result).toEqual([1]);
    });

    test("should modify the original array (in-place shuffle)", () => {
      const original = [1, 2, 3, 4, 5];
      const result = shuffle(original);
      expect(result).toBe(original); // same reference
    });
  });

  describe("floatToPercentageString", () => {
    test("should convert float to percentage string", () => {
      expect(floatToPercentageString(0.5)).toBe("50%");
      expect(floatToPercentageString(0.756)).toBe("76%");
      expect(floatToPercentageString(1.0)).toBe("100%");
    });

    test("should handle zero", () => {
      expect(floatToPercentageString(0)).toBe("0%");
    });

    test("should return null for null/undefined values", () => {
      expect(floatToPercentageString(null)).toBe(null);
      expect(floatToPercentageString(undefined)).toBe(null);
    });

    test("should handle very small numbers", () => {
      expect(floatToPercentageString(0.001)).toBe("0%");
      expect(floatToPercentageString(0.006)).toBe("1%");
    });
  });

  describe("getTop3Rank", () => {
    test("should calculate average of top 3 ranks", () => {
      const ranks = {
        top: 10,
        jungle: 8,
        mid: 9,
        adc: 6,
        support: 7,
      };
      expect(getTop3Rank(ranks)).toBe("9.0");
    });

    test("should handle all same values", () => {
      const ranks = {
        top: 5,
        jungle: 5,
        mid: 5,
        adc: 5,
        support: 5,
      };
      expect(getTop3Rank(ranks)).toBe("5.0");
    });

    test("should handle mixed positive and negative values", () => {
      const ranks = {
        top: -1,
        jungle: 10,
        mid: 5,
        adc: 0,
        support: 8,
      };
      expect(getTop3Rank(ranks)).toBe("7.7");
    });
  });

  describe("getWinRateClassName", () => {
    test("should return white for neutral win rates", () => {
      expect(getWinRateClassName(0.5)).toBe("text-white");
      expect(getWinRateClassName(0.505)).toBe("text-white");
    });

    test("should return red-500 for very low win rates", () => {
      expect(getWinRateClassName(0.3)).toBe("text-red-500");
      expect(getWinRateClassName(0.1)).toBe("text-red-500");
    });

    test("should return green-500 for very high win rates", () => {
      expect(getWinRateClassName(0.7)).toBe("text-green-500");
      expect(getWinRateClassName(0.9)).toBe("text-green-500");
    });

    test("should return appropriate colors for intermediate win rates", () => {
      expect(getWinRateClassName(0.52)).toBe("text-green-50");
      expect(getWinRateClassName(0.48)).toBe("text-red-100");
    });
  });

  describe("isObjEmpty", () => {
    test("should return true for empty objects", () => {
      expect(isObjEmpty({})).toBe(true);
    });

    test("should return false for objects with properties", () => {
      expect(isObjEmpty({ a: 1 })).toBe(false);
      expect(isObjEmpty({ name: "test", value: 123 })).toBe(false);
    });

    test("should return false for objects with falsy values", () => {
      expect(isObjEmpty({ a: null })).toBe(false);
      expect(isObjEmpty({ b: undefined })).toBe(false);
      expect(isObjEmpty({ c: 0 })).toBe(false);
      expect(isObjEmpty({ d: "" })).toBe(false);
    });
  });

  describe("timeSince", () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2023-01-01T00:00:00Z"));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test("should return months ago for old dates", () => {
      const oldDate = new Date("2022-10-01T00:00:00Z");
      expect(timeSince(oldDate)).toBe("3 months ago");
    });

    test("should return days ago for recent dates", () => {
      const recentDate = new Date("2022-12-29T00:00:00Z");
      expect(timeSince(recentDate)).toBe("3 days ago");
    });

    test("should return hours ago for very recent dates", () => {
      const veryRecentDate = new Date("2022-12-31T21:00:00Z");
      expect(timeSince(veryRecentDate)).toBe("3 hours ago");
    });

    test("should return minutes ago for just happened dates", () => {
      const justHappenedDate = new Date("2022-12-31T23:57:00Z");
      expect(timeSince(justHappenedDate)).toBe("3 minutes ago");
    });

    test("should return empty string for very recent dates", () => {
      const veryRecentDate = new Date("2022-12-31T23:59:45Z");
      expect(timeSince(veryRecentDate)).toBe("");
    });

    test("should handle singular forms correctly", () => {
      const oneDayAgo = new Date("2022-12-31T00:00:00Z");
      expect(timeSince(oneDayAgo)).toBe("24 hours ago");

      const oneHourAgo = new Date("2022-12-31T23:00:00Z");
      expect(timeSince(oneHourAgo)).toBe("60 minutes ago");
    });
  });

  describe("convertSecondsToMinutesAndSeconds", () => {
    test("should convert seconds to MM:SS format", () => {
      expect(convertSecondsToMinutesAndSeconds(90)).toBe("01:30");
      expect(convertSecondsToMinutesAndSeconds(125)).toBe("02:05");
      expect(convertSecondsToMinutesAndSeconds(3661)).toBe("61:01");
    });

    test("should handle zero seconds", () => {
      expect(convertSecondsToMinutesAndSeconds(0)).toBe("00:00");
    });

    test("should handle less than a minute", () => {
      expect(convertSecondsToMinutesAndSeconds(45)).toBe("00:45");
      expect(convertSecondsToMinutesAndSeconds(5)).toBe("00:05");
    });

    test("should handle exact minutes", () => {
      expect(convertSecondsToMinutesAndSeconds(60)).toBe("01:00");
      expect(convertSecondsToMinutesAndSeconds(600)).toBe("10:00");
    });
  });

  describe("convertSecondsToMinutesAndSeconds2", () => {
    test("should convert seconds to MMm SSs format", () => {
      expect(convertSecondsToMinutesAndSeconds2(90)).toBe("01m  30s");
      expect(convertSecondsToMinutesAndSeconds2(125)).toBe("02m  05s");
      expect(convertSecondsToMinutesAndSeconds2(3661)).toBe("61m  01s");
    });

    test("should handle zero seconds", () => {
      expect(convertSecondsToMinutesAndSeconds2(0)).toBe("00m  00s");
    });

    test("should handle less than a minute", () => {
      expect(convertSecondsToMinutesAndSeconds2(45)).toBe("00m  45s");
      expect(convertSecondsToMinutesAndSeconds2(5)).toBe("00m  05s");
    });
  });

  describe("getKDA", () => {
    test("should calculate KDA correctly", () => {
      const stats = { kills: 10, deaths: 5, assists: 15 };
      expect(getKDA(stats)).toBe("5.0");
    });

    test("should handle zero deaths", () => {
      const stats = { kills: 10, deaths: 0, assists: 5 };
      expect(getKDA(stats)).toBe("Infinity");
    });

    test("should handle zero kills and assists", () => {
      const stats = { kills: 0, deaths: 5, assists: 0 };
      expect(getKDA(stats)).toBe("0.0");
    });

    test("should round to one decimal place", () => {
      const stats = { kills: 7, deaths: 3, assists: 8 };
      expect(getKDA(stats)).toBe("5.0");
    });

    test("should handle partial KDA values", () => {
      const stats = { kills: 1, deaths: 3, assists: 2 };
      expect(getKDA(stats)).toBe("1.0");
    });
  });

  describe("formatNumber", () => {
    test("should format numbers with locale formatting", () => {
      expect(formatNumber(1000)).toBe("1.000");
      expect(formatNumber(1234567)).toBe("1.234.567");
    });

    test("should handle zero", () => {
      expect(formatNumber(0)).toBe("0");
    });

    test("should handle negative numbers", () => {
      expect(formatNumber(-1000)).toBe("-1.000");
    });

    test("should handle decimal numbers", () => {
      expect(formatNumber(1000.5)).toBe("1.000,5");
    });

    test("should handle small numbers", () => {
      expect(formatNumber(123)).toBe("123");
    });
  });
});
