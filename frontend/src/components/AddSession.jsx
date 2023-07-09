import React, { useState } from "react";
import PageHeader from "./PageHeader";
import { FormProgress } from "./FormProgress";
import { useAppContext } from "../context/appContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import MultiPageForm from "./MultiPageForm";
import AddSessionPageOne from "./AddSessionPageOne";
import { Form } from "./ui/form";
import AddSessionPageTwo from "./AddSessionPageTwo";
import { isTimeLater } from "../utils/isTimeLater";
import AddSessionPageThree from "./AddSessionPageThree";
const AddSession = () => {
  const [formStep, setFormStep] = useState(0);
  const nextFormStep = () => setFormStep((currentStep) => currentStep + 1);
  const prevFormStep = () => setFormStep((currentStep) => currentStep - 1);
  // formschemas needs to be in an array so that the useResolver can work for multiple pages.
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
  });
  const endResultZod = z.intersection(zodForDates, zodForRest);
  const formSchemas = [
    endResultZod,
    {}, // nothing to validate at the second page
    // last page validation object needs to have everything combined
    z.object({
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
      // moderators: z.array(
      //   z.object({
      //     moderator: z.string().nonempty("Required"),
      //   })
      // ),
    }),
    // to include the last page - allocate time to topics later
    // where does wordpressurl go??
  ];
  const FormSchema = formSchemas[formStep];
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      synopsis: "",
      startTime: "",
      endTime: "",
      sessionCode: "",
      location: "",
      // sessionType: "Symposia",
      // moderators: [{ moderator: "" }],
    },
    mode: "onChange",
  });
  const {
    control,
    watch,
    formState: { errors, isValid },
  } = form;
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col w-full p-12">
      <div className="w-full">
        <PageHeader rowType="Add New Session" hasButton={false} />
        {formStep === 0 && <p className="font-semibold">Session Details</p>}
        {formStep === 1 && <p className="font-semibold">Select Topics</p>}
        {formStep === 2 && <p className="font-semibold">Confirm Topics</p>}
      </div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <MultiPageForm
              errors={errors}
              isValid={isValid}
              nextFormStep={nextFormStep}
              currentStep={formStep}
              prevFormStep={prevFormStep}
            >
              {formStep === 0 && <AddSessionPageOne control={control} />}
              {formStep === 1 && <AddSessionPageTwo control={control} />}
              {formStep === 2 && <AddSessionPageThree control={control} />}
            </MultiPageForm>
          </form>
        </Form>
      </div>
      <pre>{JSON.stringify(watch(), null, 2)}</pre>
    </div>
  );
};

export default AddSession;
