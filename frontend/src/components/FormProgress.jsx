"use client";

import { useEffect, useState } from "react";
import { Progress } from "./ui/progress";

export function FormProgress({ progress }) {
  return <Progress value={progress} className="w-[60%] mx-auto " />;
}
