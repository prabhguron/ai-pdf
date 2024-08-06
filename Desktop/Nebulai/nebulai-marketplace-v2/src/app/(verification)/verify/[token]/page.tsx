'use client';

import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import NebulaiApi from "@/neb-api/NebulaiApi";
import Link from "next/link";
import Image from "next/image";

const VerificationPage = ({
    params,
  }: {
    params: { token: string }
  }) => {
    const { token } = params;
    const { verifyAccountEmail } = NebulaiApi();
    const [verifying, setVerifying] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    const [isFirstRender, setIsFirstRender] = useState(true);
  
    useEffect(() => {
      let fetch = true;
      if (token && !isFirstRender) {
        (async () => {
          const result = await verifyAccountEmail({ token });
          if(result && result.status && result.data){
            const status = result?.data?.status || 'error';
            if(fetch){
              if(status === 'success'){
                setVerifying(false)
              }else{
                setError('Invalid Token / Already Verified')
              }
            }
          }
        })();
      } else {
        setIsFirstRender(false);
      }
  
      return () => {
        fetch = false
      }
    }, [token, isFirstRender]);
  
    return (
      <>
        <div
          className="error-page-wrapper "
          style={{
            backgroundImage: `url(/img/404.jpg)`,
          }}
          data-aos="fade"
        >
          <div className="content">
            <div className="logo">
              <Link href="/">
                <Image src="/img/logo1.png" alt="brand" width={250} height={250}/>
              </Link>
            </div>
  
            {verifying && error && 
              <h2 className="fw-bold text-black mb-4">
                  {error}
              </h2>
            }
  
            <h2 className="fw-bold text-black mb-4">
              {(!verifying) ? 
               <>
                Verified! <FaCheckCircle />
                <p className="text-black">
                  You have successfully verified your account
                </p>
               </> : 
                !error ? 
                'Verifying Email...'
                :null
              }
            </h2>
           
  
            {verifying && !error ? (
              <button
                className="theme-btn btn-style-three call-modal btn-small"
                type="button"
                disabled
              >
                
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              </button>
            ) : (
              <Link
                className="theme-btn btn-style-three call-modal btn-small"
                href="/login"
              >
                Login
              </Link>
            )}
          </div>
          {/* End .content */}
        </div>
      </>
    );
}

export default VerificationPage