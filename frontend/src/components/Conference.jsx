import { countries } from "../utils/countries";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { Toaster } from "./ui/toaster";
import { Trash } from "lucide-react";

import Combobox from "./Combobox";
import PageHeader from "./PageHeader";
import DatePicker from "./DatePicker";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppContext } from "../context/appContext";
const Conference = () => {
  const FormSchema = z
    .object({
      conferenceName: z.string().min(1, {
        message: "Required",
      }),
      country: z.string().nonempty("Required"),
      startDate: z.date().min(new Date("1900-01-01"), {
        message: "Please input a date",
      }),
      endDate: z.date().min(new Date("1900-01-01"), {
        message: "Please input a date",
      }),
      venue: z.string().min(1, {
        message: "Required",
      }),
      api: z.string().min(1, {
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
      conferenceName: "",
      country: "",
      roomItems: [{ room: "" }],
      venue: "",
      api: "",
    },
  });

  const control = form.control;

  const {
    fields: rooms,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "roomItems",
  });

  const onSubmit = (data) => {
    console.log(data);
    form.reset();
    toast({
      description: "Form Submitted",
    });
  };
  const { toast } = useToast();
  const { comboBoxValue } = useAppContext();
  return (
    <div className="flex flex-col w-full p-12">
      <h1 className="text-4xl font-bold">{comboBoxValue}</h1>
      <div className="flex w-full gap-6">
        <div className="w-full flex p-6 border-[#EAECF0] flex-col gap-6  shadow-md">
          <h2 className="text-2xl font-medium">Total speakers</h2>
          <h3 className="text-4xl font-semibold">120</h3>
        </div>
        <div className="w-full flex p-6 border-[#EAECF0] flex-col gap-6  shadow-md">
          <h2 className="text-2xl font-medium">Total Symposia</h2>
          <h3 className="text-4xl font-semibold">120</h3>
        </div>
        <div className="w-full flex p-6 border-[#EAECF0] flex-col gap-6  shadow-md">
          <h2 className="text-2xl font-medium">Total Masterclasses</h2>
          <h3 className="text-4xl font-semibold">120</h3>
        </div>
      </div>
      <div className="w-full mt-10">
        <PageHeader rowType="Conference Information" hasButton={false} />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <div className="flex flex-wrap justify-between gap-y-6 gap-x-0.5 mt-5">
              <div className="w-[48%]">
                <FormField
                  control={form.control}
                  name="conferenceName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conference Name:</FormLabel>
                      <FormControl>
                        <Input placeholder="Conference Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-[48%]">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Country:</FormLabel>
                        <Combobox
                          field={field}
                          setValue={form.setValue}
                          options={countries}
                          fieldName="Country"
                          validateProperty={"value"}
                          displayProperty={"label"}
                        />
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="w-[48%]">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <DatePicker field={field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-[48%]">
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <DatePicker field={field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-[48%]">
                <FormField
                  control={form.control}
                  name="venue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Venue:</FormLabel>
                      <FormControl>
                        <Input placeholder="Venue" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-[48%]">
                <FormField
                  control={form.control}
                  name="api"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WordPress API Key:</FormLabel>
                      <FormControl>
                        <Input placeholder="WordPress API Key" {...field} />
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
                    key={`${field}-${index}`}
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
            >
              Submit
            </Button>
          </form>
        </Form>
        <Toaster />
      </div>
    </div>
  );
};

export default Conference;
