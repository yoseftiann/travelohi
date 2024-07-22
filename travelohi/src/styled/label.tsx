import styled from "@emotion/styled";

interface ILabel {
    color? : string;
  }

export const Label = styled.p<ILabel>`
color: ${props => props.color};
font-size: 14px;
font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
`