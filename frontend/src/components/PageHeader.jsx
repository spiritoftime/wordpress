import React from "react";
import { Button } from "./button";
import { Plus } from "lucide-react";
// rowType - Conference/Speaker/Session,etc
const PageHeader = ({ rowType }) => {
  return (
    <div className="flex justify-between">
      <h1 className="text-3xl font-bold">{rowType.toUpperCase()}</h1>
      <Button className="bg-[#0D05F2] text-white font-semibold hover:bg-[#3D35FF]">
        <Plus className="w-4 h-4 mr-2" />
        Add {rowType}
      </Button>
    </div>
  );
};

export default PageHeader;
