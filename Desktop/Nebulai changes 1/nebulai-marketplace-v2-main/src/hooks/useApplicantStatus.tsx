import JobApplicationApi from "@/neb-api/JobApplicationApi";
import { goToStep, setStepAllowed } from "@/redux/jobFlowSteps/jobFlowStepsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useApplicantStatus = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const shortlistStepActive = useAppSelector(
    (state) => state.jobFlowSteps.steps[2]?.active
  );
  const { updateApplicationStatus } = JobApplicationApi();

  let result = null;
  const {
    mutate: updateApplicationStatusMutation,
    isLoading: updatingApplicationStatus,
  } = useMutation({
    mutationFn: (mutationData: {
      applicationId: string;
      newStatus: string;
    }) => {
      return updateApplicationStatus(
        mutationData?.applicationId,
        mutationData?.newStatus
      );
    },
    onSuccess: (response) => {
      const { status, data } = response;
      if (status === 200 && data?.updatedApplication) {
        const { updatedApplication } = data;
        result = updatedApplication;

        queryClient.setQueryData(
          ["jobApplicants", updatedApplication?.jobId],
          (prev: any) => {
            const applicationData = { ...prev };
            const updated = updateStatus(applicationData, updatedApplication._id, updatedApplication?.status)
            return updated;
          }
        );
        
        if(!shortlistStepActive &&  updatedApplication?.status === 'shortlisted'){
          //enable shortlisted tab
          dispatch(setStepAllowed({step:3, allowed: true}));
          dispatch(goToStep(3))
        }
        queryClient.invalidateQueries(["myAllJobs"]);
        toast.success("Update Application Status Successfully");
        return;
      }
      toast.error("Updating Application Status Failed");
    },
    onError: (error) => {
      toast.error("Something went wrong");
    },
  });

  const updateStatus = (data: any,applicationId: string, newStatus: string) => {
    const updatedPages = data.pages.map((page:any) => {
      const updatedApplications = page.allApplications.map((application: any) => {
        if (application.applicationId === applicationId) {
          return {
            ...application,
            status: newStatus,
          };
        }
        return application;
      });

      return {
        ...page,
        allApplications: updatedApplications,
      };
    });


    return {
        ...data,
        pages: updatedPages
      }
  };

  return {
    updateApplicationStatusMutation,
    updatingApplicationStatus,
    result,
  };
};

export default useApplicantStatus;
