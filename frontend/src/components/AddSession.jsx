import React from "react";
import PageHeader from "./PageHeader";
import { FormProgress } from "./FormProgress";
import { useAppContext } from "../context/appContext";
const AddSession = () => {
  const { progress } = useAppContext();
  return (
    <div className="flex flex-col w-full p-12">
      <div className="w-full">
        <PageHeader rowType="Add New Session" hasButton={false} />
        <p className="font-semibold">Session Details</p>
        <div>
          <FormProgress progress={progress} />
        </div>
      </div>
    </div>
  );
};

export default AddSession;
