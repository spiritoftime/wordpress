import React, { useState, useEffect, useRef } from "react";
import useGetAccessToken from "../custom_hooks/useGetAccessToken";
import { getConferences } from "../services/conferences";
import { NormalComboBox } from "./NormalComboBox";
import Loading from "./Loading";
import Conferences from "./Conferences";

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
  CopySlash,
} from "lucide-react";

import {
  Outlet,
  useLocation,
  Link,
  useMatch,
  useParams,
  useNavigate,
} from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { cn } from "../lib/utils";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { useAppContext } from "../context/AppContext";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const matchedConferencePath = useMatch("/conferences/:conferenceId");
  const matchedContactPath = useMatch("/contacts/:contactId");
  const comboBoxValueRef = useRef();

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
    // enabled: conferenceId !== undefined,
    refetchOnWindowFocus: false, // it is not necessary to keep refetching
    cacheTime: 0,
  });
  // console.log("wtf is conferences", conferences);
  useEffect(() => {
    if (!isAuthenticated) return;
    if (conferenceId !== undefined) {
      if (!isConferencesFetching) {
        // console.log("conferenceid", conferenceId, "conferences", conferences);
        const conference = conferences.find((c) => {
          // console.log(c, conferenceId, "jesus");
          return c.id === +conferenceId;
        });
        // console.log(comboBoxValue, conference.name, "wtf");

        setComboBoxValue(conference.name);
        comboBoxValueRef.current = conference.name;
        setConference(conference);
      } else return;
    }
  }, [conferences, isConferencesFetching]);

  useEffect(() => {
    if (!isAuthenticated) return;

    if (
      !isConferencesFetching &&
      comboBoxValue !== undefined &&
      comboBoxValue !== ""
    ) {
      const conference = conferences.find((c) => {
        return c.name.toUpperCase() === comboBoxValue.toUpperCase();
      });

      // if (matchedConferencePath) {
      //   navigate(`/conferences/${conference.id}`);
      // } else if (pathname !== "/") {
      //   const newPath = pathname.slice(0, -2);
      //   navigate(`${newPath}/${conference.id}`);
      // }

      if (comboBoxValue !== comboBoxValueRef.current) {
        navigate(`/conferences/${conference.id}`);
      }

      setConference(conference);
    }
    comboBoxValueRef.current = comboBoxValue;
  }, [comboBoxValue]);

  useEffect(() => {
    setUserName(user.name);
  }, [user]);

  const conferenceSelected = pathname.includes("conferences");

  return (
    <div className="flex flex-col min-h-screen layout ">
      <div
        className={cn(
          "flex py-2 pr-6 border bottom-2",
          conferenceSelected ? "justify-between" : "justify-between"
        )}
      >
        <div className="flex justify-between w-[50%]">
          <div
            className="w-[30%] my-auto cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src="assets/logo-transparent.png"
              alt="auto mate logo"
              width="80%"
              className="m-auto"
            />
          </div>
          {conferenceSelected && (
            <div className="w-[69%]">
              {!isConferencesFetching && isAuthenticated && comboBoxValue && (
                <NormalComboBox
                  options={conferences}
                  validateProperty={"name"}
                  displayProperty={"name"}
                  fieldName={"conference"}
                  value={comboBoxValue}
                  setValue={setComboBoxValue}
                  disabled={pathname.includes("add") ? true : false}
                />
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2">
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
            <Link
              to={
                pathname.includes("conferences")
                  ? `/conferences/${conferenceId}`
                  : "/"
              }
            >
              <div
                className={cn(
                  (pathname.endsWith("dashboard") ||
                    pathname.endsWith("/") ||
                    pathname.endsWith("add-conference") ||
                    pathname.endsWith("conferences") ||
                    matchedConferencePath) &&
                    "text-[#0D05F2] bg-[#F9FAFB]",
                  "flex gap-2 w-[200px] h-[50px] cursor-pointer p-3 rounded-[10px]"
                )}
              >
                <Home />
                <h3 className="font-bold">Conference</h3>
              </div>
            </Link>
            {!conferenceSelected && (
              <Link to={"/contacts"}>
                <div
                  className={cn(
                    (pathname.endsWith("contacts") ||
                      pathname.endsWith("add-contact") ||
                      matchedContactPath) &&
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
                <Link to={`conferences/speakers/${conferenceId}`}>
                  <div
                    className={cn(
                      pathname.includes("speakers") &&
                        "text-[#0D05F2] bg-[#F9FAFB]",
                      "flex gap-2 w-[200px] h-[50px] cursor-pointer p-3 rounded-[10px]"
                    )}
                  >
                    <Users />
                    <h3 className="font-bold">Speakers</h3>
                  </div>
                </Link>
                <Link to={`conferences/sessions/${conferenceId}`}>
                  <div
                    className={cn(
                      pathname.includes("sessions") &&
                        "text-[#0D05F2] bg-[#F9FAFB]",
                      "flex gap-2 w-[200px] h-[50px] cursor-pointer p-3 rounded-[10px]"
                    )}
                  >
                    <ClipboardList />
                    <h3 className="font-bold">Sessions</h3>
                  </div>
                </Link>
                <Link to={`conferences/program-overview/${conferenceId}`}>
                  <div
                    className={cn(
                      pathname.includes("program-overview") &&
                        "text-[#0D05F2] bg-[#F9FAFB]",
                      "flex gap-2 w-[200px] h-[50px] cursor-pointer p-3 rounded-[10px]"
                    )}
                  >
                    <CalendarDays />
                    <h3 className="font-bold">Program Overview</h3>
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
        {pathname === "/" ? <Conferences /> : <Outlet />}
      </div>
    </div>
  );
};

export default DashboardLayout;

// export default withAuthenticationRequired(DashboardLayout, {
//   // Show a message while the user waits to be redirected to the login page.
//   onRedirecting: () => <div>Redirecting you to the login page...</div>,
// });
