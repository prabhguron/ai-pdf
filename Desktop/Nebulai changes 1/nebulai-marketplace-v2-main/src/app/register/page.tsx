import RegisterMain from "@/components/register/RegisterMain";
import { Metadata } from "next";
import { metaDescription } from '@/utils/meta';

export const metadata: Metadata = {
  title: "Nebulai | Register",
  description:
    metaDescription,
};

const RegistrationPage = () => {
  return (
    <>
      <RegisterMain />
    </>
  );
};

export default RegistrationPage;
