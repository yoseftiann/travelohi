import { useEffect } from "react";
import { IUserData } from "../interfaces/user-data";
import "./styles/table.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

interface ITableProps {
  data: IUserData[];
  headers: string[];
}

export default function Table({ data, headers, updateData }: ITableProps & { updateData: () => void}) {
  //Handle OnClick
  const handleBan = async (userID : number, userIsBanned: boolean) => {
    try{
        const response = await axios.put('http://localhost:3000/user/update/isbanned', 
        {
            ID: userID,
            IsBanned: !userIsBanned
        }
        )

        if(response.status==200){
            console.log("success");
            updateData();
        }
    }catch(error){
        console.log(error);
    }
  };

  useEffect(() => {
    if (data) {
      console.log(data);
    } else {
      console.log("empty");
    }
  }, []);

  return (
    <table className="table">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} className="th">
              {header.toUpperCase()}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((data, index) => {
          return (
            <tr key={index} className="tr">
              <td className="td">{data.ID}</td>
              <td className="td">{`${data.FirstName} ${data.LastName}`}</td>
              <td className="td">{data.Email}</td>
              <td className="td">{data.DOB}</td>
              <td className="td">{data.Address}</td>
              <td className="td center pointer" onClick={() => handleBan(data.ID, data.IsBanned)}>
                {data.IsBanned ? (
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    size="lg"
                    color="#F28585"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    size="lg"
                    color="#BFEA7C"
                  />
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
