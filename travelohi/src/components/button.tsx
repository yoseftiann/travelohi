import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Button } from "../styled/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


interface IButton {
  name: string;
  color: string;
  border?: string;
  textColor?: string;
  addShadow?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  icon? : IconDefinition;
  width?: string;
}

export default function FilledButton({
  disabled,
  onClick,
  name,
  color,
  textColor,
  border,
  addShadow = true,
  icon,
  width
}: IButton) {
  return (
    <div
      style={{
        width: width ? width : '100%',
      }}
    >
      <Button
        disabled={disabled}
        onClick={onClick}
        addShadow={addShadow}
        color={color}
        border={border ? border : "0"}
        textColor={textColor}
        type="submit"
      >
        {icon && <FontAwesomeIcon icon={icon} style={{margin:'0 1rem'}} />} 
        {name}
      </Button>
    </div>
  );
}
