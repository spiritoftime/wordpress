import { useState } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useAppContext } from "../context/appContext";
import { FormProgress } from "./FormProgress";
import { useNavigate, useParams } from "react-router-dom";
import FormExitAlert from "./FormExitAlert";

const MAX_STEPS = 3;

const MultiPageForm = ({
  children,
  isValid,
  currentStep,
  prevFormStep,
  nextFormStep,
  isAddingLoading,
}) => {
  const { progress, setProgress, selectedTopics } = useAppContext();
  // console.log(selectedTopics);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const navigate = useNavigate();
  const { conferenceId } = useParams();

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
        {currentStep < 2 && (
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
        )}
        {currentStep === 2 && (
          <Button
            disabled={!isValid || isAddingLoading}
            type="submit"
            className="bg-[#0D05F2] text-white font-semibold hover:bg-[#3D35FF]"
          >
            {isAddingLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Please wait
              </>
            ) : (
              "Save"
            )}
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowDeleteAlert(true)}
        >
          Cancel
        </Button>
      </div>
      <FormExitAlert
        conferenceId={conferenceId}
        navigate={() => navigate(`/conferences/sessions/${conferenceId}`)}
        open={showDeleteAlert}
        onOpenChange={setShowDeleteAlert}
      />
    </div>
  );
};

export default MultiPageForm;
