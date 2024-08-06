"use client"
import { RootState, useAppSelector } from "@/redux/store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Navigate from "../Navigate";


const AuthRoleGuard = ({ allowedRoles, children }:{
  allowedRoles: Role[];
  children: React.ReactNode;
}) => {
  const { user, accessToken } = useAppSelector((state: RootState) => state.auth);
  const role: Role | "" = user?.role || "";  
  const allowedRole: boolean =  role !== "" && allowedRoles.includes(role);

  const pathname = usePathname();
  const router = useRouter();
  let locationPath = pathname;
  let storageAccessToken = localStorage.getItem("NEB_ACC")

  useEffect(() => {
    if (!storageAccessToken) {
      router.push("/login");
    }
  }, [router, storageAccessToken]);

  if(accessToken && user && !allowedRole){
      return <Navigate to="/" replace />
  }

  return storageAccessToken ? (
    <>{children}</>
  ) : !storageAccessToken ? (
    <Navigate to="/login" replace />
  ) : locationPath && (
    <Navigate to={locationPath} replace />
  );
};

export default AuthRoleGuard;
