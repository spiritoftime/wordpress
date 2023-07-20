import React, { useCallback, useEffect, useState } from "react";
import PageHeader from "./PageHeader";
import { FormProgress } from "./FormProgress";
import { useAppContext } from "../context/appContext";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import MultiPageForm from "./MultiPageForm";
import AddSessionPageOne from "./AddSessionPageOne";
import { Form } from "./ui/form";
import AddSessionPageTwo from "./AddSessionPageTwo";
import AddSessionPageThree from "./AddSessionPageThree";
import { formSchemas } from "../utils/multiPageFormZod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useGetAccessToken from "../custom_hooks/useGetAccessToken";
import { useNavigate, useParams } from "react-router-dom";
import { addSession } from "../services/sessions";
const AddSession = () => {
  const [formStep, setFormStep] = useState(0);
  const { conferenceId } = useParams();

  const getAccessToken = useGetAccessToken();
  const { showToaster } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // console.log("formstep", formStep);
  const nextFormStep = () => setFormStep((currentStep) => currentStep + 1);
  const prevFormStep = () => setFormStep((currentStep) => currentStep - 1);
  const { mutate: addToDatabase, isLoading } = useMutation(
    async (data) => {
      const accessToken = await getAccessToken();
      return addSession(accessToken, conferenceId, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["sessions"], { exact: true });
        form.reset();
        navigate(`/conferences/sessions/${conferenceId}`);
        showToaster("Session Added");
      },
    }
  );

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
    mode: "onChange",
  });
  const {
    control,
    watch,
    getValues,
    unregister,
    formState: { errors, isValid },
  } = form;
  const {
    fields: moderators,
    append,
    remove,
    replace,
  } = useFieldArray({
    control,
    name: "speakers",
  });
  const onSubmit = (data) => {
    // console.log("data", data);
    addToDatabase(data);
  };
  useEffect(() => {
    if (formStep !== 2 && getValues("topics")) unregister("topics");
  }, [formStep, unregister, getValues]);

  // console.log(errors, "errors");
  // console.log("form validity", isValid);
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
              {formStep === 0 && (
                <AddSessionPageOne
                  moderators={moderators}
                  append={append}
                  remove={remove}
                  control={control}
                />
              )}
              {formStep === 1 && <AddSessionPageTwo control={control} />}
              {formStep === 2 && (
                <AddSessionPageThree
                  moderators={moderators}
                  append={append}
                  remove={remove}
                  getValues={getValues}
                  control={control}
                />
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
