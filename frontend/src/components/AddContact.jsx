import { useState, useRef } from "react";
import { fullCountries as countries } from "../utils/countriesFull";
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
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { Toaster } from "./ui/toaster";
import { Avatar, AvatarImage } from "./ui/avatar";

import Combobox from "./Combobox";
import PageHeader from "./PageHeader";
import DatePicker from "./DatePicker";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Edit } from "lucide-react";

const titles = [
  { value: "Prof", label: "Prof" },
  { value: "Dr", label: "Dr" },
  { value: "Mr", label: "Mr" },
  { value: "Ms", label: "Ms" },
  { value: "Mrs", label: "Mrs" },
];

const AddContact = () => {
  const inputRef = useRef(null);
  const [photoPreviewLink, setPhotoPreviewLink] = useState("");

  const maxFileSize = 500000;
  const acceptedImageTypes = ["image/jpeg", "image/jpg", "image/png"];

  const FormSchema = z
    .object({
      firstName: z.string().min(1, {
        message: "Required",
      }),
      lastName: z.string().min(1, {
        message: "Required",
      }),
      country: z.string().nonempty("Required"),
      title: z.string().nonempty("Required"),
      email: z.string().min(1, {
        message: "Required",
      }),
      organisation: z.string().min(1, {
        message: "Required",
      }),
      biography: z.string().min(1, {
        message: "Required",
      }),
      // photo: z.any(),
      // photo: z.string().refine((value) => value.length > 0, {
      //   message: "Please upload a photo",
      //   path: "photo",
      // }),
      photo: z
        .any()
        .refine((value) => value.length === 0, "Required")
        .refine(
          // (files) => console.log(files),
          (file) => file?.size <= maxFileSize,
          `Max image size is 5MB.`
        )
        .refine(
          (file) => acceptedImageTypes.includes(file?.type),
          "Only .jpg, .jpeg and .png formats are supported."
        ),
    })
    .required();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      photo: "",
      firstName: "",
      lastName: "",
      country: "",
      title: "",
      email: "",
      organisation: "",
      biography: "",
    },
  });

  const handleInputClick = () => {
    inputRef.current.click();
  };

  const handlePhotoInput = (event) => {
    // Create a preview of the file before uploading it onto database
    setPhotoPreviewLink(URL.createObjectURL(event.target.files[0]));
  };

  // const control = form.control;

  const onSubmit = (data) => {
    console.log(data);
    form.reset();
    // toast({
    //   description: "Form Submitted",
    // });
  };

  const { toast } = useToast();

  return (
    <div className="w-full p-10">
      <PageHeader rowType="Add Contact" hasButton={false} />
      <button type="button" onClick={handleInputClick} className="mt-10">
        <div className="relative">
          <img
            src={photoPreviewLink ? photoPreviewLink : "/assets/dummy.jpg"}
            alt="speaker photo"
            width="120px"
            className="rounded-lg shadow-lg"
          />
          <Edit className="absolute bottom-[-9px] right-[-15px] text-[#0D05F2] shadow-lg" />
        </div>
      </button>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="photo"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <input
                    ref={inputRef}
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={(e) => {
                      field.onChange(e.target.files[0]);
                      handlePhotoInput(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className="mt-10 text-lg font-bold">Contact Details</p>
          <div className="flex flex-wrap justify-between gap-y-6 gap-x-0.5 mt-2">
            <div className="w-[48%]">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name:</FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-[48%]">
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name:</FormLabel>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country:</FormLabel>
                    <Combobox
                      field={field}
                      setValue={form.setValue}
                      options={countries}
                      fieldName="Country"
                      customHeight="160"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-[48%]">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title:</FormLabel>
                    <Combobox
                      field={field}
                      setValue={form.setValue}
                      options={titles}
                      fieldName="Title"
                      customHeight="160"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-[48%]">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email:</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-[48%]">
              <FormField
                control={form.control}
                name="organisation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organisation:</FormLabel>
                    <FormControl>
                      <Input placeholder="Organisation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-[100%]">
              <FormField
                control={form.control}
                name="biography"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biography:</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Biography" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button
            className="bg-[#0D05F2] text-white font-semibold hover:bg-[#3D35FF] mt-5"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Form>
      <Toaster />
    </div>
  );
};

export default AddContact;
