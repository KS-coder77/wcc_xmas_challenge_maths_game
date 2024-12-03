//import React from "react"
//import PropTypes from 'prop-types'

const StudentList = ({students}) => {
    return <div> 
        <h2>Students</h2>
        <table>
            <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody> 
                {students.map((student) => (
                    <tr key ={student.id}>
                        <td>{student.firstName}</td>
                        <td>{student.lastName}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
}

export default StudentList
