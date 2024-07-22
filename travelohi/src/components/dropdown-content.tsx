import { IHotel } from "../interfaces/hotel";
import "./styles/dropdown-content.css";

interface IDropdownProps {
    data : IHotel[]
    label: string;
    onSelect: (hotel: IHotel) => void;
}

export default function DropdownContent({data, label, onSelect} : IDropdownProps){
  return (
    <div className="drop-button">
      <button className="drop-button-content">{label ? label : "Choose Hotel"} &nbsp; ▼</button>
      <div className="dropdown-content">
        {data.map((item) => (
          <a key={item.ID} onClick={() => onSelect(item)}>
            {item.Name}
          </a>
        ))}
      </div>
    </div>
  );
}
