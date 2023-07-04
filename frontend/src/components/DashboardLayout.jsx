import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useGetAccessToken from "../custom_hooks/useGetAccessToken";
import { getConference, getConferences } from "../services/conferences";
import { useParams, useNavigate } from "react-router-dom";

import { NormalComboBox } from "./NormalComboBox";

import { ProfileIcon } from "./ProfileIcon";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import {
  Home,
  Contact,
  Users,
  CalendarDays,
  ClipboardList,
} from "lucide-react";
import { Outlet, useLocation, Link, useMatch } from "react-router-dom";
import { cn } from "../lib/utils";
import { useAuth0 } from "@auth0/auth0-react";

import { useAppContext } from "../context/appContext";
import Loading from "./Loading";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const match = useMatch("/conferences/:conferenceId");

  const { logout, user, isAuthenticated } = useAuth0();
  const { conferenceId } = useParams();
  const [userName, setUserName] = useState("");
  const { comboBoxValue, setComboBoxValue, setConference } = useAppContext();
  const getAccessToken = useGetAccessToken();
  const { data: conferences, isLoading: isConferencesFetching } = useQuery({
    queryKey: ["conferences"],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      return getConferences(accessToken);
    },
    enabled: conferenceId !== undefined,
    refetchOnWindowFocus: false, // it is not necessary to keep refetching
  });
  useEffect(() => {
    if (!isAuthenticated) return;
    if (conferenceId !== undefined) {
      if (!isConferencesFetching) {
        const conference = conferences.find((c) => {
          return c.id === +conferenceId;
        });
        console.log(conference, "conference");
        setComboBoxValue(conference.name);
        setConference(conference);
      } else return;
    }
  }, [isConferencesFetching]);
  useEffect(() => {
    if (!isAuthenticated) return;

    if (!isConferencesFetching && comboBoxValue !== undefined) {
      const conference = conferences.find((c) => {
        return c.name.toUpperCase() === comboBoxValue.toUpperCase();
      });
      navigate(`/conferences/${conference.id}`);
      setConference(conference);
    }
  }, [comboBoxValue]);

  useEffect(() => {
    setUserName(user.name);
  }, [user]);

  const conferenceSelected = pathname.includes("conferences");

  return (
    <div className="flex flex-col min-h-screen layout">
      <div
        className={cn(
          "flex pl-[300px] py-2 pr-6 border bottom-2",
          conferenceSelected ? "justify-between" : "justify-end"
        )}
      >
        {conferenceSelected && (
          <div>
            {!isConferencesFetching && isAuthenticated && (
              <NormalComboBox
                options={conferences}
                validateProperty={"name"}
                displayProperty={"name"}
                fieldName={"conference"}
                value={comboBoxValue}
                setValue={setComboBoxValue}
              />
            )}
          </div>
        )}
        <div className="flex items-center justify-end gap-2 ">
          <p className="text-color">{userName}</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button>
                <ProfileIcon />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem onClick={() => logout()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex flex-1">
        <div className="border-r-2 ">
          <div className="flex flex-col items-center gap-6 px-3 pt-8 ">
            <Link to={"/"}>
              <div
                className={cn(
                  (pathname.endsWith("dashboard") ||
                    pathname.endsWith("/") ||
                    pathname.endsWith("conferences") ||
                    match) &&
                    "text-[#0D05F2] bg-[#F9FAFB]",
                  "flex gap-2 w-[200px] h-[50px] cursor-pointer p-3 rounded-[10px]"
                )}
              >
                <Home />
                <h3 className="font-bold">Conferences</h3>
              </div>
            </Link>
            {!conferenceSelected && (
              <Link to={"/contacts"}>
                <div
                  className={cn(
                    pathname.endsWith("contacts") &&
                      "text-[#0D05F2] bg-[#F9FAFB]",
                    "flex gap-2 w-[200px] h-[50px] cursor-pointer p-3 rounded-[10px]"
                  )}
                >
                  <Contact />
                  <h3 className="font-bold">Contacts</h3>
                </div>
              </Link>
            )}
            {conferenceSelected && (
              <>
                <div
                  className={cn(
                    pathname.endsWith("speakers") &&
                      "text-[#0D05F2] bg-[#F9FAFB]",
                    "flex gap-2 w-[200px] h-[50px] cursor-pointer p-3 rounded-[10px]"
                  )}
                >
                  <Users />
                  <h3 className="font-bold">Speakers</h3>
                </div>
                <div
                  className={cn(
                    pathname.endsWith("sessions") &&
                      "text-[#0D05F2] bg-[#F9FAFB]",
                    "flex gap-2 w-[200px] h-[50px] cursor-pointer p-3 rounded-[10px]"
                  )}
                >
                  <ClipboardList />
                  <h3 className="font-bold">Sessions</h3>
                </div>
                <div
                  className={cn(
                    pathname.endsWith("program") &&
                      "text-[#0D05F2] bg-[#F9FAFB]",
                    "flex gap-2 w-[200px] h-[50px] cursor-pointer p-3 rounded-[10px]"
                  )}
                >
                  <CalendarDays />
                  <h3 className="font-bold">Program Overview</h3>
                </div>
              </>
            )}
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
