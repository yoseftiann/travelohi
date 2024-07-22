import { Input } from "../styled/input";

interface ITextField {
    placeholder : string;
    name : string;
    type?: string;
    onChange? : (e : React.ChangeEvent<HTMLInputElement>) => void;
    defaultValue? : string
}

export default function TextField({onChange, placeholder, name, type, defaultValue} : ITextField) {

  return (
    <div style={{
      width: '100%',
    }}>
      <Input onChange={onChange} placeholder={placeholder} name={name} type={type ? type : "text"} defaultValue={defaultValue}></Input>
    </div>
  );
}
