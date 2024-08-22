"use client";
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import NebulaiApi from "@/neb-api/NebulaiApi";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const RegisterSuccess = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  let email: string | undefined | null = searchParams?.get('e');

  useEffect(() => {
    if (!email) {
      router.push("/");
    }
  }, [email, searchParams, router]);

  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(3);
  const [showResendBtn, setShowResendBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resendEmailVerification } = NebulaiApi();
  email = email && atob(email);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    intervalId = setInterval(() => {
      if (seconds > 0) {
        setSeconds((preS) => {
          return preS - 1;
        });
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(intervalId);
          setShowResendBtn(true);
        } else {
          setSeconds(59);
          setMinutes((preM) => {
            return preM - 1;
          });
        }
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [seconds]);

  const resendVerificationHandler = async () => {
    if (!email) return;
    try {
      const payload = { email };
      setLoading(true);
      const result = await resendEmailVerification(payload);
      if (result && result.status && result.data) {
        const statusCode = result.status;
        const status = result?.data?.status || "error";
        const msg = result?.data?.message || "Something went wrong";
        setLoading(false);
        if (statusCode == 400) {
          toast.error("Email field not passed");
          return;
        }
        if (status === "success") {
          toast.success(`A verification link has been re-sent to ${email}`);
          setSeconds(60);
          setShowResendBtn(false);
          return;
        }
        toast.error(msg);
        return;
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div
      className="error-page-wrapper "
      style={{
        backgroundImage: `url(/img/404.jpg)`,
      }}
      data-aos="fade"
    >
      <div className="content">
        <div className="logo mt-4">
          <Link href="/">
            <Image src="/img/logo1.png" alt="brand" width={250} height={250}/>
          </Link>
        </div>
        <h2>Please verify your email</h2>
        <p>You're almost there! We sent an email to</p>
        <p className="text-black fw-bold">{email}</p>

        {seconds > 0 || minutes > 0 ? (
          <p>
            Time Remaining: {minutes < 10 ? `0${minutes}` : minutes}:
            {seconds < 10 ? `0${seconds}` : seconds}
          </p>
        ) : (
          <p>Still can't find the email ?</p>
        )}

        {showResendBtn && (
          <button
            type="button"
            className="theme-btn btn-style-three call-modal"
            onClick={resendVerificationHandler}
          >
            {loading ? (
              <>
                Please Wait...{" "}
                <span
                  className="spinner-border spinner-border-sm pl-4"
                  role="status"
                  aria-hidden="true"
                ></span>
              </>
            ) : (
              "Resend Email"
            )}
          </button>
        )}
      </div>
      {/* End .content */}
    </div>
  );
};

export default RegisterSuccess;
