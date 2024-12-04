import {useState} from "react"

const StudentForm = ({}) => {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    
    const onSubmit = async (e) => {
        e.preventDefault()

        const data = {
            firstName, 
            lastName
        }
        const url = "http://127.0.0.1:5000/create_student"
        const options = {
            method:  "POST", 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
        const response = await fetch(url, options)
        if (response.status !== 201 && response.status !== 200){
            const data = await response.json()
            alert(data.message)
        } else{
            //successful 
        }
    }

    return (<form onSubmit={onSubmit}>
        <div> 
            <label htmlFor="firstName">First Name:</label>
            <input> 
                type=&quot;text&quot;
                id=&quot;firstName&quot; 
                value={firstName}
                onChange = {(e) => setFirstName(e.target.value)}
            </input>  
        </div>
        <div> 
            <label htmlFor="LastName">Last Name:</label>
            <input> 
                type=&quot;text&quot;
                id=&quot;lastName&quot; 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            </input>  
        </div>
        <button type="submit"> Create Student</button>
    </form>
    );
};
export default StudentForm 