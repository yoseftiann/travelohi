import { useState } from "react";
import { IDropdownList } from "../interfaces/dropdown-interface";
import { IListOption } from "../interfaces/list-option";
import { Select } from "../styled/select";

export default function DropdownList({children, name, onValueChange }: IDropdownList) {
  const [selectedValue, setSelectedValue] = useState("");

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {    
    const newValue = event.target.value;
    setSelectedValue(newValue);
    if(onValueChange) {
      onValueChange(name, newValue)
    }
  }

  return (
    <Select name={name} value={selectedValue} onChange={handleSelectChange}>
      {children.map((item: IListOption, index: number) => (
        <option key={index} value={item.value}>
          {item.name}
        </option>
      ))}
    </Select>
  );
}
