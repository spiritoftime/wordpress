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
  // moderators: z.array(
  //   z.object({
  //     moderator: z.string().nonempty("Required"),
  //   })
  // ),
});
// to include the last page - allocate time to topics later
// where does wordpressurl go??
