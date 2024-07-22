import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainTemplate from "./templates/main-template";
import { IMenu, MENU_LIST } from "./settings/menu-setting";
import "./styles/global.css";

const createRoutes = (menuList: IMenu[]) => {
  return menuList.map(({ path, element }) => (
    <Route key={path} path={path} element={element} />
  ));
};

function App() {
  return (
    <BrowserRouter>
      <MainTemplate>
        <Routes>{createRoutes(MENU_LIST)}</Routes>
      </MainTemplate>
    </BrowserRouter>
  );
}

export default App;
