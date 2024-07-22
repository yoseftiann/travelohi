import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faCamera } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const navigate = useNavigate()
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        backgroundColor: "#f8f8f8",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "90%",
        gap: "0.5rem",
        boxSizing: "border-box",
        borderRadius: "40px",
        padding: "20px",
      }}
    >
      <FontAwesomeIcon
        icon={faMagnifyingGlass}
        style={{
          fontSize: "18px",
          color: "#929292",
        }}
      />
      <input
        type="search"
        placeholder="Search"
        style={{
          width: "100%",
          height: "40px",
          outline: "none",
          borderRadius: "4px",
          border: "2px solid transparent",
          backgroundColor: "transparent",
          fontSize: "18px",
          marginLeft: "1rem",
        }}
      />
      <div
        style={{
          width: "45px",
          height: "40px",
          background: 'linear-gradient(to right, #74c2fd, #2286d6)',
          borderRadius:'50%',
          display:'flex',
          justifyContent:'center',
          alignItems:'center'
        }}
        onClick={() => navigate('/locationguesser')}
      >
        <FontAwesomeIcon
          icon={faCamera}
          style={{
            fontSize: "18px",
            color: "white",
          }}
        />
      </div>
    </div>
  );
}
