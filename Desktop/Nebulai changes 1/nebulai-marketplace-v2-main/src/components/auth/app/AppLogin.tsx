"use client";
import LoaderCommon from "@/components/LoaderCommon";
import useLoginActions from "@/hooks/useLoginActions";
import NebulaiApi from "@/neb-api/NebulaiApi";
import { updateAccessToken } from "@/redux/auth/authSlice";
import { useAppDispatch } from "@/redux/store";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const AppLogin = () => {
  const dispatch = useAppDispatch();
  const { logoutUser } = NebulaiApi();
  const { fetchUserAndProfile } = useLoginActions();
  const router = useRouter();
  const searchParams = useSearchParams();
  let token: string | undefined | null = searchParams?.get("t");

  useEffect(() => {
    if (!token) {
      router.push(`/login`);
      return;
    }
    (async () => {
      try {
        await logoutUser();
        await dispatch(updateAccessToken(token));
        const fetchedUserResult = await fetchUserAndProfile();
        if (fetchedUserResult !== null) {
          if (fetchedUserResult?.accessToken && fetchedUserResult?.userRole) {
            router.push(`/${fetchedUserResult?.userRole}/dashboard`);
            return;
          }
        }
      } catch (error) {}
    })();
  }, [token, dispatch, router, fetchUserAndProfile, logoutUser]);

  return (
    <div className="">
      <LoaderCommon />
    </div>
  );
};

export default AppLogin;
