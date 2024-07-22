import styled from "@emotion/styled";

interface ITitle {
  color? : string;
}

export const Title = styled.h1<ITitle>`
  font-weight: 900;
  font-size: 25px;
  color: ${props => props.color};
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
`;
