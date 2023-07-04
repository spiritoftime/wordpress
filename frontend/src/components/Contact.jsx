import { useState, useRef, useEffect } from "react";
import { fullCountries as countries } from "../utils/countriesFull";
import { convertToTitleCase } from "../utils/convertText";
import { addContact, getContact, updateContact } from "../services/contacts";
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
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

const titles = [
  { value: "Prof", label: "Prof" },
  { value: "Dr", label: "Dr" },
  { value: "Mr", label: "Mr" },
  { value: "Ms", label: "Ms" },
  { value: "Mrs", label: "Mrs" },
];

const Contact = () => {
  const { contact } = useAppContext();
  const inputRef = useRef(null);
  const [photoPreviewLink, setPhotoPreviewLink] = useState(
    contact && contact.photoUrl
  );
  const getAccessToken = useGetAccessToken();
  const { showToaster } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { contactId } = useParams();

  // console.log(contact);

  // useQuery to fetch data from server
  // Will only run when refetchContact is called
  const {
    data: contactFromFetch,
    isLoading: isLoadingContact,
    isFetching: isFetchingContact,
    refetch: refetchContact,
    isSuccess: fetchSuccess,
  } = useQuery({
    queryKey: ["contact"],
    queryFn: async () => {
      console.log("inside fetch");
      const accessToken = await getAccessToken();
      return getContact(contactId, accessToken);
    },
    refetchOnWindowFocus: false, // it is not necessary to keep refetching
    enabled: false, // Disable auto fetching on mount
  });

  const FormSchema = z.object({
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
    isAdmin: z.boolean().optional(),
  });

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
      isAdmin: false,
    },
  });

  const handleInputClick = () => {
    inputRef.current.click();
  };

  const handlePhotoInput = (event) => {
    // Create a preview of the file before uploading it onto database
    setPhotoPreviewLink(URL.createObjectURL(event.target.files[0]));
  };

  const onSubmit = (data) => {
    data.country = convertToTitleCase(data.country);
    data.title = convertToTitleCase(data.title);

    // Check if there is a change in admin status
    // If there is no change in admin status, do not need to search for user in Auth0
    let adminChanged = false;
    if (data) {
      if (
        (contact && data.isAdmin !== contact.isAdmin) ||
        (contactFromFetch && data.isAdmin !== contactFromFetch.isAdmin)
      ) {
        adminChanged = true;
      }
    }
    data.adminChanged = adminChanged;

    // console.log(data);
    updateData(data);
  };

  const prefillData = (data) => {
    form.setValue("firstName", data.firstName);
    form.setValue("lastName", data.lastName);
    form.setValue("country", data.country);
    form.setValue("title", data.title);
    form.setValue("email", data.email);
    form.setValue("organisation", data.organisation);
    form.setValue("biography", data.biography);
    form.setValue("isAdmin", data.isAdmin);
  };

  const {
    mutate: updateData,
    isLoading,
    isError: updateHasError,
    error: updateError,
  } = useMutation(
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

      return updateContact(contactId, data, accessToken);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["contacts"], { exact: true });
        form.reset();
        setPhotoPreviewLink("");
        navigate("/contacts");
        showToaster("Speaker Added");
      },
    }
  );

  // If received a prop, use the prop
  // Do not need to fetch data from server
  useEffect(() => {
    if (contact) {
      prefillData(contact);
    } else {
      refetchContact();
    }
  }, [contact]);

  // If no prop is received, fetch data from server
  useEffect(() => {
    if (fetchSuccess) {
      prefillData(contactFromFetch);
      setPhotoPreviewLink(contactFromFetch.photoUrl);
    }
  }, [fetchSuccess]);

  useEffect(() => {
    if (updateHasError) {
      const errorMsg = updateError[0].message;
      if (errorMsg === "email must be unique") {
        showToaster(
          "Email address is already in used",
          "Please use another email address",
          "destructive"
        );
      } else {
        showToaster(updateError[0].message, null, "destructive");
      }
    }
  }, [updateHasError, updateError]);

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
                      validateProperty="value"
                      displayProperty="value"
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
                      validateProperty="value"
                      displayProperty="value"
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
                      <Input
                        placeholder="Email"
                        {...field}
                        disabled={
                          (contact && contact.isAdmin) ||
                          (contactFromFetch && contactFromFetch.isAdmin)
                        }
                      />
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
                name="isAdmin"
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

export default Contact;
