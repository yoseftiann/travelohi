import { ChangeEvent } from "react";
import TextField from "./text-field";

interface FileProps {
    onFileChange: (base64: string) => void;
}

function convertFileToBase64(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  const UploadFile: React.FC<FileProps> = ({ onFileChange }) => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files ? event.target.files[0] : null;
      if (file) {
        convertFileToBase64(file)
          .then(base64 => {
            onFileChange(base64); // Pass the Base64 string to the parent component
          })
          .catch(error => {
            console.error('Error in file to Base64 conversion:', error);
          });
      }
    };
  
    return (
      <TextField
        placeholder="Upload File"
        name="file"
        onChange={handleChange}
        type="file"
      />
    );
  };

export default UploadFile;
