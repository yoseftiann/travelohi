import styled from "@emotion/styled";

interface DivProps {
  padding: string;
  gap: string;
  color: string;
  align: string;
}

export const Container = styled.div<DivProps>`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => props.align};
  gap: ${(props) => props.gap};
  color: ${(props) => props.color};
  padding: ${(props) => props.padding};
`;
