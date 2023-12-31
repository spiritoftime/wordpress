import { useState, useRef, useEffect } from "react";
import { fullCountries as countries } from "../utils/countriesFull";
import { convertToTitleCase } from "../utils/convertText";
import { addContact } from "../services/contacts";
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
import { Edit, Loader2 } from "lucide-react";

import Combobox from "./Combobox";
import PageHeader from "./PageHeader";
import { useForm } from "react-hook-form";
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

const AddContact = () => {
  const inputRef = useRef(null);
  const [photoPreviewLink, setPhotoPreviewLink] = useState("");
  const getAccessToken = useGetAccessToken();
  const { showToaster } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const maxFileSize = 500000;

  const FormSchema = z.object({
    firstName: z.string().min(1, {
      message: "Required",
    }),
    lastName: z.string().min(1, {
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
    title: z.object({
      value: z.string().nonempty("Required"),
      label: z.string().nonempty("Required"),
    }),
    email: z
      .string()
      .min(1, {
        message: "Required",
      })
      .email("This is not a valid email."),
    organisation: z.string().optional(),
    biography: z.string().optional(),
    isAdmin: z.boolean().optional(),
    photo: z.any().refine(
      (file) => {
        const isValid = file?.size <= maxFileSize && file?.size >= 0;
        return isValid;
      },
      {
        message: `Please upload an image that is less than 5MB.`,
      }
    ),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      photo: "",
      firstName: "",
      lastName: "",
      country: { value: "", label: "" },
      title: { value: "", label: "" },
      email: "",
      organisation: "",
      biography: "",
      isAdmin: false,
    },
  });

  const handleInputClick = () => {
    inputRef.current.click();
  };

  const handlePhotoInput = (event) => {
    // Create a preview of the file before uploading it onto database
    if (event.target.files[0]) {
      setPhotoPreviewLink(URL.createObjectURL(event.target.files[0]));
    }
  };

  // const watch = form.watch;
  // console.log(form.formState.errors);

  const {
    mutate: uploadContact,
    isLoading,
    isError: addHasError,
    error: addError,
  } = useMutation(
    async (data) => {
      const accessToken = await getAccessToken();
      if (data.photo !== "") {
        const storageRef = ref(
          storage,
          `photos/${data.firstName}-${data.lastName}.png`
        );

        // Upload the photo onto Firebase storage with uploadBytes
        const snapshot = await uploadBytes(storageRef, data.photo);

        // Get the download url for the uploaded photo
        const photoUrl = await getDownloadURL(snapshot.ref);

        data.photoUrl = photoUrl;

        return addContact(accessToken, data);
      }

      data.photoUrl = "";

      return addContact(accessToken, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["contacts"], { exact: true });
        form.reset();
        setPhotoPreviewLink("");
        navigate("/contacts");
        showToaster("Contact Added");
      },
    }
  );

  useEffect(() => {
    if (addHasError) {
      const errorMsg = addError[0].message;
      if (errorMsg === "email must be unique") {
        showToaster(
          "Email address is already in used",
          "Please use another email address",
          "destructive"
        );
      } else {
        showToaster(addError[0].message, null, "destructive");
      }
    }
  }, [addHasError, addError]);

  const onSubmit = (data) => {
    data.country = data.country["value"];
    data.title = data.title["value"];
    // console.log(data);
    uploadContact(data);
  };

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
                      e.target.files[0] && field.onChange(e.target.files[0]);
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
              <FormLabel>First Name*</FormLabel>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-[48%]">
              <FormLabel>Last Name*</FormLabel>
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-[48%]">
              <FormLabel>Country*</FormLabel>
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
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
                )}
              />
            </div>
            <div className="w-[48%]">
              <FormLabel>Title*</FormLabel>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <Combobox
                      value={field.value}
                      setValue={form.setValue}
                      options={titles}
                      fieldName={field.name}
                      displayName="Title"
                      customHeight="160"
                      validateProperty="value"
                      displayProperty="value"
                    />
                    {form.formState?.errors?.title?.value.message &&
                      field.value.value.length <= 0 && (
                        <p className="text-sm font-medium text-destructive">
                          {form.formState.errors.title.value.message}
                        </p>
                      )}
                  </FormItem>
                )}
              />
            </div>
            <div className="w-[48%]">
              <FormLabel>Email*</FormLabel>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-[48%]">
              <FormLabel>Organisation</FormLabel>
              <FormField
                control={form.control}
                name="organisation"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Organisation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-[100%]">
              <FormLabel>Biography</FormLabel>
              <FormField
                control={form.control}
                name="biography"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea placeholder="Biography" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-[100%]">
              <FormLabel>Admin Access</FormLabel>
              <FormField
                control={form.control}
                name="isAdmin"
                render={({ field }) => (
                  <FormItem>
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
      {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
    </div>
  );
};

export default AddContact;
