import "./styles/input-underline.css"

interface IProps {
    label: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputUnderline({label, onChange} : IProps){
    return (
        <div className="input-container">
            <input type="text" required id="input" onChange={onChange} name={label.toLowerCase()}/>
            <label className="label">{label}</label>
            <div className="underline"></div>
        </div>
    )
}