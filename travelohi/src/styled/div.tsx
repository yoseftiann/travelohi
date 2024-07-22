import styled from "@emotion/styled";

interface DivProps {
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  padding? : string;
  height?: string;
  width?: string;
  position? :string;
  gap? : string;
}

export const Div = styled.div<DivProps>`
  width: 300px;
  height: ${(props) => props.height};
  width: ${(props) => props.width};
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  border-radius: 10px;
  padding: ${(props) => props.padding};
  display: flex;
  flex-direction: ${(props) => props.flexDirection};
  justify-content: ${(props) => props.justifyContent};
  align-items : ${(props) => props.alignItems};
  position: "relative";
  zIndex : 3;
  overflow-y : auto;
  overflow-x : hidden;
  gap:${(props) => props.gap};
`;
