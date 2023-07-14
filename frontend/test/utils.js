import { expect } from "chai";
import { addTime } from "../src/utils/addTime.js";

describe("Utils", () => {
  describe("Add Time", () => {
    it("Adds a duration in positive number to a time", () => {
      const result = addTime("09:00", 7);
      expect(result).to.equal("09:07");
    });

    it("Adds a duration for more than 60 to a time", () => {
      const result = addTime("09:00", 70);
      expect(result).to.equal("10:10");
    });

    it("Adds a duration to a 12pm", () => {
      const result = addTime("12:00", 70);
      expect(result).to.equal("13:10");
    });

    it("Adds 10 minutes to 11:59pm", () => {
      const result = addTime("23:59", 10);
      expect(result).to.equal("00:09");
    });

    it("Adds a duration in negative number to a time", () => {
      const result = addTime("09:00", -7);
      expect(result).to.equal("08:53");
    });
  });
});
