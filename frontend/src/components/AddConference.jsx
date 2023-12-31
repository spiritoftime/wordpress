import { countries } from "../utils/countries";
import { addConference } from "../services/conferences";
import useGetAccessToken from "../custom_hooks/useGetAccessToken";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Trash, Loader2 } from "lucide-react";

import Combobox from "./Combobox";
import PageHeader from "./PageHeader";
import DatePicker from "./DatePicker";
import { useAppContext } from "../context/appContext";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";

const AddConference = () => {
  const { showToaster } = useAppContext();
  const queryClient = useQueryClient();
  const getAccessToken = useGetAccessToken();
  const navigate = useNavigate();

  const FormSchema = z
    .object({
      name: z.string().min(1, {
        message: "Required",
      }),
      country: z.object({
        value: z.string().min(1, {
          message: "Required",
        }),
        label: z.string().min(1, {
          message: "Required",
        }),
      }),
      startDate: z.date().min(new Date("1900-01-01"), {
        message: "Please input a date",
      }),
      endDate: z.date().min(new Date("1900-01-01"), {
        message: "Please input a date",
      }),
      venue: z.string().min(1, {
        message: "Required",
      }),
      wordpressApi: z.string().min(1, {
        message: "Required",
      }),
      roomItems: z.array(
        z.object({
          room: z.string().nonempty("Required"),
        })
      ),
    })
    .required();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      country: { value: "", label: "" },
      roomItems: [{ room: "" }],
      venue: "",
      wordpressApi: "",
    },
  });

  const control = form.control;
  const watch = form.watch;

  const {
    fields: rooms,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "roomItems",
  });

  // Function to add data to database
  const { mutate: addToDatabase, isLoading } = useMutation(
    async (data) => {
      const accessToken = await getAccessToken();
      return addConference(accessToken, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["conferences"], { exact: true });
        form.reset();
        navigate("/");
        showToaster("Conference Added");
      },
    }
  );

  const onSubmit = (data) => {
    data.country = data.country["value"];
    addToDatabase(data);
  };

  return (
    <div className="w-full p-10">
      <h1 className="text-xl font-bold">Conference Information</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <div className="flex flex-wrap justify-between gap-y-6 gap-x-0.5 mt-5">
            <div className="w-[48%]">
              <FormLabel>Conference Name:</FormLabel>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Conference Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-[48%]">
              <FormLabel>Country:</FormLabel>
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Combobox
                        value={field.value}
                        setValue={form.setValue}
                        options={countries}
                        displayName="Country"
                        fieldName={field.name}
                        customHeight="160"
                        validateProperty="value"
                        displayProperty="value"
                      />
                      {form.formState?.errors?.country?.value.message &&
                        field.value.value.length <= 0 && (
                          <p className="text-sm font-medium text-destructive">
                            {form.formState.errors.country.value.message}
                          </p>
                        )}
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="w-[48%]">
              <FormLabel>Start Date</FormLabel>
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <DatePicker field={field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-[48%]">
              <FormLabel>End Date</FormLabel>
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <DatePicker field={field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-[48%]">
              <FormLabel>Venue:</FormLabel>
              <FormField
                control={form.control}
                name="venue"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Venue" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-[48%]">
              <FormLabel>WordPress URL:</FormLabel>
              <FormField
                control={form.control}
                name="wordpressApi"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="WordPress URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-[100%]">
              <FormLabel>Rooms</FormLabel>
              {rooms.map((field, index) => (
                <div
                  key={`${field.id}`}
                  className="flex flex-wrap justify-between"
                >
                  <div
                    className={index === 0 ? "w-[95%] mt-1" : "w-[95%] mt-3"}
                  >
                    <FormField
                      control={form.control}
                      name={`roomItems.${index}.room`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Room" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {index > 0 && (
                    <div className="w-[5%] mt-6 pl-3">
                      <Trash
                        type="button"
                        className=" cursor-pointer"
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
                className="mt-3"
                onClick={() => {
                  append({
                    room: "",
                  });
                }}
              >
                Add Room
              </Button>
            </div>
          </div>
          <Button
            className="bg-[#0D05F2] text-white font-semibold hover:bg-[#3D35FF]"
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
      {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
    </div>
  );
};

export default AddConference;
