import { useNavigate } from "react-router-dom";
import background from "../assets/image-removebg-preview (8).png"
import { Label } from "../styled/label";
import { Title } from "../styled/title";

export default function Footer() {
  const navigate = useNavigate();

  //Navigate handler
  const navigateHandler = (path : string) => {
    navigate(path)
  }
  
  const navigateExternal = (url : string) => {
    window.location.href = url;
  }

  // Const
  return (
    <div
      style={{
        width: "100%",
        height: "30vh",
        backgroundColor: "#1c2930",
        display: "flex",
        flexDirection: "row",
        padding: "20px 20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "20%",
          height: "100%",
        }}
      >
        <img src={background} alt="" style={{
          width:'80%'
        }}/>
      </div>
      {/* Kanan Luar */}
      <div
        style={{
          width: "80%",
          height: "100%",
          padding: "0 20px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          boxSizing: "border-box",
        }}
      >
        {/* 1 */}
        <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              gap: "1rem",
            }}
          >
            <Label color="white">Tentang Travelohi</Label>
            <Label color="#abafb1">Asal Usul</Label>
            <Label color="#abafb1">Progress TPA</Label>
            <Label color="#abafb1">Nilai Akhir</Label>
          </div>
        <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              gap: "1rem",
            }}
          >
            <Label color="white">Follow kami</Label>
            <Label color="#abafb1" onClick={() => navigateExternal("https://twitter.com/traveloka?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor")}>Twitter</Label>
            <Label color="#abafb1" onClick={() => navigateExternal("https://www.facebook.com/traveloka.id/?locale=id_ID")}>Facebook</Label>
            <Label color="#abafb1" onClick={() => navigateExternal("https://www.instagram.com/traveloka.id/")}>Instagram</Label>
            <Label color="#abafb1" onClick={() => navigateExternal("https://www.youtube.com/traveloka")}>Youtube</Label>
            <Label color="#abafb1" onClick={() => navigateExternal("https://id.wikipedia.org/wiki/Traveloka")}>Wikipedia</Label>
          </div>
        {/* 2 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            gap: "1rem",
          }}
        >
          <Label color="white">Produk</Label>
          <Label color="#abafb1">Tiket Pesawat</Label>
          <Label color="#abafb1">Hotel</Label>
          <Label color="#abafb1">Tiket Kereta Api</Label>
          <Label color="#abafb1">JR Pass</Label>
          <Label color="#abafb1" onClick={() => navigateHandler("/game")}>XCombatBattle</Label>
        </div>
        {/* 3 */}
        <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              gap: "1rem",
            }}
          >
            <Label color="white">Lainnya</Label>
            <Label color="#abafb1" onClick={() => navigateHandler("/login")}>Log in</Label>
            <Label color="#abafb1" onClick={() => navigateHandler("/register")}>Register</Label>
            <Label color="#abafb1" onClick={() => navigateHandler("/forgotpassword")}>Forgot password?</Label>
            <Label color="#abafb1">Syarat & Ketentuan</Label>
          </div>
        <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "auto",
              gap: "1rem",
            }}
          >
            <Label color="white">Download Travelohi App</Label>
            <Label color="#abafb1">Image 1</Label>
            <Label color="#abafb1">Image 2</Label>
          </div>
      </div>
    </div>
  );
}
