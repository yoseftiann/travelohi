import styled from "@emotion/styled";

interface IDivider {
  name: string;
}

const DividerContainer = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  color: #757575;
  width: 100%
`;

const Line = styled.hr`
  display: inline-block;
  width: 100%;
  height: 2px;
  border: 0;
  background-color: #e8e8e8;
`;

const Text = styled.span`
  padding: 0 10px;
`;

export default function TextDivider({ name }: IDivider) {
  return (
    <DividerContainer>
      <Line />
      <Text>{name}</Text>
      <Line />
    </DividerContainer>
  );
}
