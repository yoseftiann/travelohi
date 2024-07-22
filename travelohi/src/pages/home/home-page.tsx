import React, { useEffect } from "react";
import Footer from "../../components/footer";
import ImageSlider from "../../components/image-slider";
import NavigationBar from "../../components/navbar";
import axios from "axios";
import HotelRecommendation from "../../components/home/hotel-recommendation";
import FlightRecommendation from "../../components/home/flight-recommendation";
import WhyTravelohi from "../../components/home/why-us";
import { IPromo } from "../../interfaces/promo";

export default function HomePage() {
  const [images, setImages] = React.useState([""]);

  //Fetch API
  const FetchAPI = async () => {
    try {
      const response = await axios.get("http://localhost:3000/fetch-promos");

      if (response.status == 200) {
        // Set image
        const fetchedImages = response.data.map((promo: IPromo) => promo.Image);
        setImages(fetchedImages);
      }
    } catch (error) {
      console.log(error);
    }
  };  

  React.useEffect(() => {
    const interval = setInterval(() => {
      FetchAPI();
    }, 5000);
  
    return () => clearInterval(interval);
  })

  return (
    <div>
      <NavigationBar />
      <div
        style={{
          width: "100%",
          height: "100%",
          // backgroundColor:'pink'
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            // backgroundColor:'red'
          }}
        >
          {/* Slide Promo */}
          <div
            style={{
              padding: "2rem 4rem",
            }}
          >
            <ImageSlider images={images} />
          </div>
          {/* Flight Recommendation */}
          <div
            style={{
              padding: "2rem 10rem",
            }}
          >
            <HotelRecommendation />
          </div>
          {/* Hotel Recommendation */}
          <div
            style={{
              padding: "2rem 10rem",
            }}
          >
            <FlightRecommendation/>
          </div>
          {/* Why Travel With Us? */}
          <div
            style={{
              padding: "2rem 10rem",
            }}
          >
            <WhyTravelohi/>
          </div>
        </div>
        <Footer/>
      </div>
    </div>
  );
}
