"use client"
import { useField } from "formik";
import React from "react";
import { useDropzone } from "react-dropzone";
import { FaTimes } from "react-icons/fa";

const dropzoneStyle = {
  width: "100%",
  height: "auto",
  borderWidth: 2,
  borderColor: "#ced4e1",
  borderStyle: "dashed",
  borderRadius: 5,
};

interface ImageDropZoneProps{
  fieldName: string;
  dropZoneMsg?: string;
  maxImg?: number;
  disabled ?: boolean;
  acceptedFileType?: {
    [key: string]: []
  }
}

const ImgDropzone = ({
  dropZoneMsg = "Drag 'n' drop some images here, or click to select images (Only *.jpeg and *.png images will be accepted)",
  fieldName,
  maxImg = 1,
  acceptedFileType = {
    "image/jpeg": [],
    "image/png": [],
  },
  disabled = false,
}: ImageDropZoneProps) => {
  const [field, meta, helpers] = useField(fieldName);
  //const [selectedImages, setSelectedImages] = useState([]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      disabled: disabled,
      accept: acceptedFileType,
      maxFiles: maxImg,
      onDrop: (files) => {
        let newImages = [...field.value, ...files];
        let allNewImages = Array.from(
          new Set(newImages.map((obj) => obj.name))
        ).map((n) => newImages.find((obj) => obj.name === n));
        //setSelectedImages(allNewImages);
        helpers.setValue(allNewImages);
      },
    });

  //console.log(field.value)

  const onRemoveImage = (imgFile: File) => {
    const { name } = imgFile;
    const remainingImages = field.value.filter((img: File) => img.name !== name);
    //setSelectedImages(remainingImages);
    helpers.setValue(remainingImages);
  };

  return (
    <div className="mt-2">
      {}
      <div
        {...getRootProps({ className: "imgDropzone" })}
        style={dropzoneStyle}
      >
        <input {...getInputProps()} />
        <div className="d-flex align-items-center justify-content-center">
          {isDragActive ? (
            <p className="mt-2">Drop the images here...</p>
          ) : (
            <p className="mt-2 mb-2">{dropZoneMsg}</p>
          )}
        </div>
      </div>
      <div className="mt-2">
        {field?.value?.map((img: File, idx: number) => (
          <span
            key={`${img.lastModified}-${idx}`}
            className="badge rounded-pill bg-secondary ml-5 mb-3"
          >
            {img.name}

            {!disabled && (
              <FaTimes
                className="ml-5 cursor-pointer"
                onClick={() => {
                  onRemoveImage(img);
                }}
              />
            )}
          </span>
        ))}
      </div>
      <div>
        {meta.error ? (
          <div className="error text-danger">{meta.error}</div>
        ) : fileRejections.length ? (
          <div className="warning text-danger">
            You can select up to {maxImg} images only
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ImgDropzone;
