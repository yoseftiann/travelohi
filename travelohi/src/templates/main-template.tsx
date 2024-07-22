import { IChildren } from "../interfaces/children-only-interface";

export default function MainTemplate({children} : 
    IChildren){
    return <div> 
        <div>
            {children}
        </div>
    </div>
}