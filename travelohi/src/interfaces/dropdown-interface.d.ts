import { IQuestion } from "../lists/questions/personal-question";

export interface IDropdownList{
    children: IQuestion[];
    name : string;
    onValueChange : ((name: string, value: string) => void)
}