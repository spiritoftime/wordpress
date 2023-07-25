import { useState, useRef, useEffect } from "react";
import { fullCountries as countries } from "../utils/countriesFull";
import { convertToTitleCase } from "../utils/convertText";
import { createDateArray } from "../utils/convertDate";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Edit, Loader2 } from "lucide-react";

import ScheduleTable from "./ScheduleTable";
import Loading from "./Loading";
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

  const { data: contactFromFetch, isSuccess: fetchSuccess } = useQuery({
    queryKey: ["contact", contactId],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      return getContact(contactId, accessToken);
    },
    refetchOnWindowFocus: false, // it is not necessary to keep refetching
    cacheTime: 0, // Disable data cache
  });

  useEffect(() => {
    if (fetchSuccess) {
      prefillData(contactFromFetch);
    }
  }, [fetchSuccess]);

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

  console.log("ContactFromFetch: ", contactFromFetch);

  // console.log("Form: ", form);
  // console.log("Error: ", form.formState.errors);

  // const watch = form.watch;

  const handleInputClick = () => {
    inputRef.current.click();
  };

  const handlePhotoInput = (event) => {
    // Create a preview of the file before uploading it onto database
    setPhotoPreviewLink(URL.createObjectURL(event.target.files[0]));
  };

  const onSubmit = (data) => {
    data.country = data.country["value"];
    data.title = data.title["value"];

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

    updateData(data);
  };

  const prefillData = (data) => {
    form.setValue("firstName", data.firstName);
    form.setValue("lastName", data.lastName);
    form.setValue("country", { value: data.country, label: data.country });
    form.setValue("title", { value: data.title, label: data.title });
    form.setValue("email", data.email);
    form.setValue("organisation", data.organisation);
    form.setValue("biography", data.biography);
    form.setValue("isAdmin", data.isAdmin);
    if (data.photoUrl.length > 0) {
      setPhotoPreviewLink(data.photoUrl);
    }
  };

  const {
    mutate: updateData,
    isLoading,
    isError: updateHasError,
    error: updateError,
    isFetched,
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
        return updateContact(contactId, data, accessToken);
      }

      return updateContact(contactId, data, accessToken);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["contacts"], { exact: true });
        form.reset();
        setPhotoPreviewLink("");
        navigate("/contacts");
        showToaster(`Contact Updated`);
      },
    }
  );

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

  if (!fetchSuccess) {
    return <Loading />;
  }

  return (
    <div className="w-full p-10">
      <PageHeader
        rowType={
          (contactFromFetch &&
            `${contactFromFetch.firstName} ${contactFromFetch.lastName}`) ||
          ""
        }
        hasButton={false}
      />
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
      <Tabs defaultValue="contactDetails" className="w-[full] mt-10">
        <TabsList className="w-[48%]">
          <TabsTrigger value="contactDetails" className="w-[50%]">
            Contact Details
          </TabsTrigger>
          <TabsTrigger value="conferences" className="w-[50%]">
            Conferences
          </TabsTrigger>
        </TabsList>
        <TabsContent value="contactDetails" className="px-3">
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
              <div className="flex flex-wrap justify-between gap-y-6 gap-x-0.5 mt-4">
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
                          fieldName={field.name}
                          displayName="Country"
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
                        <FormMessage />
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
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className="w-full" type="button">
                                <Input
                                  placeholder="Email"
                                  {...field}
                                  disabled={
                                    contactFromFetch && contactFromFetch.isAdmin
                                  }
                                />
                              </TooltipTrigger>
                              {contactFromFetch && contactFromFetch.isAdmin && (
                                <TooltipContent>
                                  <p>Unable to edit email of an admin</p>
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </TooltipProvider>
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
                  <FormLabel className="w-full">Admin Access</FormLabel>
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
        </TabsContent>
        <TabsContent value="conferences">
          {contactFromFetch && contactFromFetch["Conferences"].length > 0 ? (
            contactFromFetch["Conferences"].map((conference, index) => (
              <Accordion
                type="single"
                collapsible
                key={`${conference.name}-${index}`}
              >
                <AccordionItem value="item-1">
                  <AccordionTrigger className="font-bold">
                    {conference.name}
                  </AccordionTrigger>
                  <AccordionContent>
                    {conference.Sessions.length > 0 ? (
                      <ScheduleTable
                        conference={conference}
                        dates={createDateArray(
                          conference.startDate,
                          conference.endDate,
                          conference.Sessions
                        )}
                      />
                    ) : (
                      `${contactFromFetch.title} ${contactFromFetch.firstName} ${contactFromFetch.lastName} was invited to ${conference.name} but was not allocated with any presentation.`
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))
          ) : (
            <p className="p-3">
              {`${contactFromFetch.title} ${contactFromFetch.firstName} ${contactFromFetch.lastName} did not participate in any
              conference.`}
            </p>
          )}
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  );
};

export default Contact;
