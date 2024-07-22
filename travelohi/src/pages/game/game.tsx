import axios from "axios";
import Loading from "../../components/loader/loading-page";
import useValidateUser from "../../hooks/useValidateUser";
import GamePage from "./game-page";

export default function Game() {
  // Validation middleware
  const { data, isLoading, error } = useValidateUser();

  // func to add balance
  const addBalance = async () => {
    try{
      const response = await axios.get(`http://localhost:3000/user/${data?.ID}/add-balance`)

      if(response.status == 200){
        console.log("success");
      }
    }catch(error){
      console.log(error);
    }
  }

  if (isLoading) return <Loading />;
  if (error) return <div>error : {error.message}</div>;
  if (!data) return <div>User not validated or no current user logged in</div>;
  return <GamePage addBalance={addBalance}/>;
}
