import React, { useEffect } from "react";
import { H1 } from "../../styled/h1";
import "./hotel-recommendation.css";
import { Label } from "../../styled/label";
import { faMapLocation } from "@fortawesome/free-solid-svg-icons";
import { H5 } from "../../styled/h5";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type Hotel = {
  ID: number;
  Image: string;
  Name: string;
  Location: string;
  Rating: number;
  Price: number;
};

export default function HotelRecommendation() {
  const navigate = useNavigate()
  const [hotels, setHotels] = React.useState<Hotel[]>([]);

  const FetchAPI = async () => {
    try {
      const response = await axios.get("http://localhost:3000/fetch-hotels");

      if (response.status == 200) {    
        setHotels(response.data);
        console.log("Hotels : ", response.data);
      }
    } catch (error) {
      console.log("Failed to fetch hotels");
    }
  };

  useEffect(() => {
    // Fetch API
    FetchAPI();
  }, []);

  useEffect(() => {
    // Fetch API
    console.log(hotels);
  }, [hotels]);

  return (
    <div className="container">
      <H1>Pilihan rekomendasi hotel terbaik </H1>
      {/* Table View 8 item grid 4x2 */}
      <div className="grid">
        {hotels.map((hotel: Hotel, index) => (
          <div className="grid-item" key={index} onClick={() => navigate(`/detail/hotel/${hotel.ID}`)}>
            <img src={hotel.Image} alt="" className="img" />
            <div className="rate-label">{hotel.Rating}</div>
            <H5 align="left">{hotel.Name}</H5>
            <div className="location">
              <FontAwesomeIcon icon={faMapLocation}></FontAwesomeIcon>
              <Label>{hotel.Location}</Label>
            </div>
            <H5 align="left" className="price">
              IDR {hotel.Price}
            </H5>
          </div>
        ))}
      </div>
    </div>
  );
}
