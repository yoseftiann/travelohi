import background from "../assets/travelohi_logo.png";
import TravelohiTitle from "./travelohi";

export default function Logo() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "100vw",
        height: "6vh",
        position: "fixed",
        top: "0",
        padding: "0.5rem",
        left: "0",
      }}
    >
      <img
        style={{
          width: "4.5%",
          height: "100%",
        }}
        src={background}
        alt="Logo Travelohi"
      />
      <TravelohiTitle />
    </div>
  );
}
