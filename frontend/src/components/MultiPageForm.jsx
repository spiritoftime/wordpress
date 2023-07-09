import React from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useAppContext } from "../context/appContext";
import { FormProgress } from "./FormProgress";
const MAX_STEPS = 3;

const MultiPageForm = ({
  children,
  isValid,
  currentStep,
  prevFormStep,
  nextFormStep,
}) => {
  const { progress, setProgress, selectedTopics } = useAppContext();
  console.log(selectedTopics);
  return (
    <div>
      {currentStep < MAX_STEPS && (
        <div className="flex flex-col items-center justify-center">
          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={() => {
                  setProgress(
                    Math.ceil((100 / MAX_STEPS) * (currentStep + 1 - 1))
                  );
                  prevFormStep();
                }}
                type="button"
              >
                <ChevronLeft />
              </button>
            )}
            <h3 className="text-2xl font-bold text-center">
              Step {currentStep + 1} of {MAX_STEPS}
            </h3>
          </div>
          <FormProgress className="mt-4" progress={progress} />
        </div>
      )}
      {children}

      <div className="flex gap-2 mx-auto w-fit">
        <Button
          disabled={
            !isValid || (currentStep === 1 && selectedTopics.length === 0)
          }
          onClick={() => {
            setProgress(Math.ceil((100 / MAX_STEPS) * (currentStep + 1 + 1)));
            nextFormStep();
          }}
          type="button"
          className="bg-[#0D05F2] text-white font-semibold hover:bg-[#3D35FF]"
        >
          Next
        </Button>
        {/* on cancel pop out the dialog, then navigate */}
        <Button type="button" variant="outline">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default MultiPageForm;
