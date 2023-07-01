import { useState, useRef } from "react";
import { fullCountries as countries } from "../utils/countriesFull";
import { addContact } from "../services/contacts";
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
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { Toaster } from "./ui/toaster";
import { Switch } from "./ui/switch";
import { Edit, Loader2 } from "lucide-react";

import Combobox from "./Combobox";
import PageHeader from "./PageHeader";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase";
import { useMutation } from "@tanstack/react-query";

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
  const getAccessToken = useGetAccessToken();

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
      organisation: z.string().optional(),
      biography: z.string().optional(),
      photo: z.any(),
      admin: z.boolean(),
      // photo: z
      //   .any()
      //   .refine((value) => value.length === 0, "Required")
      //   .refine(
      //     // (files) => console.log(files),
      //     (file) => file?.size <= maxFileSize,
      //     `Max image size is 5MB.`
      //   )
      //   .refine(
      //     (file) => acceptedImageTypes.includes(file?.type),
      //     "Only .jpg, .jpeg and .png formats are supported."
      //   ),
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

  const { mutate: uploadPhoto, isLoading } = useMutation(
    async (data) => {
      const storageRef = ref(
        storage,
        `photos/${data.firstName}-${data.lastName}.png`
      );

      // Upload the photo onto Firebase storage with uploadBytes
      const promises = [getAccessToken(), uploadBytes(storageRef, data.photo)];
      const [accessToken, snapshot] = await Promise.all(promises);

      // Get the download url for the uploaded photo
      const photoUrl = await getDownloadURL(snapshot.ref);

      data.photoUrl = photoUrl;

      return addContact(accessToken, data);
    },
    {
      onSuccess: () => {
        form.reset();
        setPhotoPreviewLink("");
        toast({
          description: "Speaker added",
        });
      },
    }
  );

  const onSubmit = (data) => {
    console.log(data);
    uploadPhoto(data);
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
                    <FormLabel>First Name*</FormLabel>
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
                    <FormLabel>Last Name*</FormLabel>
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
                    <FormLabel>Country*</FormLabel>
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
                    <FormLabel>Title*</FormLabel>
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
                    <FormLabel>Email*</FormLabel>
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
                    <FormLabel>Organisation</FormLabel>
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
                    <FormLabel>Biography</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Biography" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-[100%]">
              <FormField
                control={form.control}
                name="admin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-full">Admin Access</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        {...field}
                      />
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

export default AddContact;
