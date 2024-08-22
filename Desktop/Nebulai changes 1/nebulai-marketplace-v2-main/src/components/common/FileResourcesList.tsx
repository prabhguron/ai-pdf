"use client"
import React from "react";
import { FaDownload } from "react-icons/fa";

const FileResourcesList = ({ resources }:{resources: string[]}) => {
  const downloadFile = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = getFileNameFromUrl(url);
    link.click();
  };

  const getFileNameFromUrl = (url: string) => {
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  return (
    <div>
      {resources?.map((url, index) => (
        <div key={index} className="d-flex justify-content-between">
          <a href={url} download={getFileNameFromUrl(url)}>
            {getFileNameFromUrl(url)}
          </a>
          <button onClick={() => downloadFile(url)}><FaDownload/></button>
        </div>
      ))}
    </div>
  );
};

export default FileResourcesList;
