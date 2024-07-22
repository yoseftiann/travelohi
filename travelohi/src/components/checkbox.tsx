import "./styles/checkbox.css"

interface ICheckBox{
    label : string;
    onChange?: () => void;
}

export default function CheckBox({label, onChange} : ICheckBox){
    return(
        <div className="parent-check">
            <input type="checkbox" className="custom-checkbox" onChange={onChange}/>
            <span>{label}</span>
        </div>
    )
}