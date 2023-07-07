import { useState, useRef, useEffect } from "react";
import useGetContacts from "../custom_hooks/useQueries";
import { fullCountries as countries } from "../utils/countriesFull";
import { convertToTitleCase } from "../utils/convertText";
import { getContacts } from "../services/contacts";
import useGetAccessToken from "../custom_hooks/useGetAccessToken";
import { useAppContext } from "../context/appContext";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Toaster } from "./ui/toaster";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Trash, Loader2 } from "lucide-react";

import Combobox from "./Combobox";
import PageHeader from "./PageHeader";
import Loading from "./Loading";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const titles = [
  { value: "Prof", label: "Prof" },
  { value: "Dr", label: "Dr" },
  { value: "Mr", label: "Mr" },
  { value: "Ms", label: "Ms" },
  { value: "Mrs", label: "Mrs" },
];

const AddSpeakers = () => {
  const { showToaster } = useAppContext();
  const queryClient = useQueryClient();
  const getAccessToken = useGetAccessToken();
  const navigate = useNavigate();

  const {
    data: speakersName,
    isLoading: isSpeakersNameLoading,
    isFetching: isSpeakersNameFetching,
  } = useGetContacts();

  const FormSchema = z.object({
    speakerItems: z.array(
      z.object({
        name: z.object({
          firstName: z.string(),
          lastName: z.string(),
          country: z.string(),
          biography: z.string(),
          email: z.string(),
          id: z.number(),
          isAdmin: z.boolean(),
          organisation: z.string(),
          photoUrl: z.string(),
          title: z.string(),
        }),
        topicOne: z.string(),
        topicTwo: z.string(),
        topicThree: z.string(),
        topicFour: z.string(),
      })
    ),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      speakerItems: [
        { name: "", topicOne: "", topicTwo: "", topicThree: "", topicFour: "" },
      ],
    },
  });

  const control = form.control;

  const {
    fields: speakers,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "speakerItems",
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  // Function to add data to database
  const { mutate: addToDatabase, isLoading } = useMutation(
    async (data) => {
      const accessToken = await getAccessToken();
      return addConference(accessToken, data);
    },
    {
      onSuccess: () => {
        //queryClient.invalidateQueries(["conferences"], { exact: true });
        form.reset();
        // navigate("/");
        // showToaster("Conference Added");
      },
    }
  );

  if (isSpeakersNameLoading || isSpeakersNameFetching) {
    return (
      <div className="w-full mx-auto">
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full p-10">
      <PageHeader rowType="Add Speakers" hasButton={false} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <p className="mt-10 text-base font-bold">Add Existing Contact</p>
          <div className="flex flex-wrap justify-between gap-y-6 gap-x-0.5 mt-2">
            <div className="w-[100%]">
              {speakers.map((field, index) => (
                <div
                  key={`${field.id}`}
                  className={
                    index === 0
                      ? "flex flex-wrap justify-between bg-[#F1F1F1] rounded-sm p-4 w-full"
                      : "flex flex-wrap justify-between bg-[#F1F1F1] rounded-sm p-4 w-full mt-5"
                  }
                >
                  <div className="w-[95%] flex flex-wrap justify-between items-start">
                    <div className="w-[100%]">
                      <FormLabel>Name</FormLabel>
                      <FormField
                        control={form.control}
                        name={`speakerItems.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <Combobox
                              value={field.value}
                              setValue={form.setValue}
                              options={speakersName}
                              fieldName={`${field.name}`}
                              displayName="Contact"
                              customHeight="160"
                              validateProperty="fullName"
                              displayProperty="fullName"
                              buttonClassName="bg-white"
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="w-[49%] mt-4">
                      <FormLabel>Proposed Topic 1</FormLabel>
                      <FormField
                        control={form.control}
                        name={`speakerItems.${index}.topicOne`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Proposed Topic"
                                {...field}
                                className="bg-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="w-[49%] mt-4">
                      <FormLabel>Proposed Topic 2</FormLabel>
                      <FormField
                        control={form.control}
                        name={`speakerItems.${index}.topicTwo`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Proposed Topic"
                                {...field}
                                className="bg-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="w-[49%] mt-4">
                      <FormLabel>Proposed Topic 3</FormLabel>
                      <FormField
                        control={form.control}
                        name={`speakerItems.${index}.topicThree`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Proposed Topic"
                                {...field}
                                className="bg-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="w-[49%] mt-4">
                      <FormLabel>Proposed Topic 4</FormLabel>
                      <FormField
                        control={form.control}
                        name={`speakerItems.${index}.topicFour`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Proposed Topic"
                                {...field}
                                className="bg-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  {index > 0 && (
                    <div className="w-[5%] mt-6 pl-3">
                      <Trash
                        className="mx-auto mt-2 cursor-pointer"
                        type="button"
                        size={18}
                        onClick={() => {
                          remove(index);
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="ghost"
                className=" text-[#0D05F2] mt-2"
                onClick={() => {
                  append({
                    name: "",
                    topicOne: "",
                    topicTwo: "",
                    topicThree: "",
                    topicFour: "",
                  });
                }}
              >
                Add Contact
              </Button>
            </div>
          </div>
          <Button
            className="bg-[#0D05F2] text-white font-semibold hover:bg-[#3D35FF] mt-5"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Please wait
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Form>
      <Toaster />
    </div>
  );
};

export default AddSpeakers;
