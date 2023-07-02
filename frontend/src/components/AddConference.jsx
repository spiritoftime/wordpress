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

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useOutletContext } from "react-router-dom";

const AddConference = () => {
  const [showToaster] = useOutletContext();
  const queryClient = useQueryClient();
  const getAccessToken = useGetAccessToken();
  const navigate = useNavigate();

  const FormSchema = z
    .object({
      name: z.string().min(1, {
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
      country: "",
      roomItems: [{ room: "" }],
      venue: "",
      wordpressApi: "",
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
              <FormField
                control={form.control}
                name="name"
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
                  console.log(field);
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
                name="wordpressApi"
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
    </div>
  );
};

export default AddConference;
