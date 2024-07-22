import styled from "@emotion/styled";

interface Props {
  align: string;
  color?: string;
}

export const H5 = styled.h5<Props>`
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  font-size: 0.9rem;
  text-align: ${props => props.align};
  color: ${props => props.color};
`;
