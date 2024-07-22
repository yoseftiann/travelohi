import background from "../assets/Remove-bg.ai_1707104409097.png";
import SearchBar from "./search-bar";
import RoundContainer from "./round-container";
import { faMoneyBill, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import useValidateUser from "../hooks/useValidateUser";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import axios from "axios";
import DropdownRound from "./dropdown-round";
import React from "react";

const currency = [
  { label: "RP (IDN Rupiah)", value: "1" },
  { label: "$ (USD Dollar)", value: "2" },
];

const payment = [
  { label: "Hi-Wallet", value: "wallet" },
  { label: "Credit Card", value: "cc" },
]

// Pake react navigasi Link
export default function NavigationBar() {
  //Use state
  const [balanceOpen, setBalanceOpen] = React.useState(false);

  const navigate = useNavigate();
  const { data, isLoading, error } = useValidateUser();

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

  if (isLoading) return <div>loading...</div>

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100vw",
        height: "61px",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "1rem 0",
        borderBottom: '2px solid #f8f8f8'
      }}
    >
      <Toaster position="bottom-right" richColors/>
      <div
        onClick={() => navigate('/home')}
        style={{
          backgroundColor: "transparent",
          height: "100%",
        }}
      >
        <img src={background} alt="" height="100%" />
      </div>
      <div
        style={{
          width: "50%",
          backgroundColor: "transparent",
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <SearchBar />
      </div>
      <div
        style={{
          width: "20%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: "1.5rem",
        }}
      >
        <RoundContainer color="#f8f8f8" icon={faCartShopping} tooltipText="Cart" onClick={() => navigate(`/cart/${data?.ID}`)}/>
        {data ? (
          <>
            <RoundContainer
              color="#f8f8f8"
              icon={faCoins}
              fontColor="#FF8911"
              onClick={() => setBalanceOpen((prev) => !prev)}
            />
            <RoundContainer
              color="linear-gradient(to right, #a6d8fd, #5ba4d6)"
              imageSrc={data.Image}
              onClick={() => navigate("/profile")}
              tooltipText={`${data.FirstName}`}
            />
            <RoundContainer color="#f8f8f8" icon={faRightToBracket} tooltipText="Logout" onClick={logoutHandler}/>

            {
              balanceOpen && (
                <DropdownRound title="Balance" currency={currency} payment={payment}/>
              )
            }
          </>
        ) : (
          <>
            <RoundContainer color="#f8f8f8" icon={faMoneyBill} tooltipText="Tickets"/>
            <RoundContainer color="#f8f8f8" icon={faUserGroup} tooltipText="Login" onClick={() => navigate('/login')}/>
            <RoundContainer color="#f8f8f8" icon={faUserPlus} tooltipText="Register" onClick={() => navigate('/register')}/>
          </>
        )}
      </div>
    </div>
  );
}
