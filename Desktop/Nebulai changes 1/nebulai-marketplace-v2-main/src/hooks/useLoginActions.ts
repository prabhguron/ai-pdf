import { fetchUser, fetchUserProfile, login } from "@/redux/auth/authSlice";
import { validateGetStartedUserProfile } from "@/redux/getStartedSteps/getStartedStepsSlice";
import { useAppDispatch } from "@/redux/store";

interface LoginActionReturn {
  status: string;
  msg: string;
  postData: LoginInput;
  accessToken?: string | null;
}

const useLoginActions = () => {
  const dispatch = useAppDispatch();

  const loginAction = async (
    postData: LoginInput
  ): Promise<LoginActionReturn | null> => {
    const actionResult = await dispatch(login(postData));
    const payload = actionResult.payload as LoginResponse;
    if (payload) {
      return {
        ...payload,
        postData,
      };
    }
    return null;
  };

  const fetchUserAndProfile = async () => {
    try {
      const user = await dispatch(fetchUser());
      await dispatch(fetchUserProfile());
      await dispatch(validateGetStartedUserProfile());
      if (user?.payload) {
        const userPayload = user?.payload as FetchUserReturn;
        const accessToken = userPayload?.accessToken ?? null;
        const userRole = userPayload?.data?.role ?? null;
        if (accessToken && userRole) {
          return { accessToken, userRole };
        }
      }
    } catch (error) {}
    return null;
  };

  return {
    loginAction,
    fetchUserAndProfile
  };
};

export default useLoginActions;
