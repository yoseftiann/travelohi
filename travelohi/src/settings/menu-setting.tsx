import AdminPage from "../pages/admin/admin-page";
import CartPage from "../pages/cart/cart-page";
import DetailHotelPage from "../pages/detail/hotel/detail-hotel-page";
import Game from "../pages/game/game";
import GamePage from "../pages/game/game-page";
import HomePage from "../pages/home/home-page";
import LoginPage from "../pages/login/login-page";
import OTPLoginPage from "../pages/login/otp-login-page";
import ProfilePage from "../pages/profile/profile-page";
import ForgotPasswordPage from "../pages/register/forgot-passwor-page";
import RegisterPage from "../pages/register/register-page";
import LocationGuesserPage from "../pages/shop/location-guesser-page";

export interface IMenu {
  name: string;
  path: string;
  element: JSX.Element | JSX.Element[];
}

export const MENU_LIST: IMenu[] = [
  {
    element: <LoginPage/>,
    name: "Login",
    path: "/login",
  },
  {
    element: <HomePage />,
    name: "Home",
    path: "/home",
  },
  {
    element: <RegisterPage/>,
    name : "Register",
    path :"/register"
  },
  {
    element: <OTPLoginPage/>,
    name : "OTPLogin",
    path : "/otplogin"
  },
  {
    element: <ForgotPasswordPage/>,
    name : "ForgotPassword",
    path : "/forgotpassword"
  },
  {
    element: <LocationGuesserPage/>,
    name: "LocationGuesser",
    path : "/locationguesser"
  },
  {
    element: <Game/>,
    name : 'Game',
    path:'/game'
  },
  {
    element: <ProfilePage/>,
    name: 'Profile',
    path: '/profile'
  },
  {
    element: <AdminPage/>,
    name: 'Admin',
    path: '/admin'
  },
  {
    element: <DetailHotelPage/>,
    name: 'detail',
    path: '/detail/hotel/:id'
  },
  {
    element: <CartPage />,
    name: 'cart',
    path: '/cart/:id'
  },
];
