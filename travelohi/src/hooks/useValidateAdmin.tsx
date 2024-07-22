import axios from "axios";
import React from "react";

interface AdminData {
    ID?: string;
    Image? : string;
    Email? : string;
    FirstName? : string;
    LastName? : string;
    DOB? : string;
    PhoneNumber? : string;
    Address? : string;
    Subscribe? : boolean;
    //tambahin lagi
}

interface UseValidateUserReturn {
    data: AdminData | null;
    isLoading: boolean;
    error: Error | null;
  }

const useValidateAdmin = () : UseValidateUserReturn => {
    const [data, setData] = React.useState<AdminData | null>(null)
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [error, setError] = React.useState<Error | null>(null)

    const validateAdmin = async() => {
        setIsLoading(true);
        try{
            const response = await axios.get('http://localhost:3000/validate/admin', {
                withCredentials: true,
            })

            if(response.status==200){        
                setData(response.data.message)
            }
        }catch(error){
            setError(error as Error)
        }finally{
            setIsLoading(false)
        }
    }

    React.useEffect(()=>{
        validateAdmin();
    },[])

    return {data, isLoading, error};
}

export default useValidateAdmin

