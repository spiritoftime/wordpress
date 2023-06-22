import React from "react";
import { ProfileIcon } from "./ProfileIcon";
import { Home, BarChart2, CheckSquare, Flag } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
const DashboardLayout = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col layout">
      <div className="pt-4 pr-6 border bottom-2">
        <div className="flex items-center justify-end gap-2 mb-4 ">
          <p className="text-color">Name</p>
          <ProfileIcon />
        </div>
      </div>
      <div className="flex ">
        <div className="min-h-screen border-r-2">
          <div className="flex flex-col items-center gap-6 p-4 ">
            <div
              className={cn(
                (pathname.endsWith("dashboard") ||
                  pathname.endsWith("conferences")) &&
                  "text-[#0D05F2]",
                "flex gap-2 w-[130px]"
              )}
            >
              <Home />
              <h3 className="font-bold">Conferences</h3>
            </div>
            <div
              className={cn(
                pathname.endsWith("speakers") && "text-[#0D05F2]",
                "flex gap-2 w-[130px]"
              )}
            >
              <BarChart2 />
              <h3 className="font-bold">Speakers</h3>
            </div>
            <div
              className={cn(
                pathname.endsWith("program"),
                "flex gap-2 w-[130px]"
              )}
            >
              <CheckSquare />
              <h3 className="font-bold">Program</h3>
            </div>
            <div
              className={cn(
                pathname.endsWith("download"),
                "flex gap-2 w-[130px]"
              )}
            >
              <Flag />
              <h3 className="font-bold">Download</h3>
            </div>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
