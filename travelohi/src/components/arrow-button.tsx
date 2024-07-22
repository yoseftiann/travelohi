import "./styles/arrow-button.css"

interface IArrowButton{
    direction: string;
    onClick: () => void;
}

export default function ArrowButton({direction, onClick} : IArrowButton) {
  return (
    <button className="button" onClick={onClick}>
      <div className={direction}></div>
    </button>
  );
}
