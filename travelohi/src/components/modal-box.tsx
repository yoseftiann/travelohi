import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./styles/modal-box.css"
import { faX } from "@fortawesome/free-solid-svg-icons";

interface IModalBox {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function ModalBox({ isOpen, onClose, children }: IModalBox) {
  if (!isOpen) return null;

  return (
    <div className="overlayStyle">
      <div className="modalStyle">
        <FontAwesomeIcon icon={faX} onClick={onClose} className="closeButtonStyle" size="lg"/>
        {children}
      </div>
    </div>
  );
}
