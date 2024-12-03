import { useState, useEffect } from 'react'
import StudentList from './StudentList'
import './App.css'

function App() {
  const [students, setStudents] = useState([{firstName: "Ashley", lastName:"Jenkins", id:1}])

  useEffect(() => {
    //fetchStudents()
  }, [])

  const fetchStudents = async () => {
    const response = await fetch("http://127.0.0.1:5000/students")
    const data = await response.json()
    setStudents(data.students)
    console.log(data.students)
  }
   return <StudentList students = {students}/>
  
}

export default App
