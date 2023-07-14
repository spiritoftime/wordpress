import { useState, useEffect } from "react";
import { getSpeaker } from "../services/contacts";
import { updateTopics } from "../services/topics";
import useGetAccessToken from "../custom_hooks/useGetAccessToken";
import { useAppContext } from "../context/appContext";

import { Toaster } from "./ui/toaster";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Loader2 } from "lucide-react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Loading from "./Loading";

const Speaker = () => {
  const { speaker, showToaster } = useAppContext();
  const [photoPreviewLink, setPhotoPreviewLink] = useState(
    speaker && speaker.photoUrl
  );
  const getAccessToken = useGetAccessToken();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { conferenceId, speakerId } = useParams();

  const { data: speakerFromFetch, isSuccess: fetchSuccess } = useQuery({
    queryKey: ["speaker", speakerId],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      return getSpeaker(accessToken, speakerId, conferenceId);
    },
    refetchOnWindowFocus: false, // it is not necessary to keep refetching
    cacheTime: 0, // Disable data cache
  });

  const FormSchema = z.object({
    topicOne: z.object({ id: z.any(), title: z.string() }),
    topicTwo: z.object({ id: z.any(), title: z.string() }),
    topicThree: z.object({ id: z.any(), title: z.string() }),
    topicFour: z.object({ id: z.any(), title: z.string() }),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      topicOne: { id: "", title: "" },
      topicTwo: { id: "", title: "" },
      topicThree: { id: "", title: "" },
      topicFour: { id: "", title: "" },
    },
  });

  // console.log(form);

  // console.error(form.formState.errors);

  const {
    mutate: updateData,
    isLoading,
    isError: updateHasError,
    error: updateError,
    isFetched,
  } = useMutation(
    async (data) => {
      const accessToken = await getAccessToken();

      return updateTopics(accessToken, data, speakerId, conferenceId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["speakers"], { exact: true });
        form.reset();
        setPhotoPreviewLink("");
        navigate(`/conferences/speakers/${conferenceId}`);
        showToaster(`Topics Updated`);
      },
    }
  );

  useEffect(() => {
    if (fetchSuccess) {
      console.log(speakerFromFetch);
      prefillData(speakerFromFetch);
    }
  }, [fetchSuccess]);

  const prefillData = (data) => {
    console.log(data);
    if (data["Topics"] && data["Topics"].length > 0) {
      form.setValue("topicOne", {
        id: data["Topics"][0]?.id ?? "",
        title: data["Topics"][0]?.title ?? "",
      });
      form.setValue("topicTwo", {
        id: data["Topics"][1]?.id ?? "",
        title: data["Topics"][1]?.title ?? "",
      });
      form.setValue("topicThree", {
        id: data["Topics"][2]?.id ?? "",
        title: data["Topics"][2]?.title ?? "",
      });
      form.setValue("topicFour", {
        id: data["Topics"][3]?.id ?? "",
        title: data["Topics"][3]?.title ?? "",
      });
    }
  };

  const onSubmit = (data) => {
    console.log("Hello");
    console.log(speakerFromFetch);
    console.log(data);

    updateData(data);
  };

  if (isLoading) {
    return <Loading />;
  }

  // const watch = form.watch;

  return (
    <div className="w-full p-10">
      <div className="flex gap-4 justify-normal">
        <img
          src={photoPreviewLink ? photoPreviewLink : "/assets/dummy.jpg"}
          alt="speaker photo"
          width="120px"
          className="rounded-lg shadow-lg"
        />
        <div>
          <p className="w-full text-xl font-bold">
            {(speakerFromFetch &&
              `${speakerFromFetch.firstName} ${speakerFromFetch.lastName}`) ||
              ""}
          </p>
          <p className="w-full text-base">
            {(speakerFromFetch && speakerFromFetch.country) || ""}
          </p>
          <Button
            className="bg-[#0D05F2] text-white font-semibold hover:bg-[#3D35FF] text-xs h-8 mt-2 rounded-lg"
            onClick={() => navigate(`/contacts/${speakerId}`)}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      <Tabs defaultValue="schedule" className="w-[full] mt-10">
        <TabsList className="w-[48%]">
          <TabsTrigger value="schedule" className="w-[50%]">
            Schedule
          </TabsTrigger>
          <TabsTrigger value="topics" className="w-[50%]">
            Proposed Topics
          </TabsTrigger>
        </TabsList>
        <TabsContent value="schedule" className="px-5 py-2">
          Schedule to be generated once Session part is completed
        </TabsContent>
        <TabsContent value="topics" className="py-2 px-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-wrap justify-between gap-y-6 gap-x-0.5 mt-4">
                <div className="w-[49%] mt-4">
                  <FormLabel>Proposed Topic 1</FormLabel>
                  <FormField
                    control={form.control}
                    name={`topicOne.title`}
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
                    name={`topicTwo.title`}
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
                    name={`topicThree.title`}
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
                    name={`topicFour.title`}
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
                  "Update"
                )}
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
      {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
      <Toaster />
    </div>
  );
};

export default Speaker;
