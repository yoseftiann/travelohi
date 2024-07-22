import React, { useEffect } from "react";
import { H1 } from "../../styled/h1";
import { H5 } from "../../styled/h5";
import "./flight-recommendation.css";
import axios from "axios";

type Flight = {
  imagePath: string;
  destination: string;
  count: number;
};

export default function FlightRecommendation() {
  const [flights, setFlights] = React.useState<Flight[]>([]);

  //Fetch API from query top 5 country
  const FetchAPI = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/get-popular-destination"
      );

      if (response.status == 200) {
        setFlights(response.data["data: "]);
      }
    } catch (error) {
      console.log("Failed to fetch flight data : ", error);
    }
  };

  // Use effect
  useEffect(() => {
    FetchAPI();
  }, []);

  return (
    <div className="container-flight">
      <H1>Temukan dirimu bersama kami</H1>
      <div className="flex-flight">
        {flights.map((flight: Flight, index) => (
          <div className="flex-item-flight" key={index}>
            <img src={flight.imagePath} alt="" className="img-flight" />
            <div className="text-overlay-container">
              <H5 align="left" className="text-overlay-big">{flight.destination}</H5>
              <span className="text-overlay-small">{flight.count} Accomodation</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
