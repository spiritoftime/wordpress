import * as z from "zod";
import { isTimeLater } from "./isTimeLater";
const zodForDates = z
  .object({
    startTime: z
      .string()
      .nonempty("Required")
      .regex(
        new RegExp(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
        "Please input a valid 24-hour format time"
      ),
    endTime: z
      .string()
      .nonempty("Required")
      .regex(
        new RegExp(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
        "Please input a valid 24-hour format time"
      ),
  })
  .refine(
    (data) => {
      const isValid = isTimeLater(data.startTime, data.endTime);

      return isValid;
    },
    {
      message: "End time must be later than start time",
      path: ["endTime"], // where to set the error
    }
  );
const zodForRest = z.object({
  title: z.string().nonempty("Required"),
  synopsis: z.string().nonempty("Required"),
  sessionCode: z.string().nonempty("Required"),
  location: z.string().nonempty("Required"),
  isPublish: z.boolean().optional(),
  date: z.date().min(new Date("1900-01-01"), {
    message: "Please input a date",
  }),
  sessionType: z.enum(["Symposia", "Masterclass"]),
  speakers: z.array(
    z.object({
      speakerRole: z.string().nonempty("Required"),
      speaker: z.array(z.string().nonempty("Required")),
    })
    // .refine((value) => value.some((item) => item), {
    //   message: "You have to select at least one item.",
    // }),
  ),
});

// need intersection so that the endtime refine will fire.
// for more info, check out https://github.com/colinhacks/zod/issues/479
export const firstPageZod = z.intersection(zodForDates, zodForRest);
