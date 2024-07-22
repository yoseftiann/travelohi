import styled from "@emotion/styled";

interface ButtonProps {
  border? : string;
  color? : string;
  textColor?: string;
  addShadow: boolean;
}

export const Button = styled.button<ButtonProps>`
  padding: 12px 15px;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  border-radius: 10px;
  border: ${props => props.border || '0'};
  outline: 0;
  background: ${props => props.color || 'teal'};
  color: ${props => props.textColor || 'white'};
  cursor: pointer;
  box-shadow: ${props => props.addShadow? 'rgba(0, 0, 0, 0.24) 0px 3px 8px' : 'none'};
  width: 100%;
`;
