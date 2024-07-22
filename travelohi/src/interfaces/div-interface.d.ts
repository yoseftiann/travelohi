export interface IContainer {
  children: JSX.Element | JSX.Element[];
  display: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  padding?: string;
  height?: string;
  width?: string;
  position?: string;
  gap? : string
}
