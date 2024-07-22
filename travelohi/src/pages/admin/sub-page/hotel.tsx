import React from "react";
import "./hotel.css";
import InputUnderline from "../../../components/input-underline";
import DropFileInput from "../../../components/drop-file-input";
import CheckBox from "../../../components/checkbox";
import {
  HOTEL_FACILITIES_LIST,
  ROOM_FACILITIEST_LIST,
} from "../../../settings/hotel-facilities-setting";
import RoundContainer from "../../../components/round-container";
import { faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Toaster, toast } from "sonner";
import axios from "axios";
import DropdownContent from "../../../components/dropdown-content";
import { IHotel } from "../../../interfaces/hotel";

export default function Hotel({hotels} : any) {
  //Fields
  const [hotelImage, setHotelImage] = React.useState<File | null>(null);
  const [roomImage, setRoomImage] = React.useState<File | null>(null);
  const [selectedHotelFacilities, setSelectedHotelFacilities] = React.useState<string[]>([]);
  const [selectedRoomFacilities, setSelectedRoomFacilities] = React.useState<string[]>([]);
  const [selectedHotel, setSelectedHotel] = React.useState<IHotel | null>(null);

  const [hotelFields, setHotelFields] = React.useState({
    name: "",
    rating: "",
    description: "",
    path: "",
    address: "",
    price: "",
  });

  const [roomFields, setRoomFields] = React.useState({
    type: "",
    price: "",
    capacity: "",
  })

  //Handler
  const handleCheckboxChange = (name : string, setSelected : React.Dispatch<React.SetStateAction<string[]>>) => {
    setSelected(prev => {
      console.log(selectedHotelFacilities);
      if(prev.includes(name)){
        return prev.filter(n => n != name)
      }else{
        return [...prev, name]
      }
    });
  }

  const handleHotelChange = (e : any) => {
    const { name, value } = e.target;
    setHotelFields(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRoomChange = (e : any) => {
    const { name, value } = e.target;
    setRoomFields(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  //OnClick
  const handleHotelButton = () => {
    const formData = new FormData();

    // Append image file to FormData if it exists
    if (hotelImage) {
      formData.append("image", hotelImage);
    }

    // Append other fields to FormData
    formData.append("name", hotelFields.name);
    formData.append("address", hotelFields.address);
    formData.append("description", hotelFields.description);
    formData.append("rating", "5.5")
    formData.append("price", "450.000")
    formData.append("facilities", JSON.stringify(selectedHotelFacilities));  

    toast.promise(
      axios.put('http://localhost:3000/hotel/create',formData),
      {
        loading: 'Processing hotel details...',
        success: () => {
          return "New Hotel Has Been Added!";
        },
        error: (error) => {
          console.log(error);
          return "Error while creating new hotel!";
        }
      }
    )
  }

  const handleRoomButton = () => {
    const formData = new FormData();

    if(roomImage){
      formData.append("image", roomImage);
    }

    if(selectedHotel){
      formData.append("hotel_id", selectedHotel?.ID.toString())
    }
    formData.append("type", roomFields.type)
    formData.append("price", roomFields.price)
    formData.append("capacity", roomFields.capacity)
    formData.append("facilities", JSON.stringify(selectedRoomFacilities))

    // Panggil func backend
    toast.promise(
      axios.put('http://localhost:3000/hotel/room/create', formData),
      {
        loading: 'Processing room details...',
        success: () => {
          return "Room has been added!"
        },
        error: (error) => {
          console.log(error);
          return "Error while creating new hotel!";
        }
      }
    )
    
  }

  return (
    <div className="hotel-container">
      <Toaster position="bottom-right" richColors/>
      <div className="sub-page-container big hotel">
        <h1>Hotel Detail</h1>
        <DropFileInput onFileChange={(file: File) => console.log(file)
        } setFile={setHotelImage} file={hotelImage}/>
        <InputUnderline label="Name" onChange={handleHotelChange}/>
        <InputUnderline label="Address" onChange={handleHotelChange}/>
        <InputUnderline label="Description" onChange={handleHotelChange}/>
        <InputUnderline label="City" onChange={handleHotelChange}/>

        <h1>Facilitie's</h1>
        <div className="facilities-group">
          {HOTEL_FACILITIES_LIST.map((hotel) => {
            return <CheckBox label={hotel.name} onChange={() => handleCheckboxChange(hotel.name, setSelectedHotelFacilities)}/>;
          })}
        </div>

        {/* Button */}
        <button onClick={handleHotelButton}>Submit</button>
      </div>
      <div className="hotel-room-page-container">
        {/* Header */}
        <div className="free-container">
          <DropdownContent data={hotels} label={selectedHotel? selectedHotel.Name : "CHOOSE HOTEL"} onSelect={setSelectedHotel}/>
        </div>

        {/* Room Template */}
        <div className="free-container behind">
          <h1>Room {roomFields.type}</h1>
          <DropFileInput file={roomImage} setFile={setRoomImage} onFileChange={() => setRoomImage}/>
          <InputUnderline label="Type" onChange={handleRoomChange}/>
          <InputUnderline label="Price" onChange={handleRoomChange} />
          <InputUnderline label="Capacity" onChange={handleRoomChange}/>
          <div className="facilities-group">
            {ROOM_FACILITIEST_LIST.map((room) => {
              return <CheckBox label={room.name} onChange={() => handleCheckboxChange(room.name, setSelectedRoomFacilities)}/>;
            })}
          </div>
          <div className="room-action-button">
            <RoundContainer icon={faTrash} color="#FF6868" fontColor="white" tooltipText="Delete"/>
            <RoundContainer icon={faPlusCircle} color="#65B741" fontColor="white" tooltipText="Add" onClick={handleRoomButton}/>
          </div>
        </div>
      </div>
    </div>
  );
}
