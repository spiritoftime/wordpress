import { useState } from "react";
import { getSpeaker } from "../services/contacts";
import useGetAccessToken from "../custom_hooks/useGetAccessToken";
import { useAppContext } from "../context/appContext";

import { Toaster } from "./ui/toaster";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

const Speaker = () => {
  const { speaker } = useAppContext();
  const [photoPreviewLink, setPhotoPreviewLink] = useState(
    speaker && speaker.photoUrl
  );
  const getAccessToken = useGetAccessToken();
  const navigate = useNavigate();
  const { conferenceId, speakerId } = useParams();

  // console.log(speaker);

  const { data: speakerFromFetch } = useQuery({
    queryKey: ["speaker", speakerId],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      return getSpeaker(accessToken, speakerId, conferenceId);
    },
    refetchOnWindowFocus: false, // it is not necessary to keep refetching
    cacheTime: 0, // Disable data cache
  });

  console.log(speakerFromFetch);

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
            className="bg-[#0D05F2] text-white font-semibold hover:bg-[#3D35FF] text-xs h-8 mt-2 rounded-xl"
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
          {speakerFromFetch && (
            <ol className="list-decimal ">
              {speakerFromFetch["Topics"].map((topic, index) => (
                <li key={`${topic}-${index}`} className="mb-2">
                  {topic.title}
                </li>
              ))}
            </ol>
          )}
        </TabsContent>
      </Tabs>

      <Toaster />
    </div>
  );
};

export default Speaker;
