import React from "react";
import FilledButton from "../../components/button";
import DropFileInput from "../../components/drop-file-input";
import Logo from "../../components/logo";
import { H1 } from "../../styled/h1";
import { H5 } from "../../styled/h5";

export default function LocationGuesserPage() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [result, setResult] = React.useState('');

  //Handle Change
  const onFileChange = (file: File) => {
    console.log(file);
    setSelectedFile(file);
  };

  const handleFindButton = async () => {
    if (!selectedFile) {
      console.log("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    const url = "http://127.0.0.1:5000/geoguesser";

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setResult(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelButton = async () => {
    if(selectedFile){
        setSelectedFile(null)
    }
}

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "fit-content",
        }}
      >
        <Logo></Logo>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            padding: "2rem",
          }}
        >
          <H1>Upload your files</H1>
          <H5 align="center">File should be less than 2mb.</H5>
        </div>
        <div style={{
          width:'30vw'
        }}>
          <DropFileInput
            onFileChange={(file) => onFileChange(file)}
            file={selectedFile}
            setFile={setSelectedFile}
          />
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            padding: "0.5rem",
            gap: "1rem",
            justifyContent: "flex-end",
            boxSizing: "border-box",
          }}
        >
          <FilledButton
            width="20%"
            color="transparent"
            name="Cancel"
            addShadow={false}
            border="1px solid blue"
            textColor="blue"
            onClick={handleCancelButton}
          ></FilledButton>
          <FilledButton
            width="20%"
            color="blue"
            name="Find"
            addShadow={false}
            border="0"
            onClick={handleFindButton}
          ></FilledButton>
        </div>
        <p>{result}</p>
      </div>
    </div>
  );
}
