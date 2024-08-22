"use client"
import React, { useCallback } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { AiOutlineCopy } from "react-icons/ai";
import { toast } from "react-toastify";
import { shortStr } from "@/utils/helper";

const CopyClipboard = ({ text, short=false }:{text: string, short?:boolean}) => {
  const copiedToClipboard = useCallback(() => {
    toast("🦄 Copied to clipboard!", {
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }, []);
  return (
    <CopyToClipboard text={text} onCopy={copiedToClipboard}>
      <div className="owner d-flex align-items-center mt-2 cursor-pointer">
        <span className="">
          <span className="fw-bold text-black">{(short) ? shortStr(text) :text}</span> <AiOutlineCopy />
        </span>
      </div>
    </CopyToClipboard>
  );
};

export default CopyClipboard;
