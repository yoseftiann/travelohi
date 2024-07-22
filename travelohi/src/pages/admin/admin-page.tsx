import React, { useEffect } from "react";
import { ADMIN_LIST } from "../../settings/admin-setting";
import "./admin-page.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import User from "./sub-page/user";
import { IUserData } from "../../interfaces/user-data";
import axios from "axios";
import Promo from "./sub-page/promo";
import Hotel from "./sub-page/hotel";
import { IHotel } from "../../interfaces/hotel";
import { IPromo } from "../../interfaces/promo";
import News from "./sub-page/news";
import useValidateAdmin from "../../hooks/useValidateAdmin";
import Loading from "../../components/loader/loading-page";

export default function AdminPage() {
  //Use validate
  const {data, isLoading, error} = useValidateAdmin();

  //Const
  const [activeMenu, setActiveMenu] = React.useState("");

  const handleMenuClick = (menuName: string) => {
    setActiveMenu(menuName);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "Promo":
        return <Promo promos={promos} />;
      case "Hotel":
        return <Hotel hotels={hotels} />;
      case "Airline":
        return <div>Airline content here</div>;
      case "User":
        return <User users={users} fetchData={FetchUsers} />;
      case "News":
        return <News />;
      default:
        return <Promo promos={promos} />
    }
  };

  //Fetch User
  const [users, setUsers] = React.useState<IUserData[]>([]);

  //Fetch API User Data
  const FetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/fetch-users");

      if (response.status == 200) {
        setUsers(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Fetch Promos
  const [promos, setPromos] = React.useState<IPromo[]>([]);

  const FetchPromos = async () => {
    try {
      const response = await axios.get("http://localhost:3000/fetch-promos");

      if (response.status == 200) {
        setPromos(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Fetch Hotel
  const [hotels, setHotels] = React.useState<IHotel[]>([]);

  //Fetch API Hotel Data
  const fetchHotels = async () => {
    try {
      const response = await axios.get("http://localhost:3000/fetch-hotels");

      if (response.status == 200) {
        console.log(response.data);
        setHotels(response.data);
      } else {
        console.log("error while setting the resposne data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    FetchUsers();
    fetchHotels();
    FetchPromos();
  }, []);

  if (isLoading) return <Loading/>;
  if (error) return <div>error : {error.message}</div>;

  return (
    <div className="admin-container">
      <div className="sub">
        {ADMIN_LIST.map((admin, index) => (
          <div
            className={`menu ${activeMenu === admin.name ? "active" : ""}`}
            key={index}
            onClick={() => handleMenuClick(admin.name)}
          >
            <FontAwesomeIcon icon={admin.icon} size="4x" className="icon" />
            <span>{admin.name}</span>
          </div>
        ))}
      </div>
      <div className="main">{renderContent()}</div>
    </div>
  );
}
