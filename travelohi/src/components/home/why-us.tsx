import { H1 } from "../../styled/h1";
import "./why-us.css";
import baggage from "../../assets/icon/suitcases.png";
import list from "../../assets/icon/list.png";
import shield from "../../assets/icon/security.png";

export default function WhyTravelohi() {
  return (
    <div className="container">
      <H1>Why travel with us?</H1>
      <div className="why-us-flex">
        <div className="why-us-item">
          <img src={baggage} alt=""/>
          <div className="why-us-text">
            <h5 className="why-us-header">Solusi serba ada</h5>
            <span className="why-us-detail">
              Mulai dari tiket pesawat, hotel, sampai pemandu, semua tersedia di
              travelohi.
            </span>
          </div>
        </div>
        <div className="why-us-item">
          <img src={list} alt="" />
          <div className="why-us-text">
            <h5 className="why-us-header">Jadwal booking fleksible</h5>
            <span className="why-us-detail">
              Perubahan rencana yang mendadak? Tenang! Atur ulang jadwal mu atau ajukan pengembalian dana gapake ribet
            </span>
          </div>
        </div>
        <div className="why-us-item">
          <img src={shield} alt="" />
          <div className="why-us-text">
            <h5 className="why-us-header">Keamanan dan kemudahan</h5>
            <span className="why-us-detail">
              Nikmati banyak cara yang aman dan mudah untuk melakukan transaksi bersama kami 
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
