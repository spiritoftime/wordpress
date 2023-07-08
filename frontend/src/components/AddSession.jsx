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
const AddSession = () => {
  const [formStep, setFormStep] = useState(0);
  const nextFormStep = () => setFormStep((currentStep) => currentStep + 1);
  const prevFormStep = () => setFormStep((currentStep) => currentStep - 1);
  // formschemas needs to be in an array so that the useResolver can work for multiple pages.
  const formSchemas = [
    z.object({
      title: z.string().nonempty("Required"),
      synopsis: z.string().nonempty("Required"),
      startTime: z.string().nonempty("Required"),
      endTime: z.string().nonempty("Required"),
      sessionCode: z.string().nonempty("Required"),
      location: z.string().nonempty("Required"),
      isPublish: z.boolean().optional(),
      date: z.date().min(new Date("1900-01-01"), {
        message: "Please input a date",
      }),
    }),
    z.object({
      sessionType: z.enum(["Symposia", "Masterclass"]),
      moderators: z.array(
        z.object({
          moderator: z.string().nonempty("Required"),
        })
      ),
      topics: z.array(
        z.object({
          topic: z.string().nonempty("Required"),
        })
      ),
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
      // topics: [{ topic: "" }],
      // moderators: [{ moderator: "" }],
    },
    shouldUnregister: true,
    mode: "all",
  });
  const {
    control,
    watch,
    formState: { errors, isValid },
  } = form;
  console.log("isvalid", isValid);

  return (
    <div className="flex flex-col w-full p-12">
      <div className="w-full">
        <PageHeader rowType="Add New Session" hasButton={false} />
        <p className="font-semibold">Session Details</p>
      </div>
      <div>
        <Form {...form}>
          <MultiPageForm
            errors={errors}
            isValid={isValid}
            nextFormStep={nextFormStep}
            currentStep={formStep}
            prevFormStep={prevFormStep}
          >
            {formStep === 0 && <AddSessionPageOne control={control} />}
          </MultiPageForm>
        </Form>
      </div>
      <pre>{JSON.stringify(watch(), null, 2)}</pre>
    </div>
  );
};

export default AddSession;
