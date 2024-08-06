"use client";
import { fetchUser, fetchUserProfile } from "@/redux/auth/authSlice";
import { validateGetStartedUserProfile } from "@/redux/getStartedSteps/getStartedStepsSlice";
import { useAppDispatch } from "@/redux/store";
import React from "react";

const FetchProfile = () => {
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  React.useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  React.useEffect(() => {
    dispatch(validateGetStartedUserProfile());
  }, [dispatch]);

  return null;
};

export default FetchProfile;
