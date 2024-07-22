import HomePage from "../pages/home/home-page";
import LoginPage from "../pages/login/login-page";
import RegisterPage from "../pages/register/register-page";
import { IMenu } from "./menu-setting";

export const NAVBAR_LIST: IMenu[] = [
  {
    element: <LoginPage />,
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
];
