import { IContainer } from "../interfaces/div-interface";
import { Div } from "../styled/div";

export default function FormContainer({
  height,
  display,
  children,
  alignItems,
  position,
  width,
  justifyContent,
  gap
}: IContainer) {
  return (
    <Div
      position={position ? position : "relative"}
      width={width ? width : "320px"}
      height={height ? height : "400px"}
      flexDirection={display}
      justifyContent={justifyContent? justifyContent : 'space-between'}
      alignItems={alignItems ? alignItems : "flex-start"}
      padding="30px 30px"
      gap={gap? gap : '0'}
    >
      {children}
    </Div>
  );
}
