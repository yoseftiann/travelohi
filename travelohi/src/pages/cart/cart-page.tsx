import axios from "axios";
import NavigationBar from "../../components/navbar";
import { useParams } from "react-router-dom";
import React from "react";
import "./care-page.css";
import { IRoomCart } from "../../interfaces/cart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faCalendar, faListNumeric, faPerson } from "@fortawesome/free-solid-svg-icons";
import ModalBox from "../../components/modal-box";
import FilledButton from "../../components/button";
import { toast } from "sonner";
import { IPromo } from "../../interfaces/promo";

const formatPrice = (price: any) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

export default function CartPage() {
  const { id } = useParams();

  // Const
  const [total, setTotal] = React.useState(0);
  const [roomCarts, setRoomCarts] = React.useState<IRoomCart[]>([]);
  const [editModal, setEditModal] = React.useState(false);
  const [checkInDate, setCheckInDate] = React.useState(new Date())
  const [checkOutDate, setCheckOutDate] = React.useState(new Date())
  const [editingCartId, setEditingCartId] = React.useState("");
  const [promo, setPromo] = React.useState<IPromo>();
  const [promoCode, setPromoCode] = React.useState('');
  const [hasCC, setHasCC] = React.useState(false);

  //Change handler for hotel date 
  const handleDateChange = (event : any) => {
    const { name, value } = event.target; // Destructure name and value from the event target
    console.log(`Name ${name} and Value ${value}}`);

    const newValueDate = new Date(value)
    
    if (name === 'checkInDate') {
      setCheckInDate(newValueDate);
    } else if (name === 'checkOutDate') {
      setCheckOutDate(newValueDate);
    }
  };

  //Remove cart
  const removeHandler = (cartID : string) => {
    const formData = new FormData()

    formData.append('id', cartID)

    toast.promise(
      axios.delete('http://localhost:3000/cart/remove', {data: formData}),
      {
        loading: 'Removing cart',
        success: (data) => {
          return 'Successfully removed!'
        },
        error: (error) => {
          console.log(error);
          
          return "Failed to remove cart!"
        }
      }
    ) 
  }

  const handlePromoCodeChange = (event : any) => {
    setPromoCode(event.target.value);
  };

  const handleKeyDown = (event : any) => {
    if (event.key == 'Enter'){
      // fetch api
      console.log("Enter hit, and fetching api");
      
      FetchPromo(promoCode);
    }
  }

  // Calculate Total Price
  const calculateTotalPrice = roomCarts.reduce((total, rc) => {
    return total + (Number(rc.Room.Price) * rc.Quantity);
  }, 0)

  // Fetch API
  const FetchHotelCart = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/hotel/cart/${id}/fetch`
      );

      if (response.status == 200) {
        console.log(response.data.cart);
        setRoomCarts(response.data.cart);
        setTotal(total + response.data.cart.length);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch Promo from its CODE
  const FetchPromo = async(code : string) => {
    toast.promise(
      axios.get(`http://localhost:3000/promo/${code}/get`),
      {
        loading: 'Loading your request',
        success: (data) => {
          console.log(data.data);
          setPromo(data.data);
          return 'Promo applied!'
        },
        error: (error) => {
          return "Promo not exist!"
        }
      }
    )
  }

  // Fetch Credit Card based on User ID
  const FetchCreditCard = async () => {
    try{
      const response = await axios.get(`http://localhost:3000/user/${id}/credit-card`)

      if(response.status == 200){
        setHasCC(true);
      }
    }catch(error){
      console.log(error);
      setHasCC(false);
    }
  }

  // Update Hotel Date
  const UpdateHotelDate = (hotelCartID : string) => {
    console.log(`Update Hotel ID : ${hotelCartID}`);
    
    const formData = new FormData()

    formData.append('id', hotelCartID);
    formData.append('checkindate', checkInDate.toISOString().substring(0, 10))
    formData.append('checkoutdate', checkOutDate.toISOString().substring(0, 10))

    toast.promise(
      axios.put('http://localhost:3000/hotel/cart/update/date', formData),
      {
        loading: 'Updating dates...',
        success: () => {
          return 'Hotel dates updated successfully';
        },
        error: (error) => {
          console.log(error);
          
          if (axios.isAxiosError(error)) {
            const message = error.response?.data.error || "An unexpected error occurred";
              console.log("error : ", message);
          }
          return 'Failed to update Hotel dates';
        }
      }
    )
  }

  React.useEffect(() => {
    FetchHotelCart();
    FetchCreditCard();
  }, []);

  return (
    <div>
      <NavigationBar />
      <div className="cart-page-container">
        <h1 id="cart-title">Your Cart ({total})</h1>
        <div>
          {roomCarts.map((rc) => (
            <div key={rc.ID}>
              <div className="cart-card-room">
                <div className="left">
                  <img src={`http://localhost:3000/${rc.Room.Image}`} alt="" />
                </div>
                <div className="mid">
                  <h1 id="label">{rc.Room.Hotel.Name}</h1>
                  <p>Hotel / Rooms</p>
                  <p>Room Type {rc.Room.Type}</p>
                  <div className="icon-text">
                    <FontAwesomeIcon icon={faPerson} />
                    <p>{rc.Room.Capacity}</p>
                  </div>
                  <div className="icon-text">
                    <FontAwesomeIcon icon={faListNumeric} />
                    <p>{rc.Quantity}</p>
                  </div>
                  <div className="icon-text">
                    <FontAwesomeIcon icon={faCalendar} />
                    <p>{new Date(rc.CheckInDate).toLocaleDateString()} - {new Date(rc.CheckOutDate).toLocaleDateString()}</p>
                  </div>
                  <div className="button-cart-group">
                    <button id="underline" onClick={() => removeHandler(rc.ID)}>
                      Remove
                    </button>
                    <span className="vertical-divider"></span>
                    <button id="underline" onClick={() => {setEditModal(true); setEditingCartId(rc.ID)}}>
                      Edit
                    </button>
                    <ModalBox isOpen={editModal} onClose={() => setEditModal(false)}>
                      <h1 id="label">Ubah tanggal penginapan mu</h1>
                      <span className="divider-span black" />
                      <div className="date-box">
                        {/* Check in */}
                        <span>Check In</span>
                        <input name="checkInDate" type="date" className="input-date" value={checkInDate.toISOString().substring(0,10)} onChange={handleDateChange}/>
                      </div>
                      <div className="date-box">
                        {/* Check out */}
                        <span>Check Out</span>
                        <input name="checkOutDate" type="date" className="input-date" value={checkOutDate.toISOString().substring(0,10)} onChange={handleDateChange}/>
                      </div>
                      <FilledButton name="Update" color="#2286d6" icon={faBookmark} onClick={() => UpdateHotelDate(editingCartId)}/>
                    </ModalBox>
                  </div>
                </div>
                <div className="right">
                  <p>{formatPrice(rc.Room.Price)},00</p>
                </div>
              </div>
              <span className="divider-span black" />
            </div>
          ))}
        </div>
        <div className="summary">
          <h1 id="large-title">Summary</h1>
          <span className="divider-span black" />
          <div className="label-input">
            <p>Masukkan kode promo dan dapatkan potongan</p>
            <div id="div20">
                <input placeholder="Promo Code" type="text" value={promoCode} className="h1-style" onChange={handlePromoCodeChange} onKeyDown={handleKeyDown}/>
            </div>
          </div>
          <span className="divider-span black" />
          <div className="label-input">
            <p>Subtotal</p>
            <p>{formatPrice(calculateTotalPrice)}</p>
          </div>
          <span className="divider-span black" />
          <div className="label-input">
            <p>Potongan promo</p>
            <p id="shipment">{formatPrice(calculateTotalPrice * ((promo?.Percent ?? 0) / 100))}</p>

          </div>
          <span className="divider-span black" />
          <div className="label-input">
            <p>Total</p>
            <p>{formatPrice(calculateTotalPrice - (calculateTotalPrice * ((promo?.Percent ?? 0) / 100)))}</p>
          </div>
          <div>
            {/* Button Payment right align */}
            <button className="checkout-button">Checkout</button>
            <button className="checkout-button" >Pay with Hi-Wallet</button>
            <button className="checkout-button" disabled={hasCC ? false : true}>Credit Card</button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
