import { useState, useEffect } from 'react'
import StudentList from './StudentList'
import StudentForm from './StudentForm'
import './App.css'

function App() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents()
  }, []);

  const fetchStudents = async () => {
    const response = await fetch("http://127.0.0.1:5000/students")
    const data = await response.json()
    setStudents(data.students)
    console.log(data.students)
  };

  return (
    <>
      <StudentList students = {students}/>
      <StudentForm/>
    </>
  );
} 

export default App; 
