import React from "react";
import { useParams } from "react-router-dom";
import { IHotel } from "../../../interfaces/hotel";
import axios from "axios";
import NavigationBar from "../../../components/navbar";
import "./detail-hotel-page.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faLocationDot,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";
import Stars from "../../../components/stars";
import {
  getIconByName,
  getRoomIconByName,
} from "../../../settings/hotel-facilities-setting";
import useValidateUser from "../../../hooks/useValidateUser";
import Loading from "../../../components/loader/loading-page";
import { IReview } from "../../../interfaces/review";
import { Toaster, toast } from "sonner";
import Footer from "../../../components/footer";
import { IRoom } from "../../../interfaces/room";
import FilledButton from "../../../components/button";

interface IRoomFacilities {
  [key: string]: string[];
}

export default function DetailHotelPage() {
  //Validate logged in user
  const { data, isLoading, error } = useValidateUser();

  //Params
  const { id } = useParams<{ id: string }>();

  //Const
  const [hotel, setHotel] = React.useState<IHotel | null>(null);
  const [facilities, setFacilities] = React.useState<string[]>([]);
  const [roomFacilities, setRoomFacilities] = React.useState<IRoomFacilities>(
    {}
  );
  const [isAvailable, setIsAvailable] = React.useState(false);
  const [reviews, setReviews] = React.useState<IReview[]>([]);
  const [rooms, setRooms] = React.useState<IRoom[]>([]);
  const [errors, setErrors] = React.useState("");
  const [checkInDate, setCheckInDate] = React.useState<Date>(new Date());
  const [checkOutDate, setCheckOutDate] = React.useState<Date>(new Date());

  // Handler for check-in date change
  const handleCheckInDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCheckInDate(new Date(event.target.value));
  };

  // Handler for check-out date change
  const handleCheckOutDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCheckOutDate(new Date(event.target.value));
  };

  // Handler Add to cart
  const addToCart = (userid: string, roomid: string) => {
    const formData = new FormData();

    console.log("room id : ", roomid);

    formData.append("userid", userid);
    formData.append("roomid", roomid);
    formData.append("checkindate", checkInDate.toISOString().substring(0, 10));
    formData.append(
      "checkoutdate",
      checkOutDate.toISOString().substring(0, 10)
    );

    toast.promise(
      axios.post("http://localhost:3000/hotel/cart/add", formData),
      {
        loading: "Adding to cart....",
        success: (data) => {
          console.log(data);
          return `Hotel has been added to cart!`;
        },
        error: (error) => {
          console.log(error);

          // if (axios.isAxiosError(error)) {
          //   const message =
          //     error.response?.data.error || "An unexpected error occurred";
          //   setErrors(message);
          // }
          return "Failed adding to cart!";
        },
      }
    );
  };

  //Format
  const formatPrice = (price: any) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  //Fetch hotel
  const FetchHotel = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/hotel/detail/${id}`
      );

      if (response.status == 200) {
        setHotel(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Fetch facilities
  const FetchFacilities = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/hotel/${id}/get-facilities`
      );

      if (response.status == 200) {
        setFacilities(response.data.facilities);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Fetch Room Facilities
  const FetchRoomFacilities = async (roomID: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/hotel/room/${roomID}/get-facilities`
      );

      if (response.status == 200) {
        // setRoomFacilities(response.data.facilities)
        return response.data.facilities;
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Fetch Review
  const FetchReviews = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/hotel/${id}/get-reviews`
      );

      if (response.status == 200) {
        setReviews(response.data.reviews);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Remove duplicate and make it a group
  const uniqueAvailableRooms = rooms.reduce<IRoom[]>((unique, room) => {
    const isAlreadyAdded = unique.find((uRoom) => uRoom.ID === room.ID);

    if (!isAlreadyAdded && isAvailable) {
      unique.push(room);
    }

    return unique;
  }, []);

  //Fetch Rooms
  const FetchRooms = (checkInDate: Date, checkOutDate: Date) => {
    const formattedCheckInDate = checkInDate.toISOString().split("T")[0];
    const formattedCheckOutDate = checkOutDate.toISOString().split("T")[0];
    console.log("fetching...");

    toast.promise(
      axios.get(
        `http://localhost:3000/hotel/${id}/available-rooms?checkin=${formattedCheckInDate}&checkout=${formattedCheckOutDate}`
      ),
      {
        loading: "Searching available rooms for you....",
        success: (data) => {
          setErrors("");
          setIsAvailable(true);
          setRooms(data.data);
          return `We found you some rooms!`;
        },
        error: (error) => {
          setIsAvailable(false);
          if (axios.isAxiosError(error)) {
            const message =
              error.response?.data.error || "An unexpected error occurred";
            setErrors(message);
          }
          return "Failed to find rooms";
        },
      }
    );
  };

  //Use effect
  React.useEffect(() => {
    FetchHotel();
    FetchFacilities();
    FetchReviews();
  }, [id]);

  React.useEffect(() => {
    const fetchAllRoomFacilities = async () => {
      const newRoomFacilities: IRoomFacilities = {};

      for (const room of rooms) {
        const facilities = await FetchRoomFacilities(room.ID);
        newRoomFacilities[room.ID] = facilities || [];
      }

      setRoomFacilities(newRoomFacilities);
    };

    fetchAllRoomFacilities();
  }, [rooms]);

  if (isLoading) return <Loading />;
  if (error) return <div>error : {error.message}</div>;

  if (data)
    return (
      <div>
        <Toaster position="bottom-right" richColors />
        <NavigationBar />
        <div className="content">
          {/* Header */}
          <div className="header">
            <div>
              <h1>{hotel?.Name}</h1>
              <div className="detail">
                <FontAwesomeIcon icon={faLocationDot} color="red" />
                <span>{hotel?.Location}</span>
              </div>
              <Stars stars={5} />
            </div>
            <div id="price">
              <p>Mulai dari</p>
              <h1 id="red">
                {hotel ? formatPrice(hotel.Price) : "Loading..."}
              </h1>
              <p>/kamar/malam</p>
            </div>
          </div>
          {/* Image */}
          <img src={hotel?.Image} alt="" id="large-front-image" />
          {/* Map */}
          <div className="sub-header">
            <span id="menu">Fasilitas</span>
            <span id="menu">Ulasan</span>
            <span id="menu">Lokasi</span>
            <span id="menu">Kamar</span>
          </div>
          {/* Divider */}
          <span className="divider-span black" />
          {/* Content based on sub-header*/}
          {/* 1. Facility */}
          <h4 id="title">Fasilitas Populer</h4>
          <div className="grid3">
            {facilities.map((facility, index) => (
              <div key={index} className="facility-group">
                <FontAwesomeIcon icon={getIconByName(facility)} size="lg" />
                <p>{facility}</p>
              </div>
            ))}
          </div>
          <span className="divider-span black" />
          {/* 2. Review */}
          <h4 id="title">Ulasan Customer</h4>
          {/* Map Review card */}
          <div className="flow3">
            {reviews.map((review, index) => (
              <div className="review-card" key={index}>
                <div className="details">
                  <span id="rate">{review.Rating}/5</span>
                  <span id="date">
                    {new Date(review.CreatedAt).toLocaleDateString("en-US")}
                  </span>
                </div>
                <span id="name">{review.Name}</span>
                <p>{review.Description}</p>
              </div>
            ))}
          </div>
          <span className="divider-span black" />
          {/* 3. Lokasi */}
          <h4 id="title">Lokasi</h4>
          <span className="divider-span black" />
          {/* 4. Kamar */}
          <h4 id="title">Ketersediaan Kamar</h4>
          <div className="filter-bar">
            <input
              type="date"
              name="checkInDate"
              onChange={handleCheckInDateChange}
              value={checkInDate.toISOString().split("T")[0]}
            />
            <input
              type="date"
              name="checkOutDate"
              onChange={handleCheckOutDateChange}
              value={checkOutDate.toISOString().split("T")[0]}
            />
            <button onClick={() => FetchRooms(checkInDate, checkOutDate)}>
              Search
            </button>
          </div>
          <div className="flow-3">
            {/* Map here */}
            {uniqueAvailableRooms.map((room, index) => {
              const fetchedFacil = roomFacilities[room.ID] || [];

              return (
                <div key={index} className="room-card">
                  <img src={`http://localhost:3000/${room.Image}`} alt="" />
                  <div id="large">
                    <div className="top-detail-hotel">
                      <div id="">
                        <h1>Kamar {room.Type}</h1>
                        <span>Tidak bisa di refund & reschedule</span>
                      </div>
                      <div id="price">
                        <h1 id="red">
                          {hotel ? formatPrice(room.Price) : "Loading..."}
                        </h1>
                        <p id="small">/kamar/malam(termasuk pajak)</p>
                      </div>
                    </div>
                    <span className="divider-span black" />
                    <div className="grid2">
                      <div key={index} className="facility-group small-padding">
                        <FontAwesomeIcon icon={faPerson} size="lg" id="icon" />
                        <p>{room.Capacity} Tamu</p>
                      </div>
                      {fetchedFacil.map((facility, index) => {
                        return (
                          <div
                            key={index}
                            className="facility-group small-padding"
                          >
                            <FontAwesomeIcon
                              icon={getRoomIconByName(facility)}
                              size="lg"
                              id="icon"
                            />
                            <p>{facility}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="button-group">
                      {id && (
                        <>
                          <FilledButton
                            color="white"
                            icon={faCartShopping}
                            name="Keranjang"
                            width="10rem"
                            textColor="#007BFF"
                            onClick={() => addToCart(data.ID!, room.ID)}
                          />
                          <FilledButton
                            color="#007BFF"
                            name="Pesan"
                            width="8rem"
                            onClick={() => console.log(room.ID)}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {errors}
          </div>
        </div>
        <Footer />
      </div>
    );
}
