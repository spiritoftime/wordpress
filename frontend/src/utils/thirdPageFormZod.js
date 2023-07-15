import * as z from "zod";
export const thirdPageZod = z.object({
  title: z.string().nonempty("Required"),
  synopsis: z.string().nonempty("Required"),
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
  presentationDuration: z
    .number()
    .positive({ message: "Value must be positive" })
    .int({ message: "Value must be an integer" })
    .or(z.string())
    .pipe(
      z.coerce
        .number()
        .positive({ message: "Value must be positive" })
        .int({ message: "Value must be an integer" })
    ),
  discussionDuration: z
    .number()
    .positive({ message: "Value must be positive" })
    .int({ message: "Value must be an integer" })
    .or(z.string())
    .pipe(
      z.coerce
        .number()
        .positive({ message: "Value must be positive" })
        .int({ message: "Value must be an integer" })
    ),
  sessionCode: z.string().nonempty("Required"),
  location: z.string().nonempty("Required"),
  isPublish: z.boolean().optional(),
  date: z.date().min(new Date("1900-01-01"), {
    message: "Please input a date",
  }),
  topics: z.array(
    z.object({
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
      topic: z.string().nonempty("Required"),
      topicId: z.number().optional(),
      speakers: z.array(
        z.object({
          value: z.string().nonempty("Required"),
          label: z.string().nonempty("Required"),
        })
      ),
    })
  ),
  sessionType: z.enum(["Symposia", "Masterclass"]),
  speakers: z.array(
    z.object({
      speakerRole: z.string().nonempty("Required"),
      speaker: z.array(
        z.object({
          value: z.string().nonempty("Required"),
          label: z.string().nonempty("Required"),
          id: z.number().optional(),
        })
      ),
    })
  ),
});
// to include the last page - allocate time to topics later
// where does wordpressurl go??
