import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Label } from "../styled/label";
import { faCloudDownload } from "@fortawesome/free-solid-svg-icons";
import React, { useRef } from "react";

interface IDropFileInput {
  onFileChange: (file: File) => void;
  file : File | null;
  setFile : (file : File) => void;
}

export default function DropFileInput({ onFileChange, file, setFile }: IDropFileInput) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

//   const [file, setFile] = React.useState<File | null>(null);

  const onFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files && e.target.files[0];
    if (newFile) {
      setFile(newFile);
      onFileChange(newFile);
    }
  };
  const onDragEnter = () => {
    if (wrapperRef.current) {
      wrapperRef.current.classList.add("dragover");
    }
  };

  const onDragLeave = () => {
    if (wrapperRef.current) {
      wrapperRef.current.classList.remove("dragover");
    }
  };

  const onDrop = () => {
    if (wrapperRef.current) {
      wrapperRef.current.classList.remove("dragover");
    }
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        backgroundColor: "#f9fafd",
        width: "100%",
        height: "40vh",
        borderRadius: "12px",
        justifyContent: "center",
        border: file ? "2px dashed #30a367" : "2px dashed #84c3fd",
        position: "relative",
        flexShrink:'0'
      }}
      ref={wrapperRef}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {file ? (
        <>
            <img src={URL.createObjectURL(file)} alt="Selected File" style={{
                width:'90%',
                height:'90%',
                objectFit:'cover',
                borderRadius:'12px'
            }}/>
        </>
      ) : (
        <>
          <FontAwesomeIcon icon={faCloudDownload} size="4x" color="#84c3fd" />
          <Label>Drag & drop your files here</Label>
        </>
      )}
      <input
        type="file"
        value=""
        onChange={onFileDrop}
        style={{
          opacity: 0,
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          cursor: "pointer",
        }}
      />
    </div>
  );
}
