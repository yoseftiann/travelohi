import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./promo.css";
import {
  faGift,
  faHotel,
  faPlaneArrival,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import image1 from "../../../assets/dominik-schroder-FIKD9t5_5zQ-unsplash.jpg";
import { Toaster, toast } from "sonner";
import axios from "axios";
import { IPromo } from "../../../interfaces/promo";

const typeIcons = {
  gift: faGift,
  plane: faPlaneArrival,
  flight: faPlaneArrival,
  hotel: faHotel,
};

export default function Promo({ promos }: any) {
  const [fields, setFields] = React.useState({
    type: "",
    percent: "",
    expiryDate: "",
    redeemCode: "X X X",
  });

  const [image, setImage] = React.useState<File | null>(null);

  //Handler
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const onFileChange = (file: File) => {
    console.log(file);
    setImage(file);
  };

  const onFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files && e.target.files[0];
    if (newFile) {
      setImage(newFile);
      onFileChange(newFile);
    }
  };

  //OnClick submit
  const handleSubmitButton = () => {
    const formData = new FormData();

    if (image) {
      formData.append("image", image);
      console.log(image);
    }

    formData.append("type", fields.type);
    formData.append("discount", fields.percent);
    formData.append("code", fields.redeemCode);
    formData.append("expiry", fields.expiryDate);

    toast.promise(axios.put("http://localhost:3000/promo/create", formData), {
      loading: "Processing your request...",
      success: () => {
        return "Promo has been added!";
      },
      error: (error) => {
        console.log(error);
        return "Error while creating new promo!";
      },
    });
  };

  return (
    <div className="promo-container">
      <Toaster position="bottom-right" richColors />
      <div className="sub-page-container big">
        {/* Promo Card */}
        <div className="promo-card">
          <input type="file" className="file-input" onChange={onFileDrop} />
          <img src={image ? URL.createObjectURL(image) : image1} alt="" />
          <div className="header">
            <span>{fields.redeemCode.toUpperCase()}</span>
            <FontAwesomeIcon
              icon={typeIcons[fields.type as keyof typeof typeIcons] || faGift}
              size="2x"
              color="white"
            />
          </div>
          <h1>{fields.percent} %</h1>
          <span>Terms & condition applied.</span>
          <div className="expirydate">
            <span>Valid until</span>
            <span>{fields.expiryDate}</span>
          </div>
        </div>
        {/* Fields */}
        <div className="fields">
          <input
            className="input"
            type="text"
            name="type"
            placeholder="Type of voucher"
            onChange={handleFieldChange}
          />
          <input
            className="input"
            type="text"
            name="percent"
            placeholder="Percentage of discount"
            onChange={handleFieldChange}
          />
        </div>
        <div className="fields">
          <input
            className="input"
            type="text"
            name="redeemCode"
            placeholder="Special code to redeem"
            onChange={handleFieldChange}
          />
          <input
            className="input"
            type="date"
            name="expiryDate"
            placeholder="Date of expiry"
            onChange={handleFieldChange}
          />
        </div>
        <button onClick={handleSubmitButton}>Submit</button>
      </div>
      <div className="sub-page-container small">
        {/* Mapping promo card */}
        {promos.map((promo : IPromo) => (
          <div className="promo-card small">
            <img
              src={promo.Image ? `http://localhost:3000/${promo.Image}` : image1}
              alt="Image Selected"
            />
            <div className="header">
              <span>{promo.RedeemCode.toUpperCase()}</span>
              <FontAwesomeIcon
                icon={
                  typeIcons[promo.Type as keyof typeof typeIcons] || faGift
                }
                size="2x"
                color="white"
              />
            </div>
            <h1>{promo.Percent} %</h1>
            <span>Terms & condition applied.</span>
            <div className="expirydate">
              <span>Valid until</span>
              <span>{new Date(promo.ExpiryDate).toLocaleDateString('en-US')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
