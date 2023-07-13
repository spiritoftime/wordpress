import React, { useCallback, useState } from "react";
import PageHeader from "./PageHeader";
import { FormProgress } from "./FormProgress";
import { useAppContext } from "../context/appContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import MultiPageForm from "./MultiPageForm";
import AddSessionPageOne from "./AddSessionPageOne";
import { Form } from "./ui/form";
import AddSessionPageTwo from "./AddSessionPageTwo";
import AddSessionPageThree from "./AddSessionPageThree";
import { formSchemas } from "../utils/multiPageFormZod";
const AddSession = () => {
  const [formStep, setFormStep] = useState(0);
  console.log("formstep", formStep);
  const nextFormStep = () => setFormStep((currentStep) => currentStep + 1);
  const prevFormStep = () => setFormStep((currentStep) => currentStep - 1);

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
      isPublish: false,
      presentationDuration: 0,
      discussionDuration: 0,
      // sessionType: "Symposia",
      speakers: [{}],
      // topics: [{}],
    },
    mode: "all",
  });
  const {
    control,
    watch,
    getValues,
    formState: { errors, isValid },
  } = form;
  const onSubmit = (data) => {
    console.log("data", data);
  };

  console.log(errors, "errors");
  console.log("form validity", isValid);
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
              {formStep === 2 && (
                <AddSessionPageThree getValues={getValues} control={control} />
              )}
            </MultiPageForm>
          </form>
        </Form>
      </div>
      <pre>{JSON.stringify(watch(), null, 2)}</pre>
    </div>
  );
};

export default AddSession;
