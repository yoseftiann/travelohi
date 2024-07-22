import Table from "../../../components/table"
import "./user.css"

export default function User({users, fetchData} : any){

    return(
        <div className="sub-page-container">
            {/* Table */}
            <Table data={users} headers={['id','name', 'email', 'dob' ,'address', 'banned']} updateData={fetchData}/>
        </div>
    )
}