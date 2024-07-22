import NavigationBar from "../../components/navbar";
import RoundContainer from "../../components/round-container";
import {
  faCreditCard,
  faImage,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./profile-page.css";
import useValidateUser from "../../hooks/useValidateUser";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormContainer from "../../components/form-container";
import TextField from "../../components/text-field";
import FilledButton from "../../components/button";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import unsubscribe from "../../assets/icon/mail.png";
import subscribe from "../../assets/icon/email.png"
import Loading from "../../components/loader/loading-page";
import { Toaster, toast } from 'sonner'
import { H5 } from "../../styled/h5";

//Convert to base64
function convertFileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export default function ProfilePage() {
  const { data, isLoading, error } = useValidateUser();
  const navigate = useNavigate();
  const [errors, setErrors] = React.useState("");
  const [isSubscribed, setIsSubscribed] = React.useState(data?.Subscribe)
  const [activeMenu, setActiveMenu] = React.useState("Profile");
  //Field Data
  const [personalData, setPersonalData] = React.useState({
    firstName: data?.FirstName,
    lastName: data?.LastName,
    email: data?.Email,
    phoneNumber: data?.PhoneNumber,
    address: data?.Address,
    dob: data?.DOB,
    subscribe: data?.Subscribe,
  });

  const [creditCard, setCreditCard] = React.useState({
    cvv: "",
    cardHolderName: "",
    cardNumber: "",
    city: "",
    state: "",
    expiry: "",
    zipcode: "",
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setPersonalData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreditCardChange = (e: any) => {
    const { name, value } = e.target;
    setCreditCard((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  //Handle File Change
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file && data?.Email) {
      try {
        const base64Image = await convertFileToBase64(file);

        const confirmUpload = window.confirm(
          "Do you want to update your profile picture?"
        );
        if (confirmUpload) {
          profilePictureHandler(data?.Email, base64Image);
        }
      } catch (error) {
        console.log("Error converting file to base64 : ", error);
      }
    }
  };

  const profilePictureHandler = async (email: string, base64image: string) => {
    try {
      const response = await axios.put(
        "http://localhost:3000/user/update-image",
        {
          email: email,
          image: base64image,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status == 200) {
        console.log("Profile picture updated successfully");
      }
    } catch (error) {
      console.error("Failed to update profile picture:", error);
    }
  };

  const handleMenuClick = (menuName: string) => {
    setActiveMenu(menuName);
  };

  //Update Credit Card Handler
  const updateCreditCard = async (creditCardID: any) => {
    toast.promise(
      // Promise
      axios.put(
        `http://localhost:3000/user/${creditCardID}/update/credit-card`,
        {
          cardNumber: creditCard.cardNumber,
          cardHolderName: creditCard.cardHolderName,
          cvv: creditCard.cvv,
          city: creditCard.city,
          state: creditCard.state,
          zipCode: creditCard.zipcode,
          expiry: creditCard.expiry,
        }
      ),
      {
        loading: 'Updating Credit Card...',
        success: () => {
          setErrors("")
          return "Credit Card Updated Successfully!";
        },
        error: (error) => {
          if (axios.isAxiosError(error)) {
            const message = error.response?.data.error || "An unexpected error occurred";
            setErrors(message);
          }
          return "Error updating Credit Card!";
        }
      }
    )
  };

  // Log out Handler
  const logoutHandler = async () => {
    toast.promise(
      // Promise
      axios.post(
        "http://localhost:3000/user/logout",
        {},
        {
          withCredentials: true,
        }
      ),
      {
        loading: 'Logging out...',
        success: () => {
          return "Log Out Successfully!";
        },
        error: () => {
          return "Error while logging out!";
        }
      }
    )
  };

  //Set newsletter
  const newsletterHandler = async (value : boolean) => {
    toast.promise(
      // Promise
      axios.put('http://localhost:3000/user/update/newsletter',{
        Email : data?.Email,
        Newsletter : value
      }),
      {
        loading: 'Processing your request...',
        success: () => {
          setIsSubscribed(value)
          return "Successfully!";
        },
        error: () => {
          return "Error!";
        }
      }
    )
  }

  //Switch case for activeMenu
  const renderContent = () => {
    switch (activeMenu) {
      case "Profile":
        return (
          <>
            <div className="page-sub-content-detail">
              <h2>First Name</h2>
              <TextField
                name="firstName"
                placeholder={data?.FirstName as string}
                defaultValue={data?.FirstName ? data.FirstName : ''}
                onChange={handleInputChange}
              ></TextField>
            </div>
            <div className="page-sub-content-detail">
              <h2>Last Name</h2>
              <TextField
                name="lastName"
                placeholder={data?.LastName as string}
                defaultValue={data?.LastName ? data.LastName : ''}
                onChange={handleInputChange}
              ></TextField>
            </div>
            <div className="page-sub-content-detail">
              <h2>Email</h2>
              <TextField
                name="email"
                placeholder={data?.Email as string}
                defaultValue={data?.Email ? data.Email : ''}
                onChange={handleInputChange}
              ></TextField>
            </div>
            <div className="page-sub-content-detail">
              <h2>Phone Number</h2>
              <TextField
                name="phoneNumber"
                placeholder="Fill your phone number"
                defaultValue={data?.PhoneNumber ? data.PhoneNumber : ''}
                onChange={handleInputChange}
              ></TextField>
            </div>
            <div className="page-sub-content-detail">
              <h2>Address</h2>
              <TextField
                name="address"
                placeholder="Fill your address here"
                defaultValue={data?.Address ? data.Address : ''}
                onChange={handleInputChange}
              ></TextField>
            </div>
            <div className="page-sub-content-detail">
              <h2>Date Of Birth</h2>
              <TextField
                name="dob"
                placeholder="DOB"
                type="date"
                defaultValue={data?.DOB ? data.DOB : ''}
                onChange={handleInputChange}
              ></TextField>
            </div>
            {errors && (<H5 align="center" color="red">{errors}</H5>)}
            <FilledButton
              name="Update"
              color="linear-gradient(to right, #2286d6, #74c2fd)"
              icon={faBookmark}
              onClick={updateProfile}
            ></FilledButton>
          </>
        );
      case "Payment":
        return (
          <>
            {/* Credit Card */}
            <div className="credit-card-container">
              <div className="top">
                <FontAwesomeIcon
                  icon={faCreditCard}
                  color="white"
                  size="lg"
                ></FontAwesomeIcon>
                <h4>Credit Card</h4>
              </div>
              <div className="mid">
                <label>CARD NUMBER</label>
                <h4>
                  {creditCard.cardNumber
                    ? creditCard.cardNumber
                    : "**** **** **** ****"}
                </h4>
              </div>
              <div className="bottom">
                <div>
                  <label>CARDHOLDER</label>
                  <h5>
                    {creditCard.cardHolderName
                      ? creditCard.cardHolderName.toUpperCase()
                      : "JOHN DOE"}
                  </h5>
                </div>
                <div>
                  <label>EXP DATE</label>
                  <h5>{creditCard.expiry ? creditCard.expiry : "01/01"}</h5>
                </div>
                <div>
                  <label>CVV</label>
                  <h5>{creditCard.cvv ? creditCard.cvv : "123"}</h5>
                </div>
              </div>
            </div>

            {/* Card Detail */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "1rem",
              }}
            >
              <div className="page-sub-content-detail">
                <h2>Card number</h2>
                <TextField
                  name="cardNumber"
                  placeholder="0000 0000 0000"
                  defaultValue={creditCard.cardNumber}
                  onChange={handleCreditCardChange}
                ></TextField>
              </div>

              <div className="page-sub-content-detail">
                <h2>Card holder name</h2>
                <TextField
                  name="cardHolderName"
                  placeholder="John Doe"
                  defaultValue={creditCard.cardHolderName}
                  onChange={handleCreditCardChange}
                ></TextField>
              </div>

              <div className="page-sub-content-detail">
                <h2>CVV</h2>
                <TextField
                  name="cvv"
                  placeholder="***"
                  defaultValue={creditCard.cvv}
                  onChange={handleCreditCardChange}
                ></TextField>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "1rem",
              }}
            >
              <div className="page-sub-content-detail">
                <h2>City</h2>
                <TextField
                  name="city"
                  placeholder="Jakarta"
                  defaultValue={creditCard.city}
                  onChange={handleCreditCardChange}
                ></TextField>
              </div>

              <div className="page-sub-content-detail">
                <h2>State</h2>
                <TextField
                  name="state"
                  placeholder="Indonesia"
                  defaultValue={creditCard.state}
                  onChange={handleCreditCardChange}
                ></TextField>
              </div>

              <div className="page-sub-content-detail">
                <h2>ZIP Code</h2>
                <TextField
                  name="zipCode"
                  placeholder="11750"
                  defaultValue={creditCard.zipcode}
                  onChange={handleCreditCardChange}
                ></TextField>
              </div>

              <div className="page-sub-content-detail">
                <h2>Expiry</h2>
                <TextField
                  name="expiry"
                  placeholder="01/24"
                  defaultValue={creditCard.expiry}
                  onChange={handleCreditCardChange}
                ></TextField>
              </div>
            </div>
            {errors && (
              <H5 align="center" color="red">{errors}</H5>
            )}
            <div className="security-button">
              <FilledButton
                name="Save"
                color="linear-gradient(to right, #2286d6, #74c2fd)"
                textColor="white"
                addShadow={false}
                width="15%"
                onClick={() => updateCreditCard(data?.ID)}
              ></FilledButton>
            </div>
          </>
        );

      case "Log out":
        return (
          <>
            <div className="page-sub-content-detail">
              <h2>Log out from your account</h2>
              <FilledButton
                onClick={logoutHandler}
                color="white"
                name="LOG OUT"
                addShadow={false}
                icon={faRightFromBracket}
                textColor="black"
                border="1.5px solid #4ea4ea"
                width="40%"
              />
            </div>
          </>
        );

      case "Newsletter":
        return (
          <div className="newsletter-content">
            {isSubscribed ? (
              <>
                <img src={unsubscribe} alt="" className="img" />
                <h1>Are you sure about unsubscribing?</h1>
                <span>
                  If you unsubsribe now, you might miss nice deals and useful
                  hints from us!
                </span>
                <div>
                  <FilledButton
                    color="linear-gradient(to right, #2286d6, #74c2fd)"
                    name="Unsubscribe"
                    onClick={() => newsletterHandler(false)}
                  />
                </div>
              </>
            ) : (
              <>
                <img src={subscribe} alt="" className="img" />
                <h1>Get our weekly Newsletter</h1>
                <span>
                  Get weekly updates on the newest and hint tips right in your mailbox
                </span>
                <div>
                  <FilledButton
                    color="linear-gradient(to right, #2286d6, #74c2fd)"
                    name="Subscribe"
                    onClick={() => newsletterHandler(true)}
                  />
                </div>
              </>
            )}
          </div>
        );

      default:
        return <div>Masih kosong</div>;
    }
  };

  //Update Profile Data Handler
  const updateProfile = async () => {
    toast.promise(
      axios.put(
        "http://localhost:3000/user/update-profile",
        {
          firstName: personalData.firstName,
          lastName: personalData.lastName,
          dob: personalData.dob,
          email: personalData.email,
          address: personalData.address,
          phoneNumber: personalData.phoneNumber,
        },
        {
          withCredentials: true,
        }
      ),
      {
        loading: 'Updating your profile...',
        success: () =>{
          setErrors("")
          return `Profile successfully updated`
        },
        error: (error) => {
          if (axios.isAxiosError(error)) {
            const message = error.response?.data.error || "An unexpected error occurred";
            setErrors(message);
          }
          return 'Failed to update your data'
        }
      }
    )
  };

  //Credit Card Handler
  const fetchCreditCardDetails = async (userID: any) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/user/${userID}/credit-card`
      );

      if (response.status == 200) {
        // console.log("Credit Card detail : ", response.data);

        setCreditCard({
          cvv: response.data.CVV,
          cardHolderName: response.data.CardHolderName,
          cardNumber: response.data.CardNumber,
          city: response.data.City,
          state: response.data.State,
          expiry: response.data.Expiry,
          zipcode: response.data.ZIPCode,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setErrors("");
  }, [activeMenu]);

  useEffect(() => {
    if (data) {
      fetchCreditCardDetails(data?.ID);
      setPersonalData({
        firstName: data?.FirstName,
        lastName: data?.LastName,
        email: data?.Email,
        phoneNumber: data?.PhoneNumber,
        address: data?.Address,
        dob: data?.DOB,
        subscribe: data?.Subscribe,
      })
    }
  }, [data]);

  if (isLoading) return <Loading/>;
  if (error) return <div>error : {error.message}</div>;

  return (
    <div className="page">
      <Toaster position="bottom-right" richColors/>
      <NavigationBar />
      <div className="page-content">
        <div className="page-sub-content-small">
          <RoundContainer
            color="transparent"
            icon={faArrowLeft}
            onClick={() => navigate(-1)}
          />
          <div className="image-placeholder">
            <img src={data?.Image} alt="Profile Picture" />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              position: "relative",
            }}
          >
            <RoundContainer
              color="linear-gradient(to right, #A3C9AA, #5ba4d6)"
              icon={faImage}
              fontColor="white"
            />
            <input
              type="file"
              className="embed-image"
              onChange={handleFileChange}
            />
          </div>
          <h5>
            {personalData.firstName} {personalData.lastName}
          </h5>
          <span>Enthusiast Traveller</span>
          <div
            onClick={() => handleMenuClick("Profile")}
            className={activeMenu === "Profile" ? "active" : ""}
          >
            <h5>Profile</h5>
          </div>
          <div
            onClick={() => handleMenuClick("Payment")}
            className={activeMenu === "Payment" ? "active" : ""}
          >
            <h5>Payment</h5>
          </div>
          <div
            onClick={() => handleMenuClick("Newsletter")}
            className={activeMenu === "Newsletter" ? "active" : ""}
          >
            <h5>Newsletter</h5>
          </div>
          <div
            onClick={() => handleMenuClick("Log out")}
            className={activeMenu === "Log out" ? "active" : ""}
          >
            <h5>Log out</h5>
          </div>
        </div>
        <FormContainer
          display="column"
          width="80%"
          alignItems="left"
          height="65%"
          justifyContent="start"
          gap="1.5rem"
        >
          {renderContent()}
        </FormContainer>
      </div>
    </div>
  );
}
