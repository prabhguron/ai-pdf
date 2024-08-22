"use client"
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Navigate from "../Navigate";


const AuthGuard = ({ children }:{
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  let locationPath = pathname;
  let storageAccessToken = localStorage.getItem("NEB_ACC")

  useEffect(() => {
    if (!storageAccessToken) {
      router.push("/login");
    }
  }, [router, storageAccessToken]);

  return storageAccessToken ? (
    <>{children}</>
  ) : !storageAccessToken ? (
    <Navigate to="/login" replace />
  ) : locationPath && (
    <Navigate to={locationPath} replace />
  );
};

export default AuthGuard;
