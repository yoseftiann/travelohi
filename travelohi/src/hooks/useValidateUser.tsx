import axios from "axios";
import React from "react";

interface UserData {
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
    data: UserData | null;
    isLoading: boolean;
    error: Error | null;
  }
  

const useValidateUser = () : UseValidateUserReturn=> {
    const [data, setData] = React.useState<UserData | null>(null)
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [error, setError] = React.useState<Error | null>(null)

    const validateUser = async() => {
        setIsLoading(true);
        try{
            const response = await axios.get('http://localhost:3000/validate', {
                withCredentials: true,
            })

            if(response.status==200){
                // console.log(response.data.message);
                
                setData(response.data.message)
            }
        }catch(error){
            setError(error as Error)
        }finally{
            setIsLoading(false)
        }
    }

    React.useEffect(()=>{
        validateUser();
    },[])

    return {data, isLoading, error};
}

export default useValidateUser;